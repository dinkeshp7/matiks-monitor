"use client";

import { motion } from "framer-motion";
import { useStats } from "@/hooks/useStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const SENTIMENT_COLORS: Record<string, string> = {
  positive: "#A3F15A",
  neutral: "#94a3b8",
  negative: "#f87171",
  LABEL_0: "#f87171",
  LABEL_1: "#94a3b8",
  LABEL_2: "#A3F15A",
};

export default function OverviewPage() {
  const { data, isLoading, error } = useStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-500/30">
        <CardContent className="pt-6">
          <p className="text-red-400">Failed to load stats. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  const totalMentions = data
    ? Object.values(data.platform_distribution || {}).reduce((a, b) => a + b, 0)
    : 0;

  const sentimentData = data?.sentiment_distribution
    ? Object.entries(data.sentiment_distribution).map(([name, value]) => ({
        name,
        value,
        fill: SENTIMENT_COLORS[name] || "#64748b",
      }))
    : [];

  const platformData = data?.platform_distribution
    ? Object.entries(data.platform_distribution).map(([name, value]) => ({
        name,
        count: value,
      }))
    : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-white">Overview</h1>
        <p className="text-white/60 mt-1">
          Your brand intelligence at a glance
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-white/80 text-base font-medium">
              Total Mentions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-accent">{totalMentions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-white/80 text-base font-medium">
              Platforms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-white">
              {Object.keys(data?.platform_distribution || {}).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-white/80 text-base font-medium">
              Sentiment Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-white">
              {Object.keys(data?.sentiment_distribution || {}).length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Sentiment Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) =>
                    `${name}: ${value}`
                  }
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#141416",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-white">
              Platform Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformData} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" stroke="#64748b" />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#64748b"
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#141416",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                  }}
                />
                <Bar dataKey="count" fill="#A3F15A" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
