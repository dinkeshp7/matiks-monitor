"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Stats } from "@/types";

const REFETCH_INTERVAL = 10000;

export function useStats() {
  return useQuery<Stats>({
    queryKey: ["stats"],
    queryFn: async () => {
      const { data } = await api.get<Stats>("/stats");
      return data;
    },
    refetchInterval: REFETCH_INTERVAL,
  });
}
