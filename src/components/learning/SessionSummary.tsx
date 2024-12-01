import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Target } from 'lucide-react';
import type { LearningSession } from '../../types/learning';

interface SessionSummaryProps {
  session: LearningSession;
  onClose: () => void;
}

export default function SessionSummary({ session, onClose }: SessionSummaryProps) {
  const duration = Math.round((Date.now() - session.startTime) / 1000);
  const accuracy = Math.round((session.correctAnswers / session.cardsStudied) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Session terminée !</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <Clock className="w-6 h-6 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Durée</p>
          <p className="text-lg font-semibold text-gray-900">
            {Math.floor(duration / 60)}m {duration % 60}s
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <Target className="w-6 h-6 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Précision</p>
          <p className="text-lg font-semibold text-gray-900">{accuracy}%</p>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Continuer
      </button>
    </motion.div>
  );
}