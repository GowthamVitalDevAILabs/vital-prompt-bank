// src/pages/PromptsPage.tsx

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Plus, RefreshCw } from 'lucide-react';
import { usePrompts } from '@/hooks/usePrompts';
import { PromptCard } from '@/components/PromptCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useToast } from "@/hooks/use-toast";

export default function PromptsPage() {
  const { data: prompts, isLoading, error, refetch } = usePrompts();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleRefresh = async () => {
    toast({ title: "Syncing with Notion...", description: "Fetching the latest prompts." });
    
    try {
      const response = await fetch('http://localhost:3001/api/fetch-and-cache?type=prompts');
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error);
      
      // Refetch the data from the local JSON file
      await refetch();
      
      toast({ title: "Sync Complete!", description: result.message });
    } catch (err) {
      const isOffline = !navigator.onLine || err.message.includes('fetch');
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: isOffline ? "Please check your internet connection and try again." : err.message,
      });
    }
  };

  // Debug logging
  useEffect(() => {
    console.log('Prompts data:', prompts);
    console.log('Loading:', isLoading);
    console.log('Error:', error);
  }, [prompts, isLoading, error]);

  // Extract unique categories from prompts
  const categories = useMemo(() => {
    if (!prompts) return [];
    const cats = new Set<string>();
    prompts.forEach(prompt => {
      if (prompt.Category) {
        cats.add(prompt.Category);
      }
      // if (prompt.Tags && Array.isArray(prompt.Tags)) {
      //   prompt.Tags.forEach(tag => cats.add(tag));
      // }
    });
    return Array.from(cats).sort();
  }, [prompts]);

  // Filter prompts based on search and category
  const filteredPrompts = useMemo(() => {
    if (!prompts) return [];
    
    return prompts.filter(prompt => {
      const matchesSearch = searchTerm === '' || 
        Object.values(prompt).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesCategory = selectedCategory === 'all' || 
        prompt.Category === selectedCategory ||
        (prompt.Tags && Array.isArray(prompt.Tags) && prompt.Tags.includes(selectedCategory));
      
      return matchesSearch && matchesCategory;
    });
  }, [prompts, searchTerm, selectedCategory]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span>Loading prompts...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-destructive">Error Loading Prompts</CardTitle>
              <CardDescription>
                Failed to load prompts from the server. Please check your connection.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => refetch()} className="w-full">
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        
        {/* New Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-foreground">Vital Dev</h2>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New prompt
            </Button>

            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync with Notion
            </Button>
          </div>
          <ThemeToggle />
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name, tag, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-lg rounded-xl border-border bg-background focus:border-primary focus:ring-primary"
          />
        </div>

        {/* Collections Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
            className="rounded-full"
          >
            All
          </Button>
          {categories.slice(0, 6).map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Debug: {prompts?.length || 0} prompts loaded, {filteredPrompts.length} filtered
            </p>
          </div>
        )}

        {/* Prompts Grid */}
        {filteredPrompts.length === 0 ? (
          <Card className="max-w-md mx-auto bg-card">
            <CardHeader>
              <CardTitle>No prompts found</CardTitle>
              <CardDescription>
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No prompts available. Add some prompts to your Notion database.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="w-full"
              >
                Clear filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPrompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        )}

        {/* Floating Action Button */}
        <Button
          size="lg"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
} 