import React from 'react';
import { Champion } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getChampionImageUrl } from '../services/championService';

interface Props {
  type: 'ban' | 'pick';
  team: 'blue' | 'red';
  index: number;
  champion: Champion | null;
  version: string;
  selected: boolean;
  isExpanded?: boolean;
  alternativeChampions?: (Champion | null)[];
  onClick: () => void;
  onRightClick: (e: React.MouseEvent) => void;
  onLabelClick?: () => void;
  onAlternativeClick?: (index: number) => void;
  onAlternativeRightClick?: (e: React.MouseEvent, index: number) => void;
  selectedAltIndex?: number;
}

export function DraftSlot({
  type,
  team,
  index,
  champion,
  version,
  selected,
  isExpanded,
  alternativeChampions = [],
  onClick,
  onRightClick,
  onLabelClick,
  onAlternativeClick,
  onAlternativeRightClick,
  selectedAltIndex
}: Props) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (!champion) return;
    e.dataTransfer.setData('text/plain', JSON.stringify({
      team,
      type,
      index,
      championId: champion.id
    }));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (data.championId) {
        onClick();
      }
    } catch (err) {
      console.error('Invalid drag data');
    }
  };

  const slotSize = type === 'ban' ? 'w-12 h-12' : 'w-28 h-28';
  const altSlotSize = 'w-12 h-12';
  const labelColor = team === 'blue' ? 'text-blue-500' : 'text-red-500';
  const label = `${team === 'blue' ? 'B' : 'R'}${index + 1}`;

  return (
    <div className="relative flex items-center gap-4">
      {team === 'blue' && type === 'pick' && (
        <button
          onClick={onLabelClick}
          className={`draft-slot-label ${labelColor} font-bold flex items-center gap-1 select-none min-w-[40px]`}
        >
          {label}
          <ChevronLeft
            size={16}
            className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>
      )}

      {isExpanded && team === 'blue' && (
        <div className="draft-slot-alternates absolute right-full pr-8 top-1/2 -translate-y-1/2">
          <div className="grid grid-cols-2 grid-rows-2 gap-1 w-28 h-28">
            {Array(4).fill(null).map((_, i) => (
              <div
                key={i}
                className={`${altSlotSize} bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition-all
                  ${i === selectedAltIndex ? 'ring-2 ring-yellow-400 hover:ring-yellow-400' : 'hover:ring-2 hover:ring-gray-600'}`}
                onClick={() => onAlternativeClick?.(i)}
                onContextMenu={(e) => onAlternativeRightClick?.(e, i)}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                draggable={!!alternativeChampions[i]}
                onDragStart={handleDragStart}
              >
                {alternativeChampions[i] && version && (
                  <img
                    src={getChampionImageUrl(version, alternativeChampions[i]!.id)}
                    alt={alternativeChampions[i]!.name}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        className={`${slotSize} bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition-all
          ${selected ? 'ring-2 ring-yellow-400 hover:ring-yellow-400' : 'hover:ring-2 hover:ring-gray-600'}`}
        onClick={onClick}
        onContextMenu={onRightClick}
        draggable={!!champion}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {champion && version && (
          <img
            src={getChampionImageUrl(version, champion.id)}
            alt={champion.name}
            className="w-full h-full object-cover"
            draggable={false}
          />
        )}
      </div>

      {team === 'red' && type === 'pick' && (
        <button
          onClick={onLabelClick}
          className={`draft-slot-label ${labelColor} font-bold flex items-center gap-1 select-none min-w-[40px]`}
        >
          <ChevronRight
            size={16}
            className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
          {label}
        </button>
      )}

      {isExpanded && team === 'red' && (
        <div className="draft-slot-alternates absolute left-full pl-8 top-1/2 -translate-y-1/2">
          <div className="grid grid-cols-2 grid-rows-2 gap-1 w-28 h-28">
            {Array(4).fill(null).map((_, i) => (
              <div
                key={i}
                className={`${altSlotSize} bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition-all
                  ${i === selectedAltIndex ? 'ring-2 ring-yellow-400 hover:ring-yellow-400' : 'hover:ring-2 hover:ring-gray-600'}`}
                onClick={() => onAlternativeClick?.(i)}
                onContextMenu={(e) => onAlternativeRightClick?.(e, i)}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                draggable={!!alternativeChampions[i]}
                onDragStart={handleDragStart}
              >
                {alternativeChampions[i] && version && (
                  <img
                    src={getChampionImageUrl(version, alternativeChampions[i]!.id)}
                    alt={alternativeChampions[i]!.name}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}