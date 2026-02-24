"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type DateRange = "7d" | "30d" | "90d" | "all";

interface FilterState {
  dateRange: DateRange;
}

interface FilterContextType extends FilterState {
  setDateRange: (range: DateRange) => void;
  getDateParams: () => { start_date?: string; end_date?: string };
}

const FilterContext = createContext<FilterContextType | null>(null);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [dateRange, setDateRange] = useState<DateRange>("30d");

  const getDateParams = useCallback(() => {
    const end = new Date();
    const start = new Date();
    if (dateRange === "7d") start.setDate(start.getDate() - 7);
    else if (dateRange === "30d") start.setDate(start.getDate() - 30);
    else if (dateRange === "90d") start.setDate(start.getDate() - 90);
    else return {};
    return {
      start_date: start.toISOString().slice(0, 10),
      end_date: end.toISOString().slice(0, 10),
    };
  }, [dateRange]);

  return (
    <FilterContext.Provider value={{ dateRange, setDateRange, getDateParams }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const ctx = useContext(FilterContext);
  if (!ctx) return { dateRange: "30d" as DateRange, setDateRange: () => {}, getDateParams: () => ({}) };
  return ctx;
}
