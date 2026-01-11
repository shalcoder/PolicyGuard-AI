import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/components/ui/card';

interface ComponentScore {
    name: string;
    status: 'pass' | 'fail' | 'warn';
    details: string;
}

interface ReadinessScorecardProps {
    overallStatus: 'ready' | 'blocked' | 'review';
    components: ComponentScore[];
}

export function ReadinessScorecard({ overallStatus, components }: ReadinessScorecardProps) {
    const statusColor =
        overallStatus === 'ready' ? 'text-green-500 bg-green-500/10 border-green-200' :
            overallStatus === 'blocked' ? 'text-red-500 bg-red-500/10 border-red-200' :
                'text-amber-500 bg-amber-500/10 border-amber-200';

    const StatusIcon =
        overallStatus === 'ready' ? CheckCircle :
            overallStatus === 'blocked' ? XCircle :
                AlertTriangle;

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Deployment Readiness Scorecard</span>
                    <div className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 border", statusColor)}>
                        <StatusIcon className="w-4 h-4" />
                        {overallStatus}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {components.map((comp, idx) => (
                        <div key={idx} className="flex items-start justify-between p-3 rounded-lg bg-gray-50 dark:bg-zinc-900">
                            <div className="flex gap-3">
                                {comp.status === 'pass' && <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />}
                                {comp.status === 'fail' && <XCircle className="w-5 h-5 text-red-500 mt-0.5" />}
                                {comp.status === 'warn' && <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />}

                                <div>
                                    <p className="font-medium text-sm">{comp.name}</p>
                                    <p className="text-xs text-gray-500">{comp.details}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
