import React from 'react';

interface Props {
  currentGame: number;
  numberOfGames: number;
  onGameSelect: (game: number) => void;
  fearlessDraft: boolean;
}

export function DraftVSGameSelector({
  currentGame,
  numberOfGames,
  onGameSelect,
  fearlessDraft
}: Props) {
  return (
    <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg">
      <span className="text-gray-400">Games:</span>
      <div className="flex gap-2">
        {Array.from({ length: numberOfGames }, (_, i) => i + 1).map(game => (
          <button
            key={game}
            onClick={() => onGameSelect(game)}
            className={`w-10 h-10 rounded-full font-medium transition-colors ${
              game === currentGame
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            {game}
          </button>
        ))}
      </div>
      {fearlessDraft && (
        <span className="text-sm text-yellow-500">
          Fearless Draft: Champions can only be picked once in the series
        </span>
      )}
    </div>
  );
}