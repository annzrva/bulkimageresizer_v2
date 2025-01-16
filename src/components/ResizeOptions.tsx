'use client';

import { ImageResizerMode, ResizeOptions as ResizeOptionsType } from '@/types/types';
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ResizeOptionsProps {
  mode: ImageResizerMode;
  filesCount: number;
  options: ResizeOptionsType;
  onChange: (options: ResizeOptionsType) => void;
}

export default function ResizeOptions({ mode, filesCount, options, onChange }: ResizeOptionsProps) {
  if (filesCount === 0) return null;

  const updateOptions = (updates: Partial<ResizeOptionsType>) => {
    onChange({ ...options, ...updates });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold capitalize">{mode}</h2>

      {mode === 'percentage' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={options.percentage}
              onChange={(e) => updateOptions({ percentage: Number(e.target.value) })}
              className="w-24"
              min={1}
              max={100}
            />
            <span>% of the original dimensions.</span>
          </div>
        </div>
      )}

      {mode === 'fileSize' && (
        <div className="space-y-4">
          <Label>Target File Size (KB)</Label>
          <Input
            type="number"
            placeholder="Enter target size in KB"
            min={1}
          />
        </div>
      )}

      {mode === 'dimensions' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Width (px)</Label>
              <Input
                type="number"
                placeholder="Width"
                min={1}
                value={options.width || ''}
                onChange={(e) => updateOptions({ 
                  width: e.target.value ? Number(e.target.value) : undefined 
                })}
              />
            </div>
            <div className="space-y-2">
              <Label>Height (px)</Label>
              <Input
                type="number"
                placeholder="Height"
                min={1}
                value={options.height || ''}
                onChange={(e) => updateOptions({ 
                  height: e.target.value ? Number(e.target.value) : undefined 
                })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="usePadding"
                checked={options.usePadding}
                onChange={(e) => updateOptions({ usePadding: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="usePadding" className="text-sm text-gray-600">
                Use padding to avoid stretching or squashing images
              </Label>
            </div>

            {options.usePadding && (
              <div className="pl-6">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={options.backgroundColor || '#ffffff'}
                    onChange={(e) => updateOptions({ backgroundColor: e.target.value })}
                    className="w-8 h-8 p-0 border rounded cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">Padding color</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {mode === ('width' as ImageResizerMode) && (
        <div className="space-y-4">
          <Label>Width (px)</Label>
          <Input
            type="number"
            placeholder="Enter width"
            min={1}
          />
        </div>
      )}

      {mode === ('height' as ImageResizerMode) && (
        <div className="space-y-4">
          <Label>Height (px)</Label>
          <Input
            type="number"
            placeholder="Enter height"
            min={1}
          />
        </div>
      )}

      {mode === ('longestSide' as ImageResizerMode) && (
        <div className="space-y-4">
          <Label>Longest Side (px)</Label>
          <Input
            type="number"
            placeholder="Enter max length"
            min={1}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-2">
          <Label>Image Format</Label>
          <Select
            value={options.format}
            onValueChange={(value) => updateOptions({ format: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jpeg">JPEG</SelectItem>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="webp">WebP</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Image Quality</Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[options.quality]}
              onValueChange={([value]) => updateOptions({ quality: value })}
              max={100}
              min={1}
              step={1}
              className="flex-1"
            />
            <span className="w-12 text-right">{options.quality}%</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Image Background</Label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={options.backgroundColor || '#ffffff'}
            onChange={(e) => updateOptions({ backgroundColor: e.target.value })}
            className="w-8 h-8 p-0 border rounded"
          />
          <span>Color</span>
        </div>
      </div>
    </div>
  );
} 