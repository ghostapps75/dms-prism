
import { NavLink } from 'react-router-dom';
import { BookOpen, Sword, Hammer, Map, Hexagon } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const navItems = [
        { name: 'Dashboard', path: '/', icon: Hexagon },
        { name: 'Academy', path: '/academy', icon: BookOpen },
        { name: 'Bestiary', path: '/bestiary', icon: Sword },
        { name: 'Toolbelt', path: '/toolbelt', icon: Hammer },
        { name: 'Campaign', path: '/campaign', icon: Map },
    ];

    return (
        <div className="h-screen w-64 bg-slate-900 border-r-4 border-slate-700 flex flex-col font-sans">
            <div className="p-6 border-b-4 border-slate-700">
                <h1 className="text-xl text-neon-purple tracking-wider leading-relaxed text-center shadow-neon">
                    THE DM'S PRISM
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded transition-all duration-200 group border-2 ${isActive
                                ? 'bg-slate-800 border-neon-purple text-neon-purple shadow-[0_0_10px_rgba(217,70,239,0.3)]'
                                : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-retro-green hover:border-retro-green'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-bold tracking-wide uppercase text-sm">
                            {item.name}
                        </span>
                        {/* Hover Indicator */}
                        <motion.div
                            className="ml-auto w-2 h-2 bg-current opacity-0 group-hover:opacity-100"
                            initial={false}
                            animate={{ opacity: 1 }}
                        />
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t-4 border-slate-700 text-center">
                <p className="text-xs text-slate-500 font-mono">v1.0.0 BETA</p>
            </div>
        </div>
    );
};

export default Sidebar;
