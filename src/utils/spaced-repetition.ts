import type { StudyCard } from '../types/learning';

// SuperMemo 2 Algorithm parameters
const DEFAULT_EASE_FACTOR = 2.5;
const MINIMUM_EASE_FACTOR = 1.3;

export function calculateNextReview(card: StudyCard, quality: number): StudyCard {
  // Quality: 0-2 (incorrect), 3-5 (correct with varying degrees of difficulty)
  const isCorrect = quality >= 3;
  let { repetitions, easeFactor } = card;
  let interval: number;

  if (!isCorrect) {
    repetitions = 0;
    interval = 0; // Review immediately
    easeFactor = Math.max(MINIMUM_EASE_FACTOR, easeFactor - 0.2);
  } else {
    repetitions += 1;
    easeFactor = Math.max(
      MINIMUM_EASE_FACTOR,
      easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );

    if (repetitions === 1) {
      interval = 1; // 1 day
    } else if (repetitions === 2) {
      interval = 6; // 6 days
    } else {
      interval = Math.round(card.repetitions * easeFactor);
    }
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  return {
    ...card,
    repetitions,
    easeFactor,
    nextReviewDate: nextReviewDate.toISOString(),
    status: isCorrect ? 'reviewing' : 'learning'
  };
}

export function getDueCards(cards: StudyCard[]): StudyCard[] {
  const now = new Date();
  return cards
    .filter(card => {
      if (!card.nextReviewDate) return true;
      return new Date(card.nextReviewDate) <= now;
    })
    .sort((a, b) => {
      // Prioritize cards in learning state
      if (a.status === 'learning' && b.status !== 'learning') return -1;
      if (b.status === 'learning' && a.status !== 'learning') return 1;
      
      // Then sort by due date
      const aDate = a.nextReviewDate ? new Date(a.nextReviewDate) : new Date(0);
      const bDate = b.nextReviewDate ? new Date(b.nextReviewDate) : new Date(0);
      return aDate.getTime() - bDate.getTime();
    });
}