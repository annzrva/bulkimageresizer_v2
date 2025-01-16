export type ImageResizerMode = 
  | 'percentage'
  | 'fileSize'
  | 'dimensions';

export type ImageFormat = 'jpeg' | 'png' | 'webp';

export interface ResizeOptions {
  mode: ImageResizerMode;
  percentage?: number;
  maxFileSize?: number;
  width?: number;
  height?: number;
  maxLength?: number;
  maintainAspectRatio: boolean;
  quality: number;
  format: ImageFormat;
  backgroundColor: string;
  usePadding: boolean;
  originalAspectRatio?: number;
} 