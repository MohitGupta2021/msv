import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  FileText, 
  Trash2, 
  Eye, 
  Download,
  Search,
  Filter,
  Mic,
  Volume2
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { AssemblyAIService } from '../../../services/assemblyAI';
import { GeminiAIService } from '../../../services/geminiAI';
import { MAX_FILE_SIZE, SUPPORTED_FILE_TYPES } from '../../../utils/constants';
import ProgressBar from '../../ui/ProgressBar';
import StatusBadge from '../../ui/StatusBadge';
import Modal from '../../ui/Modal';

const AUDIO_FILE_TYPES = ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac'];

export default function DocumentsTab() {
  const { uploadedFiles, addUploadedFile, updateFileProgress, removeUploadedFile, addMessage } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [transcriptionResults, setTranscriptionResults] = useState<Record<string, string>>({});

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      if (file.size > MAX_FILE_SIZE) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        continue;
      }

      const fileId = addUploadedFile({
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading',
        progress: 0,
      });

      // Check if it's an audio file
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const isAudioFile = AUDIO_FILE_TYPES.includes(fileExtension);

      if (isAudioFile) {
        try {
          // Handle audio file transcription
          updateFileProgress(fileId, 10, 'processing');
          
          const transcription = await AssemblyAIService.transcribeFile(file, (status) => {
            const progressMap: Record<string, number> = {
              'uploading': 30,
              'queued': 40,
              'processing': 70,
              'completed': 100
            };
            updateFileProgress(fileId, progressMap[status] || 50, 'processing');
          });

          // Store transcription result
          setTranscriptionResults(prev => ({
            ...prev,
            [fileId]: transcription
          }));

          updateFileProgress(fileId, 100, 'completed');

          // Add transcription to chat
          addMessage({
            content: `Audio file "${file.name}" has been transcribed: "${transcription.slice(0, 200)}${transcription.length > 200 ? '...' : ''}"`,
            sender: 'user',
            fileName: file.name,
            fileType: file.type
          });

          // Generate AI analysis of the transcription
          setTimeout(async () => {
            try {
              const analysis = await GeminiAIService.analyzeTranscription(transcription, file.name);
              addMessage({
                content: analysis,
                sender: 'ai'
              });
            } catch (error) {
              console.error('Error analyzing transcription:', error);
            }
          }, 1000);

        } catch (error) {
          console.error('Error transcribing audio:', error);
          updateFileProgress(fileId, 0, 'error');
          addMessage({
            content: `Failed to transcribe audio file "${file.name}". Please try again.`,
            sender: 'ai'
          });
        }
      } else {
        // Handle regular document upload
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 15;
          if (progress >= 100) {
            progress = 100;
            updateFileProgress(fileId, progress, 'processing');
            clearInterval(interval);
            
            // Simulate processing
            setTimeout(() => {
              updateFileProgress(fileId, 100, 'completed');
            }, 2000);
          } else {
            updateFileProgress(fileId, progress);
          }
        }, 200);
      }
    }
  }, [addUploadedFile, updateFileProgress, addMessage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/json': ['.json'],
      'text/csv': ['.csv'],
      'audio/mpeg': ['.mp3'],
      'audio/wav': ['.wav'],
      'audio/mp4': ['.m4a'],
      'audio/aac': ['.aac'],
      'audio/ogg': ['.ogg'],
      'audio/flac': ['.flac'],
    },
    multiple: true,
  });

  const filteredFiles = uploadedFiles.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isAudioFile = (fileName: string) => {
    const extension = '.' + fileName.split('.').pop()?.toLowerCase();
    return AUDIO_FILE_TYPES.includes(extension);
  };

  const handleTranscribeAgain = async (file: any) => {
    try {
      updateFileProgress(file.id, 0, 'processing');
      
      // This would need the original file blob, which we don't store
      // In a real implementation, you'd store the file or re-upload
      addMessage({
        content: `Re-transcription requested for "${file.name}". Please re-upload the file for a new transcription.`,
        sender: 'ai'
      });
      
      updateFileProgress(file.id, 100, 'completed');
    } catch (error) {
      console.error('Error re-transcribing:', error);
      updateFileProgress(file.id, 0, 'error');
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Document & Audio Management</h1>
          <p className="text-gray-600">Upload documents and audio files with automatic transcription</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Upload Zone */}
      <motion.div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900 mb-2">
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-gray-600 mb-4">
              or <span className="text-blue-600 font-medium">browse files</span>
            </p>
            <p className="text-sm text-gray-500">
              Documents: {SUPPORTED_FILE_TYPES.join(', ')} • Audio: {AUDIO_FILE_TYPES.join(', ')} • Max size: 10MB
            </p>
            <p className="text-xs text-blue-600 mt-2 font-medium">
              🎤 Audio files will be automatically transcribed using AssemblyAI
            </p>
          </div>
        </div>
      </motion.div>

      {/* Files List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Uploaded Files ({filteredFiles.length})
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredFiles.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isAudioFile(file.name) ? 'bg-purple-50' : 'bg-blue-50'
                  }`}>
                    {isAudioFile(file.name) ? (
                      <Mic className="w-6 h-6 text-purple-600" />
                    ) : (
                      <FileText className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="font-medium text-gray-900 truncate">{file.name}</h3>
                      {isAudioFile(file.name) && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                          Audio
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">{formatFileSize(file.size)}</span>
                      <StatusBadge status={file.status} pulse={file.status === 'uploading' || file.status === 'processing'}>
                        {file.status}
                      </StatusBadge>
                      <span className="text-sm text-gray-500">
                        {file.uploadedAt.toLocaleDateString()}
                      </span>
                    </div>
                    {(file.status === 'uploading' || file.status === 'processing') && (
                      <div className="mt-2">
                        <ProgressBar 
                          progress={file.progress} 
                          status={file.status}
                          showPercentage
                        />
                      </div>
                    )}
                    {transcriptionResults[file.id] && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Transcription:</p>
                        <p className="text-sm text-gray-800 line-clamp-2">
                          {transcriptionResults[file.id].slice(0, 150)}
                          {transcriptionResults[file.id].length > 150 ? '...' : ''}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {isAudioFile(file.name) && file.status === 'completed' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTranscribeAgain(file)}
                      className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Re-transcribe"
                    >
                      <Volume2 className="w-5 h-5" />
                    </motion.button>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedFile(file);
                      setIsPreviewOpen(true);
                    }}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Preview"
                  >
                    <Eye className="w-5 h-5" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => removeUploadedFile(file.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
          
          {filteredFiles.length === 0 && (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">No files found</p>
              <p className="text-gray-400">Upload your first document or audio file to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={`Preview: ${selectedFile?.name}`}
        size="xl"
      >
        {selectedFile && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-600">File Size:</span>
                <p className="text-sm text-gray-900">{formatFileSize(selectedFile.size)}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Type:</span>
                <p className="text-sm text-gray-900">{selectedFile.type}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Uploaded:</span>
                <p className="text-sm text-gray-900">{selectedFile.uploadedAt.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Status:</span>
                <StatusBadge status={selectedFile.status}>{selectedFile.status}</StatusBadge>
              </div>
            </div>
            
            {transcriptionResults[selectedFile.id] && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Transcription Result:</h4>
                <div className="max-h-64 overflow-y-auto">
                  <p className="text-sm text-blue-800 whitespace-pre-wrap">
                    {transcriptionResults[selectedFile.id]}
                  </p>
                </div>
              </div>
            )}
            
            <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                {isAudioFile(selectedFile.name) ? (
                  <>
                    <Mic className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Audio file preview</p>
                    <p className="text-sm text-gray-500">
                      {transcriptionResults[selectedFile.id] ? 'Transcription available above' : 'Processing transcription...'}
                    </p>
                  </>
                ) : (
                  <>
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Document preview not available</p>
                    <p className="text-sm text-gray-500">Download to view full content</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}