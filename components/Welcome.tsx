
import React from 'react';

interface WelcomeProps {
  onStart: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-16 animate-fadeIn bg-white min-h-[650px]">
      {/* Educational Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full mb-10 border border-indigo-100">
        <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">Professional Development Series</span>
      </div>

      <div className="max-w-2xl text-center">
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 leading-tight mb-4 tracking-tight font-heading">
          What Kind of PM Are You?
        </h1>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-500 mb-12 tracking-tight">
          12-Question Challenge
        </h2>
        
        <p className="text-xl text-slate-600 font-medium mb-12 leading-relaxed">
          How do <span className="text-indigo-600 font-bold underline decoration-2 underline-offset-4">YOU</span> think about startup decisions? This assessment evaluates your strategic frameworks through real-world scenarios.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 text-left">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="font-bold text-slate-900 mb-1">Practical</div>
            <p className="text-sm text-slate-500 leading-snug">Based on authentic company scenarios.</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="font-bold text-slate-900 mb-1">Anonymous</div>
            <p className="text-sm text-slate-500 leading-snug">Results used for community benchmarking only.</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="font-bold text-slate-900 mb-1">Efficient</div>
            <p className="text-sm text-slate-500 leading-snug">Requires ~5 minutes of focused attention.</p>
          </div>
        </div>

        <button 
          onClick={onStart}
          className="group relative px-16 py-6 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl text-xl font-bold transition-all transform hover:scale-[1.02] active:scale-95 shadow-2xl shadow-slate-200"
        >
          Begin Assessment
          <span className="inline-block ml-3 transition-transform group-hover:translate-x-1">→</span>
        </button>
      </div>

      <div className="mt-16 pt-8 border-t border-slate-100 w-full flex justify-center opacity-40">
        <div className="flex items-center gap-6">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Strategy</div>
          <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Prioritization</div>
          <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Instincts</div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
