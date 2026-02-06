import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DeploymentPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-4">Deployment Guide</h1>
                <p className="text-slate-400">
                    Deploy Wasi MD V7 to your preferred cloud provider. We recommend Heroku for beginners and VPS for advanced users.
                </p>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300">
                <strong>Note:</strong> Wasi MD V7 requires Node.js 18+ and FFmpeg installed on the server.
            </div>

            <Tabs defaultValue="heroku" className="w-full">
                <TabsList className="bg-slate-900 border border-slate-800">
                    <TabsTrigger value="heroku">Heroku</TabsTrigger>
                    <TabsTrigger value="replit">Replit</TabsTrigger>
                    <TabsTrigger value="termux">Termux (Android)</TabsTrigger>
                </TabsList>

                {/* HEROKU DEPLOYMENT */}
                <TabsContent value="heroku" className="mt-6 space-y-4">
                    <Card className="bg-slate-900/40 border-slate-800">
                        <CardHeader>
                            <CardTitle>Deploy to Heroku</CardTitle>
                            <CardDescription>The easiest way to host Wasi MD for free/cheap.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ol className="list-decimal list-inside space-y-4 text-slate-300">
                                <li>
                                    <strong>Scan QR Code:</strong> First, you need to scan the QR code to get your `session.id`.
                                    Use our <a href="#" className="text-blue-400 underline">QR Scanner</a>.
                                </li>
                                <li>
                                    <strong>Fork Repository:</strong> Go to the <a href="https://github.com/Itxxwasi/WASI-MD-V7" className="text-blue-400 underline">GitHub Repository</a> and click "Fork".
                                </li>
                                <li>
                                    <strong>Deploy:</strong> Click the "Deploy to Heroku" button in the README of your forked repo.
                                </li>
                                <li>
                                    <strong>Configure Vars:</strong> Fill in the required fields:
                                    <ul className="list-disc list-inside ml-6 mt-2 text-slate-400">
                                        <li>`SESSION_ID`: The code you got from scanning.</li>
                                        <li>`HEROKU_API_KEY`: Found in your Heroku Account Settings.</li>
                                        <li>`HEROKU_APP_NAME`: Choose a unique name.</li>
                                    </ul>
                                </li>
                            </ol>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* REPLIT DEPLOYMENT */}
                <TabsContent value="replit" className="mt-6 space-y-4">
                    <Card className="bg-slate-900/40 border-slate-800">
                        <CardHeader>
                            <CardTitle>Deploy to Replit</CardTitle>
                            <CardDescription>Good for testing and development.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ol className="list-decimal list-inside space-y-4 text-slate-300">
                                <li>Create a Replit account.</li>
                                <li>Click "+ Create Repl" and import from GitHub: `Itxxwasi/WASI-MD-V7`.</li>
                                <li>
                                    Open `Shell` and run:
                                    <div className="mt-2 bg-slate-950 p-3 rounded-md border border-slate-800 font-mono text-sm flex items-center justify-between">
                                        <code>npm install && npm start</code>
                                        <Button asChild size="icon" variant="ghost" className="h-6 w-6">
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </li>
                                <li>Click "Run" and scan the QR code that appears in the console.</li>
                            </ol>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TERMUX DEPLOYMENT */}
                <TabsContent value="termux" className="mt-6 space-y-4">
                    <Card className="bg-slate-900/40 border-slate-800">
                        <CardHeader>
                            <CardTitle>Termux (Android)</CardTitle>
                            <CardDescription>Host directly on your phone.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-sm space-y-2 text-slate-300">
                                <p className="text-slate-500"># 1. Update Packages</p>
                                <p>pkg update && pkg upgrade</p>

                                <p className="text-slate-500 mt-4"># 2. Install Dependencies</p>
                                <p>pkg install git nodejs ffmpeg libwebp -y</p>

                                <p className="text-slate-500 mt-4"># 3. Clone & Install</p>
                                <p>git clone https://github.com/Itxxwasi/WASI-MD-V7</p>
                                <p>cd WASI-MD-V7</p>
                                <p>npm install</p>

                                <p className="text-slate-500 mt-4"># 4. Start</p>
                                <p>npm start</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    );
}
