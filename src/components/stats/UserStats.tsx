import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Target } from 'lucide-react';
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery';
import { useAuth } from '../../hooks/useAuth';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import type { UserProgress } from '../../types/learning';
import type { Deck } from '../../types/memory';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function UserStats() {
  const { user } = useAuth();
  const { data: progress } = useSupabaseQuery<UserProgress>('user_progress', {
    column: 'user_id',
    value: user?.id
  });
  const { data: decks } = useSupabaseQuery<Deck>('decks');

  if (!progress?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucune statistique disponible</p>
      </div>
    );
  }

  // Create a map of deck IDs to deck names
  const deckNames = decks?.reduce((acc, deck) => {
    acc[deck.id] = deck.name;
    return acc;
  }, {} as Record<string, string>) || {};

  // Calculate total stats
  const totalStats = progress.reduce((acc, curr) => ({
    cardsStudied: acc.cardsStudied + (curr.cards_studied || 0),
    correctAnswers: acc.correctAnswers + (curr.correct_answers || 0)
  }), { cardsStudied: 0, correctAnswers: 0 });

  // Calculate accuracy percentage
  const accuracy = totalStats.cardsStudied > 0
    ? Math.round((totalStats.correctAnswers / totalStats.cardsStudied) * 100)
    : 0;

  // Prepare data for the difficulty distribution chart
  const difficultyData = {
    labels: ['Échec', 'Difficile', 'Facile', 'Parfait'],
    datasets: [{
      label: 'Distribution des réponses',
      data: [
        totalStats.cardsStudied - totalStats.correctAnswers,
        Math.round(totalStats.correctAnswers * 0.3),
        Math.round(totalStats.correctAnswers * 0.5),
        Math.round(totalStats.correctAnswers * 0.2)
      ],
      backgroundColor: [
        '#EF4444', // Rouge pour Échec
        '#F97316', // Orange pour Difficile
        '#22C55E', // Vert pour Facile
        '#15803D'  // Vert foncé pour Parfait
      ]
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Distribution des réponses',
        color: '#374151',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-indigo-500" />
            <h3 className="font-medium text-gray-900">Cartes étudiées</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {totalStats.cardsStudied}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-indigo-500" />
            <h3 className="font-medium text-gray-900">Précision</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {accuracy}%
          </p>
          <p className="text-sm text-gray-500">
            {totalStats.correctAnswers} réponses correctes
          </p>
        </motion.div>
      </div>

      {/* Difficulty Distribution Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <Bar data={difficultyData} options={chartOptions} />
      </motion.div>

      {/* Per Deck Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {progress.map((deckProgress, index) => (
          <motion.div
            key={deckProgress.deck_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 3) }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h3 className="font-medium text-gray-900 mb-4">
              {deckNames[deckProgress.deck_id] || 'Deck inconnu'}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Cartes étudiées</p>
                <p className="text-xl font-semibold text-gray-900">
                  {deckProgress.cards_studied}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Réponses correctes</p>
                <p className="text-xl font-semibold text-gray-900">
                  {deckProgress.correct_answers}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}