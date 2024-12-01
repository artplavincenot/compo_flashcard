import React from 'react';
import { motion } from 'framer-motion';
import type { Flashcard } from '../../types/memory';
import '../../styles/flashcard.css';

interface FlashcardViewProps {
  card: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
  disabled?: boolean;
}

export default function FlashcardView({ 
  card, 
  isFlipped, 
  onFlip,
  disabled = false 
}: FlashcardViewProps) {
  return (
    <div 
      className={`perspective-1000 w-full cursor-pointer ${disabled ? 'pointer-events-none' : ''}`}
      onClick={onFlip}
      role="button"
      tabIndex={0}
      aria-label="Flashcard"
    >
      <motion.div
        className={`card-container ${isFlipped ? 'card-flipped' : ''}`}
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Front of card */}
        <div className="card-face card-front">
          <div className="card-content bg-white rounded-xl shadow-lg">
            {card.image_url && (
              <img
                src={card.image_url}
                alt=""
                className="card-image"
                loading="lazy"
                crossOrigin="anonymous"
              />
            )}
            <div className="card-text">
              <p className="text-xl text-gray-900">{card.front_text}</p>
            </div>
            <p className="text-sm text-gray-500 text-center mt-2">
              Cliquer pour retourner
            </p>
          </div>
        </div>

        {/* Back of card */}
        <div className="card-face card-back">
          <div className="card-content bg-white rounded-xl shadow-lg">
            <div className="card-text">
              <p className="text-xl text-gray-900">{card.back_text}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}