import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Trash2, UserPlus, Lightbulb } from 'lucide-react';

interface NPC {
    id: string;
    name: string;
    trait: string;
}

const PLOT_TWISTS = [
    "Suddenly, a secret door opens!",
    "The item they are holding is cursed!",
    "It starts raining acid.",
    "Gravity reverses for 10 seconds.",
    "A long-dead relative appears.",
    "The treasure turns into a mimic.",
    "They realize they are being watched."
];

const Campaign = () => {
    // STATE
    const [sessionLog, setSessionLog] = useState('');
    const [npcs, setNpcs] = useState<NPC[]>([]);

    // NPC Form State
    const [npcName, setNpcName] = useState('');
    const [npcTrait, setNpcTrait] = useState('');

    // Plot Twist State
    const [twistMessage, setTwistMessage] = useState<string | null>(null);

    // --- PERSISTENCE ---

    // Load data on mount
    useEffect(() => {
        const savedLog = localStorage.getItem('dm_story_log');
        const savedNpcs = localStorage.getItem('dm_npc_list');

        if (savedLog) setSessionLog(savedLog);
        if (savedNpcs) setNpcs(JSON.parse(savedNpcs));
    }, []);

    // Save Log on change
    useEffect(() => {
        localStorage.setItem('dm_story_log', sessionLog);
    }, [sessionLog]);

    // Save NPCs on change
    useEffect(() => {
        localStorage.setItem('dm_npc_list', JSON.stringify(npcs));
    }, [npcs]);


    // --- HANDLERS ---

    const handleAddNPC = (e: React.FormEvent) => {
        e.preventDefault();
        if (!npcName) return;

        const newNPC = {
            id: Date.now().toString(),
            name: npcName,
            trait: npcTrait
        };

        setNpcs([...npcs, newNPC]);
        setNpcName('');
        setNpcTrait('');
    };

    const handleDeleteNPC = (id: string) => {
        setNpcs(npcs.filter(n => n.id !== id));
    };

    const generateTwist = () => {
        const randomTwist = PLOT_TWISTS[Math.floor(Math.random() * PLOT_TWISTS.length)];
        setTwistMessage(randomTwist);
        // Clear after 4 seconds
        setTimeout(() => setTwistMessage(null), 4000);
    };

    return (
        <div className="h-full flex flex-col md:flex-row gap-6 pb-20 relative">

            {/* LEFT COLUMN: THE STORY BIBLE (60%) */}
            <div className="md:w-3/5 flex flex-col gap-4">
                <div className="flex justify-between items-end">
                    <h2 className="text-2xl text-retro-green font-arcade drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                        CURRENT SESSION LOG
                    </h2>
                    <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                        <Save className="w-3 h-3" /> AUTO-SAVING
                    </span>
                </div>

                <div className="flex-1 relative bg-slate-900 border-4 border-slate-700 rounded-lg shadow-inner overflow-hidden">
                    {/* Lined Paper Lines CSS */}
                    <div className="absolute inset-0 pointer-events-none opacity-10"
                        style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #4ade80 32px)' }}>
                    </div>

                    <textarea
                        value={sessionLog}
                        onChange={(e) => setSessionLog(e.target.value)}
                        className="w-full h-full bg-transparent p-6 text-retro-green font-mono text-lg leading-8 focus:outline-none resize-none placeholder-slate-700"
                        placeholder="The adventure begins..."
                        spellCheck={false}
                    />
                </div>
            </div>


            {/* RIGHT COLUMN: DRAMATIS PERSONAE (40%) */}
            <div className="md:w-2/5 flex flex-col gap-4">
                <h2 className="text-2xl text-neon-purple font-arcade drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    DRAMATIS PERSONAE
                </h2>

                {/* NPC List */}
                <div className="flex-1 bg-slate-800/50 rounded-lg border-2 border-slate-700 p-4 space-y-4 overflow-y-auto max-h-[60vh] md:max-h-full">
                    <AnimatePresence>
                        {npcs.length === 0 && (
                            <p className="text-slate-500 text-center italic mt-10">No NPCs recorded yet.</p>
                        )}
                        {npcs.map((npc) => (
                            <motion.div
                                key={npc.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="bg-slate-900 border border-slate-600 p-3 rounded flex justify-between items-center group hover:border-neon-purple transition-colors"
                            >
                                <div>
                                    <div className="font-bold text-slate-200">{npc.name}</div>
                                    {npc.trait && (
                                        <div className="text-xs text-slate-400 italic">"{npc.trait}"</div>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleDeleteNPC(npc.id)}
                                    className="text-slate-600 hover:text-red-500 transition-colors p-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Add NPC Form */}
                <form onSubmit={handleAddNPC} className="bg-slate-900 p-4 rounded-lg border-t-4 border-neon-purple">
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Name (e.g. Gonzo)"
                            className="w-full bg-slate-800 border-none rounded px-3 py-2 text-sm text-white focus:ring-1 focus:ring-neon-purple"
                            value={npcName}
                            onChange={(e) => setNpcName(e.target.value)}
                        />
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Voice/Trait"
                                className="flex-1 bg-slate-800 border-none rounded px-3 py-2 text-sm text-white focus:ring-1 focus:ring-neon-purple"
                                value={npcTrait}
                                onChange={(e) => setNpcTrait(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={!npcName}
                                className="bg-neon-purple text-white px-3 py-2 rounded hover:bg-fuchsia-400 disabled:opacity-50"
                            >
                                <UserPlus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* PLOT TWIST BUTTON */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={generateTwist}
                className="fixed bottom-8 left-72 z-40 bg-yellow-400 text-slate-900 px-4 py-2 rounded-full font-bold shadow-lg border-2 border-white flex items-center gap-2 font-arcade text-xs"
            >
                <Lightbulb className="w-4 h-4" /> WRITER'S BLOCK?
            </motion.button>

            {/* PLOT TWIST TOAST */}
            <AnimatePresence>
                {twistMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: 50, x: "-50%" }}
                        className="fixed bottom-24 left-1/2 z-50 bg-slate-900 text-yellow-400 border-4 border-yellow-400 px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(250,204,21,0.5)] font-mono text-center max-w-lg"
                    >
                        <h3 className="font-arcade text-xs uppercase mb-2 text-white">Sudden Twist!</h3>
                        <p className="text-lg font-bold">{twistMessage}</p>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default Campaign;
