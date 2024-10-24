import React from 'react';
import { Champion, DraftState, SelectedSlot } from '../types';
import { DraftChampionSelect } from '../components/DraftChampionSelect';
import { DraftSlot } from '../components/DraftSlot';
import { getGameVersion, getAllChampions, NoneChampion } from '../services/championService';

export default function DraftPractice() {
  const initialState: DraftState = {
    bans: Array(5).fill(NoneChampion),
    picks: Array(5).fill(NoneChampion),
    alternates: Array(5).fill(Array(4).fill(NoneChampion))
  };

  const [blueTeam, setBlueTeam] = React.useState<DraftState>(initialState);
  const [redTeam, setRedTeam] = React.useState<DraftState>(initialState);
  const [selectedSlot, setSelectedSlot] = React.useState<SelectedSlot | null>(null);
  const [selectedChampion, setSelectedChampion] = React.useState<Champion | null>(null);
  const [champions, setChampions] = React.useState<Champion[]>([]);
  const [version, setVersion] = React.useState('');
  const [expandedSlots, setExpandedSlots] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    const initializeData = async () => {
      try {
        const [gameVersion, allChampions] = await Promise.all([
          getGameVersion(),
          getAllChampions()
        ]);
        setVersion(gameVersion);
        setChampions(allChampions);
      } catch (error) {
        console.error('Failed to load champion data:', error);
      }
    };

    initializeData();
  }, []);

  const getChampionAtSlot = (slot: SelectedSlot): Champion => {
    const team = slot.team === 'blue' ? blueTeam : redTeam;
    if (slot.type === 'alternate' && slot.altIndex !== undefined) {
      return team.alternates[slot.index][slot.altIndex];
    }
    return slot.type === 'ban' ? team.bans[slot.index] : team.picks[slot.index];
  };

  const setChampionAtSlot = (slot: SelectedSlot, champion: Champion) => {
    const setTeam = slot.team === 'blue' ? setBlueTeam : setRedTeam;
    
    setTeam(prev => {
      const newState = { ...prev };
      if (slot.type === 'alternate' && slot.altIndex !== undefined) {
        const newAlternates = [...prev.alternates];
        newAlternates[slot.index] = [...prev.alternates[slot.index]];
        newAlternates[slot.index][slot.altIndex] = champion;
        newState.alternates = newAlternates;
      } else {
        const array = slot.type === 'ban' ? [...prev.bans] : [...prev.picks];
        array[slot.index] = champion;
        if (slot.type === 'ban') newState.bans = array;
        else newState.picks = array;
      }
      return newState;
    });
  };

  const handleChampionSelect = (champion: Champion) => {
    if (selectedSlot) {
      setChampionAtSlot(selectedSlot, champion);
      setSelectedSlot(null);
      setSelectedChampion(null);
    } else {
      setSelectedChampion(champion);
      setSelectedSlot(null);
    }
  };

  const handleSlotClick = (
    team: 'blue' | 'red',
    type: 'ban' | 'pick' | 'alternate',
    index: number,
    altIndex?: number
  ) => {
    const newSlot: SelectedSlot = { team, type, index, altIndex };

    if (selectedChampion) {
      // Place selected champion in clicked slot
      setChampionAtSlot(newSlot, selectedChampion);
      setSelectedChampion(null);
      setSelectedSlot(null);
    } else if (selectedSlot) {
      // Swap champions between slots
      const champion1 = getChampionAtSlot(selectedSlot);
      const champion2 = getChampionAtSlot(newSlot);

      setChampionAtSlot(selectedSlot, champion2);
      setChampionAtSlot(newSlot, champion1);
      setSelectedSlot(null);
    } else {
      // Select slot for potential swap
      setSelectedSlot(newSlot);
    }
  };

  const handleSlotRightClick = (
    e: React.MouseEvent,
    team: 'blue' | 'red',
    type: 'ban' | 'pick' | 'alternate',
    index: number,
    altIndex?: number
  ) => {
    e.preventDefault();
    const slot: SelectedSlot = { team, type, index, altIndex };
    setChampionAtSlot(slot, NoneChampion);
    setSelectedSlot(null);
    setSelectedChampion(null);
  };

  const toggleAlternates = (team: 'blue' | 'red', index: number) => {
    const slotKey = `${team}-${index}`;
    setExpandedSlots(prev => {
      const newSet = new Set(prev);
      if (newSet.has(slotKey)) {
        newSet.delete(slotKey);
      } else {
        newSet.add(slotKey);
      }
      return newSet;
    });
  };

  const getAllSelectedChampions = () => {
    const selectedChampions: Champion[] = [];
    
    [blueTeam, redTeam].forEach(team => {
      team.bans.forEach(champion => {
        if (champion && champion.id !== '-1') selectedChampions.push(champion);
      });
      team.picks.forEach(champion => {
        if (champion && champion.id !== '-1') selectedChampions.push(champion);
      });
      team.alternates.forEach(alternateRow => {
        alternateRow.forEach(champion => {
          if (champion && champion.id !== '-1') selectedChampions.push(champion);
        });
      });
    });

    return selectedChampions;
  };

  const renderBans = (team: 'blue' | 'red') => {
    const teamState = team === 'blue' ? blueTeam : redTeam;

    return (
      <div className={`flex gap-4 ${team === 'red' ? 'flex-row-reverse' : ''}`}>
        {/* Group of 3 bans */}
        <div className="flex gap-2">
          {[0, 1, 2].map((index) => (
            <DraftSlot
              key={`${team}-ban-${index}`}
              type="ban"
              team={team}
              index={index}
              champion={teamState.bans[index]}
              version={version}
              selected={selectedSlot?.team === team && selectedSlot.type === 'ban' && selectedSlot.index === index}
              onClick={() => handleSlotClick(team, 'ban', index)}
              onRightClick={(e) => handleSlotRightClick(e, team, 'ban', index)}
            />
          ))}
        </div>
        {/* Group of 2 bans (center) */}
        <div className="flex gap-2">
          {[3, 4].map((index) => (
            <DraftSlot
              key={`${team}-ban-${index}`}
              type="ban"
              team={team}
              index={index}
              champion={teamState.bans[index]}
              version={version}
              selected={selectedSlot?.team === team && selectedSlot.type === 'ban' && selectedSlot.index === index}
              onClick={() => handleSlotClick(team, 'ban', index)}
              onRightClick={(e) => handleSlotRightClick(e, team, 'ban', index)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="flex justify-center mb-8">
        <div className="flex gap-8">
          {/* Blue Team Bans */}
          {renderBans('blue')}
          {/* Red Team Bans */}
          {renderBans('red')}
        </div>
      </div>

      <div className="flex justify-center gap-8">
        {/* Blue Team */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {blueTeam.picks.map((champion, index) => (
              <div key={`blue-pick-${index}`} className="relative flex items-center">
                <DraftSlot
                  type="pick"
                  team="blue"
                  index={index}
                  champion={champion}
                  version={version}
                  selected={selectedSlot?.team === 'blue' && selectedSlot.type === 'pick' && selectedSlot.index === index}
                  isExpanded={expandedSlots.has(`blue-${index}`)}
                  alternativeChampions={blueTeam.alternates[index]}
                  onClick={() => handleSlotClick('blue', 'pick', index)}
                  onRightClick={(e) => handleSlotRightClick(e, 'blue', 'pick', index)}
                  onLabelClick={() => toggleAlternates('blue', index)}
                  onAlternativeClick={(altIndex) => handleSlotClick('blue', 'alternate', index, altIndex)}
                  onAlternativeRightClick={(e, altIndex) => handleSlotRightClick(e, 'blue', 'alternate', index, altIndex)}
                  selectedAltIndex={selectedSlot?.team === 'blue' && selectedSlot.type === 'alternate' && selectedSlot.index === index ? selectedSlot.altIndex : undefined}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Champion Select */}
        <div className="flex-1 max-w-4xl">
          <DraftChampionSelect
            onSelect={handleChampionSelect}
            selectedChampions={getAllSelectedChampions()}
            champions={champions}
            selectedChampion={selectedChampion}
          />
        </div>

        {/* Red Team */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {redTeam.picks.map((champion, index) => (
              <div key={`red-pick-${index}`} className="relative flex items-center">
                <DraftSlot
                  type="pick"
                  team="red"
                  index={index}
                  champion={champion}
                  version={version}
                  selected={selectedSlot?.team === 'red' && selectedSlot.type === 'pick' && selectedSlot.index === index}
                  isExpanded={expandedSlots.has(`red-${index}`)}
                  alternativeChampions={redTeam.alternates[index]}
                  onClick={() => handleSlotClick('red', 'pick', index)}
                  onRightClick={(e) => handleSlotRightClick(e, 'red', 'pick', index)}
                  onLabelClick={() => toggleAlternates('red', index)}
                  onAlternativeClick={(altIndex) => handleSlotClick('red', 'alternate', index, altIndex)}
                  onAlternativeRightClick={(e, altIndex) => handleSlotRightClick(e, 'red', 'alternate', index, altIndex)}
                  selectedAltIndex={selectedSlot?.team === 'red' && selectedSlot.type === 'alternate' && selectedSlot.index === index ? selectedSlot.altIndex : undefined}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}