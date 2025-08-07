// src/hooks/usePrompts.ts

import { useQuery } from '@tanstack/react-query';
import { ApiService, Prompt } from '@/lib/api';

export const usePrompts = () => {
  return useQuery({
    queryKey: ['prompts'],
    queryFn: () => ApiService.getPrompts(), 
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export type { Prompt }; 