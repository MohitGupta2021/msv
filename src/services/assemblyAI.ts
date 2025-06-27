import axios from 'axios';

const ASSEMBLY_AI_API_KEY = '5092d746e43d47e4a11cf6118e206f14';
const BASE_URL = 'https://api.assemblyai.com';

const headers = {
  authorization: ASSEMBLY_AI_API_KEY,
  'content-type': 'application/json',
};

export interface TranscriptionResult {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'error';
  text?: string;
  error?: string;
  confidence?: number;
  audio_duration?: number;
}

export class AssemblyAIService {
  // Upload audio file to AssemblyAI
  static async uploadAudio(audioFile: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('audio', audioFile);

      const response = await axios.post(`${BASE_URL}/v2/upload`, audioFile, {
        headers: {
          authorization: ASSEMBLY_AI_API_KEY,
          'content-type': audioFile.type,
        },
      });

      return response.data.upload_url;
    } catch (error) {
      console.error('Error uploading audio:', error);
      throw new Error('Failed to upload audio file');
    }
  }

  // Start transcription for pre-recorded audio
  static async startTranscription(audioUrl: string): Promise<string> {
    try {
      const data = {
        audio_url: audioUrl,
        speech_model: 'universal',
        language_detection: true,
        punctuate: true,
        format_text: true,
        speaker_labels: true,
        auto_highlights: true,
      };

      const response = await axios.post(`${BASE_URL}/v2/transcript`, data, {
        headers,
      });

      return response.data.id;
    } catch (error) {
      console.error('Error starting transcription:', error);
      throw new Error('Failed to start transcription');
    }
  }

  // Poll for transcription result
  static async getTranscriptionResult(transcriptId: string): Promise<TranscriptionResult> {
    try {
      const response = await axios.get(`${BASE_URL}/v2/transcript/${transcriptId}`, {
        headers,
      });

      return response.data;
    } catch (error) {
      console.error('Error getting transcription result:', error);
      throw new Error('Failed to get transcription result');
    }
  }

  // Complete transcription process with polling
  static async transcribeAudio(audioUrl: string, onProgress?: (status: string) => void): Promise<string> {
    try {
      const transcriptId = await this.startTranscription(audioUrl);
      
      while (true) {
        const result = await this.getTranscriptionResult(transcriptId);
        
        if (onProgress) {
          onProgress(result.status);
        }

        if (result.status === 'completed') {
          return result.text || '';
        } else if (result.status === 'error') {
          throw new Error(`Transcription failed: ${result.error}`);
        }

        // Wait 3 seconds before polling again
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error('Error in transcription process:', error);
      throw error;
    }
  }

  // Transcribe uploaded file
  static async transcribeFile(file: File, onProgress?: (status: string) => void): Promise<string> {
    try {
      onProgress?.('uploading');
      const audioUrl = await this.uploadAudio(file);
      
      onProgress?.('processing');
      const transcription = await this.transcribeAudio(audioUrl, onProgress);
      
      return transcription;
    } catch (error) {
      console.error('Error transcribing file:', error);
      throw error;
    }
  }
}

// Live transcription service (browser-based)
export class LiveTranscriptionService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording = false;

  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        } 
      });

      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      this.audioChunks = [];
      this.isRecording = true;

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(1000); // Collect data every second
    } catch (error) {
      console.error('Error starting recording:', error);
      throw new Error('Failed to start recording');
    }
  }

  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || !this.isRecording) {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.isRecording = false;
        
        // Stop all tracks
        this.mediaRecorder?.stream.getTracks().forEach(track => track.stop());
        
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  getRecordingState(): boolean {
    return this.isRecording;
  }
}