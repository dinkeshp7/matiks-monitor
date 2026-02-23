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
}

export interface TimelineDataPoint {
  date: string;
  count: number;
}

export interface KeywordStats {
  [keyword: string]: number;
}
