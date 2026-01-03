import React from 'react';

interface PlaceholderProps {
    title: string;
}

const PlaceholderPage: React.FC<PlaceholderProps> = ({ title }) => {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <h2 className="text-4xl text-slate-700 mb-4">{title}</h2>
            <div className="p-8 border-2 border-dashed border-slate-700 rounded-lg">
                <p className="text-slate-500 font-mono">Module Under Construction</p>
                <p className="text-xs text-slate-600 mt-2">Check back later, adventurer.</p>
            </div>
        </div>
    );
};

export default PlaceholderPage;
