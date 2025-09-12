'use client';

import { useState, useEffect } from 'react';
import { useDeepgram } from '../lib/contexts/DeepgramContext';
import { addDocument } from '../lib/firebase/firebaseUtils';
import { motion } from 'framer-motion';
import { Play, Square, Mic, MicOff } from 'lucide-react';

interface VoiceRecorderProps {
  onNoteSaved: () => void;
}

export default function VoiceRecorder({ onNoteSaved }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const { connectToDeepgram, disconnectFromDeepgram, connectionState, realtimeTranscript, error } = useDeepgram();

  const handleStartRecording = async () => {
    try {
      setIsRequestingPermission(true);
      await connectToDeepgram();
      setIsRecording(true);
      setPermissionGranted(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to start recording. Please check microphone permissions.');
    } finally {
      setIsRequestingPermission(false);
    }
  };

  const handleStopRecording = async () => {
    try {
      disconnectFromDeepgram();
      setIsRecording(false);
      
      // Save the note to Firebase if there's transcript content
      if (realtimeTranscript && realtimeTranscript.trim()) {
        await addDocument('notes', {
          text: realtimeTranscript.trim(),
          timestamp: new Date().toISOString(),
        });
        
        // Notify parent component to refresh notes list
        onNoteSaved();
      }
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Main Recording Button */}
      <div className="text-center mb-8">
        <motion.button
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          disabled={isRequestingPermission}
          className={`
            relative inline-flex items-center justify-center w-24 h-24 rounded-full text-white font-bold text-lg
            transition-all duration-300 transform hover:scale-105 active:scale-95
            ${isRecording 
              ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200' 
              : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200'
            }
            ${isRequestingPermission ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isRequestingPermission ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Mic className="h-8 w-8" />
            </motion.div>
          ) : isRecording ? (
            <Square className="h-8 w-8" />
          ) : (
            <Play className="h-8 w-8 ml-1" />
          )}
        </motion.button>
        
        <p className="mt-4 text-lg font-medium text-gray-700">
          {isRequestingPermission 
            ? 'Requesting microphone permission...' 
            : isRecording 
              ? 'Click to stop recording' 
              : 'Click to start recording'
          }
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
        >
          <div className="flex items-center">
            <MicOff className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Recording Animation and Transcript */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
        >
          {/* Recording Animation */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-3 h-3 bg-red-500 rounded-full"
              />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2,
                }}
                className="w-3 h-3 bg-red-500 rounded-full"
              />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.4,
                }}
                className="w-3 h-3 bg-red-500 rounded-full"
              />
            </div>
            <span className="ml-3 text-red-600 font-medium">Recording...</span>
          </div>

          {/* Real-time Transcript */}
          <div className="bg-white rounded-lg p-4 min-h-[120px] border">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Live Transcription:</h3>
            <div className="text-gray-800 leading-relaxed">
              {realtimeTranscript ? (
                <motion.p
                  key={realtimeTranscript}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="whitespace-pre-wrap"
                >
                  {realtimeTranscript}
                </motion.p>
              ) : (
                <p className="text-gray-400 italic">Start speaking to see the transcription...</p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      {!isRecording && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-600"
        >
          <p className="text-sm">
            Click the button above to start recording your consultation. 
            The app will transcribe your speech in real-time and save it as a note.
          </p>
        </motion.div>
      )}
    </div>
  );
}