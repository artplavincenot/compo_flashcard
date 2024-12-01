import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Brain, ArrowRight } from 'lucide-react';
import type { Deck } from '../../types/memory';
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery';
import DurationSelector from './DurationSelector';
import type { StudyDuration } from '../../constants/study';
import { STUDY_DURATIONS } from '../../constants/study';

interface DeckGridProps {
  onDeckSelect: (deck: Deck, duration: StudyDuration) => void;
}

export default function DeckGrid({ onDeckSelect }: DeckGridProps) {
  const { data: decks, loading } = useSupabaseQuery<Deck>('decks', {
    orderBy: { column: 'order', ascending: true }
  });
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);

  const handleDeckClick = (deck: Deck) => {
    if (!deck.is_locked) {
      setSelectedDeck(deck);
    }
  };

  const handleDurationSelect = (duration: StudyDuration) => {
    if (selectedDeck) {
      onDeckSelect(selectedDeck, duration);
      setSelectedDeck(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Chargement des decks...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {selectedDeck && (
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Choisissez la durée de révision pour {selectedDeck.name}
          </h3>
          <DurationSelector onSelect={handleDurationSelect} />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 sm:p-6">
        {decks?.map((deck, index) => (
          <motion.div
            key={deck.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
              relative bg-white rounded-xl shadow-sm overflow-hidden
              transition-shadow duration-200
              ${deck.is_locked ? 'opacity-75' : 'hover:shadow-md'}
            `}
            role="article"
            aria-label={`Deck ${deck.name}${deck.is_locked ? ' (verrouillé)' : ''}`}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {deck.name}
                </h3>
                {deck.is_locked ? (
                  <Lock 
                    className="w-6 h-6 text-gray-400" 
                    aria-label="Deck verrouillé"
                  />
                ) : (
                  <Brain 
                    className="w-6 h-6 text-indigo-500" 
                    aria-label="Deck disponible"
                  />
                )}
              </div>

              <p className="text-sm text-gray-500 mb-6">
                {deck.is_locked 
                  ? 'Ce deck sera débloqué plus tard'
                  : 'Prêt pour la révision'
                }
              </p>

              <button
                onClick={() => handleDeckClick(deck)}
                disabled={deck.is_locked}
                className={`
                  w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                  text-sm font-medium transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${deck.is_locked
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500'
                  }
                `}
                aria-disabled={deck.is_locked}
              >
                {deck.is_locked ? (
                  'Deck verrouillé'
                ) : (
                  <>
                    Commencer la révision
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}