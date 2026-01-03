import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import SparkGuide from './SparkGuide';
import InstructionsModal from './InstructionsModal';
import { Outlet } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';

const Layout = () => {
    const [showInstructions, setShowInstructions] = useState(false);

    // Auto-open on first load
    useEffect(() => {
        const hasSeen = sessionStorage.getItem('hasSeenInstructions');
        if (!hasSeen) {
            setShowInstructions(true);
            sessionStorage.setItem('hasSeenInstructions', 'true');
        }
    }, []);

    return (
        <div className="flex h-screen bg-dark-slate text-white overflow-hidden relative">
            <Sidebar />

            {/* Help Button (Absolute Top Right of Sidebar/Main area intersection) */}
            <button
                onClick={() => setShowInstructions(true)}
                // OLD: className="absolute top-4 right-4 z-40 text-slate-500..."
                className="absolute top-4 right-4 z-40 text-[#c90000] hover:text-white hover:scale-110 transition-all p-2 drop-shadow-[0_0_5px_rgba(201,0,0,0.8)]"
                title="How to Play"
            >
                <HelpCircle className="w-8 h-8" /> {/* Increased size from 6 to 8 */}
            </button>

            <main className="flex-1 overflow-y-auto p-8 relative">
                {/* Background Grid Effect */}
                <div className="absolute inset-0 z-0 opacity-5 pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}>
                </div>

                <div className="relative z-10">
                    <Outlet />
                </div>
                <SparkGuide />
                <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} />
            </main>
        </div>
    );
};

export default Layout;
