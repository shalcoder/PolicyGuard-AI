"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Shield, AlertTriangle, Code, Terminal, Copy, Activity } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function ProxyPage() {
    const [selectedLang, setSelectedLang] = useState('python');
    const proxyUrl = "http://localhost:8000/api/proxy/v1";

    const snippets = {
        python: `import openai

client = openai.OpenAI(
    base_url="${proxyUrl}",
    api_key="your-openai-key" # Passed through securely
)

# PolicyGuard intercepts this, audits it, then forwards to OpenAI
response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "How do I process this loan?"}]
)

print(response.choices[0].message.content)`,

        node: `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: '${proxyUrl}',
  apiKey: 'your-openai-key' // Passed through securely
});

async function main() {
  // PolicyGuard intercepts this, audits it, then forwards to OpenAI
  const chatCompletion = await client.chat.completions.create({
    messages: [{ role: 'user', content: 'How do I process this loan?' }],
    model: 'gpt-4',
  });

  console.log(chatCompletion.choices[0].message.content);
}

main();`,

        curl: `curl ${proxyUrl}/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $OPENAI_API_KEY" \\
  -d '{
    "model": "gpt-4",
    "messages": [
      {
        "role": "user",
        "content": "How do I process this loan?"
      }
    ]
  }'`,

        java: `// Using standard HTTP libraries or LangChain Java
String proxyUrl = "${proxyUrl}/chat/completions";

HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create(proxyUrl))
    .header("Content-Type", "application/json")
    .header("Authorization", "Bearer " + System.getenv("OPENAI_API_KEY"))
    .POST(HttpRequest.BodyPublishers.ofString(
        "{\\"model\\": \\"gpt-4\\", \\"messages\\": [{\\"role\\": \\"user\\", \\"content\\": \\"Hello\\"}]}"
    ))
    .build();

HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());`
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-3">
                    <Shield className="h-8 w-8 text-indigo-500" />
                    AI Agent Gatekeeper
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Connect your existing AI agents to PolicyGuard. We act as a middleware to audit every extensive prompt and response in real-time.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Status Card */}
                <Card className="lg:col-span-1 border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-900/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-500" />
                            Proxy Status: Online
                        </CardTitle>
                        <CardDescription>
                            Listening on Port 8000
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            <div>
                                <span className="text-xs font-semibold uppercase text-gray-500">Base URL</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <code className="bg-white dark:bg-black px-3 py-1 rounded border text-sm font-mono flex-1">
                                        {proxyUrl}
                                    </code>
                                    <Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(proxyUrl)}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Zero Latency Mode</Badge>
                                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Async Audit</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Integration Guide */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Code className="h-5 w-5 text-gray-500" />
                            Integration Guide
                        </CardTitle>
                        <CardDescription>
                            Select your language to see how to connect your agent.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="python" className="w-full" onValueChange={setSelectedLang}>
                            <TabsList className="grid w-full grid-cols-4 mb-4">
                                <TabsTrigger value="python">Python</TabsTrigger>
                                <TabsTrigger value="node">Node.js</TabsTrigger>
                                <TabsTrigger value="curl">cURL</TabsTrigger>
                                <TabsTrigger value="java">Java</TabsTrigger>
                            </TabsList>
                            <div className="relative group">
                                <div className="absolute right-4 top-4 z-10">
                                    <Button variant="secondary" size="sm" onClick={() => navigator.clipboard.writeText(snippets[selectedLang as keyof typeof snippets])}>
                                        <Copy className="h-4 w-4 mr-2" /> Copy
                                    </Button>
                                </div>
                                <SyntaxHighlighter
                                    language={selectedLang === 'curl' ? 'bash' : selectedLang === 'node' ? 'javascript' : selectedLang}
                                    style={vscDarkPlus}
                                    customStyle={{ margin: 0, borderRadius: '0.5rem', height: '350px' }}
                                    showLineNumbers={true}
                                >
                                    {snippets[selectedLang as keyof typeof snippets]}
                                </SyntaxHighlighter>
                            </div>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>

            {/* How it works */}
            <Card>
                <CardHeader>
                    <CardTitle>How it works</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300">
                        <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4 ring-4 ring-indigo-50 dark:ring-indigo-900/10 group-hover:ring-indigo-200 dark:group-hover:ring-indigo-800 transition-all">
                            <Terminal className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="font-semibold mb-2 text-lg">1. Connect</h3>
                        <p className="text-sm text-gray-500 max-w-[250px]">Change your <code>base_url</code> to point to PolicyGuard. We mimic the OpenAI API perfectly.</p>
                    </div>

                    <div className="flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300">
                        <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 ring-4 ring-blue-50 dark:ring-blue-900/10 group-hover:ring-blue-200 dark:group-hover:ring-blue-800 transition-all">
                            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="font-semibold mb-2 text-lg">2. Audit</h3>
                        <p className="text-sm text-gray-500 max-w-[250px]">We intercept the request. If it violates active policies, we block it instantly or flag it asynchronously.</p>
                    </div>

                    <div className="flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300">
                        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 ring-4 ring-green-50 dark:ring-green-900/10 group-hover:ring-green-200 dark:group-hover:ring-green-800 transition-all">
                            <Activity className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="font-semibold mb-2 text-lg">3. Monitor</h3>
                        <p className="text-sm text-gray-500 max-w-[250px]">All interactions, including blocked prompts, appear in the "Evaluation" dashboard logs.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
