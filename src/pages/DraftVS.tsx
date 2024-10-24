import React from 'react';
import { useParams } from 'react-router-dom';
import { Champion } from '../types';
import { DraftRoom, DraftViewType, DRAFT_ORDER, DRAFT_TIMER } from '../types/draft';
import { DraftVSHeader } from '../components/DraftVSHeader';
import { DraftVSControls } from '../components/DraftVSControls';
import { DraftVSGameSelector } from '../components/DraftVSGameSelector';
import { SwapRequestModal } from '../components/SwapRequestModal';
import { DraftChampionSelect } from '../components/DraftChampionSelect';
import { DraftSlot } from '../components/DraftSlot';
import { getAllChampions, getGameVersion, NoneChampion } from '../services/championService';

export default function DraftVS() {
  const { roomId, viewType } = useParams<{ roomId: string; viewType: string }>();
  const [room, setRoom] = React.useState<DraftRoom>({
    id: roomId || '',
    blueTeam: 'Blue Team',
    redTeam: 'Red Team',
    numberOfGames: 1,
    fearlessDraft: false,
    status: 'waiting',
    currentGame: 1,
    currentPhase: 0,
    blueReady: false,
    redReady: false,
    games: [{
      gameNumber: 1,
      blueBans: Array(5).fill(NoneChampion),
      redBans: Array(5).fill(NoneChampion),
      bluePicks: Array(5).fill(NoneChampion),
      redPicks: Array(5).fill(NoneChampion),
      blueHover: null,
      redHover: null,
      swapRequest: null,
      bannedChampions: new Set(),
      pickedChampions: new Set()
    }],
    currentTimer: DRAFT_TIMER
  });

  const [champions, setChampions] = React.useState<Champion[]>([]);
  const [version, setVersion] = React.useState('');
  const [selectedChampion, setSelectedChampion] = React.useState<Champion | null>(null);

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

  const currentGame = room.games[room.currentGame - 1];
  const currentPhase = DRAFT_ORDER[room.currentPhase];
  const isMyTurn = viewType === currentPhase?.team;
  const isBlueTeamTurn = currentPhase?.team === 'blue';

  const handleReady = () => {
    setRoom(prev => ({
      ...prev,
      [viewType === 'blue' ? 'blueReady' : 'redReady']: !prev[viewType === 'blue' ? 'blueReady' : 'redReady'],
      status: prev.blueReady && prev.redReady ? 'in_progress' : 'waiting'
    }));
  };

  const handleChampionSelect = (champion: Champion) => {
    if (!isMyTurn) return;
    setSelectedChampion(champion);
  };

  const handleLockIn = () => {
    if (!selectedChampion || !isMyTurn) return;

    setRoom(prev => {
      const newRoom = { ...prev };
      const game = { ...newRoom.games[newRoom.currentGame - 1] };
      
      if (currentPhase.type === 'ban') {
        const bans = currentPhase.team === 'blue' ? [...game.blueBans] : [...game.redBans];
        bans[Math.floor(prev.currentPhase / 2)] = selectedChampion;
        if (currentPhase.team === 'blue') {
          game.blueBans = bans;
        } else {
          game.redBans = bans;
        }
      } else {
        const picks = currentPhase.team === 'blue' ? [...game.bluePicks] : [...game.redPicks];
        picks[Math.floor((prev.currentPhase - 6) / 2)] = selectedChampion;
        if (currentPhase.team === 'blue') {
          game.bluePicks = picks;
        } else {
          game.redPicks = picks;
        }
      }

      newRoom.games[newRoom.currentGame - 1] = game;
      newRoom.currentPhase = (prev.currentPhase + 1) % DRAFT_ORDER.length;
      newRoom.currentTimer = DRAFT_TIMER;
      return newRoom;
    });

    setSelectedChampion(null);
  };

  const renderBans = (team: 'blue' | 'red') => {
    const bans = team === 'blue' ? currentGame.blueBans : currentGame.redBans;

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
              champion={bans[index]}
              version={version}
              selected={false}
              onClick={() => {}}
              onRightClick={(e) => e.preventDefault()}
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
              champion={bans[index]}
              version={version}
              selected={false}
              onClick={() => {}}
              onRightClick={(e) => e.preventDefault()}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <DraftVSHeader
        blueTeam={room.blueTeam}
        redTeam={room.redTeam}
        currentGame={room.currentGame}
        numberOfGames={room.numberOfGames}
        status={room.status}
        timer={room.currentTimer}
        isBlueTeamTurn={isBlueTeamTurn}
        onReady={handleReady}
        isReady={viewType === 'blue' ? room.blueReady : room.redReady}
        viewType={viewType as DraftViewType}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Bans */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-8">
            {renderBans('blue')}
            {renderBans('red')}
          </div>
        </div>

        <div className="grid grid-cols-[280px_1fr_280px] gap-4 max-w-[1400px] mx-auto">
          {/* Blue Team */}
          <div className="space-y-2">
            {currentGame.bluePicks.map((champion, index) => (
              <DraftSlot
                key={`blue-pick-${index}`}
                type="pick"
                team="blue"
                index={index}
                champion={champion}
                version={version}
                selected={false}
                onClick={() => {}}
                onRightClick={(e) => e.preventDefault()}
              />
            ))}
          </div>

          {/* Champion Select */}
          <div className="flex flex-col gap-4">
            <DraftChampionSelect
              onSelect={handleChampionSelect}
              selectedChampions={[
                ...currentGame.blueBans,
                ...currentGame.redBans,
                ...currentGame.bluePicks,
                ...currentGame.redPicks
              ].filter((c): c is Champion => c !== null && c.id !== '-1')}
              champions={champions}
              selectedChampion={selectedChampion}
            />

            {isMyTurn && (
              <DraftVSControls
                onLockIn={handleLockIn}
                onSwapRequest={() => {}}
                selectedChampion={selectedChampion}
                canLockIn={!!selectedChampion}
                canRequestSwap={false}
                isMyTurn={isMyTurn}
              />
            )}
          </div>

          {/* Red Team */}
          <div className="space-y-2">
            {currentGame.redPicks.map((champion, index) => (
              <DraftSlot
                key={`red-pick-${index}`}
                type="pick"
                team="red"
                index={index}
                champion={champion}
                version={version}
                selected={false}
                onClick={() => {}}
                onRightClick={(e) => e.preventDefault()}
              />
            ))}
          </div>
        </div>

        {/* Game Selector */}
        <div className="mt-8">
          <DraftVSGameSelector
            currentGame={room.currentGame}
            numberOfGames={room.numberOfGames}
            onGameSelect={(game) => setRoom(prev => ({ ...prev, currentGame: game }))}
            fearlessDraft={room.fearlessDraft}
          />
        </div>
      </div>
    </div>
  );
}