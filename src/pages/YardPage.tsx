import { useState, useEffect } from 'react';
import YardCanvas from '../yard/components/YardCanvas';
import YardHUD from '../yard/components/YardHUD';
import { getArchivedSpecimens, seedArchive } from '../yard/archive';
import { spawnEntities } from '../yard/spawn';
import type { YardEntity } from '../yard/types';
import { SEED_SPECIMENS } from '../yard/seedSpecimens';
import { Link } from 'react-router-dom';
import { Ghost, Download } from 'lucide-react';

export default function YardPage() {
    const [entities, setEntities] = useState<YardEntity[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [followEnabled, setFollowEnabled] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load and spawn once
        const specimens = getArchivedSpecimens();
        const spawned = spawnEntities(specimens, { range: 30 });
        setEntities(spawned);
        setLoading(false);
    }, []);

    const handleSelect = (id: string | null) => {
        if (id !== selectedId) {
            setSelectedId(id);
            // If we deselect, we might want to disable follow automatically?
            // Or if we select a new one, we keep following.
            if (!id) setFollowEnabled(false);
        }
    };

    const toggleFollow = () => setFollowEnabled(!followEnabled);

    if (loading) {
        return <div className="h-screen bg-slate-900 flex items-center justify-center text-white">Loading Yard...</div>;
    }

    if (entities.length === 0) {
        return (
            <div className="h-screen bg-slate-900 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                <Ghost className="w-16 h-16 mb-6 opacity-20" />
                <h1 className="text-2xl font-bold mb-2 text-white">THE YARD IS EMPTY</h1>
                <p className="max-w-md mb-8">No specimens found. You can creating them in the Bestiary or populate the yard with local test subjects.</p>

                <div className="flex gap-4">
                    <button
                        onClick={() => {
                            seedArchive(SEED_SPECIMENS);
                            window.location.reload(); // Simple reload to refresh state
                        }}
                        className="px-6 py-3 bg-cyan-600 text-white font-bold rounded hover:bg-cyan-500 transition-colors flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        SEED LOCAL SPECIMENS
                    </button>

                    <Link to="/bestiary" className="px-6 py-3 border border-slate-600 text-slate-300 font-bold rounded hover:bg-slate-800 transition-colors">
                        GO TO BESTIARY
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full relative bg-slate-900 overflow-hidden">
            <YardCanvas
                entities={entities}
                selectedId={selectedId}
                onSelect={handleSelect}
                followEnabled={followEnabled}
            />

            <YardHUD
                entities={entities}
                selectedId={selectedId}
                followEnabled={followEnabled}
                onToggleFollow={toggleFollow}
            />
        </div>
    );
}
