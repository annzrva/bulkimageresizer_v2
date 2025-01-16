'use client';

import { useState } from 'react';
import { ImageResizerMode, ResizeOptions, ResizeDimensions } from '@/types/types';
import ModeSelector from '@/components/ModeSelector';
import ImageUploader from '@/components/ImageUploader';
import ResizeOptionsPanel from '@/components/ResizeOptions';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import JSZip from 'jszip';

type Step = 'upload' | 'settings';

interface PaddedDimensions extends ResizeDimensions {
  offsetX: number;
  offsetY: number;
  imageWidth: number;
  imageHeight: number;
}

interface SimpleDimensions extends ResizeDimensions {
  width: number;
  height: number;
}

export default function ImageResizer() {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [selectedMode, setSelectedMode] = useState<ImageResizerMode>('percentage');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [resizeOptions, setResizeOptions] = useState<ResizeOptions>({
    percentage: 100,
    quality: 75,
    format: 'jpeg',
    usePadding: false,
    backgroundColor: '#ffffff'
  });

  const calculateDimensions = (
    originalWidth: number,
    originalHeight: number,
    options: ResizeOptions & { mode: ImageResizerMode; maxLength?: number }
  ): SimpleDimensions | PaddedDimensions => {
    switch (options.mode) {
      case 'percentage': {
        const scale = (options.percentage || 100) / 100;
        return {
          width: Math.round(originalWidth * scale),
          height: Math.round(originalHeight * scale)
        };
      }

      case 'fileSize': {
        const scale = 0.8;
        return {
          width: Math.round(originalWidth * scale),
          height: Math.round(originalHeight * scale)
        };
      }

      case 'dimensions': {
        if (!options.width && !options.height) {
          return { width: originalWidth, height: originalHeight };
        }
        
        const targetWidth = options.width || originalWidth;
        const targetHeight = options.height || originalHeight;

        if (options.usePadding) {
          const scaleX = targetWidth / originalWidth;
          const scaleY = targetHeight / originalHeight;
          const scale = Math.min(scaleX, scaleY);
          
          const scaledWidth = Math.round(originalWidth * scale);
          const scaledHeight = Math.round(originalHeight * scale);
          
          return {
            width: targetWidth,
            height: targetHeight,
            imageWidth: scaledWidth,
            imageHeight: scaledHeight,
            offsetX: Math.round((targetWidth - scaledWidth) / 2),
            offsetY: Math.round((targetHeight - scaledHeight) / 2)
          };
        } else {
          return {
            width: targetWidth,
            height: targetHeight
          };
        }
      }

      case 'width': {
        if (!options.width) return { width: originalWidth, height: originalHeight };
        const ratio = originalHeight / originalWidth;
        return {
          width: options.width,
          height: Math.round(options.width * ratio)
        };
      }

      case 'height': {
        if (!options.height) return { width: originalWidth, height: originalHeight };
        const ratio = originalWidth / originalHeight;
        return {
          width: Math.round(options.height * ratio),
          height: options.height
        };
      }

      case 'longestSide': {
        if (!options.maxLength) return { width: originalWidth, height: originalHeight };
        const isWidthLonger = originalWidth > originalHeight;
        const ratio = isWidthLonger ? 
          originalHeight / originalWidth : 
          originalWidth / originalHeight;

        if (isWidthLonger) {
          return {
            width: options.maxLength,
            height: Math.round(options.maxLength * ratio)
          };
        } else {
          return {
            width: Math.round(options.maxLength * ratio),
            height: options.maxLength
          };
        }
      }

      default:
        return { width: originalWidth, height: originalHeight };
    }
  };

  const handleProcessImages = async () => {
    try {
      const zip = new JSZip();
      
      for (const file of uploadedFiles) {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');
        
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.src = URL.createObjectURL(file);
        });

        const dimensions = calculateDimensions(
          img.width,
          img.height,
          { ...resizeOptions, mode: selectedMode }
        );

        canvas.width = dimensions.width;
        canvas.height = dimensions.height;

        if (resizeOptions.backgroundColor) {
          ctx.fillStyle = resizeOptions.backgroundColor;
          ctx.fillRect(0, 0, dimensions.width, dimensions.height);
        }

        if (isPaddedDimensions(dimensions)) {
          ctx.drawImage(
            img,
            dimensions.offsetX,
            dimensions.offsetY,
            dimensions.imageWidth,
            dimensions.imageHeight
          );
        } else {
          ctx.drawImage(
            img,
            0,
            0,
            dimensions.width,
            dimensions.height
          );
        }

        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else throw new Error('Failed to create blob');
            },
            `image/${resizeOptions.format}`,
            resizeOptions.quality / 100
          );
        });

        const fileName = file.name.replace(/\.[^/.]+$/, '') + '.' + resizeOptions.format;
        zip.file(fileName, blob);
        URL.revokeObjectURL(img.src);
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'resized-images.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error processing images:', error);
    }
  };

  // Type guard for PaddedDimensions
  const isPaddedDimensions = (
    dimensions: SimpleDimensions | PaddedDimensions
  ): dimensions is PaddedDimensions => {
    return 'offsetX' in dimensions && 'imageWidth' in dimensions;
  };

  const handleModeChange = (newMode: ImageResizerMode) => {
    console.log('Mode changed to:', newMode);
    
    setSelectedMode(newMode);
    
    setResizeOptions(prev => ({
      ...prev,
      percentage: newMode === 'percentage' ? 100 : undefined,
      width: undefined,
      height: undefined,
      quality: prev.quality,
      format: prev.format,
      usePadding: prev.usePadding,
      backgroundColor: prev.backgroundColor
    }));
  };

  const handleResizeOptionsChange = (newOptions: ResizeOptions) => {
    console.log('Resize options changed:', newOptions);
    setResizeOptions(newOptions);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {currentStep === 'upload' && (
        <>
          <ImageUploader 
            onFilesSelected={setUploadedFiles}
            maxFiles={500}
          />
          
          {uploadedFiles.length > 0 && (
            <Button 
              onClick={() => setCurrentStep('settings')}
              className="w-full py-6 text-lg bg-blue-500 hover:bg-blue-600"
            >
              Next
            </Button>
          )}
        </>
      )}

      {currentStep === 'settings' && (
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentStep('upload')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-bold">Resize Settings</h2>
          </div>

          <div className="grid grid-cols-[300px_1fr] gap-8">
            <ModeSelector 
              selectedMode={selectedMode} 
              onModeChange={handleModeChange}
            />
            
            <ResizeOptionsPanel 
              mode={selectedMode}
              filesCount={uploadedFiles.length}
              options={resizeOptions}
              onChange={handleResizeOptionsChange}
            />
          </div>

          <Button 
            onClick={handleProcessImages}
            className="w-full py-6 text-lg bg-green-500 hover:bg-green-600"
          >
            Process Images
          </Button>
        </div>
      )}
    </div>
  );
} 