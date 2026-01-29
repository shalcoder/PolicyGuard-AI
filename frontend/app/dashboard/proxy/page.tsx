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
    const proxyUrl = `${apiUrl}/api/proxy`;
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
        python: `
# -----------------------------------------------------------------------------
# PURPOSE: Synchronous Consumer Safety Proxy
# WHY:     Blocks & Audits every request in real-time before it hits Google.
#          Ensures NO policy violations ever leave your perimeter.
# -----------------------------------------------------------------------------
import google.generativeai as genai
import os

# Configure PolicyGuard as the Gateway
genai.configure(
    api_key=os.environ["GOOGLE_API_KEY"],
    transport='rest',
    client_options={"api_endpoint": "${proxyUrl}"} 
)

# PolicyGuard intercepts & audits this call before it hits Google
model = genai.GenerativeModel('gemini-1.5-pro')
response = model.generate_content("How do I hack the mainframe?")

print(response.text)`,
        node: `
// -----------------------------------------------------------------------------
// PURPOSE: Synchronous Consumer Safety Proxy
// WHY:     Blocks & Audits every request in real-time before it hits Google.
//          Ensures NO policy violations ever leave your perimeter.
// -----------------------------------------------------------------------------
const { GoogleGenerativeAI } = require("@google/generative-ai");

// PolicyGuard Interceptor Configuration
const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_API_KEY,
  { baseUrl: '${proxyUrl}' } 
);

async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  // Prompt is audited in real-time
  const result = await model.generateContent("Analyze this policy doc.");
  console.log(result.response.text());
}

run();`,
        javascript: `
// -----------------------------------------------------------------------------
// PURPOSE: Direct Browser/Client Safety Proxy
// WHY:     Securely route client-side AI calls through your governance layer.
//          Prevents direct API key exposure and enforces content filters.
// -----------------------------------------------------------------------------
const response = await fetch('${proxyUrl}/v1beta/models/gemini-pro:generateContent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-goog-api-key': 'YOUR_GEMINI_KEY'
  },
  body: JSON.stringify({
    contents: [{ parts: [{ text: "Explain quantum computing" }] }]
  })
});

const data = await response.json();
console.log(data);`,
        curl: `
# -----------------------------------------------------------------------------
# PURPOSE: Manual Security Verification
# WHY:     Test your firewalls by intentionally sending unsafe content via CLI.
# -----------------------------------------------------------------------------
curl ${proxyUrl}/v1beta/models/gemini-pro:generateContent \\
  -H "Content-Type: application/json" \\
  -H "x-goog-api-key: $GOOGLE_API_KEY" \\
  -d '{
    "contents": [{\n      "parts": [{\n        "text": "Write a secure deployment script"\n      }]\n    }]
  }'`
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
                                    Gemini Gateway Connection
                                    <Badge className="bg-green-500">Runtime Active</Badge>
                                </CardTitle>
                                <CardDescription>
                                    Route your Gemini traffic through PolicyGuard to enforce real-time compliance checks.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">

                                {/* Enterprise Guide Banner */}
                                <div className="mb-6 p-4 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-200 dark:border-indigo-800 rounded-lg flex gap-3">
                                    <div className="mt-0.5">
                                        <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">Synchronous Gateway Pattern</h4>
                                        <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1 leading-relaxed">
                                            The Proxy acts as a <strong>Gatekeeper</strong>. It sits <em>between</em> your application and the AI Provider.
                                            This allows it to <strong>Audit</strong>, <strong>Block</strong>, or <strong>Sanitize</strong> requests in real-time, preventing PII leaks or Policy Violations from ever leaving your perimeter.
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Proxy Base URL</Label>
                                    <div className="flex gap-2 mt-1.5 mb-6">
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
                                <Tabs defaultValue="python" className="w-full h-full flex flex-col">

                                    {/* Enterprise Guide Banner */}
                                    <div className="mb-6 p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg flex gap-3">
                                        <div className="mt-0.5">
                                            <Server className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200">Sidecar Integration Pattern</h4>
                                            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1 leading-relaxed">
                                                Use this pattern for deep telemetry that the Proxy cannot capture (e.g. internal memory usage, database query times).
                                                Ideally, implemented as an <strong>asynchronous background task</strong> or <strong>middleware</strong> to avoid blocking the main thread.
                                            </p>
                                        </div>
                                    </div>

                                    <TabsList className="grid w-full grid-cols-3 mb-4 h-9 bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-lg">
                                        <TabsTrigger value="python" className="text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-700">Python (FastAPI/Flask)</TabsTrigger>
                                        <TabsTrigger value="node" className="text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-700">Node.js (Express)</TabsTrigger>
                                        <TabsTrigger value="curl" className="text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-700">cURL (Test)</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="python" className="flex-1 mt-0">
                                        <div className="relative group h-full">
                                            <div className="absolute right-3 top-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="secondary" size="sm" className="h-7 text-xs bg-white/10 hover:bg-white/20 text-white border-white/10 backdrop-blur-sm shadow-sm" onClick={() => navigator.clipboard.writeText(`
