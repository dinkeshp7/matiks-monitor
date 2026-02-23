"use client";

import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  ResponsiveContainer,
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

interface SentimentPieProps {
  data: Record<string, number>;
}

export function SentimentPie({ data }: SentimentPieProps) {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value,
    fill: SENTIMENT_COLORS[name] || "#64748b",
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPie>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          label={({ name, value }) => `${name}: ${value}`}
        >
          {chartData.map((entry, index) => (
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
      </RechartsPie>
    </ResponsiveContainer>
  );
}
