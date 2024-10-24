import React from 'react';
import { Lock } from 'lucide-react';
import { Champion } from '../types';

interface Props {
  onLockIn: () => void;
  onSwapRequest: () => void;
  selectedChampion: Champion | null;
  canLockIn: boolean;
  canRequestSwap: boolean;
  isMyTurn: boolean;
}

export function DraftVSControls({
  onLockIn,
  onSwapRequest,
  selectedChampion,
  canLockIn,
  canRequestSwap,
  isMyTurn
}: Props) {
  if (!isMyTurn) return null;

  return (
    <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg">
      <button
        onClick={onLockIn}
        disabled={!canLockIn}
        className={`flex items-center gap-2 px-4 py-2 rounded font-medium transition-colors ${
          canLockIn
            ? 'bg-green-500 hover:bg-green-600 text-white'
            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
        }`}
      >
        <Lock size={20} />
        Lock In {selectedChampion?.name || ''}
      </button>

      {canRequestSwap && (
        <button
          onClick={onSwapRequest}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded font-medium transition-colors"
        >
          Request Swap
        </button>
      )}
    </div>
  );
}