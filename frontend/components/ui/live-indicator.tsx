"use client";

import { motion } from "framer-motion";

export function LiveIndicator() {
  return (
    <div className="flex items-center gap-2 text-white/60 text-sm">
      <motion.span
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-2 h-2 rounded-full bg-accent"
      />
      Live
    </div>
  );
}
