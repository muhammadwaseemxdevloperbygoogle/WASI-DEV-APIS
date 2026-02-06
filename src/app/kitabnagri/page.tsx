"use client";

import React, { useState } from "react";
import { Search, Download, BookOpen, ExternalLink, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function KitabNagriPage() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [selectedBook, setSelectedBook] = useState<any>(null);
    const [fetchingDetails, setFetchingDetails] = useState(false);

    const handleSearch = async (e: any) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/kitabnagri/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            setResults(data.results || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDetails = async (link: string) => {
        setFetchingDetails(true);
        setSelectedBook(null);
        try {
            const res = await fetch(`/api/kitabnagri/details?url=${encodeURIComponent(link)}`);
            const data = await res.json();
            setSelectedBook(data);
        } catch (err) {
            console.error(err);
        } finally {
            setFetchingDetails(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30 pb-20">
            {/* Background Decor */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950 pointer-events-none" />

            <div className="container mx-auto max-w-5xl px-6 relative z-10">
                {/* Header */}
                <div className="pt-20 pb-12 flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-6 h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20"
                    >
                        <BookOpen className="h-8 w-8 text-white" />
                    </motion.div>
                    <h1 className="text-4xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                        KitabNagri Scraper
                    </h1>
                    <p className="text-slate-400 text-center max-w-xl">
                        Search and download Urdu novels directly from KitabNagri. Provide an author's name or book title.
                    </p>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-4 mb-12">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search novels, authors, stories..."
                            className="pl-10 h-12 bg-slate-900/50 border-slate-800 focus:border-blue-500 transition-colors"
                        />
                    </div>
                    <Button type="submit" disabled={loading} className="h-12 px-8 bg-blue-600 hover:bg-blue-500">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                    </Button>
                </form>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Results List */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider px-2">
                            {results.length > 0 ? `Results (${results.length})` : "No results yet"}
                        </h2>
                        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            <AnimatePresence mode="popLayout">
                                {results.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <button
                                            onClick={() => fetchDetails(item.link)}
                                            className={cn(
                                                "w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group",
                                                selectedBook?.url === item.link
                                                    ? "bg-blue-600/10 border-blue-500/50 shadow-sm"
                                                    : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                                            )}
                                        >
                                            <span className="font-medium text-slate-200 group-hover:text-white truncate pr-4">
                                                {item.title}
                                            </span>
                                            <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Book Details */}
                    <div className="sticky top-24">
                        <AnimatePresence mode="wait">
                            {fetchingDetails ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center p-12 border border-slate-800 rounded-2xl bg-slate-900/20 backdrop-blur-sm"
                                >
                                    <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
                                    <p className="text-slate-400 text-sm">Extracting links...</p>
                                </motion.div>
                            ) : selectedBook ? (
                                <motion.div
                                    key="details"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="overflow-hidden border border-slate-800 rounded-2xl bg-slate-900/40 backdrop-blur-sm"
                                >
                                    <div className="p-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
                                    <div className="p-8">
                                        {selectedBook.thumbnail && (
                                            <div className="aspect-[3/4] w-48 mx-auto mb-8 rounded-lg overflow-hidden border border-white/5 shadow-2xl">
                                                <img
                                                    src={selectedBook.thumbnail}
                                                    alt={selectedBook.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <h3 className="text-2xl font-bold mb-2 text-center">{selectedBook.title}</h3>
                                        <p className="text-slate-500 text-sm text-center mb-8">
                                            Found on KitabNagri Repository
                                        </p>

                                        <div className="grid grid-cols-2 gap-4">
                                            <Button
                                                variant="outline"
                                                asChild
                                                className="gap-2 border-slate-700 hover:bg-slate-800"
                                            >
                                                <a href={selectedBook.readOnlineLink} target="_blank">
                                                    <ExternalLink className="h-4 w-4" />
                                                    Read Online
                                                </a>
                                            </Button>
                                            <Button
                                                className="gap-2 bg-blue-600 hover:bg-blue-500"
                                                asChild
                                                disabled={!selectedBook.downloadLink}
                                            >
                                                <a href={selectedBook.downloadLink} target="_blank">
                                                    <Download className="h-4 w-4" />
                                                    Download PDF
                                                </a>
                                            </Button>
                                        </div>

                                        {!selectedBook.downloadLink && (
                                            <p className="mt-4 text-xs text-red-400 text-center">
                                                Direct download link not found for this book.
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center p-12 py-24 border border-dashed border-slate-800 rounded-2xl bg-slate-900/10"
                                >
                                    <Search className="h-10 w-10 text-slate-800 mb-4" />
                                    <p className="text-slate-600 text-center text-sm">
                                        Select a novel from the results to <br /> view download options
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
