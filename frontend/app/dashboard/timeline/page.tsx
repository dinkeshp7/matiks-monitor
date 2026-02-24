"use client";
import { usePlatformSentiment } from "@/hooks/usePlatformSentiment";
import { motion } from "framer-motion";
import { useTimeline } from "@/hooks/useTimeline";
import { useTimelineEnriched } from "@/hooks/useTimelineEnriched";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ComposedChart,
  Legend,
} from "recharts";

const COLORS = { positive: "#A3F15A", negative: "#f87171", neutral: "#94a3b8" };

export default function TimelinePage() {
  const { data: basicData } = useTimeline();
  const { data: enrichedData, isLoading, error } = useTimelineEnriched();

  const chartData = (enrichedData || basicData || []).map((d) => ({
    ...d,
    positive: (d as { positive?: number }).positive ?? 0,
    negative: (d as { negative?: number }).negative ?? 0,
    neutral: (d as { neutral?: number }).neutral ?? 0,
    dateFormatted: new Date(d.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "2-digit",
    }),
  }));

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
    if (!active || !payload?.length || !label) return null;
    const point = chartData.find((d) => d.dateFormatted === label) || chartData.find((d) => d.date === label);
    const total = point?.count ?? 0;
    const pos = (point as { positive?: number })?.positive ?? 0;
    const neg = (point as { negative?: number })?.negative ?? 0;
    const neu = (point as { neutral?: number })?.neutral ?? 0;
    const posPct = total ? Math.round((100 * pos) / total) : 0;
    const negPct = total ? Math.round((100 * neg) / total) : 0;
    const neuPct = total ? Math.round((100 * neu) / total) : 0;
    return (
      <div className="bg-[#141416] border border-white/10 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-white font-medium mb-2">{label}</p>
        <p className="text-white/80 text-sm">Total: {total}</p>
        <p className="text-[#A3F15A] text-sm">Positive: {posPct}%</p>
        <p className="text-red-400 text-sm">Negative: {negPct}%</p>
        <p className="text-slate-400 text-sm">Neutral: {neuPct}%</p>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-white">Timeline</h1>
        <p className="text-white/60 mt-1">
          Activity over time with sentiment breakdown
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-white">Mentions Over Time</CardTitle>
          <p className="text-sm text-white/50">
            Daily count with positive / negative / neutral breakdown
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
                <ComposedChart data={chartData}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#A3F15A" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#A3F15A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis
                    dataKey="dateFormatted"
                    stroke="#64748b"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="#64748b" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="count"
                    fill="url(#areaGradient)"
                    stroke="none"
                  />
                  <Line
                    type="natural"
                    dataKey="count"
                    stroke="#A3F15A"
                    strokeWidth={2}
                    dot={{ fill: "#A3F15A", strokeWidth: 0 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Sentiment Trend</CardTitle>
            <p className="text-sm text-white/50">
              Positive, negative, and neutral over time
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis
                    dataKey="dateFormatted"
                    stroke="#64748b"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="#64748b" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="natural"
                    dataKey="positive"
                    stroke={COLORS.positive}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="natural"
                    dataKey="negative"
                    stroke={COLORS.negative}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="natural"
                    dataKey="neutral"
                    stroke={COLORS.neutral}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <PlatformComparisonCard />
    </motion.div>
  );
}

function PlatformComparisonCard() {
  const { data, isLoading } = usePlatformSentiment();
  const chartData = (data || []).map((d) => ({
    platform: d.platform,
    positive: d.positive,
    negative: d.negative,
    neutral: d.neutral,
  }));

  if (isLoading || !chartData.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-white">Platform Comparison</CardTitle>
        <p className="text-sm text-white/50">
          Stacked sentiment by platform
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="platform" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#141416",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                }}
              />
              <Legend />
              <Bar dataKey="positive" stackId="a" fill={COLORS.positive} />
              <Bar dataKey="neutral" stackId="a" fill={COLORS.neutral} />
              <Bar dataKey="negative" stackId="a" fill={COLORS.negative} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
