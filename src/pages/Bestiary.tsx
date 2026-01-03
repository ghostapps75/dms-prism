import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import CreateSpecimenForm from '../components/CreateSpecimenForm';

interface Specimen {
    id: string;
    name: string;
    type: string;
    description: string;
    imageUrl: string;
    dateCreated: string;
}

const PRELOADED_SPECIMENS: Specimen[] = [
    {
        id: 'demogorgon',
        name: 'The Demogorgon',
        type: 'Abomination',
        description: 'A tall, thin humanoid creature with elongated limbs and no face, just a petal-like mouth lined with teeth.',
        imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent('demogorgon monster stranger things dark')}?width=768&height=768&seed=11&model=flux&nologo=true`,
        dateCreated: '11/06/1983'
    },
    {
        id: 'mindflayer',
        name: 'The Mind Flayer',
        type: 'Psionic Entity',
        description: 'A massive, spider-like shadow monster that controls the hive mind of the Upside Down.',
        imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent('mind flayer shadow spider stranger things red sky')}?width=768&height=768&seed=84&model=flux&nologo=true`,
        dateCreated: '10/31/1984'
    }
];

const Bestiary = () => {
    const [specimens, setSpecimens] = useState<Specimen[]>([]);
    const [selectedSpecimen, setSelectedSpecimen] = useState<Specimen | null>(null);

    // Load Data & Migrate Old URLs
    useEffect(() => {
        const saved = localStorage.getItem('dm_bestiary_collection');
        let initialData = PRELOADED_SPECIMENS;
        if (saved) {
            initialData = JSON.parse(saved);
        }

        // Migration: Ensure all URLs use the robust image.pollinations.ai endpoint
        const migratedData = initialData.map(s => {
            // Check if it's using the /p/ endpoint (which might be flaky)
            if (s.imageUrl.includes('pollinations.ai/p/')) {
                const parts = s.imageUrl.split('/p/');
                if (parts[1]) {
                    const promptAndParams = parts[1];
                    return {
                        ...s,
                        imageUrl: `https://image.pollinations.ai/prompt/${promptAndParams}`
                    };
                }
            }
            return s;
        });

        setSpecimens(migratedData);
    }, []);

    // Save Data
    useEffect(() => {
        localStorage.setItem('dm_bestiary_collection', JSON.stringify(specimens));
    }, [specimens]);

    const handleSaveNew = (newSpecimen: Specimen) => {
        setSpecimens([newSpecimen, ...specimens]);
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this classified record?')) {
            setSpecimens(specimens.filter(s => s.id !== id));
            if (selectedSpecimen?.id === id) setSelectedSpecimen(null);
        }
    };

    return (
        <div className="min-h-full pb-20">
            <header className="mb-8">
                <h1 className="text-4xl text-[#c90000] font-arcade drop-shadow-[2px_2px_0px_rgba(255,255,255,0.1)] mb-2">
                    BIOLOGICAL ARCHIVE
                </h1>
                <p className="text-slate-500 font-mono">
                    // LEVEL 4 CLEARANCE REQUIRED. DO NOT PHOTOGRAPH SPECIMENS.
                </p>
            </header>

            {/* CREATION UTILITY */}
            <CreateSpecimenForm onSave={handleSaveNew} />

            {/* SPECIMEN GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                    {specimens.map((specimen) => (
                        <motion.div
                            key={specimen.id}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={() => setSelectedSpecimen(specimen)}
                            className="bg-white p-3 pb-8 shadow-lg rotate-1 hover:rotate-0 transition-transform cursor-pointer relative group"
                        >
                            {/* POLAROID IMAGE */}
                            <div className="aspect-square bg-black mb-4 overflow-hidden relative border border-slate-200">
                                <img
                                    src={specimen.imageUrl}
                                    alt={specimen.name}
                                    className="w-full h-full object-cover transition-all duration-500"
                                    loading="lazy"
                                    // Basic fallback if even the saved URL fails later
                                    onError={(e) => e.currentTarget.src = 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3R5eXh6eG5qY3AxeXF4Z3V2ZmF4eXF4Z3V2ZmF4eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L1R1TVThqceztWz7Sc/giphy.gif'}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                                    <span className="text-white font-mono text-xs drop-shadow-md">CLICK TO ENLARGE</span>
                                </div>
                            </div>

                            {/* HANDWRITTEN LABEL */}
                            <div className="font-mono text-center text-slate-800">
                                <h3 className="font-bold uppercase tracking-widest text-[#c90000]">{specimen.name}</h3>
                                <p className="text-xs text-slate-500">{specimen.type} // {specimen.dateCreated}</p>
                            </div>

                            {/* DELETE BUTTON */}
                            <button
                                onClick={(e) => handleDelete(specimen.id, e)}
                                className="absolute top-2 right-2 text-white bg-black/50 hover:bg-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Delete Record"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* DETAIL MODAL */}
            <AnimatePresence>
                {selectedSpecimen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
                        onClick={() => setSelectedSpecimen(null)}
                    >
                        <motion.div
                            layoutId={selectedSpecimen.id}
                            className="bg-[#111] border-4 border-[#c90000] max-w-4xl w-full flex flex-col md:flex-row overflow-hidden shadow-[0_0_50px_rgba(201,0,0,0.4)]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* LEFT: IMAGE */}
                            <div className="md:w-1/2 bg-black relative border-b-4 md:border-b-0 md:border-r-4 border-[#c90000]">
                                <img
                                    src={selectedSpecimen.imageUrl}
                                    alt={selectedSpecimen.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)', backgroundSize: '100% 4px' }}></div>
                            </div>

                            {/* RIGHT: DETAILS */}
                            <div className="md:w-1/2 p-8 font-mono relative">
                                <button
                                    onClick={() => setSelectedSpecimen(null)}
                                    className="absolute top-4 right-4 text-[#c90000] hover:text-white"
                                >
                                    <X className="w-8 h-8" />
                                </button>

                                <h2 className="text-3xl text-white font-bold mb-1">{selectedSpecimen.name}</h2>
                                <span className="text-[#c90000] text-sm tracking-widest uppercase block mb-6 border-b border-[#333] pb-4">
                                    CLASSIFICATION: {selectedSpecimen.type}
                                </span>

                                <div className="space-y-4">
                                    <h3 className="text-slate-500 text-xs uppercase">Visual Description / Notes</h3>
                                    <p className="text-slate-300 leading-relaxed text-lg">
                                        {selectedSpecimen.description}
                                    </p>
                                </div>

                                <div className="mt-8 pt-4 border-t border-[#333] flex justify-between text-xs text-slate-600">
                                    <span>ID: {selectedSpecimen.id.toUpperCase()}</span>
                                    <span>LOGGED: {selectedSpecimen.dateCreated}</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Bestiary;
