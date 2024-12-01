import React from 'react';
import { motion } from 'framer-motion';
import { X, AlertTriangle, ThumbsUp, CheckCircle, Star } from 'lucide-react';
import type { DifficultyWeight } from '../../constants/study';

interface DifficultyRatingProps {
  onRate: (difficulty: DifficultyWeight) => void;
  disabled?: boolean;
}

export default function DifficultyRating({ onRate, disabled = false }: DifficultyRatingProps) {
  const ratings = [
    { difficulty: 'FAIL' as const, icon: X, label: 'À revoir', color: 'text-red-500' },
    { difficulty: 'HARD' as const, icon: AlertTriangle, label: 'Difficile', color: 'text-orange-500' },
    { difficulty: 'GOOD' as const, icon: ThumbsUp, label: 'Bien', color: 'text-green-500' },
    { difficulty: 'EASY' as const, icon: CheckCircle, label: 'Facile', color: 'text-emerald-500' },
    { difficulty: 'PERFECT' as const, icon: Star, label: 'Parfait', color: 'text-indigo-500' }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {ratings.map(({ difficulty, icon: Icon, label, color }) => (
        <motion.button
          key={difficulty}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onRate(difficulty)}
          disabled={disabled}
          className={`
            flex flex-col items-center p-3 rounded-lg 
            bg-white shadow-sm hover:shadow-md
            ${color} transition-all duration-200
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
          `}
        >
          <Icon className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">{label}</span>
        </motion.button>
      ))}
    </div>
  );
}