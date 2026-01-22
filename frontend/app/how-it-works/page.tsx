"use client";

import React from 'react';
import { Network, Search, ShieldCheck, Zap } from 'lucide-react';

export default function HowItWorksPage() {
    const steps = [
        {
            id: "01",
            title: "Connect Your Agent",
            desc: "Use our SDK or API proxy to route your agent's LLM calls through PolicyGuard. We support OpenAI, Anthropic, and custom models.",
            icon: Network
        },
        {
            id: "02",
            title: "Define Policies",
            desc: "Upload your corporate policies (PDF, Docx) or choose from our library of standard guardrails (GDPR, HIPAA, SOC2).",
            icon: Search
        },
        {
            id: "03",
            title: "Real-time Monitoring",
            desc: "Our engine analyzes every prompt and response in <100ms. We detect PII, toxicity, and policy violations instantly.",
            icon: Zap
        },
        {
            id: "04",
            title: "Automated Governance",
            desc: "If a violation is found, we automatically redact sensitive data, block the request, or alert your team based on your settings.",
            icon: ShieldCheck
        }
    ];

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white pt-32 pb-20 px-6 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                        How PolicyGuard Works
                    </h1>
                    <p className="text-xl text-gray-400">
                        A seamless layer of trust between your AI agents and the real world.
                    </p>
                </div>

                <div className="space-y-12 relative">
                    {/* Connecting Line */}
                    <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#7C3AED] to-transparent hidden md:block" />

                    {steps.map((step, i) => (
                        <div key={i} className="relative flex flex-col md:flex-row gap-8 md:items-start pl-0 md:pl-0">
                            <div className="hidden md:flex flex-col items-center z-10">
                                <div className="w-14 h-14 rounded-full bg-[#0B0F19] border-2 border-[#7C3AED] flex items-center justify-center text-[#7C3AED] font-bold text-lg shadow-[0_0_20px_rgba(124,58,237,0.3)]">
                                    {step.id}
                                </div>
                            </div>

                            <div className="flex-1 p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#7C3AED]/30 transition-all">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center text-[#7C3AED] md:hidden">
                                        <span className="font-bold">{step.id}</span>
                                    </div>
                                    <step.icon className="w-8 h-8 text-[#A78BFA]" />
                                    <h3 className="text-2xl font-bold">{step.title}</h3>
                                </div>
                                <p className="text-gray-400 leading-relaxed text-lg">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
