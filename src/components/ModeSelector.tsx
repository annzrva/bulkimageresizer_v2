'use client';

import { ImageResizerMode } from '@/types/types';
import { Button } from './ui/button';
import { 
  HoverCard,
  HoverCardTrigger,
  HoverCardContent 
} from './ui/hover-card';
import { 
  Percent, 
  FileDown, 
  Scaling
} from 'lucide-react';

interface ModeSelectorProps {
  selectedMode: ImageResizerMode;
  onModeChange: (mode: ImageResizerMode) => void;
}

const modes = [
  { 
    value: 'percentage', 
    label: 'Resize by %',
    description: 'Scale images proportionally by percentage',
    icon: Percent 
  },
  { 
    value: 'fileSize', 
    label: 'Compress to Size',
    description: 'Optimize images to a target file size',
    icon: FileDown
  },
  { 
    value: 'dimensions', 
    label: 'Set Dimensions',
    description: 'Specify exact width and height for your images',
    icon: Scaling
  },
];

export default function ModeSelector({ selectedMode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
      <div className="flex flex-col space-y-1 p-1">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isSelected = selectedMode === mode.value;
          
          return (
            <HoverCard key={mode.value}>
              <HoverCardTrigger asChild>
                <Button
                  variant="ghost"
                  className={`
                    group
                    w-full
                    flex
                    items-center
                    justify-start
                    px-3
                    py-2.5
                    rounded-lg
                    transition-all
                    duration-200
                    ${isSelected 
                      ? 'bg-blue-50/80 text-blue-700 hover:bg-blue-50' 
                      : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900'
                    }
                  `}
                  onClick={() => onModeChange(mode.value as ImageResizerMode)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      flex-shrink-0
                      p-2
                      rounded-lg
                      transition-colors
                      duration-200
                      ${isSelected 
                        ? 'bg-blue-100/80 text-blue-600' 
                        : 'bg-gray-100/80 text-gray-500 group-hover:bg-gray-200/80'
                      }
                    `}>
                      <Icon size={18} strokeWidth={2.5} />
                    </div>
                    
                    <span className="font-medium text-sm">
                      {mode.label}
                    </span>
                  </div>
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">{mode.label}</h4>
                    <p className="text-sm text-muted-foreground">
                      {mode.description}
                    </p>
                  </div>
                  <div className={`
                    p-2
                    rounded-lg
                    ${isSelected 
                      ? 'bg-blue-100/80 text-blue-600' 
                      : 'bg-gray-100/80 text-gray-500'
                    }
                  `}>
                    <Icon size={24} strokeWidth={2} />
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          );
        })}
      </div>
    </div>
  );
} 