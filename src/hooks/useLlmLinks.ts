// src/hooks/useLlmLinks.ts

import { useQuery } from '@tanstack/react-query';

export interface LlmLink {
  id: string;
  name: string;
  isPopular: boolean;
  model: string;
  category: string;
  description: string;
  tags: string[];
  url: string;
}

const fetchLlmLinks = async (): Promise<LlmLink[]> => {
  const response = await fetch('/data/llmLinks.json');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  console.log('Fetched LLM Links Data:', data);
  return data;
};

export const useLlmLinks = () => {
  return useQuery({
    queryKey: ['llmLinks'],
    queryFn: fetchLlmLinks,
    staleTime: Infinity,
  });
};