// src/components/LlmLinkCard.tsx

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ExternalLink } from 'lucide-react';

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
    <Card className="bg-card rounded-xl shadow-sm border-border hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold text-card-foreground line-clamp-1">
                {link.name}
              </CardTitle>
              {link.isPopular && (
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
              )}
            </div>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              {link.model} • {link.category}
            </CardDescription>
          </div>
          <Button
            size="sm"
            onClick={handleOpen}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 pb-3">
        <CardDescription className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {link.description}
        </CardDescription>
        
        <div className="flex flex-wrap gap-1">
          {link.tags.map((tag: string, index: number) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
