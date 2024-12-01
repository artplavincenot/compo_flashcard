import React, { useState, useCallback } from 'react';
import { Plus, Upload, ChevronLeft } from 'lucide-react';
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery';
import { supabase } from '../../lib/supabase/client';
import type { Deck } from '../../types/memory';
import DeckForm from './DeckForm';
import DeckList from './DeckList';
import FlashcardManager from './FlashcardManager';
import XMLImporter from './XMLImporter';
import toast from 'react-hot-toast';

export default function DeckManager() {
  const { data: decks, loading, refetch } = useSupabaseQuery<Deck>('decks', {
    orderBy: { column: 'order', ascending: true }
  });
  const [showForm, setShowForm] = useState(false);
  const [showImporter, setShowImporter] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);

  const handleReorder = async (sourceIndex: number, destinationIndex: number) => {
    if (!decks) return;

    const reorderedDecks = [...decks];
    const [movedDeck] = reorderedDecks.splice(sourceIndex, 1);
    reorderedDecks.splice(destinationIndex, 0, movedDeck);

    // Update order values
    const updates = reorderedDecks.map((deck, index) => ({
      id: deck.id,
      order: index + 1
    }));

    try {
      for (const update of updates) {
        await supabase
          .from('decks')
          .update({ order: update.order })
          .eq('id', update.id);
      }
      refetch();
      toast.success('Ordre des decks mis à jour');
    } catch (error) {
      console.error('Error updating deck order:', error);
      toast.error('Erreur lors de la mise à jour de l\'ordre des decks');
    }
  };

  const handleToggleLock = async (deckId: string) => {
    const deck = decks?.find(d => d.id === deckId);
    if (!deck) return;

    try {
      await supabase
        .from('decks')
        .update({ is_locked: !deck.is_locked })
        .eq('id', deckId);
      refetch();
      toast.success(deck.is_locked ? 'Deck déverrouillé' : 'Deck verrouillé');
    } catch (error) {
      console.error('Error toggling deck lock:', error);
      toast.error('Erreur lors du verrouillage/déverrouillage du deck');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce deck ?')) {
      try {
        await supabase
          .from('decks')
          .delete()
          .eq('id', id);
        refetch();
        toast.success('Deck supprimé');
      } catch (error) {
        console.error('Error deleting deck:', error);
        toast.error('Erreur lors de la suppression du deck');
      }
    }
  };

  const handleManageDeck = (deck: Deck) => {
    setSelectedDeck(deck);
  };

  const handleSubmit = async (data: Deck) => {
    try {
      if (editingDeck) {
        await supabase
          .from('decks')
          .update(data)
          .eq('id', editingDeck.id);
        toast.success('Deck mis à jour');
      } else {
        await supabase
          .from('decks')
          .insert(data);
        toast.success('Deck créé');
      }
      
      setShowForm(false);
      setEditingDeck(null);
      refetch();
    } catch (error) {
      console.error('Error saving deck:', error);
      toast.error('Erreur lors de l\'enregistrement du deck');
    }
  };

  const handleBack = useCallback(() => {
    setShowImporter(false);
    setSelectedDeck(null);
    setShowForm(false);
  }, []);

  const currentMaxOrder = decks?.reduce((max, deck) => 
    Math.max(max, deck.order), 0) || 0;

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {selectedDeck ? (
            <button
              onClick={() => setSelectedDeck(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-6 h-6" />
              {selectedDeck.name}
            </button>
          ) : (
            'Gestion des Decks'
          )}
        </h1>
        {!selectedDeck && !showImporter && !showForm && (
          <div className="flex gap-4">
            <button
              onClick={() => setShowImporter(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Importer ZIP
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nouveau Deck
            </button>
          </div>
        )}
      </div>

      {showImporter ? (
        <XMLImporter onComplete={refetch} onBack={handleBack} />
      ) : showForm ? (
        <DeckForm
          initialData={editingDeck || undefined}
          onSubmit={handleSubmit}
          onCancel={handleBack}
          currentMaxOrder={currentMaxOrder}
        />
      ) : selectedDeck ? (
        <FlashcardManager deckId={selectedDeck.id} />
      ) : decks ? (
        <DeckList
          decks={decks}
          onReorder={handleReorder}
          onToggleLock={handleToggleLock}
          onDelete={handleDelete}
          onManage={handleManageDeck}
        />
      ) : null}
    </div>
  );
}