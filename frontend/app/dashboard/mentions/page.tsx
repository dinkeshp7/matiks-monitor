"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useMentions } from "@/hooks/useMentions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function MentionsPage() {
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState<string>("all");
  const [sentiment, setSentiment] = useState<string>("all");
  const [appliedFilters, setAppliedFilters] = useState<{
    search?: string;
    platform?: string;
    sentiment?: string;
  }>({});

  const { data, isLoading, error } = useMentions(appliedFilters);

  function applyFilters() {
    setAppliedFilters({
      ...(search && { search }),
      ...(platform && platform !== "all" && { platform }),
      ...(sentiment && sentiment !== "all" && { sentiment }),
    });
  }

  const defaultPlatforms = ["reddit", "appstore", "playstore", "twitter"];
  const defaultSentiments = ["positive", "neutral", "negative", "LABEL_0", "LABEL_1", "LABEL_2"];
  const dataPlatforms = Array.from(
    new Set((data || []).map((m) => m.platform).filter(Boolean))
  );
  const dataSentiments = Array.from(
    new Set((data || []).map((m) => m.sentiment).filter(Boolean))
  );
  const platforms = Array.from(new Set([...defaultPlatforms, ...dataPlatforms])).sort();
  const sentiments = Array.from(new Set([...defaultSentiments, ...dataSentiments])).sort();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-white">Mentions</h1>
        <p className="text-white/60 mt-1">
          All captured brand mentions across platforms
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-white">Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Input
            placeholder="Search content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All platforms</SelectItem>
              {platforms.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sentiment} onValueChange={setSentiment}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sentiment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sentiments</SelectItem>
              {sentiments.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={applyFilters}>Apply</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-white">Results</CardTitle>
          {data && (
            <p className="text-sm text-white/50">{data.length} mentions</p>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : error ? (
            <p className="text-red-400">Failed to load mentions.</p>
          ) : !data?.length ? (
            <p className="text-white/50 py-8 text-center">
              No mentions found. Try adjusting your filters.
            </p>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-white/10 text-left text-sm text-white/60">
                    <th className="py-3 px-4">Platform</th>
                    <th className="py-3 px-4">Keyword</th>
                    <th className="py-3 px-4">Content</th>
                    <th className="py-3 px-4">Sentiment</th>
                    <th className="py-3 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((m) => (
                    <tr
                      key={m.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span className="capitalize text-accent font-medium">
                          {m.platform}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white/70 text-sm">
                        {m.keyword || "—"}
                      </td>
                      <td className="py-3 px-4 max-w-md truncate text-white/90">
                        {m.content}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-lg text-xs ${
                            m.sentiment?.toLowerCase().includes("positive")
                              ? "bg-accent/20 text-accent"
                              : m.sentiment?.toLowerCase().includes("negative")
                              ? "bg-red-500/20 text-red-400"
                              : "bg-white/10 text-white/70"
                          }`}
                        >
                          {m.sentiment}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white/50 text-sm">
                        {m.timestamp
                          ? new Date(m.timestamp).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
