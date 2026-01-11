"use client"

import { PolicyUploadPanel } from '@/components/PolicyUploadPanel';

export default function PoliciesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Policy Management</h1>
                <p className="text-gray-500 dark:text-gray-400">Upload and manage organization guardrails.</p>
            </div>

            <PolicyUploadPanel />

            {/* We can add a list of existing policies here later */}
        </div>
    );
}
