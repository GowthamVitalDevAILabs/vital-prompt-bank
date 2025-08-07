import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Brain, Shield, Search, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      {/* Hero Content */}
      <div className="text-center max-w-4xl mx-auto mb-16">
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center animate-float">
            <Brain className="w-12 h-12 text-white" />
          </div>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold mb-6">
          <span className="gradient-text">Vital Prompt</span>
          <br />
          <span className="text-foreground">Forge</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Your secure, personal library for managing and searching your most valuable AI prompts.
          Built with modern architecture to keep your data safe.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/prompts">
            <Button variant="hero" size="lg" className="text-lg px-8 py-6">
              View Prompts
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="text-lg px-8 py-6">
            Learn More
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <Card variant="glass" className="animate-float" style={{ animationDelay: '0s' }}>
          <CardHeader>
            <CardTitle className="gradient-text">Secure Architecture</CardTitle>
            <CardDescription>
              API keys and sensitive data are never exposed to the frontend
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Shield className="w-8 h-8 mb-4 text-green-500" />
            <p className="text-sm text-muted-foreground">
              Backend acts as a secure vault for your Notion API credentials
            </p>
          </CardContent>
        </Card>

        <Card variant="premium" className="animate-float" style={{ animationDelay: '0.5s' }}>
          <CardHeader>
            <CardTitle className="gradient-text">Smart Search</CardTitle>
            <CardDescription>
              Find your prompts quickly with powerful search and filtering
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Search className="w-8 h-8 mb-4 text-blue-500" />
            <p className="text-sm text-muted-foreground">
              Search across all prompt content and filter by categories
            </p>
          </CardContent>
        </Card>

        <Card variant="glass" className="animate-float" style={{ animationDelay: '1s' }}>
          <CardHeader>
            <CardTitle className="gradient-text">Lightning Fast</CardTitle>
            <CardDescription>
              Built with React 19, Vite, and modern tooling for speed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Zap className="w-8 h-8 mb-4 text-yellow-500" />
            <p className="text-sm text-muted-foreground">
              Instant loading and smooth user experience
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tech Badges */}
      <div className="mt-16 flex flex-wrap gap-4 justify-center">
        {['React 19', 'Vite', 'TypeScript', 'Express.js', 'Notion API', 'shadcn/ui'].map((tech) => (
          <div 
            key={tech}
            className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium hover:bg-accent transition-colors"
          >
            {tech}
          </div>
        ))}
      </div>
    </div>
  );
}