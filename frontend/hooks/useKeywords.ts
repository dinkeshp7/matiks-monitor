"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { KeywordStats } from "@/types";

export function useKeywordStats() {
  return useQuery<KeywordStats>({
    queryKey: ["keyword_stats"],
    queryFn: async () => {
      const { data } = await api.get<KeywordStats>("/keyword_stats");
      return data;
    },
  });
}
