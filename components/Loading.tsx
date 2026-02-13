
import React, { useState, useEffect } from 'react';

const Loading: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    "Analyzing your risk profile...",
    "Comparing datasets with 200+ startups...",
    "Running 10,000 product simulations...",
    "Evaluating technical debt sensitivity...",
    "Finding your PM soulmate...",
    "Polishing your custom report..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="p-12 text-center h-[500px] flex flex-col items-center justify-center">
      <div className="relative w-24 h-24 mb-10">
        <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-75"></div>
        <div className="relative z-10 w-full h-full bg-indigo-600 rounded-full flex items-center justify-center shadow-xl">
           <svg className="w-10 h-10 text-white animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4.75V6.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M17.1266 6.87347L16.0659 7.93413" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M19.25 12L17.75 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M17.1266 17.1265L16.0659 16.0658" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M12 19.25V17.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M6.87353 17.1265L7.93419 16.0658" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M4.75 12L6.25 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M6.87353 6.87347L7.93419 7.93413" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-slate-800 mb-3 animate-pulse">
        Generating results
      </h3>
      <p className="text-slate-500 font-medium transition-all duration-500 h-6">
        {messages[messageIndex]}
      </p>
    </div>
  );
};

export default Loading;
