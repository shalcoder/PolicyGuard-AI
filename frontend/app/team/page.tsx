"use client";

import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';
import Image from 'next/image';

export default function TeamPage() {
    const team = [
        {
            name: "Alex Rivera",
            role: "Founder & CEO",
            bio: "Ex-Google AI Researcher. Building safe AGI systems.",
            image: "https://ui-avatars.com/api/?name=Alex+Rivera&background=7C3AED&color=fff&size=200"
        },
        {
            name: "Sarah Chen",
            role: "CTO",
            bio: "Systems Architect. Expert in distributed governance.",
            image: "https://ui-avatars.com/api/?name=Sarah+Chen&background=0D9488&color=fff&size=200"
        },
        {
            name: "Marcus Johnson",
            role: "Head of Policy",
            bio: "Legal tech veteran ensuring compliance across borders.",
            image: "https://ui-avatars.com/api/?name=Marcus+Johnson&background=EA580C&color=fff&size=200"
        },
        {
            name: "Elena Rodriguez",
            role: "Lead Engineer",
            bio: "Full-stack wizard. Loves Rust and clean code.",
            image: "https://ui-avatars.com/api/?name=Elena+Rodriguez&background=DB2777&color=fff&size=200"
        }
    ];

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white pt-32 pb-20 px-6 font-sans">
            <div className="max-w-7xl mx-auto text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                    Meet the Builders
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-16">
                    We are a diverse team of engineers, researchers, and policy experts committed to making AI safe for everyone.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {team.map((member, i) => (
                        <div key={i} className="group relative p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-[#7C3AED]/50 transition-all hover:-translate-y-2 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0B0F19] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <div className="relative z-10">
                                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-6 border-4 border-white/5 group-hover:border-[#7C3AED] transition-colors shadow-xl">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                                <p className="text-[#7C3AED] font-medium text-sm mb-4">{member.role}</p>
                                <p className="text-gray-400 text-sm mb-6">{member.bio}</p>

                                <div className="flex items-center justify-center gap-4 text-gray-500">
                                    <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                                    <a href="#" className="hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
                                    <a href="#" className="hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
