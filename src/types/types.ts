export type ImageResizerMode = 'width' | 'height' | 'longestSide' | 'percentage' | 'fileSize' | 'dimensions';

export interface ResizeOptions {
  width?: number;
  height?: number;
  quality: number;
  format: string;
  backgroundColor?: string;
  usePadding?: boolean;
  percentage?: number;
  maxLength?: number;
}

export interface ResizeDimensions {
  width: number;
  height: number;
  imageWidth?: number;
  imageHeight?: number;
  offsetX?: number;
  offsetY?: number;
} 