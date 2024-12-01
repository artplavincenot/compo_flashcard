import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery';
import { supabase } from '../../lib/supabase/client';
import type { Flashcard, FlashcardFormData } from '../../types/memory';
import FlashcardForm from './FlashcardForm';

interface FlashcardManagerProps {
  deckId: string;
}

export default function FlashcardManager({ deckId }: FlashcardManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const { data: cards, loading, refetch } = useSupabaseQuery<Flashcard>('flashcards', {
    column: 'deck_id',
    value: deckId
  });

  const handleSubmit = async (data: FlashcardFormData) => {
    try {
      if (editingCard) {
        await supabase
          .from('flashcards')
          .update(data)
          .eq('id', editingCard.id);
      } else {
        await supabase
          .from('flashcards')
          .insert(data);
      }
      
      setShowForm(false);
      setEditingCard(null);
      refetch();
    } catch (error) {
      console.error('Error saving flashcard:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette carte ?')) {
      try {
        await supabase
          .from('flashcards')
          .delete()
          .eq('id', id);
        refetch();
      } catch (error) {
        console.error('Error deleting flashcard:', error);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      {showForm ? (
        <FlashcardForm
          deckId={deckId}
          initialData={editingCard || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingCard(null);
          }}
        />
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus className="w-4 h-4" />
          Nouvelle Carte
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards?.map((card) => (
          <div key={card.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium text-gray-900 truncate">
                {card.front_text}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingCard(card);
                    setShowForm(true);
                  }}
                  className="text-gray-600 hover:text-gray-700"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(card.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            {card.image_url && (
              <div className="relative w-full h-32 mb-4">
                <img
                  src={card.image_url}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover rounded-md"
                  crossOrigin="anonymous"
                />
              </div>
            )}
            <p className="text-sm text-gray-600 truncate">{card.back_text}</p>
            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <span>Difficulté: {card.difficulty}/5</span>
              <span>{new Date(card.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}