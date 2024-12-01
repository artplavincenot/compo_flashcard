import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import type { Flashcard } from '../../types/memory';
import type { StudyDuration } from '../../constants/study';
import { useStudySession } from '../../hooks/useStudySession';
import FlashcardView from './FlashcardView';
import DifficultyButtons from './DifficultyButtons';
import StudyTimer from './StudyTimer';
import StudyProgress from './StudyProgress';

interface StudySessionProps {
  deckId: string;
  duration: StudyDuration;
  cards: Flashcard[];
  onComplete: (session: { cardsStudied: number; correctAnswers: number }) => void;
  onBack: () => void;
}

export default function StudySession({ 
  deckId, 
  duration, 
  cards = [], 
  onComplete, 
  onBack 
}: StudySessionProps) {
  const {
    currentCard,
    isFlipped,
    timeRemaining,
    stats,
    handleFlip,
    handleDifficultySelect,
    isTransitioning
  } = useStudySession({
    cards,
    duration,
    deckId,
    onComplete
  });

  useEffect(() => {
    if (!cards || cards.length === 0) {
      console.warn('No cards provided to StudySession');
    }
  }, [cards]);

  if (!cards || cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucune carte disponible</p>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Chargement des cartes...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          disabled={isTransitioning}
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>
        <StudyTimer timeRemaining={timeRemaining} />
      </div>

      <StudyProgress
        currentCard={stats.cardsStudied + 1}
        totalCards={cards.length}
        correctAnswers={stats.correctAnswers}
      />

      <div className="mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <FlashcardView
              card={currentCard}
              isFlipped={isFlipped}
              onFlip={handleFlip}
              disabled={isTransitioning}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {isFlipped && !isTransitioning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <DifficultyButtons onSelect={handleDifficultySelect} />
        </motion.div>
      )}
    </div>
  );
}