"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, ShieldAlert, CheckCircle, Search } from "lucide-react"

interface Trace {
    id: string;
    timestamp: string;
    agent: string;
    action: string;
    status: 'pass' | 'block' | 'warn';
    details: string;
}

export default function MonitorPage() {
    const [traces, setTraces] = useState<Trace[]>([
        { id: 'T-1024', timestamp: '10:42:05', agent: 'HR-Helper-01', action: 'Query Employee DB', status: 'pass', details: 'Access compliant with HR-001' },
        { id: 'T-1023', timestamp: '10:41:58', agent: 'Finance-Bot-Pro', action: 'Export Q3 Data', status: 'block', details: 'Violation: PII in unencrypted export' },
        { id: 'T-1022', timestamp: '10:41:12', agent: 'Support-AI', action: 'Refund Process', status: 'pass', details: 'Within authorized limits' },
    ]);

    // Simulate live feed
    useEffect(() => {
        const interval = setInterval(() => {
            const actions = [
                { agent: 'HR-Helper-01', action: 'Update Record', type: 'pass', detail: 'Authorized update' },
                { agent: 'Sales-GPT', action: 'Generate Contract', type: 'warn', detail: 'Manual review suggested' },
                { agent: 'Dev-Ops-Bot', action: 'Deploy to Prod', type: 'block', detail: 'Change freeze in effect' },
                { agent: 'Legal-Eagle', action: 'Review NDA', type: 'pass', detail: 'Standard template used' },
            ];

            const randomAction = actions[Math.floor(Math.random() * actions.length)];
            const newTrace: Trace = {
                id: `T-${Math.floor(Math.random() * 10000)}`,
                timestamp: new Date().toLocaleTimeString(),
                agent: randomAction.agent,
                action: randomAction.action,
                status: randomAction.type as any,
                details: randomAction.detail
            };

            setTraces(prev => [newTrace, ...prev].slice(0, 10)); // Keep last 10
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Continuous Compliance Monitor</h1>
                    <p className="text-gray-500">Real-time auditing of post-deployment agent activity.</p>
                </div>
                <Badge variant="outline" className="animate-pulse border-green-500 text-green-500 bg-green-500/10">
                    <Activity className="w-3 h-3 mr-1" /> Live Feed
                </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Live Traces / Min</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">142</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Blocking Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">1.2%</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Active Policies</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">14</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Audit Log Stream</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-zinc-800 dark:text-gray-400">
                                <tr>
                                    <th className="px-6 py-3">Timestamp</th>
                                    <th className="px-6 py-3">Trace ID</th>
                                    <th className="px-6 py-3">Agent</th>
                                    <th className="px-6 py-3">Action</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                                {traces.map((trace) => (
                                    <tr key={trace.id} className="bg-white dark:bg-zinc-950 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors animate-in fade-in slide-in-from-top-2 duration-300">
                                        <td className="px-6 py-4 font-mono text-gray-500">{trace.timestamp}</td>
                                        <td className="px-6 py-4 font-medium">{trace.id}</td>
                                        <td className="px-6 py-4">{trace.agent}</td>
                                        <td className="px-6 py-4">{trace.action}</td>
                                        <td className="px-6 py-4">
                                            {trace.status === 'pass' && <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">PASS</Badge>}
                                            {trace.status === 'block' && <Badge variant="destructive">BLOCKED</Badge>}
                                            {trace.status === 'warn' && <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">WARN</Badge>}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 truncate max-w-xs">{trace.details}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
