"use client";

import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { Copy, Terminal, Activity, Users, Server, ExternalLink, ChevronRight, Code2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function LandingPage() {
  const { data: healthData, error } = useSWR("/health", fetcher, { refreshInterval: 5000 });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30">

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md"
      >
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Terminal className="h-5 w-5 text-white" />
            </div>
            <span>WASIDEV</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
            <a href="#stats" className="hover:text-white transition-colors">System Status</a>
            <a href="/docs" className="hover:text-white transition-colors">Documentation</a>
          </div>
          <Button variant="outline" className="hidden md:flex gap-2">
            <Code2 className="h-4 w-4" />
            GitHub
          </Button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none" />

        <div className="container mx-auto max-w-5xl relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            System Online & Operational
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400"
          >
            Automating the Future <br />
            with <span className="text-blue-500">Wasi MD</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed"
          >
            Advanced WhatsApp automation infrastructure, high-performance web scrapers, and
            developer-first APIs. Built for scale, designed for developers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Button size="lg" className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-500">
              Get Started
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-slate-950/50 backdrop-blur-sm border-slate-800 hover:bg-slate-900">
              View Documentation
            </Button>
          </motion.div>

          {/* Terminal Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 w-full max-w-3xl rounded-xl border border-slate-800 bg-slate-950/50 shadow-2xl backdrop-blur-sm overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-slate-900/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
              </div>
              <div className="text-xs text-slate-500 font-mono ml-2">bash</div>
            </div>
            <div className="p-6 font-mono text-sm text-left">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-blue-500">❯</span> npm install wasi-md-v7
              </div>
              <div className="mt-2 text-slate-500">
                + wasi-md-v7@7.0.0 <br />
                added 1 package in 0.4s
              </div>
              <div className="flex items-center gap-2 text-slate-400 mt-4">
                <span className="text-blue-500">❯</span> wasi start --session=main
              </div>
              <div className="mt-2 text-emerald-400">
                [SYSTEM] Wasi MD V7 is online <br />
                [INFO] Connected to Database <br />
                [INFO] Listening for events...
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 border-y border-white/5 bg-slate-900/20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="API Status"
              value={healthData ? "Online" : "Connecting..."}
              icon={<Activity className="h-5 w-5 text-emerald-500" />}
              desc="System Operational"
              loading={!healthData}
            />
            <StatsCard
              title="Uptime"
              value={healthData ? `${Math.floor(healthData.uptime / 60)}m` : "..."}
              icon={<Server className="h-5 w-5 text-blue-500" />}
              desc="Current Session"
              loading={!healthData}
            />
            <StatsCard
              title="Total Requests"
              value={healthData ? healthData.requests : "0"}
              icon={<Terminal className="h-5 w-5 text-purple-500" />}
              desc="Processed Interactions"
              loading={!healthData}
            />
            <StatsCard
              title="Active Users"
              value="1,240+"
              icon={<Users className="h-5 w-5 text-orange-500" />}
              desc="Across all nodes"
              loading={false}
            />
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section id="projects" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Ecosystem & Scrapers
            </h2>
            <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
              Professional tools built to handle scale. From social media scraping to automated messaging infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PROJECTS.map((project, i) => (
              <Card key={i} className="bg-slate-900/40 border-slate-800 hover:border-slate-700 transition-colors group">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-xl">
                    {project.name}
                    <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    {project.status}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                    {project.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-slate-950">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-slate-500 text-sm">
            © 2026 Wasidev. All rights reserved. <br />
            Built by <span className="text-blue-400">Itxxwasi (Mr. Wasi)</span> - Full Stack Developer & Learner.
          </div>
          <div className="flex gap-6 text-slate-400">
            <a href="https://github.com/itxxwasi" target="_blank" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Components and Consants

function StatsCard({ title, value, icon, desc, loading }: any) {
  return (
    <Card className="bg-slate-900/40 border-slate-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-slate-400 text-sm font-medium">{title}</div>
          {icon}
        </div>
        <div className="text-3xl font-bold text-white mb-1">
          {loading ? (
            <div className="h-8 w-24 bg-slate-800 animate-pulse rounded" />
          ) : value}
        </div>
        <div className="text-xs text-slate-500">{desc}</div>
      </CardContent>
    </Card>
  )
}

const PROJECTS = [
  {
    name: "Wasi MD V7",
    status: "Production • v7.0.1",
    desc: "The flagship WhatsApp bot utilizing the latest Baileys library. Features localized content, simplified plugin system, and anti-ban architecture.",
    tags: ["Node.js", "WebSocket", "Baileys"],
  },
  {
    name: "Media Scraper API",
    status: "Active • 99.9% Uptime",
    desc: "High-throughput API for downloading media from TikTok, Instagram, and YouTube. Built with Express and Puppeteer for reliable extraction.",
    tags: ["Express", "Puppeteer", "ffmpeg"],
  },
  {
    name: "Cricket Live Score",
    status: "Beta • Real-time",
    desc: "Real-time cricket match data delivery system. Fetches scores, commentary, and player stats with sub-second latency.",
    tags: ["Cheerio", "Next.js", "Redis"],
  },
  {
    name: "KitabNagri Scraper",
    status: "New • Live",
    desc: "A specialized scraper for KitabNagri.org. Allows users to search through thousands of Urdu novels and download them as PDFs directly.",
    tags: ["Axios", "Cheerio", "PDF"],
  },
]
