// frontend/hooks/useGrowth.ts
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

export function useGrowth() {
  return useQuery({
    queryKey: ["growth"],
    queryFn: async () => {
      const res = await api.get("/analytics/growth")
      return res.data
    },
    refetchInterval: 60000,
  })
}