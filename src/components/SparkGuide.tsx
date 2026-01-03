import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TIPS = [
    "DM Tip: Use funny voices!",
    "Rule #1: Have fun!",
    "Don't panic if they go off-script.",
    "Reward creativity with Inspiration!",
    "Fudge the dice if it makes the story better.",
    "Describe the smells and sounds, not just the sights."
];

const SparkGuide = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentTip, setCurrentTip] = useState(TIPS[0]);

    const toggleBubble = () => {
        if (!isOpen) {
            // Pick a random tip when opening, but try to avoid the same one twice in a row if possible (optional simple random for now)
            const randomTip = TIPS[Math.floor(Math.random() * TIPS.length)];
            setCurrentTip(randomTip);
        }
        setIsOpen(!isOpen);
    };

    return (
        <div className="fixed bottom-8 right-8 z-50 flex items-end flex-col-reverse gap-4">

            {/* Dragon Avatar Button */}
            <motion.button
                onClick={toggleBubble}
                className="relative group cursor-pointer outline-none"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{ y: [0, -10, 0] }}
                transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut"
                }}
            >
                {/* "Pixel Dragon" CSS Placeholder */}
                <div className="w-16 h-16 bg-red-500 border-4 border-yellow-400 shadow-[0_0_15px_rgba(239,68,68,0.6)] relative overflow-hidden retro-pixel-corners">
                    {/* Eyes */}
                    <div className="absolute top-4 left-3 w-3 h-3 bg-white"></div>
                    <div className="absolute top-4 right-3 w-3 h-3 bg-white"></div>
                    {/* Pupils */}
                    <div className="absolute top-5 left-4 w-1 h-1 bg-black"></div>
                    <div className="absolute top-5 right-4 w-1 h-1 bg-black"></div>
                    {/* Snout */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-4 bg-red-700"></div>
                </div>

                {/* Name Tag */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-[10px] uppercase text-yellow-400 font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Spark
                </div>
            </motion.button>

            {/* Speech Bubble */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        className="relative bg-white text-slate-900 p-4 rounded-lg shadow-xl max-w-xs border-4 border-slate-900 mb-2"
                    >
                        {/* Bubble Triangle */}
                        <div className="absolute -bottom-3 right-6 w-0 h-0 border-l-[10px] border-l-transparent border-t-[10px] border-t-slate-900 border-r-[10px] border-r-transparent"></div>
                        <div className="absolute -bottom-[7px] right-6 w-0 h-0 border-l-[6px] border-l-transparent border-t-[7px] border-t-white border-r-[6px] border-r-transparent"></div>

                        <h4 className="font-bold text-xs uppercase text-neon-purple mb-1 font-sans">Spark says:</h4>
                        <p className="font-mono text-sm leading-relaxed">
                            {currentTip}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SparkGuide;
