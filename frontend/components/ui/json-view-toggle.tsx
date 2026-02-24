"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Code } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export function JsonViewToggle() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(!open)}
        title="View API"
      >
        <Code className="w-4 h-4" />
      </Button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 w-80 rounded-xl border border-white/10 bg-[#0a0a0b] p-4 shadow-xl">
            <p className="text-xs text-white/60 mb-2">JSON API</p>
            <code className="text-accent text-xs block break-all">
              {API_URL}
            </code>
            <a
              href={`${API_URL}/docs`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent/80 text-sm hover:underline mt-2 block"
            >
              Open Swagger docs →
            </a>
          </div>
        </>
      )}
    </div>
  );
}
