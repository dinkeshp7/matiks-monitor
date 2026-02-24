export interface Mention {
  id: number;
  platform: string;
  author: string;
  content: string;
  keyword?: string;
  timestamp: string;
  sentiment: string;
  score: number;
}

export interface Stats {
  sentiment_distribution: Record<string, number>;
  platform_distribution: Record<string, number>;
  total_mentions?: number;
  positive_pct?: number;
  negative_pct?: number;
  neutral_pct?: number;
  mentions_last_24h?: number;
}

export interface TimelineDataPoint {
  date: string;
  count: number;
}

export interface KeywordStats {
  [keyword: string]: number;
}
