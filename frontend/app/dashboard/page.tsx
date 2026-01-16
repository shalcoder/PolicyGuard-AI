"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, CheckCircle, ShieldAlert, FileText, TrendingUp, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

interface DashboardStats {
    traces_analyzed: number;
    violations: number;
    active_policies: number;
    system_health: number;
    recent_evaluations: Array<{
        workflow_name: string;
        verdict: "PASS" | "FAIL";
        timestamp: string;
    }>;
    risk_distribution?: Array<{ name: string; value: number; }>;
    compliance_trend?: Array<{ date: string; score: number; }>;
}

const COLORS = ['#ef4444', '#f59e0b', '#22c55e']; // Red (High), Amber (Medium), Green (Low)

export default function OverviewPage() {
    const [stats, setStats] = useState<DashboardStats>({
        traces_analyzed: 0,
        violations: 0,
        active_policies: 1, // Start with 1 to avoid /0 visual glitches if loading
        system_health: 100,
        recent_evaluations: [],
        risk_distribution: [
            { name: "High", value: 0 },
            { name: "Medium", value: 0 },
            { name: "Low", value: 1 }
        ],
        compliance_trend: []
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('http://127.0.0.1:8000/api/v1/dashboard/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 5000); // 5s poll for demo feel
        return () => clearInterval(interval);
    }, []);

    const getRelativeTime = (isoString: string) => {
        const date = new Date(isoString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">CISO Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Real-time compliance posture and risk analytics.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-sm border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Traces Analyzed</CardTitle>
                        <Activity className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.traces_analyzed.toLocaleString()}</div>
                        <p className="text-xs text-gray-500">Total AI workflow evaluations</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-l-4 border-l-red-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Critical Violations</CardTitle>
                        <ShieldAlert className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats.violations}</div>
                        <p className="text-xs text-gray-500">Blocked high-risk deployments</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
                        <FileText className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.active_policies}</div>
                        <p className="text-xs text-gray-500">Enforced across all agents</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.system_health}%</div>
                        <p className="text-xs text-gray-500">Overall hygiene rating</p>
                    </CardContent>
                </Card>
            </div>

            {/* Chart Section */}
            <div className="grid gap-4 md:grid-cols-7">
                {/* Trend Chart (4 cols) */}
                <Card className="col-span-4 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
                            Use Compliance Trend (7 Days)
                        </CardTitle>
                        <CardDescription>Historical compliance score analysis</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.compliance_trend}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                    <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Risk Distribution Chart (3 cols) */}
                <Card className="col-span-3 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
                            Risk Distribution
                        </CardTitle>
                        <CardDescription>Breakdown of detected issues</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.risk_distribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {stats.risk_distribution?.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card className="col-span-4 shadow-sm">
                <CardHeader>
                    <CardTitle>Recent Evaluations</CardTitle>
                    <CardDescription>Latest audit logs from the AI Gatekeeper</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {stats.recent_evaluations.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 bg-gray-50 dark:bg-zinc-900 rounded-lg border border-dashed border-gray-200">
                                No evaluations yet. Run an audit to populate this feed.
                            </div>
                        ) : (
                            stats.recent_evaluations.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white border border-gray-100 dark:bg-zinc-900 dark:border-zinc-800 rounded-lg hover:shadow-md transition-shadow">
                                    <div className="flex items-center">
                                        <div className={`h-2 w-2 rounded-full mr-3 ${item.verdict === 'PASS' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-gray-100">{item.workflow_name}</p>
                                            <p className="text-xs text-gray-500">{getRelativeTime(item.timestamp)}</p>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${item.verdict === 'PASS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {item.verdict}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
