import React from 'react';
import { Clock } from 'lucide-react';

interface StudyTimerProps {
  timeRemaining: number;
}

export default function StudyTimer({ timeRemaining }: StudyTimerProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="flex items-center gap-2 text-gray-600">
      <Clock className="w-4 h-4" />
      <span className="font-medium">
        {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
}