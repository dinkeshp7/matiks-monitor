"use client";

import { useQuery } from "@tanstack/react-query";

import {api }from "@/lib/api";

export interface PlatformSentiment {
  platform: string;
  positive: number;
  neutral: number;
  negative: number;
}

export const usePlatformSentiment = () => {
  return useQuery<PlatformSentiment[]>({
    queryKey: ["platform-sentiment"],
    queryFn: async () => {
      const res = await api.get("/analytics/platform-sentiment");
      return res.data;
    },
    refetchInterval: 10000,
  });
};