"use client";

import { motion } from "framer-motion";
import { useStats } from "@/hooks/useStats";
import { useGrowth } from "@/hooks/useGrowth";
import { useInsights } from "@/hooks/useInsights";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LiveIndicator } from "@/components/ui/live-indicator";
import { ArrowLeft } from "lucide-react";

export default function MonitorPage() {
  const { data: stats } = useStats();
  const { data: growth } = useGrowth();
  const { data: insights } = useInsights();

  const total = stats?.total_mentions ?? 0;
  const growthPct = growth?.growth_percentage ?? 0;
  const last24h = stats?.mentions_last_24h ?? 0;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern bg-grid bg-[length:40px_40px] opacity-50" />
      <div className="absolute top-6 right-8 flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        </Link>
        <LiveIndicator />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-4xl space-y-8"
      >
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-2">
            Matiks Monitor
          </h1>
          <p className="text-white/50 text-lg">Live Analytics</p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <Card className="bg-card/90 backdrop-blur border-white/10">
            <CardContent className="pt-8 pb-8 text-center">
              <p className="text-6xl font-bold text-accent">{total}</p>
              <p className="text-white/60 mt-2">Total Mentions</p>
            </CardContent>
          </Card>
          <Card className="bg-card/90 backdrop-blur border-white/10">
            <CardContent className="pt-8 pb-8 text-center">
              <p className="text-6xl font-bold text-white">{last24h}</p>
              <p className="text-white/60 mt-2">Last 24h</p>
            </CardContent>
          </Card>
          <Card className="bg-card/90 backdrop-blur border-white/10">
            <CardContent className="pt-8 pb-8 text-center">
              <p className={`text-6xl font-bold ${growthPct >= 0 ? "text-accent" : "text-red-400"}`}>
                {growthPct >= 0 ? "+" : ""}{growthPct}%
              </p>
              <p className="text-white/60 mt-2">Growth</p>
            </CardContent>
          </Card>
        </div>

        {insights?.summary && (
          <Card className="bg-card/90 backdrop-blur border-white/10">
            <CardContent className="pt-6 pb-6">
              <p className="text-white/90 text-center text-lg">
                {insights.summary}
              </p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
