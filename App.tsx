
import React, { useState, useCallback } from 'react';
import { AppState, UserResponse, UserInfo } from './types';
import { QUIZ_QUESTIONS } from './constants';
import { db } from './db';
import Welcome from './components/Welcome';
import UserDetailsForm from './components/UserDetailsForm';
import Quiz from './components/Quiz';
import ThankYou from './components/ThankYou';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppState>(AppState.WELCOME);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [responses, setResponses] = useState<UserResponse[]>([]);

  const startDetails = () => setCurrentStep(AppState.DETAILS);
  const backToWelcome = () => setCurrentStep(AppState.WELCOME);

  const handleDetailsSubmit = (info: UserInfo) => {
    setUserInfo(info);
    setCurrentStep(AppState.QUIZ);
  };

  const handleQuizComplete = useCallback(async (finalResponses: UserResponse[]) => {
    setResponses(finalResponses);
    try {
      if (userInfo) {
        await db.saveSubmission(userInfo, finalResponses, null as any);
      }
      setCurrentStep(AppState.THANK_YOU);
    } catch (err) {
      console.error(err);
      setCurrentStep(AppState.THANK_YOU);
    }
  }, [userInfo]);

  const restart = () => {
    setResponses([]);
    setUserInfo(null);
    setCurrentStep(AppState.WELCOME);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-slate-50 overflow-hidden">
      <div className="w-full max-w-6xl bg-white sm:rounded-[3rem] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100 transition-all duration-500 min-h-[700px] flex flex-col">
        {currentStep === AppState.WELCOME && (
          <Welcome onStart={startDetails} />
        )}

        {currentStep === AppState.DETAILS && (
          <UserDetailsForm onSubmit={handleDetailsSubmit} onBack={backToWelcome} />
        )}

        {currentStep === AppState.QUIZ && (
          <div className="flex-grow overflow-hidden">
            <Quiz 
              questions={QUIZ_QUESTIONS} 
              onComplete={handleQuizComplete} 
            />
          </div>
        )}

        {currentStep === AppState.THANK_YOU && (
          <ThankYou onRestart={restart} />
        )}
      </div>
      
      <footer className="mt-8 text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em] flex items-center gap-4 opacity-50 shrink-0">
        <span>PM Decision Challenge</span>
        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
        <span>Educational Framework v1.0</span>
      </footer>
    </div>
  );
};

export default App;
