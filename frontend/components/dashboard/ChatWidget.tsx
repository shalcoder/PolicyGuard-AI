"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, MessageSquare, X, Minimize2, Loader2, Info, FileText, Activity, ExternalLink, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

interface Message {
    role: "user" | "model";
    content: string;
    citations?: string[];
    action?: {
        type: string;
        params?: any;
    };
}

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [agentMode, setAgentMode] = useState<"ask" | "action">("ask");
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "model",
            content:
                "Hello! I am Guardian AI. I can answer questions about your live system (Ask Mode) or execute commands for you (Agent Mode).",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    // Helper to gather comprehensive live context from the system
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
                if (params?.page) {
                    router.push(params.page);
                }
                break;
            case 'trigger_audit':
                router.push('/dashboard/evaluate');
                // Could emit a global event here to auto-click "Run Audit"
                break;
            case 'download_report':
            case 'show_metrics':
                // For download, hit the export endpoint
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

        const userMsg = { role: "user" as const, content: textValue };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const liveContext = await gatherLiveContext();
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
            
            const response = await fetch(`${apiUrl}/api/v1/agent/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMsg.content,
                    history: messages.map((m) => ({ role: m.role, content: m.content })),
                    live_context: liveContext,
                    agent_mode: agentMode
                }),
            });

            if (!response.ok) {
                throw new Error("Network error connecting to Guardian AI");
            }

            const data = await response.json();
            
            setMessages((prev) => [
                ...prev,
                {
                    role: "model",
                    content: data.answer,
                    citations: data.citations,
                    action: data.action?.type ? data.action : undefined
                },
            ]);

            // Execute the action if the agent returned one
            if (data.action && data.action.type) {
                setTimeout(() => executeAction(data.action.type, data.action.params), 1000);
            }

        } catch (error: any) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                {
                    role: "model",
                    content: "Sorry, I encountered an error connecting to the AI brain.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const actionChips = agentMode === "ask" 
        ? ["Summarize recent proxy logs", "What is our violation rate?", "Any critical failures today?"]
        : ["Navigate to Red Team", "Trigger compliance audit", "Download latest audit PDF"];

    return (
        <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end pointer-events-auto">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4 w-[420px] h-[650px] max-h-[85vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-transparent bg-gradient-to-r from-slate-900 to-blue-900 dark:from-slate-950 dark:to-blue-950 shadow-sm relative overflow-hidden">
                                {/* Animated background glow */}
                                <div className="absolute inset-0 bg-blue-500/10 blur-2xl animate-pulse"></div>
                                
                                <div className="flex flex-col text-white relative z-10 w-full">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center">
                                            <div className="relative mr-3">
                                                <ShieldCheck className="h-7 w-7 text-blue-400" />
                                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-900 rounded-full"></span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-[15px] tracking-wide flex items-center gap-2">
                                                    Guardian AI
                                                    <span className="px-1.5 py-0.5 rounded text-[8px] uppercase tracking-bolder bg-blue-500/20 text-blue-300 border border-blue-500/30">Dual-Mode</span>
                                                </h3>
                                                <p className="text-xs text-slate-400 font-medium flex items-center mt-0.5">
                                                    <Activity className="w-3 h-3 mr-1 text-emerald-400 animate-pulse" />
                                                    Connected to Live Context
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-full text-slate-300 hover:text-white transition-colors">
                                                <Minimize2 className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-full text-slate-300 hover:text-white transition-colors">
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Mode Toggle Switch */}
                                    <div className="mt-4 flex bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
                                        <button 
                                            onClick={() => setAgentMode("ask")} 
                                            className={cn("flex-1 text-xs font-semibold py-1.5 rounded-lg transition-all", agentMode === "ask" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-white")}
                                        >
                                            Ask Mode
                                        </button>
                                        <button 
                                            onClick={() => setAgentMode("action")} 
                                            className={cn("flex-1 text-xs font-semibold py-1.5 rounded-lg transition-all", agentMode === "action" ? "bg-emerald-600 text-white shadow-md" : "text-slate-400 hover:text-white")}
                                        >
                                            Agent Mode
                                        </button>
                                    </div>
                                </div>
                            </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-slate-50/50 dark:bg-slate-950/30 relative">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={cn("flex w-full", msg.role === "user" ? "justify-end" : "justify-start")}>
                                    {msg.role === "model" && (
                                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mr-3 shrink-0 shadow-sm border border-slate-300 dark:border-slate-700">
                                            <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    )}
                                    <div className={cn(
                                        "flex flex-col max-w-[80%]",
                                        msg.role === "user" ? "items-end" : "items-start"
                                    )}>
                                        <div className={cn(
                                            "rounded-2xl px-4 py-3 text-[14px] shadow-sm leading-relaxed",
                                            msg.role === "user"
                                                ? "bg-blue-600 text-white rounded-br-sm"
                                                : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-sm border border-slate-200/60 dark:border-slate-700/60"
                                        )}>
                                            <div className="whitespace-pre-wrap">{msg.content}</div>

                                            {/* Action Execution Card */}
                                            {msg.action && msg.action.type && (
                                                <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                                        <Activity className="w-4 h-4 animate-pulse" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-0.5">Automated Action</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                            {msg.action.type === 'navigate' ? `Navigating to ${msg.action.params?.page}...` : 
                                                             msg.action.type === 'trigger_audit' ? `Triggering compliance audit...` :
                                                             msg.action.type === 'download_report' ? `Opening latest report...` :
                                                             `Executing ${msg.action.type}...`}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Citations */}
                                            {msg.citations && msg.citations.length > 0 && (
                                                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50">
                                                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2 flex items-center">
                                                        <Info className="h-3 w-3 mr-1" /> Verified Sources
                                                    </p>
                                                    <div className="flex flex-col gap-1.5">
                                                        {msg.citations.map((cit, cIdx) => (
                                                            <div key={cIdx} className="flex gap-2 items-start p-2 rounded-md bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                                                                <FileText className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                                                                <span className="line-clamp-2">{cit}</span>
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
                                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mr-3 shrink-0">
                                        <ShieldCheck className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-sm px-5 py-4 shadow-sm">
                                        <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} className="h-4" />
                        </div>

                        {/* Quick Chips (only show if no messages or just starting) */}
                        {messages.length < 3 && !loading && (
                            <div className="px-4 pb-2 bg-slate-50/50 dark:bg-slate-950/30 flex gap-2 overflow-x-auto scrollbar-none">
                                {actionChips.map(chip => (
                                    <button 
                                        key={chip}
                                        onClick={() => handleSend(chip)}
                                        className="whitespace-nowrap px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        {chip}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                            <form onSubmit={handleSend} className="relative flex items-end gap-2">
                                <div className="relative flex-1">
                                    <textarea
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSend();
                                            }
                                        }}
                                        placeholder="Ask a question or give a command..."
                                        className="w-full bg-slate-100 dark:bg-slate-950 border-0 rounded-xl pl-4 pr-12 py-3 min-h-[50px] max-h-[120px] focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 outline-none text-[14px] transition-all resize-none shadow-inner"
                                        disabled={loading}
                                        rows={1}
                                    />
                                    <div className="absolute right-3 bottom-2.5 text-xs font-bold text-slate-300 dark:text-slate-700 pt-1 border-t border-slate-200 dark:border-slate-800">
                                        ↵ to send
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={!input.trim() || loading}
                                    className={cn(
                                        "h-[50px] w-[50px] flex items-center justify-center rounded-xl shrink-0 transition-all duration-200",
                                        input.trim() && !loading
                                            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:-translate-y-0.5"
                                            : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                                    )}
                                >
                                    <Send className="h-5 w-5" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "h-14 w-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 relative group",
                    isOpen
                        ? "bg-slate-800 text-white rotate-90 dark:bg-slate-800"
                        : "bg-slate-900 text-white hover:bg-blue-600 hover:shadow-blue-500/30"
                )}
            >
                {/* Ping animation when closed */}
                {!isOpen && (
                    <span className="absolute inset-0 rounded-full border-2 border-blue-500 opacity-0 group-hover:animate-ping"></span>
                )}
                
                {isOpen ? (
                    <X className="h-5 w-5" />
                ) : (
                    <ShieldCheck className="h-7 w-7" />
                )}
            </motion.button>
        </div>
    );
}
