"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface TimelineEnrichedPoint {
  date: string;
  count: number;
  positive: number;
  negative: number;
  neutral: number;
}

const REFETCH_INTERVAL = 10000;

export function useTimelineEnriched() {
  return useQuery<TimelineEnrichedPoint[]>({
    queryKey: ["timeline-enriched"],
    queryFn: async () => {
      const { data } = await api.get<TimelineEnrichedPoint[]>("/timeline/enriched");
      return data;
    },
    refetchInterval: REFETCH_INTERVAL,
  });
}
