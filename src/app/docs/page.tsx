import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function DocsPage() {
    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                    Wasi MD Documentation
                </h1>
                <p className="text-xl text-slate-400 leading-relaxed">
                    Welcome to the official documentation for the Wasi MD ecosystem.
                    Learn how to deploy, configure, and extend the most advanced WhatsApp automation bot.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-slate-900/40 border-slate-800">
                    <CardHeader>
                        <CardTitle>Getting Started</CardTitle>
                        <CardDescription>New to Wasi MD?</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-400 mb-6">
                            Set up your first bot instance in under 5 minutes using our optimized deployment guides.
                        </p>
                        <Link href="/docs/deployment">
                            <Button>
                                View Deployment Guide <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/40 border-slate-800">
                    <CardHeader>
                        <CardTitle>Core Features</CardTitle>
                        <CardDescription>Why choose Wasi MD V7?</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-slate-400">
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                Anti-Ban Architecture
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                Plug-n-Play Extension System
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                Multi-Device Support (Baileys)
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
