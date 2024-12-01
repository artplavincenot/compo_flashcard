import React, { useState } from 'react';
import { Upload, AlertCircle, ArrowLeft } from 'lucide-react';
import { validateXMLStructure } from '../../utils/xml-validator';
import { supabase } from '../../lib/supabase/client';
import { uploadImage } from '../../lib/supabase/client';
import JSZip from 'jszip';
import toast from 'react-hot-toast';

interface XMLImporterProps {
  onComplete: () => void;
  onBack: () => void;
}

export default function XMLImporter({ onComplete, onBack }: XMLImporterProps) {
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  const processZipContent = async (file: File) => {
    try {
      setImporting(true);
      const zip = new JSZip();
      const contents = await zip.loadAsync(file);
      
      // Find XML file
      const xmlFile = Object.values(contents.files).find(f => f.name.endsWith('.xml'));
      if (!xmlFile) {
        throw new Error('Aucun fichier XML trouvé dans le ZIP');
      }

      // Read XML content
      const xmlContent = await xmlFile.async('text');
      const validation = validateXMLStructure(xmlContent);
      if (!validation.isValid) {
        throw new Error(validation.error || 'Structure XML invalide');
      }

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
      const deck = xmlDoc.getElementsByTagName('deck')[0];
      const deckName = deck.getAttribute('name');

      // Insert deck
      const { data: newDeck, error: deckError } = await supabase
        .from('decks')
        .insert({
          name: deckName,
          category: deckName, // Using deck name as category
          is_locked: false,
          order: 0
        })
        .select()
        .single();

      if (deckError) throw deckError;

      // Process cards
      const cards = deck.getElementsByTagName('card');
      for (const card of Array.from(cards)) {
        // Get front text (Texte sous l'image)
        const frontText = card.querySelector('text[name="Texte sous l\'image"]')?.textContent?.trim() || '';
        
        // Get back text
        const backText = card.querySelector('text[name="Texte"]')?.textContent?.trim() || '';

        // Handle image
        let imageUrl = null;
        const imgElement = card.querySelector('img[type]');
        if (imgElement) {
          const imgId = imgElement.getAttribute('id');
          if (imgId) {
            // Look for image file in zip
            const imageFile = Object.values(contents.files).find(f => 
              f.name.includes(imgId) || f.name.endsWith(`${imgId}.png`)
            );

            if (imageFile) {
              const imageBlob = await imageFile.async('blob');
              const file = new File([imageBlob], `${imgId}.png`, {
                type: 'image/png'
              });
              const { url } = await uploadImage(file);
              imageUrl = url;
            }
          }
        }

        const { error: cardError } = await supabase
          .from('flashcards')
          .insert({
            deck_id: newDeck.id,
            front_text: frontText,
            back_text: backText,
            image_url: imageUrl,
            difficulty: 1
          });

        if (cardError) throw cardError;
      }

      toast.success('Import réussi !');
      onComplete();
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      toast.error(`Erreur d'import : ${errorMessage}`);
    } finally {
      setImporting(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (file.type !== 'application/zip') {
      setError('Veuillez uploader un fichier ZIP');
      return;
    }

    processZipContent(file);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux decks
      </button>

      <div className="text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Import ZIP</h3>
        <p className="mt-1 text-sm text-gray-500">
          Sélectionnez un fichier ZIP contenant votre fichier XML et les images
        </p>
        <div className="mt-6">
          <label className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
            <span>Sélectionner un fichier</span>
            <input
              type="file"
              className="hidden"
              accept=".zip"
              onChange={handleFileUpload}
              disabled={importing}
            />
          </label>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 rounded-md">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Erreur d'import
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      {importing && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Import en cours...
        </div>
      )}
    </div>
  );
}