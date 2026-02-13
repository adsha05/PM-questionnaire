
import React, { useState, useEffect } from 'react';
import { QuizResults } from '../types';
import { db } from '../db';

interface ResultsProps {
  results: QuizResults | null;
  error: string | null;
  onRestart: () => void;
}

const Results: React.FC<ResultsProps> = ({ results, error, onRestart }) => {
  const [peers, setPeers] = useState<any[]>([]);

  useEffect(() => {
    if (results?.archetype) {
      db.getPeersByArchetype(results.archetype).then(setPeers);
    }
  }, [results?.archetype]);

  if (error) {
    return (
      <div className="p-12 text-center">
        <div className="text-5xl mb-6">😅</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">The AI hit a snag</h2>
        <p className="text-slate-600 mb-8">{error}</p>
        <button onClick={onRestart} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg">
          Try Again
        </button>
      </div>
    );
  }

  if (!results) return null;

  const avgGrowth = 55;
  const avgRisk = "Medium";
  const avgData = 7.2;
  const userData = results.stats.dataDrivenScore.toFixed(1);

  return (
    <div className="bg-slate-50 min-h-[600px] overflow-y-auto custom-scrollbar pb-12">
      {/* Indigo Header Section */}
      <div className="bg-[#4a40e0] text-white p-12 text-center rounded-b-3xl shadow-lg mb-10">
        <div className="inline-block px-4 py-1.5 bg-indigo-400/30 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-8 border border-white/20">
          Your PM Type
        </div>
        <h1 className="text-4xl sm:text-5xl font-black mb-6 tracking-tight font-heading leading-tight">
          {results.archetype}
        </h1>
        <p className="text-indigo-100 text-lg sm:text-xl font-medium italic opacity-90">
          "{results.description}"
        </p>
      </div>

      <div className="px-8 sm:px-12">
        {/* Traits & Why it Matters */}
        <div className="bg-white rounded-3xl p-8 mb-8 shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">Your Signature Traits</h3>
            <ul className="space-y-6">
              {results.traits.map((trait, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-slate-700 font-bold text-lg leading-snug">{trait}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex items-center gap-2 text-slate-400 font-bold text-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              You're similar to {results.similarityPercentage}% of PMs
            </div>
          </div>

          <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100/30">
            <h3 className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest mb-4">Why This Matters</h3>
            <p className="text-slate-600 font-medium leading-relaxed">
              {results.contextWhyItMatters}
            </p>
          </div>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <h3 className="font-bold text-slate-900">Growth Focus</h3>
              </div>
              <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-2 py-1 rounded">
                {results.stats.growthFocus > 55 ? 'ABOVE AVG' : 'CONSISTENT'}
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                  <span>You ({results.stats.growthFocus}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${results.stats.growthFocus}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                  <span>Average PM ({avgGrowth}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-300 rounded-full" style={{ width: `${avgGrowth}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-10">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="font-bold text-slate-900">Risk Tolerance</h3>
            </div>
            <div className="flex items-center justify-between h-20">
              <div className="text-center flex-1">
                <div className="text-4xl font-black text-slate-900 mb-1">{results.stats.riskTolerance}</div>
                <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">YOU</div>
              </div>
              <div className="w-px h-12 bg-slate-100"></div>
              <div className="text-center flex-1">
                <div className="text-4xl font-black text-slate-400 mb-1">{avgRisk}</div>
                <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">AVG PM</div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Slider */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8">
           <div className="flex items-center gap-2 mb-12">
              <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="font-bold text-slate-900">Data-Driven Instincts (1-10)</h3>
            </div>
            <div className="relative pt-10 pb-4">
              <div className="w-full h-1.5 bg-slate-100 rounded-full relative">
                <div className="absolute top-0 bottom-0 w-px bg-slate-300" style={{ left: `${avgData * 10}%` }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-bold text-slate-400">
                    Avg ({avgData})
                  </div>
                </div>
                <div className="absolute w-4 h-4 bg-indigo-600 rounded-full border-2 border-white shadow-md top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-1000" style={{ left: `${results.stats.dataDrivenScore * 10}%` }}>
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-[13px] font-black text-indigo-600">
                    You ({userData})
                  </div>
                </div>
              </div>
            </div>
        </div>

        {/* Community Section */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-12">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">You're in good company!</h3>
          <p className="text-slate-600 font-medium mb-6">Other <span className="text-indigo-600 font-bold">{results.archetype}s</span> in our community include:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {peers.map((peer, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-3 font-bold text-sm">
                  {peer.name[0]}
                </div>
                <div className="text-xs font-black text-slate-800 mb-1">{peer.name}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate">{peer.company}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Step / CTA */}
        <div className="bg-indigo-600 rounded-3xl p-10 text-center text-white mb-12 shadow-xl shadow-indigo-100">
          <h2 className="text-3xl font-black mb-4">Want to test your intuitions against AI?</h2>
          <p className="text-indigo-100 font-medium mb-8 max-w-lg mx-auto leading-relaxed">
            See how your specific product decisions compare to our specialized models in real-time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#" className="w-full sm:w-auto px-10 py-4 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all transform hover:scale-105">
              Try TriconeAI free →
            </a>
            <span className="text-indigo-300 text-xs font-bold uppercase tracking-widest">
              No credit card needed
            </span>
          </div>
        </div>

        <div className="text-center">
          <button 
            onClick={onRestart}
            className="px-10 py-4 border-2 border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95"
          >
            Retake Challenge
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
