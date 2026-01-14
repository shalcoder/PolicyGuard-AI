"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Shield, Activity, Settings, FileText, ChevronRight, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/context/UserContext';

const navItems = [
    { name: 'Overview', href: '/dashboard', icon: Home },
    { name: 'Policy Manager', href: '/dashboard/policies', icon: FileText },
    { name: 'Evaluation', href: '/dashboard/evaluate', icon: Activity },
    { name: 'Monitor', href: '/dashboard/monitor', icon: BarChart3 },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const { profile } = useUser();

    return (
        <div className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex h-16 items-center px-6 border-b border-gray-100 dark:border-zinc-800">
                <Shield className="h-6 w-6 text-blue-600 mr-2" />
                <span className="text-lg font-bold tracking-tight">PolicyGuard AI</span>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                                    isActive
                                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-zinc-900 dark:hover:text-gray-300"
                                )}
                            >
                                <Icon
                                    className={cn(
                                        "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                                        isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 group-hover:text-gray-500"
                                    )}
                                />
                                {item.name}
                                {isActive && <ChevronRight className="ml-auto h-4 w-4 text-blue-400" />}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="border-t border-gray-100 p-4 dark:border-zinc-800">
                <Link href="/dashboard/profile" className="flex items-center hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-md p-2 transition-colors">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500"></div>
                    <div className="ml-3">
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{profile.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">{profile.jobTitle}</p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
