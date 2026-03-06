"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Sparkles, X, ChevronRight, Zap, Target, 
    GitPullRequest, Cpu, ShieldCheck, Database, Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const EnterpriseUpdateNotification = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const hasSeenUpdate = localStorage.getItem('pg_v2_update_seen');
        if (!hasSeenUpdate) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const dismiss = () => {
        setIsVisible(false);
        localStorage.setItem('pg_v2_update_seen', 'true');
    };

    const features = [
        { icon: Bot, label: "Dual-Mode Agentic Chatbot", color: "text-indigo-400" },
        { icon: Database, label: "GraphRAG Policy Cognition", color: "text-blue-400" },
        { icon: Target, label: "MITRE ATLAS Threat Mapping", color: "text-red-400" },
        { icon: Cpu, label: "LangGraph Closed-Loop Eval", color: "text-purple-400" },
        { icon: GitPullRequest, label: "Auto GitHub PR Synthesis", color: "text-emerald-400" },
        { icon: ShieldCheck, label: "CI/CD Policy Gate v1.0", color: "text-cyan-400" },
        { icon: Zap, label: "Unstructured.io Intelligence", color: "text-amber-400" },
    ];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative z-50 mb-8 overflow-hidden rounded-[2rem] border border-cyan-500/30 bg-slate-900/80 p-8 text-white backdrop-blur-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)]"
                >
                    {/* Background Glows */}
                    <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-cyan-600/10 blur-[100px]" />
                    <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-purple-600/10 blur-[100px]" />

                    <div className="relative flex flex-col md:flex-row items-center gap-8">
                        {/* Title Section */}
                        <div className="flex-1 space-y-4">
                            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-cyan-400">
                                <Sparkles className="h-3 w-3" />
                                Protocol Update V2.0 Live
                            </div>
                            <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">
                                <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Enterprise Upgrade V2.0</span>
                            </h2>
                            <p className="max-w-xl text-xs font-bold uppercase tracking-[0.1em] text-cyan-500/80">
                                7 Major Security Protocols Deployed:
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 pt-1">
                                {features.map((f, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="h-1 w-1 rounded-full bg-cyan-500 shadow-[0_0_5px_rgba(6,182,212,1)]" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{f.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Button Section */}
                        <div className="flex flex-col gap-3 shrink-0 sm:flex-row md:flex-col lg:flex-row">
                            <Button 
                                className="h-12 bg-cyan-600 px-8 font-black uppercase tracking-widest text-[11px] hover:bg-cyan-500 rounded-xl"
                                onClick={dismiss}
                            >
                                Experience the Future <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button 
                                variant="outline"
                                className="h-12 border-slate-700 bg-transparent px-8 font-black uppercase tracking-widest text-[11px] text-slate-300 hover:bg-white/5 rounded-xl"
                                onClick={() => window.open('https://github.com/shalcoder/PolicyGuard-AI', '_blank')}
                            >
                                View Changelog
                            </Button>
                        </div>

                        {/* Close Button */}
                        <button 
                            onClick={dismiss}
                            className="absolute -top-4 -right-4 p-2 text-slate-500 hover:text-white transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Scan-line animation overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-1/2 animate-scanline" />
                </motion.div>
            )}
        </AnimatePresence>
    );
};
