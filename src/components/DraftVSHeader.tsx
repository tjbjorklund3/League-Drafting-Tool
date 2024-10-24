import React from 'react';
import { DraftVSTimer } from './DraftVSTimer';
import { Shield, Swords } from 'lucide-react';
import { DraftStatus } from '../types/draft';

interface Props {
  blueTeam: string;
  redTeam: string;
  currentGame: number;
  numberOfGames: number;
  status: DraftStatus;
  timer: number;
  isBlueTeamTurn: boolean;
  onReady?: () => void;
  isReady?: boolean;
  viewType: 'blue' | 'red' | 'spectator';
}

export function DraftVSHeader({
  blueTeam,
  redTeam,
  currentGame,
  numberOfGames,
  status,
  timer,
  isBlueTeamTurn,
  onReady,
  isReady,
  viewType
}: Props) {
  return (
    <div className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Teams */}
          <div className="flex items-center gap-12">
            <div className={`flex items-center gap-3 ${isBlueTeamTurn && status === 'in_progress' ? 'text-blue-400' : 'text-gray-400'}`}>
              <Shield size={24} className="text-blue-500" />
              <span className="text-xl font-bold">{blueTeam}</span>
              {viewType === 'blue' && status === 'waiting' && (
                <button
                  onClick={onReady}
                  className={`px-3 py-1 rounded text-sm ${
                    isReady
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {isReady ? 'Ready!' : 'Ready Up'}
                </button>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Swords size={24} className="text-gray-500" />
              <span className="text-lg font-bold text-gray-400">
                Game {currentGame} of {numberOfGames}
              </span>
            </div>
            <div className={`flex items-center gap-3 ${!isBlueTeamTurn && status === 'in_progress' ? 'text-red-400' : 'text-gray-400'}`}>
              <Shield size={24} className="text-red-500" />
              <span className="text-xl font-bold">{redTeam}</span>
              {viewType === 'red' && status === 'waiting' && (
                <button
                  onClick={onReady}
                  className={`px-3 py-1 rounded text-sm ${
                    isReady
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  {isReady ? 'Ready!' : 'Ready Up'}
                </button>
              )}
            </div>
          </div>

          {/* Timer */}
          {status === 'in_progress' && (
            <DraftVSTimer
              seconds={timer}
              isActive={true}
            />
          )}
          
          {status === 'waiting' && (
            <div className="text-gray-400">
              Waiting for both teams to ready up...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}