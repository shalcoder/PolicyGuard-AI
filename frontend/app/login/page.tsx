"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, ArrowRight, Activity, CheckCircle2, Terminal, Lock, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
    const { login, loginAsAuditor, user, isLoading } = useAuth() as any;
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [demoSequence, setDemoSequence] = useState(false);
    const [terminalLines, setTerminalLines] = useState<string[]>([]);

    // Auto-redirect if already logged in
    useEffect(() => {
        if (!isLoading && user) {
            router.push('/dashboard');
        }
    }, [user, isLoading, router]);

    const triggerAuditorLogin = async () => {
        setDemoSequence(true);
        // Simulate Infrastructure Sequence
        const lines = [
            "Initializing Compliance Protocol...",
            "Verifying Organizational Identity...",
            "Syncing Governance Policies...",
            "SUCCESS: Session authorized for Governance Audit."
        ];

        for (const line of lines) {
            await new Promise(r => setTimeout(r, 600)); // Delay per line
            setTerminalLines(prev => [...prev, line]);
        }

        await new Promise(r => setTimeout(r, 800)); // Final pause for wow factor

        // Start Tour
        localStorage.setItem('pg_tour_active', 'true');
        window.dispatchEvent(new CustomEvent('pg-start-tour'));

        // Login
        loginAsAuditor();
        // loginAsAuditor internal router.push will take over
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            await login(email, password);
        } catch (err: any) {
            console.error("Login Error:", err);
            const errorMessage = err.message || "Invalid email or password.";
            setError(errorMessage.replace("Firebase: ", ""));
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen font-outfit">
            {/* Demo Sequence Overlay */}
            <AnimatePresence>
                {demoSequence && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center font-mono text-green-400 p-8"
                    >
                        <div className="w-full max-w-lg space-y-4">
                            <div className="flex items-center gap-2 text-white mb-6 border-b border-white/10 pb-4">
                                <Terminal className="w-6 h-6" />
                                <span className="text-xl font-bold tracking-widest">GOVERNANCE_TERMINAL_V1.1</span>
                            </div>

                            <div className="space-y-2">
                                {terminalLines.map((line, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center gap-3"
                                    >
                                        <span className="text-green-600">➜</span>
                                        <span>{line}</span>
                                        {i === terminalLines.length - 1 && (
                                            <span className="inline-block w-2 h-4 bg-green-400 animate-pulse ml-2" />
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Left Side - Visuals */}
            <div className="hidden w-1/2 bg-slate-50 dark:bg-[#0B0F19] lg:flex flex-col justify-between p-12 relative overflow-hidden border-r border-slate-200 dark:border-white/5">
                {/* Background Gradients */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

                <div className="z-10">
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xl tracking-tight mb-8">
                        <Shield className="w-8 h-8 text-cyan-500" />
                        PolicyGuard AI
                    </div>

                    <h1 className="text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
                        AI Governance,<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-cyan-500 dark:from-cyan-400 dark:to-cyan-600">Solved.</span>
                    </h1>
                    <p className="text-slate-500 dark:text-gray-400 text-lg max-w-md">
                        The automated control plane for enterprise agents. Red Team, Remediate, and Monitor in one unified platform.
                    </p>
                </div>

                {/* Abstract Metrics Visual */}
                <div className="z-10 grid gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-4 p-4 bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-white/5 hover:bg-white dark:hover:bg-white/10 transition-colors shadow-sm"
                    >
                        <div className="p-3 bg-green-500/20 rounded-lg">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                            <h4 className="text-slate-900 dark:text-white font-medium">Compliance Audit</h4>
                            <p className="text-sm text-slate-500 dark:text-gray-500">Passed: HIPAA, GDPR, SOC2</p>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-center gap-4 p-4 bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-white/5 hover:bg-white dark:hover:bg-white/10 transition-colors shadow-sm"
                    >
                        <div className="p-3 bg-cyan-500/20 rounded-lg">
                            <Activity className="w-5 h-5 text-cyan-500" />
                        </div>
                        <div>
                            <h4 className="text-slate-900 dark:text-white font-medium">Latency Guardrails</h4>
                            <p className="text-sm text-slate-500 dark:text-gray-500">Global Avg: 84ms</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex w-full items-center justify-center lg:w-1/2 bg-white dark:bg-[#080C14] border-l border-slate-200 dark:border-white/5">
                <div className="w-full max-w-md space-y-8 px-4 sm:px-6">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Welcome back</h2>
                        <p className="text-slate-500 dark:text-gray-400">Sign in to access your compliance dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700 dark:text-gray-300">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="executive@company.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-600 focus:border-cyan-500 transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-700 dark:text-gray-300">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-cyan-500 transition-colors"
                            />
                        </div>

                        {error && (
                            <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 text-base bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Authing..." : "Sign In"}
                        </Button>
                        <div className="text-center text-sm">
                            <span className="text-slate-500 dark:text-gray-400">Don't have an account? </span>
                            <a href="/signup" className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 font-medium transition-colors">
                                Sign up
                            </a>
                        </div>
                    </form>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-[#080C14] px-2 text-slate-400 dark:text-gray-500 font-mono">For Evaluation & Compliance</span>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={triggerAuditorLogin}
                        className="w-full h-16 relative overflow-hidden group rounded-xl bg-gradient-to-r from-slate-100 to-slate-200 dark:from-cyan-900/40 dark:to-cyan-800/40 border border-slate-200 dark:border-cyan-500/30 p-1"
                    >
                        <div className="absolute inset-0 bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors"></div>
                        <div className="relative h-full flex items-center justify-between px-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-cyan-500 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                                    <Fingerprint className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">One-Click Auditor Access</h3>
                                    <p className="text-xs text-cyan-600 dark:text-cyan-300">Instant Compliance Sandbox</p>
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
