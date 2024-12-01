import React from 'react';
import { motion } from 'framer-motion';

interface StudyProgressProps {
  currentCard: number;
  totalCards: number;
  correctAnswers: number;
}

export default function StudyProgress({ currentCard, totalCards, correctAnswers }: StudyProgressProps) {
  const progress = (currentCard / totalCards) * 100;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-gray-600">
          {currentCard} / {totalCards} cartes
        </div>
        <div className="text-sm text-gray-600">
          {correctAnswers} correctes
        </div>
      </div>
      
      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full bg-indigo-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}