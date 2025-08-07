// src/components/PromptCard.tsx

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Clock } from 'lucide-react';
import { Prompt } from '@/hooks/usePrompts';
import { toast } from '@/hooks/use-toast';

interface PromptCardProps {
  prompt: Prompt;
}

export const PromptCard = ({ prompt }: PromptCardProps) => {
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied!',
        description: 'Prompt copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy prompt',
        variant: 'destructive',
      });
    }
  };

  const getDisplayValue = (value: any): string => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return String(value || '');
  };

  // Get the main prompt content
  const promptContent = prompt.Prompt || prompt.Content || '';
  
  // Get tags/categories
  const tags = [];
  if (prompt.Tags && Array.isArray(prompt.Tags)) {
    tags.push(...prompt.Tags);
  }
  if (prompt.Category) {
    tags.push(prompt.Category);
  }

  // Mock usage data (you can replace with real data)
  const usageCount = Math.floor(Math.random() * 10) + 1;
  const lastUsed = Math.floor(Math.random() * 7) + 1;
  const lastUsedText = lastUsed === 1 ? '1 day ago' : `${lastUsed} days ago`;

  // Get title and description
  const title = prompt.Name || prompt.Title || 'Untitled Prompt';
  const description = prompt.Description || promptContent.substring(0, 100) + '...';

  return (
    <Card className="bg-white rounded-xl shadow-sm border-gray-200 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
              {title}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 line-clamp-2">
              {description}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopy(promptContent)}
            className="ml-2 h-8 w-8 p-0 hover:bg-gray-100"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag: string, index: number) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="secondary" className="text-xs px-2 py-1 rounded-full">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Usage Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <span>Used {usageCount} times</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{lastUsedText}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 