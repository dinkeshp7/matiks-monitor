"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { TimelineDataPoint } from "@/types";

const REFETCH_INTERVAL = 10000;

export function useTimeline() {
  return useQuery<TimelineDataPoint[]>({
    queryKey: ["timeline"],
    queryFn: async () => {
      const { data } = await api.get<TimelineDataPoint[]>("/timeline");
      return data;
    },
    refetchInterval: REFETCH_INTERVAL,
  });
}
