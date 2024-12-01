import React from 'react';
import { LogIn, LogOut } from 'lucide-react';
import { signIn, signOut } from '../../lib/supabase/auth';
import { useAuth } from '../../hooks/useAuth';

export default function AuthButton() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <button
      onClick={() => user ? signOut() : signIn()}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
    >
      {user ? (
        <>
          <LogOut className="w-4 h-4" />
          Déconnexion
        </>
      ) : (
        <>
          <LogIn className="w-4 h-4" />
          Connexion
        </>
      )}
    </button>
  );
}