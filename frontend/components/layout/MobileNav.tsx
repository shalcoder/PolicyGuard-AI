"use client"

import React, { useState } from 'react';
import { Menu, X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/layout/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="lg:hidden flex items-center justify-between p-4 border-b bg-white dark:bg-zinc-950 dark:border-zinc-800">
            <div className="flex items-center">
                <Shield className="h-6 w-6 text-blue-600 mr-2" />
                <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">PolicyGuard AI</span>
            </div>

            <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
                <Menu className="w-6 h-6" />
            </Button>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-zinc-950 shadow-xl border-r dark:border-zinc-800"
                        >
                            <div className="flex justify-end p-4 absolute top-0 right-0 z-50">
                                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Reusing Sidebar Component */}
                            <Sidebar className="w-full flex h-full pt-10" onNavigate={() => setIsOpen(false)} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
