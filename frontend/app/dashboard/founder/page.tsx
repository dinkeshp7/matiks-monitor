"use client";

import { motion } from "framer-motion";
import { useInsights } from "@/hooks/useInsights";
import { useGrowth } from "@/hooks/useGrowth";
import { useKeywordStats } from "@/hooks/useKeywords";
import { useStats } from "@/hooks/useStats";
import { usePlatformSentiment } from "@/hooks/usePlatformSentiment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, AlertTriangle, Sparkles, Download } from "lucide-react";
import { api } from "@/lib/api";
import { exportJson } from "@/lib/export";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function FounderPage() {
  const { data: insights, isLoading: insightsLoading } = useInsights();
  const { data: growth } = useGrowth();
  const { data: keywords } = useKeywordStats();
  const { data: stats } = useStats();
  const { data: platformSentiment } = usePlatformSentiment();

  const topKeyword = keywords
    ? Object.entries(keywords).sort((a, b) => b[1] - a[1])[0]
    : null;
  const topRiskPlatform = platformSentiment
    ? [...platformSentiment]
        .sort((a, b) => b.negative - a.negative)
        .filter((p) => p.negative > 0)[0]
    : null;

  async function handleDownloadReport() {
    const [insightsRes, growthRes] = await Promise.all([
      api.get("/analytics/insights"),
      api.get("/analytics/growth"),
    ]);
    exportJson(
      {
        generated_at: new Date().toISOString(),
        insights: insightsRes.data,
        growth: growthRes.data,
      },
      `matiks-report-${new Date().toISOString().slice(0, 10)}.json`
    );
  }

  if (insightsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64 mb-2" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="flex flex-row items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Founder Intelligence</h1>
          <p className="text-white/60 mt-1">
            Executive insights at a glance
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleDownloadReport}>
          <Download className="w-4 h-4 mr-2" />
          Download Insights Report
        </Button>
      </div>

      <motion.div variants={item} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <MotionCard>
          <CardHeader className="pb-2">
            <CardTitle className="text-accent flex items-center gap-2 text-base">
              <Sparkles className="w-5 h-5" />
              AI Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/90 text-sm leading-relaxed">
              {insights?.summary ?? "No insights yet."}
            </p>
          </CardContent>
        </MotionCard>

        <MotionCard>
          <CardHeader className="pb-2">
            <CardTitle className="text-white/80 text-base">Growth Indicator</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            {growth && growth.growth_percentage >= 0 ? (
              <TrendingUp className="w-10 h-10 text-accent" />
            ) : (
              <TrendingDown className="w-10 h-10 text-red-400" />
            )}
            <div>
              <p className="text-2xl font-bold text-white">
                {growth?.growth_percentage ?? 0}%
              </p>
              <p className="text-xs text-white/50">vs previous 24h</p>
            </div>
          </CardContent>
        </MotionCard>

        <MotionCard>
          <CardHeader className="pb-2">
            <CardTitle className="text-white/80 text-base">Top Risk Platform</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-red-400 capitalize">
              {topRiskPlatform?.platform ?? "—"}
            </p>
            <p className="text-xs text-white/50">
              {topRiskPlatform ? `${topRiskPlatform.negative} negative mentions` : "No risks detected"}
            </p>
          </CardContent>
        </MotionCard>

        <MotionCard>
          <CardHeader className="pb-2">
            <CardTitle className="text-white/80 text-base">Top Performing Keyword</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-accent">
              {topKeyword?.[0] ?? "—"}
            </p>
            <p className="text-xs text-white/50">
              {topKeyword ? `${topKeyword[1]} mentions` : "No data yet"}
            </p>
          </CardContent>
        </MotionCard>

        <MotionCard className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-white/80 flex items-center gap-2 text-base">
              <AlertTriangle className="w-5 h-5" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {insights?.anomalies?.length ? (
              <ul className="space-y-2">
                {insights.anomalies.map((a, i) => (
                  <li key={i} className="text-amber-400 text-sm flex items-start gap-2">
                    <span className="text-amber-500">•</span>
                    {a}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white/50 text-sm">No anomalies detected.</p>
            )}
          </CardContent>
        </MotionCard>

        <MotionCard>
          <CardHeader className="pb-2">
            <CardTitle className="text-white/80 text-base">Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            {insights?.recommendations?.length ? (
              <ul className="space-y-2">
                {insights.recommendations.map((r, i) => (
                  <li key={i} className="text-accent/90 text-sm flex items-start gap-2">
                    <span className="text-accent">→</span>
                    {r}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white/50 text-sm">Continue monitoring.</p>
            )}
          </CardContent>
        </MotionCard>
      </motion.div>
    </motion.div>
  );
}

function MotionCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={item}>
      <Card className={className}>{children}</Card>
    </motion.div>
  );
}
