
import React, { useState, useEffect } from 'react';
import { db } from '../db';

interface WelcomeProps {
  onStart: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  const [count, setCount] = useState<number | string>('200+');

  useEffect(() => {
    db.getSubmissionsCount().then(c => {
      // If there are additional local submissions, we can show the specific number, 
      // otherwise "200+" is the default.
      if (c > 200) {
        setCount(c);
      } else {
        setCount('200+');
      }
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center animate-fadeIn bg-white min-h-[600px]">
      {/* Icon */}
      <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-12 shadow-sm border border-indigo-200/50">
        <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>

      <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight mb-2 tracking-tight">
        The PM Instincts
      </h1>
      <h2 className="text-4xl sm:text-5xl font-black text-indigo-600 leading-tight mb-16 tracking-tight">
        Gauntlet
      </h2>

      {/* The Specific Card from Screenshot */}
      <div className="w-full max-w-lg bg-white border border-slate-100/80 rounded-[2rem] p-12 mb-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h3 className="text-2xl font-black text-slate-800 mb-12 tracking-tight">
          How do you think about startup decisions?
        </h3>
        
        <div className="flex items-center justify-center gap-6 mb-12">
          <div className="text-right text-slate-500 font-bold text-lg leading-tight">
            <p>Compare your gut check</p>
            <p>to</p>
          </div>
          
          <div className="text-6xl font-black text-indigo-600 tabular-nums">
            {count}
          </div>
          
          <div className="text-left text-slate-500 font-bold text-lg leading-tight">
            <p>other</p>
            <p>PMs.</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 text-slate-500 font-bold text-lg">
          <span className="w-3 h-3 bg-[#4ade80] rounded-full"></span>
          <p>Takes 5 minutes. (Seriously.)</p>
        </div>
      </div>

      <button 
        onClick={onStart}
        className="px-14 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xl font-bold transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-indigo-200/50 mb-8"
      >
        Start the Gauntlet
      </button>

      <p className="text-slate-400 font-bold tracking-wide text-sm uppercase">
        No right answers. Just your instincts.
      </p>
    </div>
  );
};

export default Welcome;
