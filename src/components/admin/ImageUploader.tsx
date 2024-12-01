import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { uploadImage } from '../../lib/supabase/client';
import toast from 'react-hot-toast';

interface ImageUploaderProps {
  onUploadComplete: (url: string) => void;
  onError: (error: string) => void;
}

export default function ImageUploader({ onUploadComplete, onError }: ImageUploaderProps) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    
    // Validation
    if (file.size > 5 * 1024 * 1024) {
      onError("L'image ne doit pas dépasser 5Mo");
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      onError("Format d'image non supporté");
      return;
    }

    try {
      const { url, error } = await uploadImage(file);
      
      if (error) {
        throw error;
      }

      if (url) {
        onUploadComplete(url);
        toast.success('Image uploadée avec succès');
      }
    } catch (error) {
      console.error('Upload error:', error);
      onError("Erreur lors de l'upload de l'image. Veuillez vérifier vos permissions.");
    }
  }, [onUploadComplete, onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
        ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}
      `}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        {isDragActive ? 
          "Déposez l'image ici..." : 
          'Glissez-déposez une image, ou cliquez pour sélectionner'
        }
      </p>
      <p className="mt-1 text-xs text-gray-500">
        PNG, JPG, WEBP ou GIF jusqu'à 5MB
      </p>
    </div>
  );
}