import type { Flashcard } from './memory';

export interface LearningSession {
  deckId: string;
  startTime: number;
  cardsStudied: number;
  correctAnswers: number;
  lastReviewDate?: string;
}

export interface UserProgress {
  user_id: string;
  deck_id: string;
  cards_studied: number;
  correct_answers: number;
  daily_xp: number;
  last_reward_date: string;
  review_history: ReviewHistory[];
}

export interface ReviewHistory {
  card_id: string;
  review_date: string;
  difficulty: string;
  interval: number;
}

export interface StudyCard extends Flashcard {
  status: 'new' | 'learning' | 'reviewing';
  nextReviewDate?: string;
  repetitions: number;
  easeFactor: number;
  lastInterval?: number;
}