import React, { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
import type { DeckFormData } from '../../types/memory';
import { useCategories } from '../../hooks/useCategories';

interface DeckFormProps {
  initialData?: Partial<DeckFormData>;
  onSubmit: (data: DeckFormData) => void;
  onCancel: () => void;
  currentMaxOrder: number;
}

export default function DeckForm({ initialData, onSubmit, onCancel, currentMaxOrder }: DeckFormProps) {
  const { categories, loading: categoriesLoading } = useCategories();
  const [formData, setFormData] = useState<DeckFormData>({
    name: initialData?.name || '',
    category: initialData?.category || 'Modern',
    is_locked: initialData?.is_locked || false,
    order: initialData?.order || currentMaxOrder + 1
  });

  const [newCategory, setNewCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      category: showNewCategoryInput ? newCategory : formData.category
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nom du deck
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Catégorie
        </label>
        {showNewCategoryInput ? (
          <div className="mt-1 flex gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Nouvelle catégorie"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewCategoryInput(false)}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Annuler
            </button>
          </div>
        ) : (
          <div className="mt-1 flex gap-2">
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              disabled={categoriesLoading}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowNewCategoryInput(true)}
              className="px-3 py-2 text-sm text-indigo-600 hover:text-indigo-700"
            >
              Nouvelle
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, is_locked: !prev.is_locked }))}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              formData.is_locked
                ? 'bg-gray-100 text-gray-600'
                : 'bg-green-50 text-green-600'
            }`}
          >
            {formData.is_locked ? (
              <>
                <Lock className="w-4 h-4" />
                <span>Verrouillé</span>
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4" />
                <span>Déverrouillé</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
        >
          Enregistrer
        </button>
      </div>
    </form>
  );
}