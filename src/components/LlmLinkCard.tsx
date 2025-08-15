// src/components/LlmLinkCard.tsx

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ExternalLink, Sparkles } from 'lucide-react';

interface LlmLink {
  id: string;
  name: string;
  isPopular: boolean;
  model: string;
  category: string;
  description: string;
  tags: string[];
  url: string;
}

interface LlmLinkCardProps {
  link: LlmLink;
}

export const LlmLinkCard = ({ link }: LlmLinkCardProps) => {
  const handleOpen = () => {
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="bg-card rounded-xl shadow-sm border-border hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <CardHeader className="pb-3 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-bold text-foreground line-clamp-1 leading-tight">
                {link.name}
              </CardTitle>
              {link.isPopular && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium">
                  <Star className="h-3 w-3" />
                  Popular
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground/90">{link.model}</span>
              <span className="text-muted-foreground/50">•</span>
              <span className="inline-flex items-center gap-1 text-foreground/70">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                {link.category}
              </span>
            </div>
          </div>
          
          {link.url && (
            <Button
              size="sm"
              onClick={handleOpen}
              className="bg-gradient-to-br from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-sm"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0 pb-4 px-6">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {link.description}
        </p>

        {link.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {link.tags.map((tag, index) => (
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
