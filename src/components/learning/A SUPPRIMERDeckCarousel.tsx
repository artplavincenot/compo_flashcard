import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Trophy } from 'lucide-react';
import type { Deck } from '../../types/memory';
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery';

interface DeckCarouselProps {
  onDeckSelect: (deck: Deck) => void;
}

export default function DeckCarousel({ onDeckSelect }: DeckCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const { data: decks, loading } = useSupabaseQuery<Deck>('decks', {
    orderBy: { column: 'order', ascending: true }
  });

  const handleNext = () => {
    if (decks) {
      setCurrentIndex((prev) => (prev + 1) % decks.length);
    }
  };

  const handlePrevious = () => {
    if (decks) {
      setCurrentIndex((prev) => (prev - 1 + decks.length) % decks.length);
    }
  };

  if (loading || !decks?.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement des decks...</div>
      </div>
    );
  }

  const currentDeck = decks[currentIndex];

  return (
    <div className="relative h-64 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-between z-10 px-4">
        <button
          onClick={handlePrevious}
          className="p-2 rounded-full bg-white/80 shadow-lg hover:bg-white"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <button
          onClick={handleNext}
          className="p-2 rounded-full bg-white/80 shadow-lg hover:bg-white"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentDeck.id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="h-full"
        >
          <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {currentDeck.name}
                </h3>
                <p className="text-sm text-gray-500">{currentDeck.category}</p>
              </div>
              {currentDeck.is_locked ? (
                <Trophy className="w-6 h-6 text-gray-400" />
              ) : (
                <Star className="w-6 h-6 text-yellow-400" />
              )}
            </div>

            <div className="flex-grow flex items-center justify-center">
              {currentDeck.is_locked ? (
                <p className="text-sm text-gray-500 text-center">
                  Ce deck sera débloqué à 1500 XP
                </p>
              ) : (
                <button
                  onClick={() => onDeckSelect(currentDeck)}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Commencer la révision
                </button>
              )}
            </div>

            <div className="mt-4 flex justify-between text-sm text-gray-500">
              <span>{currentIndex + 1} / {decks.length}</span>
              <span>Ordre: {currentDeck.order}</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}