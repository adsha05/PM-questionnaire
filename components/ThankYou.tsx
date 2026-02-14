
import React from 'react';

interface ThankYouProps {
  onRestart: () => void;
}

const ThankYou: React.FC<ThankYouProps> = ({ onRestart }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-16 text-center animate-fadeIn bg-white min-h-[600px]">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-10 shadow-sm border border-emerald-200/50">
        <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight mb-6 tracking-tight font-heading">
        Thank you for your contribution
      </h1>
      
      <p className="text-xl text-slate-500 font-medium mb-12 max-w-lg mx-auto leading-relaxed">
        Your responses have been securely recorded. Your input helps us benchmark the collective instincts of the startup PM community.
      </p>

      <div className="w-full max-w-md bg-slate-50 border border-slate-100 rounded-3xl p-8 mb-12">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">What's Next?</h3>
        <p className="text-slate-600 font-semibold">
          We aggregate these insights periodically to share high-level trends with participants. Stay tuned for the next community update.
        </p>
      </div>

      <button 
        onClick={onRestart}
        className="px-12 py-5 bg-slate-900 hover:bg-black text-white rounded-2xl text-lg font-bold transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-slate-200 mb-8"
      >
        Return to Start
      </button>

      <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest opacity-60">
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
        Submission Confirmed
      </div>
    </div>
  );
};

export default ThankYou;
