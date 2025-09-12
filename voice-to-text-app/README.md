# Doctor Notes - Voice to Text App

A voice-based note-taking application designed for medical consultations between doctors and patients. This app transcribes real-time conversations and saves them as editable notes.

## Features

### 🎤 Real-time Voice Transcription
- Click the play button to start recording
- Real-time transcription using Deepgram API
- Visual recording animation with pulsing indicators
- Automatic microphone permission handling

### 📝 Note Management
- Automatic saving of transcribed notes with timestamps
- Edit existing notes with inline text editing
- Delete notes with confirmation dialog
- Chronological display of recent notes

### 🏥 Medical-Focused Design
- Clean, minimalistic interface with medical theme
- Healthcare icon (stethoscope) branding
- Professional color scheme (medical blue)
- Responsive design for various devices

### 🔒 Secure & Reliable
- Firebase integration for secure data storage
- Real-time data synchronization
- Error handling and user feedback
- Accessible design with proper focus management

## App Flow

1. **Home Screen**: Displays the Doctor Notes header with healthcare icon
2. **Start Recording**: Click the play button to begin voice recording
3. **Permission Request**: App requests microphone access
4. **Live Transcription**: Real-time speech-to-text conversion with visual feedback
5. **Stop Recording**: Click stop button to end recording
6. **Auto-Save**: Note is automatically saved to Firebase with timestamp
7. **Note Management**: View, edit, or delete saved notes

## Technical Stack

- **Frontend**: Next.js 14 with App Router, React 18, TypeScript
- **Styling**: Tailwind CSS with custom medical theme
- **Animations**: Framer Motion for smooth transitions
- **Voice Processing**: Deepgram real-time speech-to-text API
- **Database**: Firebase Firestore for note storage
- **Icons**: Lucide React for consistent iconography

## Environment Setup

The app requires the following environment variables in the Secrets tab:

- `DEEPGRAM_API_KEY`: Your Deepgram API key for speech recognition
- `NEXT_PUBLIC_FIREBASE_API_KEY`: Firebase API key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Firebase auth domain
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Firebase project ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Firebase storage bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Firebase messaging sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID`: Firebase app ID

## Usage

1. **Start the app**: Run `npm run dev` to start the development server
2. **Access the app**: Open your browser to the local development URL
3. **Record a consultation**: Click the play button and speak clearly
4. **Review transcription**: Watch the real-time transcription appear
5. **Save the note**: Click stop to automatically save the note
6. **Manage notes**: Edit or delete notes as needed

## Key Components

- **VoiceRecorder**: Handles recording, transcription, and note saving
- **DeepgramContext**: Manages WebSocket connection to Deepgram API
- **Firebase Utils**: Handles database operations for notes
- **Main Page**: Displays the interface and manages note state

## Accessibility Features

- Keyboard navigation support
- Screen reader friendly
- High contrast focus indicators
- Clear visual feedback for all interactions
- Proper ARIA labels and semantic HTML

This application is designed to save time during medical consultations by automatically transcribing conversations, allowing healthcare professionals to focus on patient care rather than note-taking.