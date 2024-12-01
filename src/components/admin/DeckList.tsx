import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Lock, Unlock, Trash2, GripVertical, Settings } from 'lucide-react';
import type { Deck } from '../../types/memory';

interface DeckListProps {
  decks: Deck[];
  onReorder: (sourceIndex: number, destinationIndex: number) => void;
  onToggleLock: (deckId: string) => void;
  onDelete: (deckId: string) => void;
  onManage: (deck: Deck) => void;
}

export default function DeckList({ 
  decks, 
  onReorder, 
  onToggleLock, 
  onDelete,
  onManage 
}: DeckListProps) {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    onReorder(result.source.index, result.destination.index);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="decks">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`
              space-y-4 p-4 rounded-lg
              ${snapshot.isDraggingOver ? 'bg-indigo-50/30' : ''}
              transition-colors duration-200
            `}
          >
            {decks.map((deck, index) => (
              <Draggable key={deck.id} draggableId={deck.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={{
                      ...provided.draggableProps.style,
                      opacity: Math.max(0.4, 1 - (index * 0.15))
                    }}
                    className={`
                      group relative rounded-lg
                      bg-gradient-to-r from-indigo-500/10 to-indigo-600/10
                      border-2 ${snapshot.isDragging ? 'border-indigo-500' : 'border-indigo-200'}
                      shadow-sm hover:shadow-md
                      transition-all duration-200 ease-in-out
                      ${snapshot.isDragging ? 'ring-2 ring-indigo-500 ring-opacity-50' : ''}
                      hover:opacity-100
                    `}
                  >
                    <div className="relative p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {/* Drag Handle with improved grip icon */}
                          <div
                            {...provided.dragHandleProps}
                            className="
                              cursor-grab active:cursor-grabbing
                              p-2 rounded-lg 
                              bg-white hover:bg-indigo-100
                              transition-colors
                              border border-indigo-200
                              shadow-sm
                              group-hover:shadow-md
                            "
                            title="Déplacer pour réorganiser"
                          >
                            <GripVertical className="w-5 h-5 text-indigo-500" />
                          </div>

                          {/* Deck Info with Order Badge */}
                          <div className="flex items-center space-x-4">
                            <div className="
                              w-8 h-8 
                              flex items-center justify-center 
                              rounded-full 
                              bg-white 
                              border-2 border-indigo-200
                              text-indigo-700 
                              font-semibold
                              shadow-sm
                            ">
                              {index + 1}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900 text-lg">
                                {deck.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {deck.category}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onManage(deck)}
                            className="
                              p-2.5 rounded-lg 
                              bg-white hover:bg-indigo-100
                              text-indigo-600 
                              transition-colors
                              border border-indigo-200
                              shadow-sm hover:shadow-md
                            "
                            title="Gérer le deck"
                          >
                            <Settings className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => onToggleLock(deck.id)}
                            className={`
                              p-2.5 rounded-lg
                              transition-colors
                              border border-gray-200
                              shadow-sm hover:shadow-md
                              ${deck.is_locked 
                                ? 'bg-white hover:bg-gray-100 text-gray-400' 
                                : 'bg-white hover:bg-green-100 text-green-600'}
                            `}
                            title={deck.is_locked ? 'Déverrouiller' : 'Verrouiller'}
                          >
                            {deck.is_locked ? (
                              <Lock className="w-5 h-5" />
                            ) : (
                              <Unlock className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => onDelete(deck.id)}
                            className="
                              p-2.5 rounded-lg 
                              bg-white hover:bg-red-100
                              text-red-500 
                              transition-colors
                              border border-red-200
                              shadow-sm hover:shadow-md
                            "
                            title="Supprimer"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}