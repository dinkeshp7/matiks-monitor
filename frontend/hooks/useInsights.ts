"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface InsightsData {
  summary: string;
  anomalies: string[];
  recommendations: string[];
}

const REFETCH_INTERVAL = 10000;

export function useInsights() {
  return useQuery<InsightsData>({
    queryKey: ["insights"],
    queryFn: async () => {
      const { data } = await api.get<InsightsData>("/analytics/insights");
      return data;
    },
    refetchInterval: REFETCH_INTERVAL,
  });
}
