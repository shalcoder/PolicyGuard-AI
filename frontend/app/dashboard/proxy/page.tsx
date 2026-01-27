"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Shield, AlertTriangle, Terminal, Copy, Activity, Server, Zap, ArrowRight, Eye, Clock } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function ProxyPage() {
    const [selectedLang, setSelectedLang] = useState('python');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const proxyUrl = `${apiUrl}/api/proxy/v1`;
    const router = useRouter();

    // View State
    const [activeStream, setActiveStream] = useState<'stream1' | 'stream2'>('stream1');

    // SLA Connection State
    const [isConnecting, setIsConnecting] = useState(false);
    const [isSlaConnected, setIsSlaConnected] = useState(false);
    const [serviceName, setServiceName] = useState("payment-service-prod");

    const handleSlaConnect = () => {
        setIsConnecting(true);
        // Simulate handshake
        setTimeout(() => {
            setIsConnecting(false);
            setIsSlaConnected(true);
        }, 2000);
    };

    const snippets = {
        python: `import openai\n\nclient = openai.OpenAI(\n    base_url="${proxyUrl}",\n    api_key="your-openai-key" # Passed through securely\n)\n\n# PolicyGuard intercepts this, audits it, then forwards to OpenAI\nresponse = client.chat.completions.create(\n    model="gpt-4",\n    messages=[{"role": "user", "content": "How do I process this loan?"}]\n)\n\nprint(response.choices[0].message.content)`,
        node: `import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  baseURL: '${proxyUrl}',\n  apiKey: 'your-openai-key' // Passed through securely\n});\n\nasync function main() {\n  // PolicyGuard intercepts this, audits it, then forwards to OpenAI\n  const chatCompletion = await client.chat.completions.create({\n    messages: [{ role: 'user', content: 'How do I process this loan?' }],\n    model: 'gpt-4',\n  });\n\n  console.log(chatCompletion.choices[0].message.content);\n}\n\nmain();`,
        javascript: `// Vanilla JS / Frontend\nconst response = await fetch('${proxyUrl}/chat/completions', {\n  method: 'POST',\n  headers: {\n    'Content-Type': 'application/json',\n    'Authorization': 'Bearer your-openai-key'\n  },\n  body: JSON.stringify({\n    model: 'gpt-4',\n    messages: [{ role: 'user', content: 'How do I process this loan?' }]\n  })\n});\n\nconst data = await response.json();\nconsole.log(data.choices[0].message.content);`,
        curl: `curl ${proxyUrl}/chat/completions \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer $OPENAI_API_KEY" \\\n  -d '{\n    "model": "gpt-4",\n    "messages": [\n      {\n        "role": "user",\n        "content": "How do I process this loan?"\n      }\n    ]\n  }'`
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 p-2">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-3">
                    <Shield className="h-8 w-8 text-indigo-500" />
                    AI Integration Hub
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-3xl">
                    Centralize your AI governance. Click a stream below to configure:
                </p>
            </div>

            {/* Visual Architecture Diagram (Now Acts as Controller) */}
            <div className="relative bg-gradient-to-r from-gray-50 to-white dark:from-zinc-900 dark:to-black rounded-xl border border-dashed border-gray-300 dark:border-zinc-700 p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
                <div className="absolute inset-0 opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

                {/* User's AI */}
                <div className="flex flex-col items-center z-10">
                    <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-700 flex items-center justify-center mb-3">
                        <Terminal className="w-8 h-8 text-gray-600 dark:text-gray-300" />
                    </div>
                    <span className="font-bold text-sm">Your AI Agent</span>
                </div>

                {/* Connection Line */}
                <div className="flex-1 h-[2px] bg-gray-300 dark:bg-zinc-700 relative hidden md:block">
                    <div className="absolute inset-0 bg-indigo-500 w-1/2 animate-[shimmer_2s_infinite]"></div>
                </div>

                {/* PolicyGuard Hub */}
                <div className="flex flex-col items-center z-10 w-full max-w-md">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border-2 border-indigo-500 p-4 w-full transition-transform hover:scale-[1.01]">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Shield className="w-5 h-5 text-indigo-500" />
                            <span className="font-bold">PolicyGuard Gatekeeper</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {/* Stream 1 Selector */}
                            <div
                                onClick={() => setActiveStream('stream1')}
                                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 group
                                    ${activeStream === 'stream1'
                                        ? 'bg-indigo-100 dark:bg-indigo-900/40 border-indigo-500 ring-2 ring-indigo-500/20'
                                        : 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/40'
                                    }`}
                            >
                                <div className="flex items-center gap-2 mb-2 group-hover:translate-x-1 transition-transform">
                                    <Shield className={`w-4 h-4 ${activeStream === 'stream1' ? 'text-indigo-700' : 'text-indigo-600'}`} />
                                    <span className={`font-bold text-xs ${activeStream === 'stream1' ? 'text-indigo-800 dark:text-indigo-200' : 'text-indigo-700 dark:text-indigo-300'}`}>
                                        STREAM 1: SAFETY
                                    </span>
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                    <span className="text-[10px] text-green-600 font-medium flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> Active
                                    </span>
                                    {activeStream === 'stream1' && <Eye className="w-3 h-3 text-indigo-500" />}
                                </div>
                            </div>

                            {/* Stream 2 Selector */}
                            <div
                                onClick={() => setActiveStream('stream2')}
                                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 group
                                    ${activeStream === 'stream2'
                                        ? 'bg-purple-100 dark:bg-purple-900/40 border-purple-500 ring-2 ring-purple-500/20'
                                        : `bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800/50 hover:bg-purple-100 dark:hover:bg-purple-900/40 ${isSlaConnected ? '' : 'opacity-70'}`
                                    }`}
                            >
                                <div className="flex items-center gap-2 mb-2 group-hover:translate-x-1 transition-transform">
                                    <Activity className={`w-4 h-4 ${activeStream === 'stream2' ? 'text-purple-700' : 'text-purple-600'}`} />
                                    <span className={`font-bold text-xs ${activeStream === 'stream2' ? 'text-purple-800 dark:text-purple-200' : 'text-purple-700 dark:text-purple-300'}`}>
                                        STREAM 2: STABILITY
                                    </span>
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                    {isSlaConnected ? (
                                        <span className="text-green-600 flex items-center gap-1 text-[10px] font-medium"><CheckCircle2 className="w-3 h-3" /> Active</span>
                                    ) : (
                                        <span className="text-yellow-600 flex items-center gap-1 text-[10px] font-medium"><AlertTriangle className="w-3 h-3" /> Pending</span>
                                    )}
                                    {activeStream === 'stream2' && <Eye className="w-3 h-3 text-purple-500" />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Consumers & Metrics */}
                <div className="flex flex-col gap-8 md:block hidden relative z-10 w-32">
                    <div
                        onClick={() => router.push('/dashboard/monitor')}
                        className={`flex items-center gap-3 mb-8 cursor-pointer group transition-all duration-300 ${activeStream === 'stream1' ? 'opacity-100 translate-x-0' : 'opacity-40 translate-x-2'}`}
                        title="Go to Safety Console"
                    >
                        <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                        <span className="text-xs font-semibold text-indigo-500 underline decoration-dotted underline-offset-4">Consumers</span>
                    </div>
                    <div
                        onClick={() => router.push('/dashboard/sla')}
                        className={`flex items-center gap-3 cursor-pointer group transition-all duration-300 ${activeStream === 'stream2' ? 'opacity-100 translate-x-0' : 'opacity-40 translate-x-2'}`}
                        title="Go to Stability Console"
                    >
                        <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                        <span className="text-xs font-semibold text-purple-500 underline decoration-dotted underline-offset-4">SLA Dashboard</span>
                    </div>
                </div>
            </div>

            {/* DYNAMIC CONTENT AREA */}
            <div className="min-h-[400px]">
                {activeStream === 'stream1' ? (
                    /* STREAM 1 CONTENT */
                    <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600">1</div>
                            <h2 className="text-xl font-bold">Stream 1: Consumer Safety Configuration</h2>
                        </div>

                        <Card className="border-indigo-200 dark:border-indigo-800 shadow-sm">
                            <CardHeader className="bg-indigo-50/30 dark:bg-indigo-900/10 pb-4">
                                <CardTitle className="text-base flex justify-between items-center">
                                    OpenAI Proxy Connection
                                    <Badge className="bg-green-500">Runtime Active</Badge>
                                </CardTitle>
                                <CardDescription>
                                    Replace your existing Base URL with this Proxy URL to enable real-time safety guardrails.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div>
                                    <Label className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Proxy Base URL</Label>
                                    <div className="flex gap-2 mt-1.5">
                                        <div className="flex-1 bg-slate-950 text-slate-50 font-mono text-sm p-2.5 rounded-md border border-slate-800 truncate">
                                            {proxyUrl}
                                        </div>
                                        <Button variant="outline" size="icon" onClick={() => navigator.clipboard.writeText(proxyUrl)}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <Tabs defaultValue="python" className="w-full" onValueChange={setSelectedLang}>
                                    <TabsList className="grid w-full grid-cols-4 h-8">
                                        <TabsTrigger value="python" className="text-xs">Python</TabsTrigger>
                                        <TabsTrigger value="node" className="text-xs">Node.js</TabsTrigger>
                                        <TabsTrigger value="javascript" className="text-xs">JavaScript</TabsTrigger>
                                        <TabsTrigger value="curl" className="text-xs">cURL</TabsTrigger>
                                    </TabsList>
                                    <div className="relative mt-2 group">
                                        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                className="h-7 text-xs bg-white/10 hover:bg-white/20 text-white border-white/10 backdrop-blur-sm"
                                                onClick={() => navigator.clipboard.writeText(snippets[selectedLang as keyof typeof snippets])}
                                            >
                                                <Copy className="h-3 w-3 mr-1.5" /> Copy Code
                                            </Button>
                                        </div>
                                        <SyntaxHighlighter
                                            language={selectedLang === 'curl' ? 'bash' : selectedLang === 'node' ? 'javascript' : selectedLang}
                                            style={vscDarkPlus}
                                            customStyle={{ margin: 0, borderRadius: '0.5rem', height: '400px', fontSize: '13px', paddingTop: '1rem' }}
                                            showLineNumbers={true}
                                        >
                                            {snippets[selectedLang as keyof typeof snippets]}
                                        </SyntaxHighlighter>
                                    </div>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    /* STREAM 2 CONTENT */
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 max-w-5xl mx-auto">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600">2</div>
                            <h2 className="text-xl font-bold">Stream 2: System Stability Configuration</h2>
                        </div>

                        {!isSlaConnected ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                {/* LEFT: Connection Form */}
                                <Card className="border-dashed border-2 bg-gray-50/50 dark:bg-zinc-900/30 h-full">
                                    <CardHeader>
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <Server className="w-5 h-5 text-gray-400" />
                                            Connect Backend Telemetry
                                        </CardTitle>
                                        <CardDescription>
                                            Link your backend service to enable Gemini SRE.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Service Name</Label>
                                            <Input
                                                placeholder="e.g. payment-service-prod"
                                                value={serviceName}
                                                onChange={(e) => setServiceName(e.target.value)}
                                                className="bg-white dark:bg-zinc-950"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Metrics Endpoint (Optional)</Label>
                                            <Input placeholder="https://api.yourservice.com/metrics" className="bg-white dark:bg-zinc-950" />
                                        </div>
                                        <div className="pt-4">
                                            <Button
                                                className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-900/20"
                                                onClick={handleSlaConnect}
                                                disabled={isConnecting}
                                            >
                                                {isConnecting ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                        Verifying Handshake...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Zap className="w-4 h-4 mr-2" /> Enable SLA Stream
                                                    </>
                                                )}
                                            </Button>
                                            <p className="text-[10px] text-center text-gray-400 mt-3">
                                                Injects <code className="bg-gray-100 dark:bg-zinc-800 px-1 py-0.5 rounded">policyguard-sidecar:v2</code> container.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* RIGHT: Value Prop / Preview */}
                                <Card className="border-purple-100 dark:border-purple-900/30 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/10 dark:to-zinc-900 h-full">
                                    <CardHeader>
                                        <CardTitle className="text-base text-purple-700 dark:text-purple-300 flex items-center gap-2">
                                            <Activity className="w-5 h-5" />
                                            Why Connect Stream 2?
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-5">
                                        <div className="flex gap-3">
                                            <div className="mt-1 bg-purple-100 dark:bg-purple-900/50 p-1.5 rounded-md h-fit">
                                                <Activity className="w-4 h-4 text-purple-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-sm">Predictive Risk Scoring</h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                    Gemini analyzes latency trends to predict SLA breaches 1 hour in advance.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <div className="mt-1 bg-blue-100 dark:bg-blue-900/50 p-1.5 rounded-md h-fit">
                                                <Zap className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-sm">Auto-Remediation</h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                    Get copy-paste CLI commands (e.g. <code className="text-xs">kubectl scale</code>) generated by AI to fix issues instantly.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <div className="mt-1 bg-orange-100 dark:bg-orange-900/50 p-1.5 rounded-md h-fit">
                                                <Shield className="w-4 h-4 text-orange-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-sm">Root Cause Analysis</h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                    Automatic correlation of "High Latency" with "Garbage Collection Spikes".
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <Card className="border-purple-500/30 bg-purple-500/5 max-w-3xl mx-auto">
                                <CardHeader>
                                    <CardTitle className="text-base flex justify-between items-center text-purple-400">
                                        Telemetry Stream Active
                                        <Badge className="bg-purple-500 hover:bg-purple-600">Connected</Badge>
                                    </CardTitle>
                                    <CardDescription className="text-purple-300/70">
                                        Gemini is actively monitoring <strong>{serviceName}</strong>.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20 flex flex-col items-center justify-center text-center">
                                            <Activity className="w-6 h-6 text-purple-400 mb-2" />
                                            <div className="text-2xl font-bold text-white">98.2%</div>
                                            <div className="text-xs text-purple-300">Health Score</div>
                                        </div>
                                        <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20 flex flex-col items-center justify-center text-center">
                                            <Clock className="w-6 h-6 text-blue-400 mb-2" />
                                            <div className="text-2xl font-bold text-white">42ms</div>
                                            <div className="text-xs text-purple-300">P95 Latency</div>
                                        </div>
                                        <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20 flex flex-col items-center justify-center text-center">
                                            <Server className="w-6 h-6 text-green-400 mb-2" />
                                            <div className="text-2xl font-bold text-white">Healthy</div>
                                            <div className="text-xs text-purple-300">Pod Status</div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button variant="outline" className="text-xs border-purple-500 text-purple-400 hover:bg-purple-500/10" onClick={() => setIsSlaConnected(false)}>
                                            Disconnect Service
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
