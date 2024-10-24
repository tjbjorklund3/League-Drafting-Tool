import React from 'react';
import { X } from 'lucide-react';
import { SwapRequest } from '../types/draft';

interface Props {
  request: SwapRequest;
  onAccept: () => void;
  onDecline: () => void;
  teamName: string;
}

export function SwapRequestModal({ request, onAccept, onDecline, teamName }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Swap Request</h3>
          <button
            onClick={onDecline}
            className="p-1 hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-gray-300 mb-4">
          {teamName} wants to swap their champion selection. This will revert the draft back to
          position {request.originalPhase + 1} and restart the timer.
        </p>

        <div className="flex gap-4">
          <button
            onClick={onAccept}
            className="flex-1 py-2 bg-green-500 hover:bg-green-600 rounded font-medium transition-colors"
          >
            Accept
          </button>
          <button
            onClick={onDecline}
            className="flex-1 py-2 bg-red-500 hover:bg-red-600 rounded font-medium transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}