"use client";

import { motion } from "framer-motion";
import { useKeywordStats } from "@/hooks/useKeywords";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function KeywordsPage() {
  const { data, isLoading, error } = useKeywordStats();

  const chartData = data
    ? Object.entries(data)
        .map(([keyword, count]) => ({ keyword, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-white">Keywords</h1>
        <p className="text-white/60 mt-1">
          Keyword performance across all mentions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-white">Keyword Counts</CardTitle>
          {data && (
            <p className="text-sm text-white/50">
              Top {chartData.length} keywords by mention count
            </p>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-96 w-full rounded-xl" />
          ) : error ? (
            <p className="text-red-400">Failed to load keyword stats.</p>
          ) : !chartData.length ? (
            <p className="text-white/50 py-16 text-center">
              No keyword data yet. Start scraping to see results.
            </p>
          ) : (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 100 }}>
                  <XAxis type="number" stroke="#64748b" />
                  <YAxis
                    type="category"
                    dataKey="keyword"
                    stroke="#64748b"
                    width={90}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#141416",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#A3F15A"
                    radius={[0, 8, 8, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
