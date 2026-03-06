'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, ShieldCheck, FileText, Loader2, Info, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter, usePathname } from 'next/navigation';

interface Message {
    role: 'user' | 'model';
    content: string;
    citations?: string[];
    action?: {
        type: string;
        params?: any;
    };
}

export default function ChatPage() {
    const [agentMode, setAgentMode] = useState<"ask" | "action">("ask");
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', content: "Hello! I am Guardian AI Command Center. I can answer questions about your live system (Ask Mode) or execute commands for you (Agent Mode)." }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const gatherLiveContext = async () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        let context = { current_route: pathname, metrics: null, policies: null, logs: null, latest_eval: null };
        try {
            const [metricsRes, settingsRes, latestEvalRes, proxyLogsRes] = await Promise.all([
                fetch(`${apiUrl}/api/v1/metrics/dashboard`).catch(() => null),
                fetch(`${apiUrl}/api/v1/settings/gatekeeper`).catch(() => null),
                fetch(`${apiUrl}/api/v1/evaluate/latest`).catch(() => null),
                fetch(`${apiUrl}/api/v1/settings`).catch(() => null)
            ]);
            
            if (metricsRes?.ok) context.metrics = await metricsRes.json();
            if (settingsRes?.ok) context.policies = (await settingsRes.json()).active_rules;
            if (latestEvalRes?.ok) context.latest_eval = await latestEvalRes.json();
            if (proxyLogsRes?.ok) context.logs = (await proxyLogsRes.json()).proxy_logs;
            
        } catch (e) {
            console.error("Failed to gather live context", e);
        }
        return context;
    };

    const executeAction = (actionType: string, params: any) => {
        if (!actionType) return;
        console.log(`[Guardian AI] Executing Action: ${actionType}`, params);
        
        switch (actionType) {
            case 'navigate':
                if (params?.page) router.push(params.page);
                break;
            case 'trigger_audit':
                router.push('/dashboard/evaluate');
                break;
            case 'download_report':
            case 'show_metrics':
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
                window.open(`${apiUrl}/api/v1/evaluate/export/latest`, '_blank');
                break;
            default:
                console.log("Unhandled action:", actionType);
        }
    };

    const handleSend = async (e?: React.FormEvent | string) => {
        if (typeof e !== 'string') e?.preventDefault();
        
        const textValue = typeof e === 'string' ? e : input;
        if (!textValue.trim() || loading) return;

        const userMsg = { role: 'user' as const, content: textValue };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const liveContext = await gatherLiveContext();
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
            
            const response = await fetch(`${apiUrl}/api/v1/agent/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg.content,
                    history: messages.map(m => ({ role: m.role, content: m.content })),
                    live_context: liveContext,
                    agent_mode: agentMode
                })
            });

            if (!response.ok) {
                throw new Error('Network error connecting to Guardian AI');
            }

            const data = await response.json();
            
            setMessages(prev => [...prev, {
                role: 'model',
                content: data.answer,
                citations: data.citations,
                action: data.action?.type ? data.action : undefined
            }]);

            if (data.action && data.action.type) {
                setTimeout(() => executeAction(data.action.type, data.action.params), 1000);
            }

        } catch (error: any) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'model', content: "Sorry, I encountered an error connecting to the AI brain. Please check if the backend is running." }]);
        } finally {
            setLoading(false);
        }
    };

    const predefinedQueries = agentMode === "ask"
        ? [
            "Summarize recent proxy logs",
            "What is our current system violation rate?",
            "Any critical failures today?"
          ]
        : [
            "Navigate me to the red team dashboard",
            "Download the latest compliance PDF",
            "Run a fresh evaluation audit"
          ];

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] max-w-5xl mx-auto p-4 animate-in fade-in duration-500">
            {/* Header */}
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 shadow-sm border border-blue-200 dark:border-blue-800">
                            <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        Guardian AI Command Center
                        <span className="ml-3 px-2 py-0.5 rounded text-[10px] uppercase tracking-bolder bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">Dual-Mode</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl pl-13">
                        More than just a chatbot. Guardian AI understands your live system context. Ask questions about live logs in Ask Mode, or execute direct commands in Agent Mode.
                    </p>
                    
                    {/* Mode Toggle Switch */}
                    <div className="mt-4 ml-13 flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-200 dark:border-slate-700/50 max-w-[300px]">
                        <button 
                            onClick={() => setAgentMode("ask")} 
                            className={cn("flex-1 text-sm font-semibold py-2 rounded-lg transition-all", agentMode === "ask" ? "bg-blue-600 text-white shadow-md" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white")}
                        >
                            Ask Mode
                        </button>
                        <button 
                            onClick={() => setAgentMode("action")} 
                            className={cn("flex-1 text-sm font-semibold py-2 rounded-lg transition-all", agentMode === "action" ? "bg-emerald-600 text-white shadow-md" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white")}
                        >
                            Agent Mode
                        </button>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-lg border border-emerald-200 dark:border-emerald-800/30 shadow-sm text-sm font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Context Active
                </div>
            </div>

            {/* Chat Container */}
            <div className="flex-1 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col overflow-hidden relative">

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50 dark:bg-transparent">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "flex w-full",
                                msg.role === 'user' ? "justify-end" : "justify-start"
                            )}
                        >
                            <div
                                className={cn(
                                    "flex max-w-[85%] rounded-2xl px-5 py-4 shadow-sm",
                                    msg.role === 'user'
                                        ? "bg-blue-600 text-white rounded-tr-sm"
                                        : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-sm border border-slate-200 dark:border-slate-700"
                                )}
                            >
                                {/* Icon for AI */}
                                {msg.role === 'model' && (
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mr-4 shrink-0 shadow-sm border border-slate-200 dark:border-slate-700 mt-0.5">
                                        <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                )}

                                <div className="flex flex-col gap-3 min-w-0">
                                    <div className="whitespace-pre-wrap leading-relaxed text-[15px]">
                                        {msg.content}
                                    </div>

                                    {/* Action Execution Card */}
                                    {msg.action && msg.action.type && (
                                        <div className="mt-2 p-4 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                                <Activity className="w-5 h-5 animate-pulse" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">Automated Action Detected</p>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                                                    {msg.action.type === 'navigate' ? `Navigating to ${msg.action.params?.page}...` : 
                                                     msg.action.type === 'trigger_audit' ? `Triggering compliance evaluation audit...` :
                                                     msg.action.type === 'download_report' ? `Downloading latest forensic report PDF...` :
                                                     `Executing ${msg.action.type}...`}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Citations */}
                                    {msg.citations && msg.citations.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50">
                                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                                                <Info className="h-3.5 w-3.5" /> Retrieved Documents
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {msg.citations.map((cit, cIdx) => (
                                                    <div key={cIdx} className="flex gap-2 items-start p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/80">
                                                        <FileText className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                                                        <span className="line-clamp-3 leading-relaxed">{cit}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start w-full">
                            <div className="max-w-[85%] flex">
                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mr-4 shrink-0 shadow-sm border border-slate-200 dark:border-slate-700">
                                    <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-sm border border-slate-200 dark:border-slate-700 px-5 py-4 flex items-center gap-2 shadow-sm">
                                    <div className="flex gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                    <span className="ml-3 text-sm text-slate-500">Guardian is thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} className="h-2" />
                </div>

                {/* Predefined Chips */}
                {messages.length < 3 && !loading && (
                    <div className="px-6 py-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/50 flex flex-wrap gap-2">
                        {predefinedQueries.map((query, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSend(query)}
                                className="px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:hover:border-blue-700 dark:hover:bg-slate-700 transition-all"
                            >
                                {query}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input Area */}
                <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                    <form onSubmit={handleSend} className="relative flex items-end gap-3 max-w-4xl mx-auto">
                        <div className="relative flex-1 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all overflow-hidden flex flex-col">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder="Give Guardian AI a command (e.g., 'Take me to the red team metrics' or 'Run a compliance audit')..."
                                className="w-full bg-transparent border-0 px-5 py-4 min-h-[60px] max-h-[200px] outline-none text-[15px] resize-none"
                                disabled={loading}
                                rows={1}
                            />
                            <div className="px-5 py-2 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-400">
                                <span>Mode: <strong className={agentMode === 'ask' ? "text-blue-500" : "text-emerald-500"}>{agentMode === 'ask' ? 'ASK' : 'AGENT'}</strong> | Context: ON</span>
                                <span className="font-bold">↵ Enter to send, Shift+Enter for new line</span>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={!input.trim() || loading}
                            className={cn(
                                "h-[60px] w-[60px] rounded-2xl flex items-center justify-center transition-all duration-200 shrink-0 mt-auto",
                                input.trim() && !loading
                                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:-translate-y-0.5"
                                    : "bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800"
                            )}
                        >
                            <Send className="h-6 w-6" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
