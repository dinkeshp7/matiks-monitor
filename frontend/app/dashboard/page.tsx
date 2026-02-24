"use client";
import { useGrowth } from "@/hooks/useGrowth"
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
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

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
  const { data: growth } = useGrowth();
  

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
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

  const totalMentions = data?.total_mentions ?? Object.values(data?.platform_distribution || {}).reduce((a, b) => a + b, 0);
  const growthPct = growth?.growth_percent ?? 0;

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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-white/80 text-sm font-medium">
              Total Mentions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-accent">{totalMentions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-white/80 text-sm font-medium">
              Positive %
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[#A3F15A]">
              {data?.positive_pct ?? 0}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-white/80 text-sm font-medium">
              Negative %
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-400">
              {data?.negative_pct ?? 0}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-white/80 text-sm font-medium">
              Neutral %
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-400">
              {data?.neutral_pct ?? 0}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-white/80 text-sm font-medium">
              Last 24h
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">
              {data?.mentions_last_24h ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-white/80 text-sm font-medium">
              Growth
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-1">
            {growthPct > 0 ? (
              <TrendingUp className="w-5 h-5 text-accent" />
            ) : growthPct < 0 ? (
              <TrendingDown className="w-5 h-5 text-red-400" />
            ) : (
              <Minus className="w-5 h-5 text-slate-400" />
            )}
            <span
              className={`text-2xl font-bold ${
                growthPct > 0 ? "text-accent" : growthPct < 0 ? "text-red-400" : "text-slate-400"
              }`}
            >
              {growthPct > 0 ? "+" : ""}{growthPct}%
            </span>
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
                  label={({ name, value }) => `${name}: ${value}`}
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
