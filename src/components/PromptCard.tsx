// src/components/PromptCard.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Star, ExternalLink } from 'lucide-react';
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

  // Get title and description
  const title = prompt.Name || prompt.Title || 'Untitled Prompt';
  const description = prompt.Description || promptContent.substring(0, 100) + '...';
  const isPopular = prompt.isPopular || false;
  const category = prompt.Category || '';

  return (
    <Card className="bg-card rounded-xl shadow-sm border-border hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <CardHeader className="pb-3 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-bold text-foreground line-clamp-1 leading-tight">
                {title}
              </CardTitle>
              {isPopular && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium">
                  <Star className="h-3 w-3" />
                  Popular
                </span>
              )}
            </div>
            
            {category && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1 text-foreground/70">
                  {category}
                </span>
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopy(promptContent)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0 pb-4 px-6">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {description}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {tags.map((tag: string, index: number) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs px-2.5 py-1 rounded-md bg-muted/50 hover:bg-muted transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};