// src/components/PromptCard.tsx

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
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

  // Get title and description
  const title = prompt.Name || prompt.Title || 'Untitled Prompt';
  const description = prompt.Description || promptContent.substring(0, 100) + '...';

  return (
    <Card className="bg-card rounded-xl shadow-sm border-border hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-card-foreground line-clamp-1 flex-1">
            {title}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopy(promptContent)}
            className="ml-2 h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 pb-3">
        <CardDescription className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </CardDescription>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex flex-wrap gap-1 w-full">
          {tags.slice(0, 3).map((tag: string, index: number) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20"
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
      </CardFooter>
    </Card>
  );
}; 