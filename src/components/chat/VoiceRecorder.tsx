import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Square, Play, Pause, Upload } from 'lucide-react';
import { LiveTranscriptionService, AssemblyAIService } from '../../services/assemblyAI';
import { useApp } from '../../context/AppContext';

interface VoiceRecorderProps {
  onTranscriptionComplete: (transcription: string) => void;
  disabled?: boolean;
}

export default function VoiceRecorder({ onTranscriptionComplete, disabled = false }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcriptionStatus, setTranscriptionStatus] = useState<string>('');
  
  const liveTranscriptionRef = useRef<LiveTranscriptionService>(new LiveTranscriptionService());
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addMessage } = useApp();

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setTranscriptionStatus('Recording...');
      await liveTranscriptionRef.current.startRecording();
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
      setTranscriptionStatus('');
      addMessage({
        content: 'Failed to start recording. Please check microphone permissions.',
        sender: 'ai'
      });
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      setIsProcessing(true);
      setTranscriptionStatus('Processing audio...');
      
      const audioBlob = await liveTranscriptionRef.current.stopRecording();
      setRecordedAudio(audioBlob);
      
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

      // Convert blob to file and transcribe
      const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
      
      const transcription = await AssemblyAIService.transcribeFile(audioFile, (status) => {
        setTranscriptionStatus(`Transcribing: ${status}...`);
      });

      setTranscriptionStatus('Transcription complete!');
      onTranscriptionComplete(transcription);
      
      // Clear status after 2 seconds
      setTimeout(() => {
        setTranscriptionStatus('');
        setIsProcessing(false);
      }, 2000);

    } catch (error) {
      console.error('Error stopping recording:', error);
      setIsProcessing(false);
      setTranscriptionStatus('');
      addMessage({
        content: 'Failed to process recording. Please try again.',
        sender: 'ai'
      });
    }
  };

  const playRecording = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is audio
    if (!file.type.startsWith('audio/')) {
      addMessage({
        content: 'Please select an audio file (MP3, WAV, M4A, etc.)',
        sender: 'ai'
      });
      return;
    }

    try {
      setIsProcessing(true);
      setTranscriptionStatus('Uploading audio file...');

      const transcription = await AssemblyAIService.transcribeFile(file, (status) => {
        setTranscriptionStatus(`Processing: ${status}...`);
      });

      setTranscriptionStatus('Transcription complete!');
      
      // Add message showing the uploaded file
      addMessage({
        content: `Transcribed audio from "${file.name}": "${transcription}"`,
        sender: 'user',
        fileName: file.name,
        fileType: file.type
      });

      onTranscriptionComplete(transcription);
      
      setTimeout(() => {
        setTranscriptionStatus('');
        setIsProcessing(false);
      }, 2000);

    } catch (error) {
      console.error('Error transcribing file:', error);
      setIsProcessing(false);
      setTranscriptionStatus('');
      addMessage({
        content: 'Failed to transcribe audio file. Please try again.',
        sender: 'ai'
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const clearRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setRecordedAudio(null);
    setAudioUrl(null);
    setIsPlaying(false);
    setTranscriptionStatus('');
  };

  return (
    <div className="flex items-center space-x-2">
      {/* File Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled || isRecording || isProcessing}
        className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50"
        title="Upload Audio File"
      >
        <Upload className="w-4 h-4" />
      </motion.button>

      {/* Recording Controls */}
      <div className="flex items-center space-x-2">
        {!isRecording ? (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={startRecording}
            disabled={disabled || isProcessing}
            className="p-2 text-gray-500 hover:text-green-500 hover:bg-green-50 rounded-full transition-colors disabled:opacity-50"
            title="Start Recording"
          >
            <Mic className="w-4 h-4" />
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={stopRecording}
            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors animate-pulse"
            title="Stop Recording"
          >
            <Square className="w-4 h-4" />
          </motion.button>
        )}

        {/* Playback Controls */}
        {recordedAudio && audioUrl && (
          <>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={playRecording}
              className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
              title={isPlaying ? "Pause" : "Play Recording"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={clearRecording}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="Clear Recording"
            >
              <MicOff className="w-4 h-4" />
            </motion.button>

            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          </>
        )}
      </div>

      {/* Status Display */}
      {transcriptionStatus && (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
          <span className="text-xs text-blue-600 font-medium">{transcriptionStatus}</span>
        </div>
      )}
    </div>
  );
}