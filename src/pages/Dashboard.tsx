import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Skull, Dices } from 'lucide-react';

const Dashboard = () => {
    const headlineText = "HELLO, DUNGEON MASTER CASEY.";

    // Typing animation variants
    const sentence = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                delay: 0.5,
                staggerChildren: 0.1,
            },
        },
    };

    const letter = {
        hidden: { opacity: 0, display: "none" },
        visible: {
            opacity: 1,
            display: "inline-block", // Important for cursor effect
        },
    };

    return (
        <motion.div
            className="min-h-full flex flex-col justify-between"
            animate={{
                backgroundColor: ["rgba(15, 23, 42, 1)", "rgba(18, 26, 48, 1)", "rgba(15, 23, 42, 1)"],
            }}
            transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        >
            {/* 1. HERO SECTION */}
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 mt-10">

                {/* Typing Headline */}
                <motion.h1
                    className="text-4xl md:text-5xl lg:text-6xl text-neon-purple font-arcade leading-tight drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] max-w-4xl"
                    variants={sentence}
                    initial="hidden"
                    animate="visible"
                >
                    {headlineText.split("").map((char, index) => (
                        <motion.span key={char + "-" + index} variants={letter}>
                            {char === " " ? "\u00A0" : char}
                        </motion.span>
                    ))}
                    {/* Blinking Cursor */}
                    <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="inline-block w-4 h-8 md:w-6 md:h-12 bg-retro-green ml-2 align-middle -mt-2"
                    />
                </motion.h1>

                {/* Subtext */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3.5, duration: 1 }}
                    className="text-xl md:text-2xl text-slate-400 font-mono"
                >
                    The gate to the <span className="text-red-500 font-bold">Upside Down</span> is open. Your players are waiting.
                </motion.p>

            </div>

            {/* 2. QUICK ACCESS GRID */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 4, duration: 0.8 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full px-4 mb-20"
            >
                {/* Card 1: Resume Campaign */}
                <Link to="/campaign" className="group">
                    <div className="bg-slate-800 border-4 border-slate-700 hover:border-retro-green rounded-xl p-8 flex flex-col items-center gap-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(74,222,128,0.3)]">
                        <div className="bg-slate-900 p-4 rounded-full border-2 border-slate-600 group-hover:border-retro-green group-hover:text-retro-green transition-colors text-slate-400">
                            <BookOpen className="w-10 h-10" />
                        </div>
                        <h3 className="font-arcade text-lg text-white group-hover:text-retro-green">RESUME CAMPAIGN</h3>
                    </div>
                </Link>

                {/* Card 2: Open Bestiary */}
                <Link to="/bestiary" className="group">
                    <div className="bg-slate-800 border-4 border-slate-700 hover:border-neon-purple rounded-xl p-8 flex flex-col items-center gap-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(217,70,239,0.3)]">
                        <div className="bg-slate-900 p-4 rounded-full border-2 border-slate-600 group-hover:border-neon-purple group-hover:text-neon-purple transition-colors text-slate-400">
                            <Skull className="w-10 h-10" />
                        </div>
                        <h3 className="font-arcade text-lg text-white group-hover:text-neon-purple">OPEN BESTIARY</h3>
                    </div>
                </Link>

                {/* Card 3: Dice & Tools */}
                <Link to="/toolbelt" className="group">
                    <div className="bg-slate-800 border-4 border-slate-700 hover:border-yellow-400 rounded-xl p-8 flex flex-col items-center gap-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(250,204,21,0.3)]">
                        <div className="bg-slate-900 p-4 rounded-full border-2 border-slate-600 group-hover:border-yellow-400 group-hover:text-yellow-400 transition-colors text-slate-400">
                            <Dices className="w-10 h-10" />
                        </div>
                        <h3 className="font-arcade text-lg text-white group-hover:text-yellow-400">DICE & TOOLS</h3>
                    </div>
                </Link>
            </motion.div>

            {/* 3. FOOTER */}
            <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 5, duration: 1 }}
                className="text-center py-6 border-t border-slate-800/50"
            >
                <p className="text-xs text-slate-600 font-mono tracking-wider">
                    System Version 1.0 // Built with <span className="text-red-500">❤️</span> by Dad // Authorized by The Hellfire Club
                </p>
            </motion.footer>

        </motion.div>
    );
};

export default Dashboard;
