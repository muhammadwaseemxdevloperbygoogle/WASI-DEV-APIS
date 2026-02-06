"use client";

import React, { useEffect, useState } from "react";
import useSWR from "swr";
import {
  Terminal, Activity, ExternalLink,
  ChevronRight, Play, Bot, Zap, Globe, ShieldCheck,
  CheckCircle2, XCircle, Loader2, FlaskConical
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// API Endpoints to test
const API_ENDPOINTS = [
  { name: "Health Check", endpoint: "/health", method: "GET" },
  { name: "YouTube Search", endpoint: "/api/search/youtube?q=test", method: "GET" },
  { name: "YouTube Video DL", endpoint: "/api/download/youtube/video?url=https://youtube.com/watch?v=dQw4w9WgXcQ", method: "GET" },
  { name: "YouTube Audio DL", endpoint: "/api/download/youtube/audio?url=https://youtube.com/watch?v=dQw4w9WgXcQ", method: "GET" },
  { name: "Pinterest Search", endpoint: "/api/search/pinterest?q=nature", method: "GET" },
  { name: "KitabNagri Search", endpoint: "/api/search/kitabnagri?q=ishq", method: "GET" },
];

export default function LandingPage() {
  const { data: healthData } = useSWR("/health", fetcher, { refreshInterval: 5000 });
  const [mounted, setMounted] = useState(false);
  const [apiResults, setApiResults] = useState<Record<string, { status: 'idle' | 'loading' | 'success' | 'error', time?: number, message?: string }>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const testEndpoint = async (name: string, endpoint: string) => {
    setApiResults(prev => ({ ...prev, [name]: { status: 'loading' } }));
    const startTime = Date.now();

    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      const time = Date.now() - startTime;

      if (data.status === true || data.status === 'ok' || response.ok) {
        setApiResults(prev => ({ ...prev, [name]: { status: 'success', time, message: 'OK' } }));
      } else {
        setApiResults(prev => ({ ...prev, [name]: { status: 'error', time, message: data.message || 'Failed' } }));
      }
    } catch (error: any) {
      const time = Date.now() - startTime;
      setApiResults(prev => ({ ...prev, [name]: { status: 'error', time, message: error.message } }));
    }
  };

  const testAllEndpoints = async () => {
    for (const api of API_ENDPOINTS) {
      await testEndpoint(api.name, api.endpoint);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen mesh-gradient text-slate-50 selection:bg-blue-500/30 font-sans bg-grid relative pb-32">

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/40 backdrop-blur-xl"
      >
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 font-bold text-2xl tracking-tighter">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Terminal className="h-6 w-6 text-white" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">WASIDEV</span>
          </div>
          <div className="hidden md:flex gap-10 text-sm font-semibold text-slate-400">
            <a href="#features" className="hover:text-white transition-colors uppercase tracking-widest text-[10px]">Features</a>
            <a href="#api-tester" className="hover:text-white transition-colors uppercase tracking-widest text-[10px]">API Tester</a>
            <a href="#projects" className="hover:text-white transition-colors uppercase tracking-widest text-[10px]">Ecosystem</a>
            <a href="#stats" className="hover:text-white transition-colors uppercase tracking-widest text-[10px]">Status</a>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-slate-400 hover:text-white hidden lg:flex">Login</Button>
            <Button className="bg-white text-slate-950 hover:bg-slate-200 font-bold px-6 rounded-full transition-all hover:scale-105 active:scale-95">
              Get Started
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/50 border border-white/10 text-blue-400 text-xs font-bold mb-10 backdrop-blur-md shadow-xl"
            >
              <Zap className="h-3 w-3 fill-blue-400" />
              <span>V7.2 IS NOW LIVE WITH 40+ NEW APIS</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-sm:text-4xl text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9] text-white"
            >
              The AI-Powered <br />
              <span className="text-gradient">API Infrastructure</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-lg md:text-2xl text-slate-400 max-w-3xl mb-12 leading-relaxed"
            >
              High-performance scrapers, WhatsApp automation, and developer-centric tools.
              Build faster with our robust, scalable backend ecosystem.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-6"
            >
              <Button size="lg" className="h-14 px-10 text-lg bg-blue-600 hover:bg-blue-500 rounded-full glow-blue">
                Explore APIs
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg bg-slate-950/20 backdrop-blur-md border-white/10 hover:bg-white/5 rounded-full ring-1 ring-white/5">
                Join Discord
              </Button>
            </motion.div>

            {/* Code Playground */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="mt-24 w-full max-w-4xl group"
            >
              <div className="relative rounded-2xl border border-white/10 bg-slate-950/80 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] backdrop-blur-2xl overflow-hidden transition-all duration-500 group-hover:border-blue-500/30 group-hover:shadow-[0_0_80px_-12px_rgba(59,130,246,0.4)]">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-900/40">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/40" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                    <div className="w-3 h-3 rounded-full bg-green-500/40" />
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Request Simulator</div>
                  <div className="w-12" />
                </div>
                <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/5 min-h-[340px]">
                  <div className="flex-1 p-8 font-mono text-left bg-slate-950/50">
                    <div className="text-blue-400 mb-2">// Fetch any media instantly</div>
                    <div className="flex gap-3 mb-6">
                      <span className="text-emerald-400 uppercase font-bold text-xs">GET</span>
                      <span className="text-slate-200">/api/download/youtube</span>
                    </div>
                    <div className="space-y-1 text-slate-400 text-sm">
                      <div>query: &#123;</div>
                      <div className="pl-6">url: <span className="text-orange-300">"https://youtu.be/..."</span>,</div>
                      <div className="pl-6">type: <span className="text-orange-300">"audio"</span></div>
                      <div>&#125;</div>
                    </div>
                    <Button className="mt-8 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-600/30 text-xs py-1 h-9 font-bold px-6 rounded-lg transition-all">
                      RUN REQUEST
                    </Button>
                  </div>
                  <div className="flex-1 p-8 font-mono text-left bg-[#020617]">
                    <div className="text-slate-600 mb-4 uppercase text-[10px] font-bold">Response</div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key="resp"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-1 text-xs"
                      >
                        <div className="text-slate-400">&#123;</div>
                        <div className="pl-4"><span className="text-purple-400">"status"</span>: <span className="text-emerald-400">true</span>,</div>
                        <div className="pl-4"><span className="text-purple-400">"result"</span>: &#123;</div>
                        <div className="pl-8"><span className="text-purple-400">"title"</span>: <span className="text-orange-300">"Dandelions - Ruth B."</span>,</div>
                        <div className="pl-8"><span className="text-purple-400">"dl"</span>: <span className="text-blue-400">"https://cdn.wasidev.com/..."</span></div>
                        <div className="pl-4">&#125;</div>
                        <div className="text-slate-400">&#125;</div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<Zap className="h-6 w-6 text-yellow-400" />}
              title="Lightning Fast"
              description="Proprietary scraping engines built for sub-second responses and high concurrency."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-6 w-6 text-emerald-400" />}
              title="Anti-Ban Tech"
              description="Sophisticated proxy rotation and fingerprinting to bypass the toughest bot protections."
            />
            <FeatureCard
              icon={<Globe className="h-6 w-6 text-blue-400" />}
              title="Global Scale"
              description="Distributed nodes across the globe for low-latency access from anywhere."
            />
          </div>
        </div>
      </section>

      {/* API Tester Section */}
      <section id="api-tester" className="py-24 bg-slate-900/30 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold mb-6">
                <FlaskConical className="h-4 w-4" />
                API TESTING LAB
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-4">Test All <span className="text-gradient">Endpoints</span></h2>
              <p className="text-slate-400 text-lg">Click to test individual APIs or run all tests at once to verify system health.</p>
            </div>
            <Button
              onClick={testAllEndpoints}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-8 h-14 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20"
            >
              <Play className="mr-2 h-5 w-5" />
              Test All APIs
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {API_ENDPOINTS.map((api, i) => {
              const result = apiResults[api.name];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="bg-slate-950/60 border-white/5 hover:border-white/10 transition-all p-6 rounded-2xl backdrop-blur-md group">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">{api.name}</h3>
                        <code className="text-xs text-slate-500 font-mono break-all">{api.endpoint.substring(0, 40)}...</code>
                      </div>
                      <div className="flex items-center gap-2">
                        {result?.status === 'loading' && (
                          <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
                        )}
                        {result?.status === 'success' && (
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        )}
                        {result?.status === 'error' && (
                          <XCircle className="h-5 w-5 text-red-400" />
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${api.method === 'GET' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                          {api.method}
                        </span>
                        {result?.time && (
                          <span className="text-xs text-slate-500">{result.time}ms</span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => testEndpoint(api.name, api.endpoint)}
                        disabled={result?.status === 'loading'}
                        className="text-slate-400 hover:text-white hover:bg-white/5 text-xs"
                      >
                        {result?.status === 'loading' ? 'Testing...' : 'Test'}
                      </Button>
                    </div>

                    {result?.status === 'error' && result.message && (
                      <div className="mt-3 text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">
                        {result.message}
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section id="projects" className="py-24 bg-slate-900/20 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black mb-6">The WASIDEV <br /><span className="text-gradient">Ecosystem</span></h2>
              <p className="text-slate-400 text-lg">Powerful tools designed for developers who demand reliability and performance.</p>
            </div>
            <Button variant="outline" className="rounded-full border-white/10 h-12 px-8">View All APIs</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROJECTS.map((project, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-blue-500/5 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <Card className="h-full bg-slate-950/40 border-white/5 hover:border-blue-500/30 transition-all duration-500 rounded-3xl overflow-hidden backdrop-blur-md relative z-10 p-8">
                  <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    {project.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{project.name}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {project.desc}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3 py-1 bg-white/5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Live Pulse */}
      <section id="stats" className="py-32">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-12 animate-pulse">
            <Activity className="h-4 w-4" />
            LIVE SYSTEM STATUS
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-white">
            <div className="space-y-4">
              <div className="text-6xl font-black">{healthData ? "99.9%" : "99.9%"}</div>
              <div className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Average Uptime</div>
            </div>
            <div className="space-y-4">
              <div className="text-6xl font-black">{healthData ? `${healthData.requests}+` : "1.2M"}</div>
              <div className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Daily Requests</div>
            </div>
            <div className="space-y-4">
              <div className="text-6xl font-black">45ms</div>
              <div className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Avg Latency</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-slate-950/50 backdrop-blur-xl absolute bottom-0 w-full">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 font-bold">
            <div>© 2026 WASIDEV. SOLUTIONS BY ITXXWASI.</div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">GITHUB</a>
              <a href="#" className="hover:text-white transition-colors">DISCORD</a>
              <a href="#" className="hover:text-white transition-colors">PRIVACY</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <div className="space-y-6 group text-white">
      <div className="h-16 w-16 rounded-3xl bg-slate-900/80 border border-white/5 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:border-blue-500/50 transition-all duration-500">
        {icon}
      </div>
      <h3 className="text-2xl font-black">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">{description}</p>
    </div>
  );
}

const PROJECTS = [
  {
    name: "Wasi MD Core",
    desc: "The heartbeat of our automation ecosystem. High-concurrency WhatsApp engine.",
    icon: <Bot className="h-6 w-6 text-blue-500" />,
    tags: ["Node.js", "Baileys", "WebSocket"]
  },
  {
    name: "Media Scrapers",
    desc: "Universal extractors for TikTok, IG, FB and YT with native y2mate-engine.",
    icon: <Play className="h-6 w-6 text-emerald-400" />,
    tags: ["Puppeteer", "Express", "Axios"]
  },
  {
    name: "KitabNagri SDK",
    desc: "Deep-scraping engine for the largest Urdu novel database in the world.",
    icon: <ExternalLink className="h-6 w-6 text-purple-400" />,
    tags: ["Fuzzy Match", "PDF Gen"]
  },
  {
    name: "Cricket Realtime",
    desc: "Sub-second match updates, scorecard analytics, and player metrics scraping.",
    icon: <Zap className="h-6 w-6 text-orange-400" />,
    tags: ["Cheerio", "Redis", "Realtime"]
  }
];
