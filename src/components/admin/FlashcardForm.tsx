import React, { useState } from 'react';
import type { FlashcardFormData } from '../../types/memory';
import ImageUploader from './ImageUploader';

interface FlashcardFormProps {
  deckId: string;
  initialData?: Partial<FlashcardFormData>;
  onSubmit: (data: FlashcardFormData) => void;
  onCancel: () => void;
}

export default function FlashcardForm({ deckId, initialData, onSubmit, onCancel }: FlashcardFormProps) {
  const [formData, setFormData] = useState<FlashcardFormData>({
    deck_id: deckId,
    front_text: initialData?.front_text || '',
    back_text: initialData?.back_text || '',
    image_url: initialData?.image_url,
    difficulty: initialData?.difficulty || 1
  });

  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, image_url: url }));
    setError(null);
  };

  const handleImageError = (error: string) => {
    setError(error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="front_text" className="block text-sm font-medium text-gray-700">
          Texte recto
        </label>
        <textarea
          id="front_text"
          value={formData.front_text}
          onChange={(e) => setFormData(prev => ({ ...prev, front_text: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          rows={3}
          required
        />
      </div>

      <div>
        <label htmlFor="back_text" className="block text-sm font-medium text-gray-700">
          Texte verso
        </label>
        <textarea
          id="back_text"
          value={formData.back_text}
          onChange={(e) => setFormData(prev => ({ ...prev, back_text: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image (optionnelle)
        </label>
        <ImageUploader
          onUploadComplete={handleImageUpload}
          onError={handleImageError}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
        {formData.image_url && (
          <div className="mt-2">
            <img
              src={formData.image_url}
              alt="Preview"
              className="h-32 w-auto object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
          Difficulté
        </label>
        <input
          type="range"
          id="difficulty"
          min="1"
          max="5"
          value={formData.difficulty}
          onChange={(e) => setFormData(prev => ({ ...prev, difficulty: parseInt(e.target.value) }))}
          className="mt-1 block w-full"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>Facile</span>
          <span>Moyen</span>
          <span>Difficile</span>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Enregistrer
        </button>
      </div>
    </form>
  );
}