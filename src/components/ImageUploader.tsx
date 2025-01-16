'use client';

import { useState, useCallback, useEffect, ChangeEvent } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from './ui/button';
import { X, ChevronDown, ChevronUp, Upload } from 'lucide-react';
import Image from 'next/image';

interface ImageDimensions {
  width: number;
  height: number;
}

interface ProcessedImageFile {
  file: File;
  preview: string;
  dimensions?: ImageDimensions;
}

interface ImageUploaderProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles: number;
}

export default function ImageUploader({ onFilesSelected, maxFiles }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<ProcessedImageFile[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getImageDimensions = useCallback((file: File): Promise<ImageDimensions> => {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const processFile = useCallback(async (file: File): Promise<ProcessedImageFile> => {
    const dimensions = await getImageDimensions(file);
    const preview = URL.createObjectURL(file);
    return { file, preview, dimensions };
  }, [getImageDimensions]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
      const newFiles = await Promise.all(imageFiles.map(processFile));
      const combinedFiles = [...uploadedFiles, ...newFiles].slice(0, maxFiles);
      setUploadedFiles(combinedFiles);
      onFilesSelected(combinedFiles.map(f => f.file));
    } catch (error) {
      console.error('Error handling dropped files:', error);
    }
  }, [maxFiles, onFilesSelected, uploadedFiles, processFile]);

  const removeFile = useCallback((fileToRemove: ProcessedImageFile) => {
    const updatedFiles = uploadedFiles.filter(f => f !== fileToRemove);
    setUploadedFiles(updatedFiles);
    onFilesSelected(updatedFiles.map(f => f.file));
    URL.revokeObjectURL(fileToRemove.preview);
  }, [uploadedFiles, onFilesSelected]);

  useEffect(() => {
    return () => {
      uploadedFiles.forEach(file => {
        URL.revokeObjectURL(file.preview);
      });
    };
  }, [uploadedFiles]);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    noClick: true
  });

  const handleFileUpload = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      onDrop(files);
    }
  }, [onDrop]);

  return (
    <div {...getRootProps()} className={`border-2 border-dashed rounded-lg transition-colors duration-200 ease-in-out h-[400px] overflow-y-auto ${isDragging ? 'border-primary bg-primary/5' : 'border-violet-300'} hover:border-violet-500`}>
      <div className="p-8">
        <input {...getInputProps()} onChange={handleFileUpload} />
        <div className="text-center mb-6">
          {uploadedFiles.length === 0 ? (
            <>
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Drop Images Here!</h3>
              <p className="text-xl mb-4">OR</p>
              <Button 
                className="bg-blue-500 hover:bg-blue-600 text-lg py-6 px-8" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  open(); 
                }}
              >
                Choose Images
              </Button>
            </>
          ) : (
            <div className="flex items-center justify-center gap-2 mb-4">
              <Button 
                className="bg-blue-500 hover:bg-blue-600" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  open(); 
                }}
              >
                Add More Images
              </Button>
              <span className="text-sm text-gray-500">
                {uploadedFiles.length} {uploadedFiles.length === 1 ? 'file' : 'files'} selected
              </span>
            </div>
          )}
        </div>

        {uploadedFiles.length > 0 && (
          <div className="border rounded-lg overflow-hidden bg-white">
            <div 
              className="bg-gray-100 p-3 flex justify-between items-center cursor-pointer" 
              onClick={(e) => { 
                e.stopPropagation(); 
                setIsExpanded(!isExpanded); 
              }}
            >
              <span className="font-medium">Uploaded Images ({uploadedFiles.length})</span>
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            
            {isExpanded && (
              <div className="p-4" onClick={(e) => e.stopPropagation()}>
                <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto">
                  {uploadedFiles.map((processedFile, index) => (
                    <div key={`${processedFile.file.name}-${index}`} className="flex items-center gap-4 p-2 bg-gray-50 rounded hover:bg-gray-100">
                      <Image 
                        src={processedFile.preview} 
                        alt={processedFile.file.name} 
                        className="w-16 h-16 object-cover rounded" 
                        width={64} 
                        height={64}
                        unoptimized
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{processedFile.file.name}</p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(processedFile.file.size)} • 
                          {processedFile.dimensions ? 
                            ` ${processedFile.dimensions.width}×${processedFile.dimensions.height}px` : 
                            ' Loading dimensions...'}
                        </p>
                      </div>
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          removeFile(processedFile); 
                        }} 
                        className="p-1 hover:bg-red-100 rounded-full text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 