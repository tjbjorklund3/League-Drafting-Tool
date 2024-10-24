import React from 'react';
import { Clock } from 'lucide-react';

interface Props {
  seconds: number;
  isActive: boolean;
}

export function DraftVSTimer({ seconds, isActive }: Props) {
  const getTimerColor = () => {
    if (!isActive) return 'text-gray-500';
    if (seconds <= 5) return 'text-red-500';
    if (seconds <= 10) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className={`flex items-center gap-2 text-2xl font-bold ${getTimerColor()}`}>
      <Clock className="animate-pulse" />
      <span>{seconds}</span>
    </div>
  );
}