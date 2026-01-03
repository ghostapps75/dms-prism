import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const DICE_TYPES = [4, 6, 8, 10, 12, 20];

const ENCOUNTERS = [
    "Suddenly, the lights go out!",
    "A goblin falls from the ceiling!",
    "The door slams shut!",
    "You hear a growl behind you.",
    "The floor begins to shake."
];

const Toolbelt = () => {
    // Dice State
    const [rollResult, setRollResult] = useState<number | null>(null);
    const [isCrit, setIsCrit] = useState(false);
    const [lastDie, setLastDie] = useState<number | null>(null);

    // Protocol State
    const [encounter, setEncounter] = useState<string | null>(null);

    const rollDie = (sides: number) => {
        // Reset states
        setIsCrit(false);
        setRollResult(null); // brief flicker

        setTimeout(() => {
            const result = Math.floor(Math.random() * sides) + 1;
            setRollResult(result);
            setLastDie(sides);
            if (sides === 20 && result === 20) {
                setIsCrit(true);
            }
        }, 100);
    };

    const triggerProtocol = () => {
        const randomEncounter = ENCOUNTERS[Math.floor(Math.random() * ENCOUNTERS.length)];
        setEncounter(randomEncounter);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-16 pb-20">

            {/* SECTION 1: THE DICE BAG */}
            <section className="space-y-6">
                <h2 className="text-2xl text-neon-purple font-arcade mb-4 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    THE DICE BAG
                </h2>

                {/* Dice Buttons */}
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    {DICE_TYPES.map((sides) => (
                        <motion.button
                            key={sides}
                            whileHover={{ y: -4, boxShadow: "0 0 15px rgba(74, 222, 128, 0.6)" }}
                            whileTap={{ scale: 0.95, y: 0 }}
                            onClick={() => rollDie(sides)}
                            className="w-16 h-16 bg-slate-800 border-2 border-retro-green text-retro-green font-arcade text-xs rounded-lg shadow-[0_0_5px_rgba(74,222,128,0.4)] hover:bg-retro-green hover:text-slate-900 transition-colors flex items-center justify-center"
                        >
                            d{sides}
                        </motion.button>
                    ))}
                </div>

                {/* Readout Area */}
                <div className="h-40 flex flex-col items-center justify-center p-8 bg-slate-900 border-4 border-slate-700 rounded-xl relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {rollResult !== null && (
                            <motion.div
                                key={rollResult}
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1, rotate: isCrit ? [0, -10, 10, 0] : 0 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="text-center"
                            >
                                <span className={`text-6xl font-arcade block ${isCrit ? 'text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.8)]' : 'text-white'}`}>
                                    {rollResult}
                                </span>
                                {isCrit && (
                                    <motion.span
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="block text-yellow-400 font-bold tracking-widest mt-2 text-xl animate-pulse"
                                    >
                                        CRITICAL HIT!
                                    </motion.span>
                                )}
                                {!isCrit && lastDie && (
                                    <span className="text-slate-500 text-sm font-mono mt-2 block">
                                        (d{lastDie})
                                    </span>
                                )}
                            </motion.div>
                        )}
                        {rollResult === null && (
                            <span className="text-slate-600 font-mono text-sm animate-pulse">Waiting for input...</span>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* SECTION 2: THE DEMOGORGON PROTOCOL */}
            <section className="space-y-6">
                <h2 className="text-2xl text-red-500 font-arcade mb-4 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    EMERGENCY OVERRIDE
                </h2>

                <div className="flex flex-col items-center gap-8 p-8 border-2 border-dashed border-red-900/50 rounded-xl bg-red-950/10">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{ boxShadow: ["0 0 0px rgba(239,68,68,0)", "0 0 20px rgba(239,68,68,0.6)", "0 0 0px rgba(239,68,68,0)"] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        onClick={triggerProtocol}
                        className="px-10 py-6 bg-red-600 text-white font-arcade text-lg rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] border-t-2 border-t-red-400 border-b-4 border-b-red-800 active:border-b-0 active:translate-y-1"
                    >
                        INITIATE PROTOCOL
                    </motion.button>

                    {encounter && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: [-2, 2, -2, 0] }}
                            key={encounter}
                            className="w-full bg-black border-l-4 border-red-500 p-4 font-mono text-red-500 relative"
                        >
                            <div className="absolute top-2 right-2">
                                <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                            </div>
                            <p className="text-lg uppercase tracking-wider glitch-text">
                                WARNING: {encounter}
                            </p>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* SECTION 3: ARCHIVE FOOTAGE */}
            <section className="space-y-6">
                <h2 className="text-2xl text-slate-400 font-arcade mb-4">
                    TOP SECRET TAPES
                </h2>

                {/* CRT Monitor Frame */}
                <div className="bg-gray-800 p-4 rounded-xl shadow-2xl border-4 border-gray-600 relative inline-block mx-auto w-full">
                    {/* Screen Bezel */}
                    <div className="bg-black p-1 rounded-lg overflow-hidden relative shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
                        <div className="aspect-video w-full rounded relative overflow-hidden">
                            <iframe
                                width="100%"
                                height="100%"
                                src="https://www.youtube.com/embed/uEkjlRVWhwE"
                                title="D&D Trailer"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="opacity-90 contrast-125 saturate-150"
                            ></iframe>

                            {/* CRT Scanline Overlay */}
                            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]"></div>
                            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_50px_rgba(0,0,0,0.7)] z-20"></div>
                        </div>
                    </div>

                    {/* Monitor Brand */}
                    <div className="mt-2 text-center">
                        <span className="text-gray-500 font-bold font-sans text-xs tracking-[0.2em] uppercase">Sony Trinitron</span>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Toolbelt;
