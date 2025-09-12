'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Play, Square, Edit3, Trash2, Plus } from 'lucide-react';
import VoiceRecorder from '../components/VoiceRecorder';
import { getDocuments, updateDocument, deleteDocument } from '../lib/firebase/firebaseUtils';

interface Note {
  id: string;
  text: string;
  timestamp: string;
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const notesData = await getDocuments('notes');
      // Sort by timestamp descending (newest first)
      const sortedNotes = notesData.sort((a: any, b: any) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setNotes(sortedNotes as Note[]);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note.id);
    setEditText(note.text);
  };

  const handleSaveEdit = async (noteId: string) => {
    try {
      await updateDocument('notes', noteId, { text: editText });
      setEditingNote(null);
      setEditText('');
      loadNotes(); // Reload notes to show updated data
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDelete = async (noteId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteDocument('notes', noteId);
        loadNotes(); // Reload notes to show updated data
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Stethoscope className="h-8 w-8 text-blue-600" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900">Doctor Notes</h1>
          </div>
          <p className="text-center text-gray-600 mt-2">
            Voice-to-text transcription for medical consultations
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {/* Voice Recorder Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Start Recording Consultation
            </h2>
            <VoiceRecorder onNoteSaved={loadNotes} />
          </div>
        </motion.div>

        {/* Notes List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Recent Notes
          </h2>
          
          {notes.length === 0 ? (
            <div className="text-center py-12">
              <Stethoscope className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No notes yet</p>
              <p className="text-gray-400">Start recording to create your first note</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-gray-500">
                      {formatDate(note.timestamp)}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(note)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit note"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete note"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {editingNote === note.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={4}
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSaveEdit(note.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingNote(null);
                            setEditText('');
                          }}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {note.text}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Doctor Notes. Secure medical transcription.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
