// src/hooks/usePrompts.ts

import { useQuery } from '@tanstack/react-query';

// Define the Prompt type based on your expected JSON structure
export interface Prompt {
  id: string;
  [key: string]: any;
}

const fetchPrompts = async (): Promise<Prompt[]> => {
  const response = await fetch('/data/prompts.json');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const usePrompts = () => {
  return useQuery({
    queryKey: ['prompts'],
    queryFn: fetchPrompts,
    staleTime: Infinity, // Data is considered fresh until manually refetched
  });
}; 