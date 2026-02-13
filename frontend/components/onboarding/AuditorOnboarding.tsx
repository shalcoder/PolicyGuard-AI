"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ChevronRight, X, Sparkles, Terminal, Shield, ArrowRight } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface TourStep {
    id: number;
    title: string;
    description: string;
    path: string;
    actionLabel: string;
    icon?: any;
    position?: "center" | "bottom-right";
}

const TOUR_STEPS: TourStep[] = [
    {
        id: 0,
        title: "Platform Overview 🛡️",
        description: "Welcome to the Compliance Sandbox. This environment is pre-configured to showcase PolicyGuard's governance capabilities. Let's begin by exploring the active policy engine.",
        path: "/dashboard",
        actionLabel: "View Policy Infrastructure",
        icon: Sparkles,
        position: "center"
    },
    {
        id: 1,
        title: "1. Semantic Policy Engine",
        description: "Observe the active 'Core Data Governance' policy. \n\n👉 ACTION: Select 'View Details' to examine the extracted semantic ruleset. \n\nOur engine transforms complex documents into executable guardrails for real-time enforcement.",
        path: "/dashboard/policies",
        actionLabel: "Explore Red Team Ops",
        icon: Shield,
        position: "bottom-right"
    },
    {
        id: 2,
        title: "2. Adversarial Governance",
        description: "Proactively secure your agents. \n\n👉 ACTION: Choose the 'Financial Services Agent' and trigger a 'Threat Simulation'. \n\nWatch the system perform deep intent analysis to identify potential bypasses and security drifts.",
        path: "/dashboard/evaluate",
        actionLabel: "Begin Auditing",
        icon: Terminal,
        position: "bottom-right"
    }
];

export function AuditorOnboarding() {
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [currentStep, setCurrentStep] = useState<number | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (user) {
            const savedStep = localStorage.getItem('auditorTourStep');
            const stepNum = savedStep ? parseInt(savedStep) : 0;
            const isCompleted = localStorage.getItem('auditorTourCompleted');

            if (!isCompleted) {
                setCurrentStep(stepNum);
                setIsVisible(true);
            }
        }
    }, [user]);

    const handleNext = () => {
        if (currentStep === null) return;
        const nextStepIndex = currentStep + 1;

        if (nextStepIndex < TOUR_STEPS.length) {
            const nextPath = TOUR_STEPS[nextStepIndex].path;
            if (nextPath && nextPath !== pathname) {
                router.push(nextPath);
            }
            setCurrentStep(nextStepIndex);
            localStorage.setItem('auditorTourStep', nextStepIndex.toString());
        } else {
            handleComplete();
        }
    };

    const handleComplete = () => {
        setIsVisible(false);
        localStorage.setItem('auditorTourCompleted', 'true');
        setCurrentStep(null);
    };

    if (!isVisible || currentStep === null) return null;

    const step = TOUR_STEPS[currentStep];
    const StepIcon = step.icon || Sparkles;
    const isCenter = step.position === "center";

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`fixed inset-0 z-[100] pointer-events-none p-6 flex ${isCenter ? 'items-center justify-center' : 'items-end justify-end'}`}
            >
                <div className={`pointer-events-auto bg-white dark:bg-zinc-900 border border-blue-500/30 shadow-2xl rounded-xl w-full max-w-md overflow-hidden ring-1 ring-blue-500/20 ${isCenter ? '' : 'mb-8 mr-4'}`}>
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white font-bold">
                            <StepIcon className="w-5 h-5 text-blue-100" />
                            <span>{step.title}</span>
                        </div>
                        <button onClick={handleComplete} className="text-white/70 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6">
                        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-sm">
                            {step.description}
                        </p>

                        <div className="flex items-center justify-between pt-2">
                            <div className="flex gap-1">
                                {TOUR_STEPS.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-6 bg-blue-600' : 'w-1.5 bg-gray-200 dark:bg-zinc-700'
                                            }`}
                                    />
                                ))}
                            </div>

                            <Button onClick={handleNext} size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
                                {step.actionLabel}
                                {currentStep === TOUR_STEPS.length - 1 ? <CheckCircle2 className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
