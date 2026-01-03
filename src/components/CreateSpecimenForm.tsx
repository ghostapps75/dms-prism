import { useEffect, useRef, useState } from 'react';
import { Box, Save, Activity } from 'lucide-react';
import { apiUrl } from '../config/api';

// Meshy status response shape (subset)
interface MeshyTask {
    id: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'SUCCEEDED' | 'FAILED' | 'EXPIRED';
    progress?: number;
    model_urls?: {
        glb?: string;
    };
    thumbnail_url?: string;
}

type Props = {
    onSave: (data: any) => void;
};

const CreateSpecimenForm = ({ onSave }: Props) => {
    const [name, setName] = useState('');
    const [type, setType] = useState('Abomination');
    const [description, setDescription] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [statusLog, setStatusLog] = useState('');
    const [modelUrl, setModelUrl] = useState<string | null>(null);
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

    const pollTimeoutRef = useRef<number | null>(null);
    const abortRef = useRef<AbortController | null>(null);
    const activeTaskIdRef = useRef<string | null>(null);

    useEffect(() => {
        return () => {
            clearPolling();
        };
    }, []);

    const clearPolling = () => {
        if (pollTimeoutRef.current) {
            window.clearTimeout(pollTimeoutRef.current);
            pollTimeoutRef.current = null;
        }
        abortRef.current?.abort();
        abortRef.current = null;
        activeTaskIdRef.current = null;
    };

    const fetchJson = async <T,>(url: string, init?: RequestInit, signal?: AbortSignal): Promise<T> => {
        const resp = await fetch(url, { ...(init || {}), signal });
        const text = await resp.text();

        let json;
        try {
            json = text ? JSON.parse(text) : {};
        } catch {
            throw new Error(`Failed to parse JSON response: ${text.slice(0, 50)}...`);
        }

        if (!resp.ok) {
            const msg = (json && (json.error || json.message)) || `Request failed (${resp.status})`;
            throw new Error(msg);
        }

        return json as T;
    };

    // Generic poller that returns the final GLB URL (cached stable URL) or throws
    // Side effect: caches thumbnail if available
    const pollTaskAndCache = async (taskId: string, startMessage: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            // Setup cancellation for this specific poll operation
            activeTaskIdRef.current = taskId;
            abortRef.current?.abort();
            const ac = new AbortController();
            abortRef.current = ac;

            const pollOnce = async () => {
                if (activeTaskIdRef.current !== taskId) return; // obsolete

                try {
                    const data = await fetchJson<MeshyTask>(
                        apiUrl(`/api/meshy/text-to-3d/${encodeURIComponent(taskId)}`),
                        undefined,
                        ac.signal
                    );

                    if (data.status === 'SUCCEEDED') {
                        const glb = data.model_urls?.glb;
                        if (!glb) {
                            throw new Error('Task succeeded but no GLB returned');
                        }

                        // Just in case, try to cache thumbnail
                        if (data.thumbnail_url) {
                            try {
                                const thumbCacheResp = await fetchJson<{ url: string; cached: boolean }>(
                                    apiUrl(`/api/meshy/cache-image?url=${encodeURIComponent(data.thumbnail_url)}`)
                                );
                                setThumbnailUrl(thumbCacheResp.url);
                            } catch (err) {
                                console.warn('Failed to cache thumbnail:', err);
                            }
                        }

                        // Trigger Cache for GLB
                        setStatusLog('Caching model locally...');
                        const cacheResp = await fetchJson<{ url: string; cached: boolean }>(
                            apiUrl(`/api/meshy/cache-glb?url=${encodeURIComponent(glb)}`)
                        );

                        // Done!
                        resolve(cacheResp.url);
                        return;
                    }

                    if (data.status === 'FAILED' || data.status === 'EXPIRED') {
                        throw new Error('Generation Failed.');
                    }

                    // Progress
                    const p = typeof data.progress === 'number' ? data.progress : 0;
                    setStatusLog(`${startMessage} ${p}%`);

                    // Schedule next
                    pollTimeoutRef.current = window.setTimeout(pollOnce, 2000);

                } catch (err: any) {
                    // Ignore abort errors
                    if (String(err?.name).toLowerCase().includes('abort')) return;
                    reject(err);
                }
            };

            pollOnce();
        });
    };

    const handleGenerate = async () => {
        setIsLoading(true);
        setModelUrl(null);
        setThumbnailUrl(null);
        setStatusLog('Initializing Matter Stream...');

        clearPolling();

        try {
            const prompt = `game asset, blender 3d style, ${description} ${type}, high fidelity, dark fantasy, 4k textures`;

            // 1. Create Preview Task
            const createResp = await fetchJson<any>(apiUrl('/api/meshy/text-to-3d'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mode: 'preview',
                    prompt,
                    art_style: 'realistic',
                    negative_prompt: 'low quality, blurry, pixelated',
                }),
            });

            const previewId = createResp?.result || createResp?.id;
            if (!previewId) throw new Error('No preview ID returned');

            setStatusLog('Fabricating Preview...');

            // 2. Poll Preview
            const previewUrl = await pollTaskAndCache(previewId, 'Fabricating Geometry...');

            // Show preview immediately
            setModelUrl(previewUrl);
            setStatusLog('Preview Complete. Increasing Fidelity...');

            // 3. Start Refinement (Texture Pass)
            // Note: We do NOT throw if refinement fails to start, we just stop.
            try {
                const refineResp = await fetchJson<any>(apiUrl('/api/meshy/refine'), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ base_task_id: previewId })
                });

                const refineId = refineResp?.result || refineResp?.id;
                if (!refineId) throw new Error('No refine ID returned');

                // 4. Poll Refinement
                const refinedUrl = await pollTaskAndCache(refineId, 'Refining Textures...');

                // Swap to refined model
                setModelUrl(refinedUrl);
                setStatusLog('Rendering Complete (High Quality).');

            } catch (refineErr: any) {
                console.warn('Refinement failed:', refineErr);
                setStatusLog('Refinement Failed. Using Preview.');
                // We serve the preview (already set) so just stop loading.
            }

        } catch (err: any) {
            console.error('Meshy Error:', err);
            setStatusLog(`Error: ${err?.message || 'Unknown error'}`);
        } finally {
            setIsLoading(false);
            clearPolling();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        onSave({
            id: crypto.randomUUID(),
            name,
            type,
            description,
            modelUrl, // stable local URL
            thumbnailUrl, // stable local URL
            createdAt: new Date().toISOString(),
            is3D: true
        });

        // Reset form
        setName('');
        setDescription('');
        setModelUrl(null);
        setThumbnailUrl(null);
        setStatusLog('');
    };

    return (
        <div className="p-6 text-slate-200 bg-slate-900 border border-slate-700/50 rounded-lg shadow-xl shadow-black/20">
            <h3 className="text-xl font-bold mb-6 text-cyan-400 tracking-wider flex items-center gap-2">
                <Box className="w-5 h-5" />
                BIOLOGICAL ARCHIVE / NEW ENTRY
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-xs font-bold tracking-[0.2em] text-slate-400">SPECIMEN NAME</label>
                        <input
                            className="w-full bg-slate-800/80 border border-slate-600/50 text-slate-200 p-3 rounded-md focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all placeholder:text-slate-600 font-mono text-sm"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. THE SABLE WRETCH"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-bold tracking-[0.2em] text-slate-400">CLASSIFICATION</label>
                        <select
                            className="w-full bg-slate-800/80 border border-slate-600/50 text-slate-200 p-3 rounded-md focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all font-mono text-sm appearance-none"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option>Abomination</option>
                            <option>Construct</option>
                            <option>Spirit</option>
                            <option>Beast</option>
                            <option>Humanoid</option>
                            <option>Relic</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-bold tracking-[0.2em] text-slate-400">VISUAL DATA</label>
                        <textarea
                            className="w-full bg-slate-800/80 border border-slate-600/50 text-slate-200 p-3 rounded-md focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all placeholder:text-slate-600 font-mono text-sm min-h-[120px] resize-none"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe physical characteristics for matter reconstruction..."
                        />
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button
                            type="button"
                            onClick={handleGenerate}
                            disabled={isLoading || !description.trim()}
                            className="flex-1 bg-cyan-900/20 border border-cyan-500/30 text-cyan-400 py-3 rounded hover:bg-cyan-500/10 hover:border-cyan-400/50 transition-all font-bold text-xs tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {isLoading ? <Activity className="animate-spin w-4 h-4" /> : <Box className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                            {isLoading ? 'FABRICATING...' : 'INITIATE GENESIS'}
                        </button>

                        <button
                            type="submit"
                            disabled={!modelUrl}
                            className="flex-1 bg-slate-100/10 border border-slate-400/30 text-slate-200 py-3 rounded hover:bg-slate-100/20 hover:text-white transition-all font-bold text-xs tracking-widest flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <Save className="w-4 h-4" />
                            ARCHIVE
                        </button>
                    </div>

                    {/* Status */}
                    <div className="mt-4 p-4 rounded bg-slate-950 border border-slate-800">
                        <div className="flex items-start gap-3">
                            <Activity className={`w-4 h-4 mt-[2px] ${isLoading ? 'text-cyan-400 animate-pulse' : 'text-slate-600'}`} />
                            <div className="text-xs font-mono">
                                <div className="tracking-widest text-slate-500 mb-1">SYSTEM STATUS</div>
                                <div className={isLoading ? 'text-cyan-400' : 'text-slate-400'}>
                                    {statusLog || 'STANDBY'}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Right: Preview */}
                <div className="space-y-3">
                    <div className="text-xs font-bold tracking-[0.2em] text-slate-400">HOLOGRAM PREVIEW</div>

                    <div className="w-full aspect-square rounded-lg border border-slate-700/50 overflow-hidden bg-gradient-to-br from-slate-900 to-black flex items-center justify-center relative shadow-inner">
                        {isLoading && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 backdrop-blur-[2px]">
                                <div className="flex flex-col items-center gap-4">
                                    <Activity className="w-8 h-8 text-cyan-400 animate-spin" />
                                    <div className="text-xs text-cyan-400 tracking-widest font-mono animate-pulse">PROCESSING...</div>
                                </div>
                            </div>
                        )}

                        {modelUrl ? (
                            // @ts-ignore
                            <model-viewer
                                src={modelUrl}
                                camera-controls
                                auto-rotate
                                shadow-intensity="1"
                                style={{ width: '100%', height: '100%' }}
                            >
                                {/* @ts-ignore */}
                            </model-viewer>
                        ) : (
                            <div className="text-slate-700 text-center p-8 border-2 border-dashed border-slate-800 mx-8 rounded">
                                <Box className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p className="text-xs tracking-widest font-mono opacity-50">NO MATTER DATA</p>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono opacity-60">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/50"></div>
                        CACHED AT {modelUrl && modelUrl.includes('r2.dev') ? 'REMOTE STORAGE' : 'LOCAL CACHE'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateSpecimenForm;
