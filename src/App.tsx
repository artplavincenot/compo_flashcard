import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Brain, Settings, BarChart3 } from 'lucide-react';
import DeckManager from './components/admin/DeckManager';
import AuthButton from './components/auth/AuthButton';
import { useAuth } from './hooks/useAuth';
import DeckGrid from './components/learning/DeckGrid';
import StudySession from './components/learning/StudySession';
import SessionSummary from './components/learning/SessionSummary';
import UserStats from './components/stats/UserStats';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useSupabaseQuery } from './hooks/useSupabaseQuery';
import type { Deck } from './types/memory';
import type { LearningSession } from './types/learning';
import type { StudyDuration } from './constants/study';

function App() {
  const { user, loading } = useAuth();
  const [view, setView] = useState<'learn' | 'admin' | 'stats'>('learn');
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [studyDuration, setStudyDuration] = useState<StudyDuration>(5);
  const [completedSession, setCompletedSession] = useState<LearningSession | null>(null);

  const { data: cards } = useSupabaseQuery(
    'flashcards',
    selectedDeck ? {
      column: 'deck_id',
      value: selectedDeck.id
    } : undefined
  );

  const handleDeckSelect = (deck: Deck, duration: StudyDuration) => {
    setSelectedDeck(deck);
    setStudyDuration(duration);
  };

  const handleSessionComplete = (session: LearningSession) => {
    setCompletedSession(session);
  };

  const handleSessionClose = () => {
    setCompletedSession(null);
    setSelectedDeck(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold text-gray-900">
                Flashcards
              </h1>
              <nav className="flex space-x-4">
                <button
                  onClick={() => setView('learn')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                    view === 'learn' 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Brain className="w-4 h-4" />
                  <span>Apprendre</span>
                </button>
                <button
                  onClick={() => setView('stats')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                    view === 'stats'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Statistiques</span>
                </button>
                {user && (
                  <button
                    onClick={() => setView('admin')}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                      view === 'admin'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Administration</span>
                  </button>
                )}
              </nav>
            </div>
            <AuthButton />
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {view === 'admin' && user ? (
            <DeckManager />
          ) : view === 'stats' ? (
            <UserStats />
          ) : (
            <div className="max-w-6xl mx-auto">
              {completedSession ? (
                <SessionSummary
                  session={completedSession}
                  onClose={handleSessionClose}
                />
              ) : selectedDeck ? (
                <StudySession
                  deckId={selectedDeck.id}
                  duration={studyDuration}
                  cards={cards || []}
                  onComplete={handleSessionComplete}
                  onBack={() => setSelectedDeck(null)}
                />
              ) : (
                <DeckGrid onDeckSelect={handleDeckSelect} />
              )}
            </div>
          )}
        </main>
        <Toaster position="top-right" />
      </div>
    </ErrorBoundary>
  );
}

export default App;