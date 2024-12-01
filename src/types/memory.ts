export interface Deck {
  id: string;
  name: string;
  category: 'Modern' | 'Classical';
  is_locked: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Flashcard {
  id: string;
  deck_id: string;
  front_text: string;
  back_text: string;
  image_url?: string;
  difficulty: number;
  created_at: string;
  updated_at: string;
}

export interface DeckFormData {
  name: string;
  category: 'Modern' | 'Classical';
  is_locked: boolean;
  order: number;
}

export interface FlashcardFormData {
  deck_id: string;
  front_text: string;
  back_text: string;
  image_url?: string;
  difficulty: number;
}