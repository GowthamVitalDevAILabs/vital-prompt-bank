// src/pages/PromptsPage.tsx

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Sun, Hand } from 'lucide-react';
import { usePrompts } from '@/hooks/usePrompts';
import { PromptCard } from '@/components/PromptCard';

export default function PromptsPage() {
  const { data: prompts, isLoading, error, refetch } = usePrompts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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
      if (prompt.Tags && Array.isArray(prompt.Tags)) {
        prompt.Tags.forEach(tag => cats.add(tag));
      }
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

  // Calculate statistics
  const stats = useMemo(() => {
    if (!prompts) return { total: 0, categories: 0, usedToday: 0 };
    
    const uniqueCategories = new Set();
    prompts.forEach(prompt => {
      if (prompt.Category) uniqueCategories.add(prompt.Category);
      if (prompt.Tags && Array.isArray(prompt.Tags)) {
        prompt.Tags.forEach(tag => uniqueCategories.add(tag));
      }
    });

    // Mock "used today" - you can replace this with actual usage tracking
    const usedToday = Math.floor(Math.random() * 10) + 1;

    return {
      total: prompts.length,
      categories: uniqueCategories.size,
      usedToday
    };
  }, [prompts]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span>Loading prompts...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 space-y-6">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Sun className="h-4 w-4 mr-2" />
              All Design
            </Button>
            <Button variant="ghost" size="sm">
              <Hand className="h-4 w-4 mr-2" />
              Si
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name, tag, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-lg rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Statistics Card */}
        <Card className="bg-white rounded-xl shadow-sm border-gray-200">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Prompts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.categories}</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.usedToday}</div>
                <div className="text-sm text-gray-600">Used Today</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Filters */}
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
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-800">
              Debug: {prompts?.length || 0} prompts loaded, {filteredPrompts.length} filtered
            </p>
          </div>
        )}

        {/* Prompts Grid */}
        {filteredPrompts.length === 0 ? (
          <Card className="max-w-md mx-auto bg-white rounded-xl shadow-sm">
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPrompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        )}

        {/* Floating Action Button */}
        <Button
          size="lg"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
} 