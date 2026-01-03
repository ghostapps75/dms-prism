import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ACADEMY_CONTENT } from '../data/academyContent'; // Ensure this path is correct

const Academy = () => {
    const [activeTab, setActiveTab] = useState(ACADEMY_CONTENT[0].id);

    return (
        <div className="h-full flex flex-col gap-6">
            <header className="flex-none">
                <h1 className="text-4xl text-retro-green font-arcade drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-2">
                    TRAINING MODULES
                </h1>
                <p className="text-slate-400 font-mono">
                    // CONFIDENTIAL: FOR OVERSEER EYES ONLY
                </p>
            </header>

            {/* TAB NAVIGATION */}
            <div className="flex flex-wrap gap-2 border-b-2 border-slate-700 pb-1">
                {ACADEMY_CONTENT.map((module) => {
                    const isActive = activeTab === module.id;
                    const Icon = module.icon;
                    return (
                        <button
                            key={module.id}
                            onClick={() => setActiveTab(module.id)}
                            className={`
                                flex items-center gap-2 px-4 py-3 rounded-t-lg font-mono text-sm font-bold transition-all
                                ${isActive
                                    ? 'bg-slate-800 text-neon-purple border-t-2 border-x-2 border-neon-purple translate-y-[2px] z-10'
                                    : 'bg-slate-900 text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                                }
                            `}
                        >
                            <Icon className="w-4 h-4" />
                            {module.title}
                        </button>
                    );
                })}
            </div>

            {/* TAB CONTENT (DOSSIER) */}
            <div className="flex-1 bg-slate-800 border-2 border-neon-purple rounded-b-lg rounded-tr-lg p-6 overflow-y-auto shadow-[0_0_20px_rgba(217,70,239,0.1)] relative">
                {/* Decorative background grid */}
                <div className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#d946ef 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>

                <AnimatePresence mode="wait">
                    {ACADEMY_CONTENT.map((module) => (
                        module.id === activeTab && (
                            <motion.div
                                key={module.id}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="relative z-10 max-w-4xl mx-auto"
                            >
                                <div className="mb-6 border-b border-slate-600 pb-4">
                                    <h2 className="text-2xl text-white font-arcade mb-2">{module.title}</h2>
                                    <p className="text-retro-green font-mono text-sm uppercase tracking-widest">
                                        SUBJECT: {module.description}
                                    </p>
                                </div>

                                <div className="prose prose-invert prose-p:font-mono prose-headings:font-arcade prose-headings:text-yellow-400 prose-strong:text-retro-green prose-li:text-slate-300 max-w-none">
                                    {module.content.split('\n').map((line, i) => {
                                        const trimmed = line.trim();
                                        if (trimmed.startsWith('###')) return <h3 key={i} className="text-xl text-yellow-400 mt-6 mb-3 border-l-4 border-yellow-400 pl-3">{trimmed.replace('###', '').trim()}</h3>;
                                        if (trimmed.startsWith('-') || trimmed.startsWith('*')) return <li key={i} className="ml-4 list-disc text-slate-300 mb-1 pl-2 marker:text-retro-green">{trimmed.replace(/^[-*]\s*/, '')}</li>;
                                        if (/^\d+\./.test(trimmed)) return <div key={i} className="mb-2 font-bold text-slate-200 mt-2">{line}</div>;
                                        if (trimmed === '') return <br key={i} />;
                                        return <p key={i} className="mb-2 leading-relaxed text-slate-300 font-mono">{line}</p>;
                                    })}
                                </div>
                            </motion.div>
                        )
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Academy;
