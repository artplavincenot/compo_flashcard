import React from 'react';
import { motion } from 'framer-motion';
import { X, AlertTriangle, ThumbsUp, CheckCircle, Star } from 'lucide-react';
import type { DifficultyWeight } from '../../constants/study';

interface DifficultyButtonsProps {
  onSelect: (difficulty: DifficultyWeight) => void;
  disabled?: boolean;
}

export default function DifficultyButtons({ onSelect, disabled = false }: DifficultyButtonsProps) {
  const buttons = [
    { 
      difficulty: 'FAIL' as const,
      label: 'À revoir',
      color: 'bg-red-500 hover:bg-red-600',
      icon: X
    },
    { 
      difficulty: 'HARD' as const,
      label: 'Difficile',
      color: 'bg-orange-500 hover:bg-orange-600',
      icon: AlertTriangle
    },
    { 
      difficulty: 'GOOD' as const,
      label: 'Bien',
      color: 'bg-green-500 hover:bg-green-600',
      icon: ThumbsUp
    },
    { 
      difficulty: 'EASY' as const,
      label: 'Facile',
      color: 'bg-emerald-500 hover:bg-emerald-600',
      icon: CheckCircle
    },
    { 
      difficulty: 'PERFECT' as const,
      label: 'Parfait',
      color: 'bg-indigo-500 hover:bg-indigo-600',
      icon: Star
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
      {buttons.map(({ difficulty, label, color, icon: Icon }) => (
        <motion.button
          key={difficulty}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(difficulty)}
          disabled={disabled}
          className={`
            ${color} text-white font-medium py-3 px-4 rounded-lg
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2
            flex items-center justify-center gap-2
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <Icon className="w-4 h-4" />
          <span className="text-sm">{label}</span>
        </motion.button>
      ))}
    </div>
  );
}