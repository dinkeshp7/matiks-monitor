"use client";

import { motion } from "framer-motion";
import { useTimeline } from "@/hooks/useTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function TimelinePage() {
  const { data, isLoading, error } = useTimeline();

  const chartData = (data || []).map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "2-digit",
    }),
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-white">Timeline</h1>
        <p className="text-white/60 mt-1">
          Review activity over time
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-white">Mentions Over Time</CardTitle>
          <p className="text-sm text-white/50">
            Daily review count from App Store & Play Store
          </p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-96 w-full rounded-xl" />
          ) : error ? (
            <p className="text-red-400">Failed to load timeline.</p>
          ) : !chartData.length ? (
            <p className="text-white/50 py-16 text-center">
              No timeline data yet. Start scraping to see results.
            </p>
          ) : (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis
                    dataKey="date"
                    stroke="#64748b"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#141416",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#A3F15A"
                    strokeWidth={2}
                    dot={{ fill: "#A3F15A", strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
