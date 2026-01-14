"use client"

import React, { useState } from 'react';
import { GuardrailTimeline, StepStatus } from '@/components/GuardrailTimeline';
import { ReadinessScorecard, ComplianceReport } from '@/components/ReadinessScorecard';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Play, FileText as FileIcon, Shield, Activity, AlertTriangle } from 'lucide-react';

export default function EvaluatePage() {
    const [evaluationStatus, setEvaluationStatus] = useState<'idle' | 'running' | 'done'>('idle');
    const [timelineSteps, setTimelineSteps] = useState([
        { id: 'ingest', label: 'Policy Verification', status: 'pending' as StepStatus, description: 'Checking authorized governance rules...' },
        { id: 'intent', label: 'Workflow Discovery', status: 'pending' as StepStatus, description: 'Extracting semantic behavior maps' },
        { id: 'simulate', label: 'Counterfactual Modeling', status: 'pending' as StepStatus, description: 'Simulating plausible failure modes' },
        { id: 'conflict', label: 'Semantic Risk Analysis', status: 'pending' as StepStatus, description: 'Gemini reasoning on policy edge cases' },
        { id: 'verdict', label: 'Forensic Snapshot', status: 'pending' as StepStatus, description: 'Hashing immutable audit report' },
    ]);

    // Initial Policy Check
    React.useEffect(() => {
        const checkPolicies = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/v1/policies');
                if (res.ok) {
                    const policies = await res.json();
                    setTimelineSteps(prev => {
                        const newSteps = [...prev];
                        newSteps[0].description = `Ready with ${policies.length} active policies`;
                        return newSteps;
                    });
                }
            } catch (e) {
                console.error("Failed to check policies", e);
            }
        };
        checkPolicies();
    }, []);

    const [workflowData, setWorkflowData] = useState({
        intent: { purpose: '', users: '' },
        data: { types: '' },
        decision: { output: '' },
        safeguards: { controls: '' },
        deployment: { region: '', scale: '' }
    });

    const [complianceReport, setComplianceReport] = useState<ComplianceReport | null>(null);

    const loadDemoScenario = () => {
        setWorkflowData({
            intent: {
                purpose: 'Automate 24/7 mortgage inquiry desk. Agent acts as a "Financial Ally" to applicants.',
                users: 'First-time homebuyers surged by 40%.'
            },
            data: {
                types: 'Full credit reports, employment history, and internal demographic spending profiles.'
            },
            decision: {
                output: 'Smart Rate Flexing: Agent dynamically adjusts displayed interest rates based on spending patterns and zip code clusters. Authorized to commit 0.25% discounts immediately.'
            },
            safeguards: {
                controls: 'No Human Review: Agent commits discount to core banking system immediately for real-time feel.'
            },
            deployment: {
                region: 'US/Global',
                scale: 'Full autonomy for discount lifecycle.'
            }
        });
    };

    const handleRunEvaluation = async () => {
        setEvaluationStatus('running');
        setComplianceReport(null);

        // Reset Steps
        setTimelineSteps(prev => prev.map(s => ({ ...s, status: 'pending' as StepStatus })));

        // Animate first few steps visually while we fetch
        updateStepStatus(0, 'processing');

        try {
            // 1. Fetch Policies (Verify context)
            const policiesRes = await fetch('http://localhost:8000/api/v1/policies');
            const policies = await policiesRes.json();
            updateStepStatus(0, 'completed');

            // Dynamic Policy Count Update
            setTimelineSteps(prev => {
                const newSteps = [...prev];
                newSteps[0].description = `Loading ${policies.length} active policies`;
                return newSteps;
            });

            updateStepStatus(1, 'processing');

            // 2. Parse Intent (Mock delay for visual)
            await new Promise(r => setTimeout(r, 800));
            updateStepStatus(1, 'completed');
            updateStepStatus(2, 'processing');

            // 3. Simulate Traces
            await new Promise(r => setTimeout(r, 800));
            updateStepStatus(2, 'completed');
            updateStepStatus(3, 'processing');

            // 4. Call Real Evaluation API
            const evalRes = await fetch('http://localhost:8000/api/v1/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: "Workflow", description: JSON.stringify(workflowData, null, 2) })
            });

            if (!evalRes.ok) {
                const errorData = await evalRes.json();
                throw new Error(errorData.detail || "Evaluation Failed");
            }

            const result: ComplianceReport = await evalRes.json();

            updateStepStatus(3, 'completed');
            updateStepStatus(4, 'completed');
            setEvaluationStatus('done');
            setComplianceReport(result);

        } catch (error: any) {
            console.error(error);
            setEvaluationStatus('idle'); // Reset on error
            alert(error.message || "Evaluation Failed: Possible Backend Connection Error");
        }
    };

    const updateStepStatus = (index: number, status: StepStatus) => {
        setTimelineSteps(prev => {
            const newSteps = [...prev];
            if (newSteps[index]) newSteps[index].status = status;
            return newSteps;
        });
    }

    const [isAutoGenerateOn, setIsAutoGenerateOn] = useState(false);
    const [isAnalyzingDoc, setIsAnalyzingDoc] = useState(false);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsAnalyzingDoc(true);
        // Simulate AI Parsing
        setTimeout(() => {
            setWorkflowData({
                intent: {
                    purpose: 'Automated mortgage approval agent for retail banking',
                    users: 'Public applicants seeking home loans'
                },
                data: {
                    types: 'Credit scores, Income statements, Tax returns, PII (SSN, Address)'
                },
                decision: {
                    output: 'Final loan approval/rejection decision without human review'
                },
                safeguards: {
                    controls: 'None currently configured'
                },
                deployment: {
                    region: 'Global (including EU/GDPR zones)',
                    scale: 'Full public launch'
                }
            });
            setIsAnalyzingDoc(false);
        }, 1500);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {/* Demo Trigger Section */}
            <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-blue-400">
                <div className="space-y-2">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Shield className="w-6 h-6 text-blue-200" />
                        Fiduciary Shield: Financial Decision Agents
                    </h2>
                    <p className="text-sm text-blue-100 max-w-xl">
                        PolicyGuard doesn't decide what to build—<strong>it proves what you knew before you built it.</strong> A pre-deployment forensic record for high-stakes financial agents.
                    </p>
                    <div className="flex gap-2 pt-1">
                        <Badge className="bg-blue-500/50 border-blue-300 text-[10px] uppercase">Indispensable Gemini Reasoning</Badge>
                        <Badge className="bg-blue-500/50 border-blue-300 text-[10px] uppercase">Cross-Policy Contradiction Detection</Badge>
                    </div>
                </div>
                <Button
                    onClick={loadDemoScenario}
                    variant="secondary"
                    className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 h-12 rounded-xl"
                >
                    Load Dangerous Workflow
                </Button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
                <div className="flex-1">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 whitespace-nowrap">Workflow Evaluation</h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 mt-1">Test AI agents against guardrails before deployment.</p>
                </div>
                <div className="flex-shrink-0 w-full md:w-auto">
                    <Button
                        onClick={handleRunEvaluation}
                        disabled={evaluationStatus === 'running'}
                        className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-2xl h-16 px-14 text-xl font-black rounded-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4 border-b-4 border-blue-800"
                    >
                        <Play className="w-6 h-6 fill-current" />
                        {evaluationStatus === 'running' ? 'Analyzing...' : 'Start Analysis'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Input */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Workflow Specification</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Auto-generate from docs</span>
                                <Button
                                    variant={isAutoGenerateOn ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setIsAutoGenerateOn(!isAutoGenerateOn)}
                                    className={isAutoGenerateOn ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
                                >
                                    {isAutoGenerateOn ? "ON" : "OFF"}
                                </Button>
                            </div>
                        </div>

                        {/* File Upload Zone */}
                        {isAutoGenerateOn && (
                            <div className="mb-6 p-6 border-2 border-dashed border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center transition-all">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="p-3 bg-white dark:bg-zinc-800 rounded-full shadow-sm">
                                        <FileIcon className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div className="font-medium text-blue-900 dark:text-blue-200">
                                        {isAnalyzingDoc ? "AI Analysis in progress..." : "Upload PRD or Architecture Doc"}
                                    </div>
                                    {!isAnalyzingDoc && (
                                        <>
                                            <p className="text-xs text-blue-700 dark:text-blue-300 mb-2">
                                                We'll automatically extract intent, data flows, and safeguards.
                                            </p>
                                            <input
                                                type="file"
                                                className="hidden"
                                                id="doc-upload"
                                                accept=".pdf,.docx,.txt,.md"
                                                onChange={handleFileUpload}
                                            />
                                            <label htmlFor="doc-upload">
                                                <Button size="sm" variant="secondary" className="cursor-pointer" asChild>
                                                    <span>Select File</span>
                                                </Button>
                                            </label>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="space-y-6 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {/* 1. AI System Intent */}
                            <div className="space-y-4 p-4 border rounded-md bg-gray-50 dark:bg-zinc-950">
                                <h4 className="font-medium text-blue-600 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs">1</span>
                                    AI System Intent
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Purpose</Label>
                                        <input
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder="e.g. Customer support chatbot"
                                            value={workflowData.intent.purpose}
                                            onChange={(e) => setWorkflowData(prev => ({ ...prev, intent: { ...prev.intent, purpose: e.target.value } }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Target Users</Label>
                                        <input
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder="e.g. Banking customers"
                                            value={workflowData.intent.users}
                                            onChange={(e) => setWorkflowData(prev => ({ ...prev, intent: { ...prev.intent, users: e.target.value } }))}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 2. Data Interaction */}
                            <div className="space-y-4 p-4 border rounded-md bg-gray-50 dark:bg-zinc-950">
                                <h4 className="font-medium text-blue-600 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs">2</span>
                                    Data Interaction
                                </h4>
                                <div className="space-y-2">
                                    <Label>Data Types & Sensitivity</Label>
                                    <textarea
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="What data does it touch? (e.g. PII, Financial data, Health records)"
                                        value={workflowData.data.types}
                                        onChange={(e) => setWorkflowData(prev => ({ ...prev, data: { ...prev.data, types: e.target.value } }))}
                                    />
                                </div>
                            </div>

                            {/* 3. Decision & Output */}
                            <div className="space-y-4 p-4 border rounded-md bg-gray-50 dark:bg-zinc-950">
                                <h4 className="font-medium text-blue-600 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs">3</span>
                                    Decision & Output Behavior
                                </h4>
                                <div className="space-y-2">
                                    <Label>Output Type & Impact</Label>
                                    <textarea
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="What does it output? (e.g. Financial advice, Loan approval decision)"
                                        value={workflowData.decision.output}
                                        onChange={(e) => setWorkflowData(prev => ({ ...prev, decision: { ...prev.decision, output: e.target.value } }))}
                                    />
                                </div>
                            </div>

                            {/* 4. Safeguards */}
                            <div className="space-y-4 p-4 border rounded-md bg-gray-50 dark:bg-zinc-950">
                                <h4 className="font-medium text-blue-600 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs">4</span>
                                    Existing Safeguards
                                </h4>
                                <div className="space-y-2">
                                    <Label>Controls</Label>
                                    <input
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="e.g. Content filtering, Human-in-the-loop"
                                        value={workflowData.safeguards.controls}
                                        onChange={(e) => setWorkflowData(prev => ({ ...prev, safeguards: { ...prev.safeguards, controls: e.target.value } }))}
                                    />
                                </div>
                            </div>

                            {/* 5. Deployment Environment */}
                            <div className="space-y-4 p-4 border rounded-md bg-gray-50 dark:bg-zinc-950">
                                <h4 className="font-medium text-blue-600 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs">5</span>
                                    Deployment Context
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Region</Label>
                                        <input
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder="e.g. EU, India, Global"
                                            value={workflowData.deployment.region}
                                            onChange={(e) => setWorkflowData(prev => ({ ...prev, deployment: { ...prev.deployment, region: e.target.value } }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Scale</Label>
                                        <input
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder="e.g. Internal pilot, Public beta"
                                            value={workflowData.deployment.scale}
                                            onChange={(e) => setWorkflowData(prev => ({ ...prev, deployment: { ...prev.deployment, scale: e.target.value } }))}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {evaluationStatus === 'done' && complianceReport && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <ReadinessScorecard report={complianceReport} />
                        </div>
                    )}
                </div>

                {/* Right: Timeline */}
                <div className="lg:col-span-1">
                    <GuardrailTimeline steps={timelineSteps} />
                </div>
            </div>
        </div>
    );
}
