// src/hooks/useStudySession.ts
import { useState, useCallback, useEffect, useMemo } from 'react';
import type { Flashcard } from '../types/memory';
import type { StudyCard, LearningSession } from '../types/learning';
import type { StudyDuration, DifficultyWeight } from '../constants/study';
import { rotateCards, shuffleCards } from '../utils/cardRotation';
import { calculateNextReview } from '../lib/spaced-repetition';
import { updateUserProgress } from '../lib/supabase/progress';
import { supabase } from '../lib/supabase/client';
import toast from 'react-hot-toast';

interface UseStudySessionProps {
  cards: Flashcard[];
  duration: StudyDuration;
  deckId: string;
  onComplete: (session: LearningSession) => void;
}

export function useStudySession({ 
  cards, 
  duration, 
  deckId, 
  onComplete 
}: UseStudySessionProps) {
  const [studyCards, setStudyCards] = useState<StudyCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(duration * 60);
  const [stats, setStats] = useState({ cardsStudied: 0, correctAnswers: 0 });
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Initialize study cards
  useEffect(() => {
    if (cards && cards.length > 0) {
      const initialStudyCards = cards.map(card => ({
        ...card,
        status: 'new',
        repetitions: 0,
        easeFactor: 2.5,
        lastInterval: 0
      }));
      setStudyCards(shuffleCards(initialStudyCards));
    }
  }, [cards]);

  // Timer logic
  useEffect(() => {
    if (!studyCards.length) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          onComplete({
            deckId,
            startTime: Date.now() - duration * 60 * 1000,
            cardsStudied: stats.cardsStudied,
            correctAnswers: stats.correctAnswers,
            lastReviewDate: new Date().toISOString()
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [duration, onComplete, stats, studyCards.length, deckId]);

  const currentCard = useMemo(() => 
    studyCards.length > 0 ? studyCards[currentIndex] : null,
    [studyCards, currentIndex]
  );

  const handleFlip = useCallback(() => {
    if (!isTransitioning) {
      setIsFlipped(prev => !prev);
    }
  }, [isTransitioning]);

  const moveToNextCard = useCallback((newIndex: number) => {
    setIsTransitioning(true);
    setIsFlipped(false);

    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsTransitioning(false);
    }, 300);
  }, []);

  const handleDifficultySelect = useCallback(async (difficulty: DifficultyWeight) => {
    if (!currentCard || isTransitioning || timeRemaining <= 0) return;

    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        toast.error('Vous devez être connecté pour enregistrer votre progression');
        return;
      }

      // Calculate next review parameters
      const updatedCard = calculateNextReview(currentCard, difficulty);

      // Update progress and review history
      await updateUserProgress(
        user.id,
        deckId,
        currentCard.id,
        difficulty,
        updatedCard
      );

      // Update study cards array
      setStudyCards(prev => {
        const updated = [...prev];
        updated[currentIndex] = updatedCard;
        return updated;
      });

      // Update local stats
      setStats(prev => ({
        cardsStudied: prev.cardsStudied + 1,
        correctAnswers: prev.correctAnswers + (difficulty !== 'FAIL' ? 1 : 0)
      }));

      // Calculate next card index using rotation logic
      const nextIndex = rotateCards(studyCards, currentIndex, difficulty);
      moveToNextCard(nextIndex);

    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Erreur lors de la mise à jour de la progression');
    }
  }, [currentCard, deckId, studyCards, currentIndex, isTransitioning, timeRemaining, moveToNextCard]);

  return {
    currentCard,
    isFlipped,
    timeRemaining,
    stats,
    handleFlip,
    handleDifficultySelect,
    isTransitioning
  };
}
