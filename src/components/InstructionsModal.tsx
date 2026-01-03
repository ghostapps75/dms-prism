import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Dna, Dice5, BookOpen, Map, HelpCircle, Terminal, Skull } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface InstructionsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const InstructionsModal = ({ isOpen, onClose }: InstructionsModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Data Mapping based on Route
    const getContent = () => {
        switch (location.pathname) {
            case '/':
            default:
                return {
                    title: "MISSION PROTOCOL: DASHBOARD",
                    goal: "This is your Mission Control. Access all areas of the Hawkins Lab mainframe from here.",
                    steps: [
                        { icon: Map, text: "CAMPAIGN: Resume your story notes." },
                        { icon: Skull, text: "BESTIARY: Classified monster data." },
                        { icon: Dice5, text: "TOOLBELT: Dice & Panic Button." },
                        { icon: BookOpen, text: "ACADEMY: Training modules." }
                    ],
                    tip: "Friends don't lie... and they read the instructions."
                };
            case '/academy':
                return {
                    title: "TRAINING MODULES: ACADEMY",
                    goal: "Review confidential training material to improve your Dungeon Master capabilities.",
                    steps: [
                        { icon: BookOpen, text: "SELECT A MODULE: Click any card to open the dossier." },
                        { icon: Terminal, text: "LEARN: Absorb the tips and tricks provided." },
                        { icon: HelpCircle, text: "APPLY: Use this knowledge in your next session." }
                    ],
                    tip: "Knowledge is your weapon against the Demogorgon."
                };
            case '/bestiary':
                return {
                    title: "BIOLOGICAL ARCHIVE: BESTIARY",
                    goal: "Access and create records for entity identification and danger assessment.",
                    steps: [
                        { icon: Skull, text: "BROWSE: Review existing subject files." },
                        { icon: Dna, text: "CREATE: Use the 'Monster Lab' form below." },
                        { icon: Terminal, text: "TRACK: Monitor danger levels carefully." }
                    ],
                    tip: "Keep the laboratory secure. Do not let the specimens escape."
                };
            case '/toolbelt':
                return {
                    title: "FIELD EQUIPMENT: TOOLBELT",
                    goal: "Utilize standard-issue equipment for randomization and emergency scenarios.",
                    steps: [
                        { icon: Dice5, text: "DICE: Click a die to generate a random number." },
                        { icon: HelpCircle, text: "CRITICALS: Natural 20s trigger excitement protocols." },
                        { icon: Terminal, text: "PANIC BUTTON: Generates instant encounters." }
                    ],
                    tip: "When in doubt, roll the dice."
                };
            case '/campaign':
                return {
                    title: "OPERATIONS LOG: CAMPAIGN",
                    goal: "Maintain persistent records of mission events and personnel.",
                    steps: [
                        { icon: Terminal, text: "STORY LOG: Type session notes on the left." },
                        { icon: Dna, text: "NPCs: Track personnel on the right." },
                        { icon: HelpCircle, text: "PLOT TWISTS: Use the 'Writer's Block' button." }
                    ],
                    tip: "Data is auto-saved to local mainframe storage."
                };
        }
    };

    const content = getContent();

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                >
                    <motion.div
                        ref={modalRef}
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="w-full max-w-2xl relative bg-[#111] border-4 border-[#c90000] shadow-[0_0_30px_rgba(201,0,0,0.5)] rounded-sm overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-[#c90000] text-black font-mono font-bold p-4 flex justify-between items-center">
                            <h2 className="tracking-[0.2em] text-lg">HAWKINS LAB: SUBJECT 012</h2>
                            <button onClick={onClose} className="hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 text-[#ddd] font-mono leading-relaxed space-y-8">

                            {/* Dynamic Title/Goal */}
                            <div className="border-l-4 border-[#c90000] pl-4">
                                <strong className="text-[#c90000] text-xl block mb-2 tracking-widest">{content.title}</strong>
                                <p className="text-lg">
                                    {content.goal}
                                </p>
                            </div>

                            {/* Dynamic Steps */}
                            <div>
                                <strong className="text-[#c90000] block mb-3 tracking-widest border-b border-[#333] pb-1">OPERATIONAL GUIDE</strong>
                                <ul className="space-y-4 text-sm mt-4">
                                    {content.steps.map((step, idx) => (
                                        <li key={idx} className="flex items-center gap-3">
                                            <step.icon className="w-5 h-5 text-[#c90000]" />
                                            <span>{step.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <p className="text-center text-xs text-gray-500 italic mt-6">
                                "{content.tip}"
                            </p>
                        </div>

                        {/* Footer Button */}
                        <div className="p-6 text-center border-t border-[#c90000]/30 bg-[#1a0000]">
                            <button
                                onClick={onClose}
                                className="bg-[#c90000] text-black font-bold font-mono px-10 py-3 rounded-sm hover:bg-red-600 hover:text-white transition-all shadow-[0_0_15px_rgba(201,0,0,0.6)] active:scale-95 tracking-[0.2em]"
                            >
                                ENTER THE VOID
                            </button>
                        </div>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default InstructionsModal;