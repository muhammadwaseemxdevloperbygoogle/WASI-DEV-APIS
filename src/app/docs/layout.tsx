import Link from "next/link";
import { Book, Cloud, Code, Terminal, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-50 pt-16">
            {/* Sidebar */}
            <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r border-slate-800 bg-slate-950/50 backdrop-blur-xl hidden md:block overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-lg font-bold mb-4 px-2">Documentation</h2>
                    <div className="space-y-1">
                        <Link href="/docs">
                            <Button variant="ghost" className="w-full justify-start gap-2">
                                <Book className="h-4 w-4" />
                                Introduction
                            </Button>
                        </Link>
                        <Link href="/docs/deployment">
                            <Button variant="ghost" className="w-full justify-start gap-2">
                                <Cloud className="h-4 w-4" />
                                Deployment
                            </Button>
                        </Link>
                        <Link href="/docs/api">
                            <Button variant="ghost" className="w-full justify-start gap-2">
                                <Terminal className="h-4 w-4" />
                                API Reference
                            </Button>
                        </Link>
                    </div>

                    <h2 className="text-lg font-bold mt-8 mb-4 px-2">Ecosystem</h2>
                    <div className="space-y-1">
                        <Button variant="ghost" className="w-full justify-start gap-2 text-slate-400">
                            <Code className="h-4 w-4" />
                            Wasi MD Plugins
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:pl-64">
                <div className="container max-w-4xl mx-auto p-6 md:p-12">
                    {children}
                </div>
            </main>
        </div>
    );
}