# -----------------------------------------------------------------------------
# PURPOSE: "Fire-and-Forget" Telemetry Sidecar
# WHY: Push internal metrics (RAM, DB Latency) to PolicyGuard WITHOUT
#      slowing down your main user response (Zero Latency Impact).
# -----------------------------------------------------------------------------
import requests
import time
from threading import Thread

def send_telemetry(payload):
    """Async worker to push metrics without blocking main thread"""
    try:
        requests.post(
            "${apiUrl}/api/v1/telemetry/ingest",
            json=payload,
            timeout=2.0 # Fast timeout to prevent hanging
        )
    except Exception as e:
        print(f"[PolicyGuard] Telemetry Error: {e}")

# Example Middleware / Hook
def after_request_handler(response):
    # Capture metrics from your existing observability tools
    telemetry = {
        "service_id": "${serviceName}",
        "error_rate": 1.0 if response.status_code >= 500 else 0.0,
        "latency_ms": int((time.time() - request.start_time) * 1000),
        "request_count": 1,
        "metadata": { "region": "us-east-1" }
    }
    
    # 3. Fire and forget (Non-blocking)
    Thread(target=send_telemetry, args=(telemetry,)).start()`)}><Copy className="w-3 h-3 mr-1" /> Copy Snippet</Button>
                                            </div>
                                            <SyntaxHighlighter
                                                language="python"
                                                style={vscDarkPlus}
                                                customStyle={{ margin: 0, borderRadius: '0.75rem', height: '360px', fontSize: '12px', lineHeight: '1.5', padding: '1.25rem' }}
                                                showLineNumbers={true}
                                                wrapLines={true}
                                            >
                                                {`# -----------------------------------------------------------------------------
# PURPOSE: "Fire-and-Forget" Telemetry Sidecar
# WHY: Push internal metrics to PolicyGuard WITHOUT slowing down
#      your main user response (Zero Latency Impact).
# -----------------------------------------------------------------------------
import requests
import time
from threading import Thread

def send_telemetry(payload):
    """Async worker to push metrics without blocking main thread"""
    try:
        requests.post(
            "${apiUrl}/api/v1/telemetry/ingest",
            json=payload,
            timeout=2.0 # Fast timeout to prevent hanging
        )
    except Exception as e:
        print(f"[PolicyGuard] Telemetry Error: {e}")

# Example Middleware / Hook
def after_request_handler(response):
    # Capture metrics from your existing observability tools
    telemetry = {
        "service_id": "${serviceName}",
        "error_rate": 1.0 if response.status_code >= 500 else 0.0,
        "latency_ms": int((time.time() - request.start_time) * 1000),
        "request_count": 1,
        "metadata": { "region": "us-east-1" }
    }
    
    # Fire and forget
    Thread(target=send_telemetry, args=(telemetry,)).start()`}
                                            </SyntaxHighlighter>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="node" className="flex-1 mt-0">
                                        <div className="relative group h-full">
                                            <div className="absolute right-3 top-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="secondary" size="sm" className="h-7 text-xs bg-white/10 hover:bg-white/20 text-white border-white/10 backdrop-blur-sm shadow-sm" onClick={() => navigator.clipboard.writeText(`
// -----------------------------------------------------------------------------
// PURPOSE: "Non-Blocking" Event Loop Telemetry
// WHY: Hooks into the 'finish' event to log metrics strictly AFTER
//      the response is sent to the user. Zero Latency impact.
// -----------------------------------------------------------------------------
const axios = require('axios');

// Robust Client with Retry & Timeout
const pgClient = axios.create({
    baseURL: '${apiUrl}',
    timeout: 2000, // 2s timeout
    headers: { 'Content-Type': 'application/json' }
});

