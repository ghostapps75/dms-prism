import { ArrowLeft, User, Video } from 'lucide-react';
import type { YardEntity } from '../types';
import { Link } from 'react-router-dom';

interface Props {
    entities: YardEntity[];
    selectedId: string | null;
    followEnabled: boolean;
    onToggleFollow: () => void;
}

export default function YardHUD({ entities, selectedId, followEnabled, onToggleFollow }: Props) {
    const selected = entities.find(e => e.id === selectedId);

    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
            {/* Top Bar */}
            <div className="flex justify-between items-start pointer-events-auto">
                <Link to="/" className="bg-slate-900/80 text-white p-2 px-4 rounded border border-slate-700 hover:bg-slate-800 flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    BACK TO DASHBOARD
                </Link>

                <div className="bg-slate-900/80 p-3 rounded border border-slate-700 text-right">
                    <div className="text-xs text-slate-400 tracking-widest font-bold">POPULATION</div>
                    <div className="text-2xl text-cyan-400 font-mono font-bold leading-none">{entities.length}</div>
                </div>
            </div>

            {/* Bottom Info Panel - Only if Selected */}
            {selected && (
                <div className="pointer-events-auto self-center md:self-end md:w-96 bg-slate-900/90 backdrop-blur border-l-4 border-cyan-500 p-6 rounded shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <User className="w-24 h-24" />
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-1 uppercase tracking-wider">{selected.specimen.name}</h2>
                    <div className="text-xs text-cyan-400 font-mono mb-4 flex items-center gap-2">
                        <span className="bg-cyan-900/50 px-2 py-0.5 rounded">{selected.specimen.type}</span>
                        <span>// ID: {selected.id.slice(0, 8)}</span>
                    </div>

                    <p className="text-slate-300 text-sm leading-relaxed mb-6 line-clamp-3">
                        {selected.specimen.description}
                    </p>

                    <div className="flex gap-2">
                        <button
                            onClick={onToggleFollow}
                            className={`flex-1 py-2 px-4 rounded text-xs font-bold tracking-widest flex items-center justify-center gap-2 transition-all ${followEnabled
                                ? 'bg-cyan-500 text-black hover:bg-cyan-400'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                }`}
                        >
                            <Video className="w-4 h-4" />
                            {followEnabled ? 'FOLLOWING' : 'FOLLOW CAM'}
                        </button>
                    </div>
                </div>
            )}

            {!selected && (
                <div className="self-center bg-black/50 text-white/50 px-4 py-2 rounded-full text-xs font-mono backdrop-blur-sm">
                    CLICK A SPECIMEN TO INSPECT
                </div>
            )}
        </div>
    );
}
