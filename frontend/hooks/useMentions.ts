"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Mention } from "@/types";

interface UseMentionsParams {
  platform?: string;
  sentiment?: string;
  search?: string;
}

export function useMentions(params?: UseMentionsParams) {
  return useQuery<Mention[]>({
    queryKey: ["mentions", params],
    queryFn: async () => {
      const { data } = await api.get<Mention[]>("/mentions/", { params });
      return data;
    },
  });
}