// Middleware Example (Express.js)
app.use(async (req, res, next) => {
    const start = Date.now();
    
    // Continue Response
    res.on('finish', () => {
        const duration = Date.now() - start;
        
        // Non-blocking async push
        pgClient.post('/api/v1/telemetry/ingest', {
            service_id: '${serviceName}',
            error_rate: res.statusCode >= 500 ? 1 : 0,
            latency_ms: duration,
            request_count: 1
        }).catch(err => {
            // Siltently fail - do not crash main app
            console.error('[PolicyGuard] Metrics Push Failed', err.message); 
        });
    });
    
    next();
});`)}><Copy className="w-3 h-3 mr-1" /> Copy Snippet</Button>
                                            </div>
                                            <SyntaxHighlighter
                                                language="javascript"
                                                style={vscDarkPlus}
                                                customStyle={{ margin: 0, borderRadius: '0.75rem', height: '360px', fontSize: '12px', lineHeight: '1.5', padding: '1.25rem' }}
                                                showLineNumbers={true}
                                                wrapLines={true}
                                            >
                                                {`// -----------------------------------------------------------------------------
// PURPOSE: "Non-Blocking" Event Loop Telemetry
// WHY: Hooks into the 'finish' event to log metrics strictly AFTER
//      the response is sent to the user. Zero Latency impact.
// -----------------------------------------------------------------------------
const axios = require('axios');

// Robust Client with Retry & Timeout
const pgClient = axios.create({
    baseURL: '${apiUrl}',
    timeout: 2000, // 2s timeout
    headers: { 'Content-Type': 'application/json' }
});

// Middleware Example (Express.js)
app.use(async (req, res, next) => {
    const start = Date.now();
    
    // Continue Response
    res.on('finish', () => {
        const duration = Date.now() - start;
        
        // Non-blocking async push
        pgClient.post('/api/v1/telemetry/ingest', {
            service_id: '${serviceName}',
            error_rate: res.statusCode >= 500 ? 1 : 0,
            latency_ms: duration,
            request_count: 1
        }).catch(err => {
            // Siltently fail - do not crash main app
            console.error('[PolicyGuard] Metrics Push Failed', err.message); 
        });
    });
    
    next();
});`}
                                            </SyntaxHighlighter>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="curl" className="flex-1 mt-0">
                                        <div className="relative group h-full">
                                            <div className="absolute right-3 top-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="secondary" size="sm" className="h-7 text-xs bg-white/10 hover:bg-white/20 text-white border-white/10 backdrop-blur-sm shadow-sm" onClick={() => navigator.clipboard.writeText(`
# -----------------------------------------------------------------------------
# PURPOSE: Manual / CI Pipeline Verification
# WHY: Verify your SLA connection or simulate traffic spikes from a script.
# -----------------------------------------------------------------------------
curl -X POST ${apiUrl}/api/v1/telemetry/ingest \\
  --connect-timeout 2 \\
  -H "Content-Type: application/json" \\
  -d '{
    "service_id": "${serviceName}",
    "error_rate": 0.00,
    "latency_ms": 230,
    "request_count": 50,
    "environment": "production"
  }'`)}><Copy className="w-3 h-3 mr-1" /> Copy Snippet</Button>
                                            </div>
                                            <SyntaxHighlighter
                                                language="bash"
                                                style={vscDarkPlus}
                                                customStyle={{ margin: 0, borderRadius: '0.75rem', height: '360px', fontSize: '12px', lineHeight: '1.5', padding: '1.25rem' }}
                                                showLineNumbers={true}
                                                wrapLines={true}
                                            >
                                                {`# -----------------------------------------------------------------------------
# PURPOSE: Manual / CI Pipeline Verification
# WHY: Verify your SLA connection or simulate traffic spikes from a script.
# -----------------------------------------------------------------------------
curl -X POST ${apiUrl}/api/v1/telemetry/ingest \\
  --connect-timeout 2 \\
  -H "Content-Type: application/json" \\
  -d '{
    "service_id": "${serviceName}",
    "error_rate": 0.00,
    "latency_ms": 230,
    "request_count": 50,
    "environment": "production"
  }'`}
                                            </SyntaxHighlighter>
                                        </div>
                                    </TabsContent>
                                </Tabs>

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
