import React from 'react';
import { Clock } from 'lucide-react';
import { STUDY_DURATIONS } from '../../constants/study';
import type { StudyDuration } from '../../constants/study';

interface DurationSelectorProps {
  onSelect: (duration: StudyDuration) => void;
}

export default function DurationSelector({ onSelect }: DurationSelectorProps) {
  return (
    <div className="flex gap-4 justify-center mb-6">
      {Object.entries(STUDY_DURATIONS).map(([key, value]) => (
        <button
          key={key}
          onClick={() => onSelect(value)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          <Clock className="w-4 h-4 text-indigo-500" />
          <span className="font-medium">{value} minutes</span>
        </button>
      ))}
    </div>
  );
}