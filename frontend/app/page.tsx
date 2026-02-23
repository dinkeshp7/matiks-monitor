"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart3, MessageSquare, TrendingUp, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background bg-grid-pattern bg-grid relative overflow-hidden">
      {/* Gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <span className="text-xl font-bold text-accent">Matiks Monitor</span>
        <div className="flex gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">View Dashboard</Link>
          </Button>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold leading-tight text-white">
              Turn Brand Mentions Into{" "}
              <span className="text-accent">Smart Intelligence</span>
            </h1>
            <p className="text-xl text-white/70 max-w-xl">
              Track reviews, sentiment, and keyword trends across platforms.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-2xl border border-white/10 bg-card/80 backdrop-blur-xl p-6 shadow-glow">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-white/10 rounded w-3/4" />
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-24 rounded-xl bg-white/5 border border-white/5"
                    />
                  ))}
                </div>
                <div className="h-32 rounded-xl bg-white/5 border border-white/5" />
              </div>
            </div>
            <div className="absolute -inset-1 rounded-2xl bg-accent/20 blur-2xl -z-10 opacity-60" />
          </motion.div>
        </div>

        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-32 pt-20 border-t border-white/10"
        >
          <h2 className="text-3xl font-bold text-center mb-16">
            Everything you need for brand intelligence
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: MessageSquare,
                title: "Mention Tracking",
                desc: "Capture every brand mention across platforms.",
              },
              {
                icon: TrendingUp,
                title: "Sentiment Analysis",
                desc: "AI-powered sentiment for every piece of content.",
              },
              {
                icon: BarChart3,
                title: "Keyword Trends",
                desc: "See which keywords drive the most engagement.",
              },
              {
                icon: Zap,
                title: "Real-time Dashboard",
                desc: "Beautiful analytics at a glance.",
              },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-white/10 bg-card/50 p-6 hover:border-accent/30 transition-colors"
              >
                <Icon className="w-10 h-10 text-accent mb-4" />
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-white/60 text-sm">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <footer className="mt-32 pt-12 border-t border-white/10 text-center text-white/40 text-sm">
          © {new Date().getFullYear()} Matiks Monitor. All rights reserved.
        </footer>
      </main>
    </div>
  );
}
