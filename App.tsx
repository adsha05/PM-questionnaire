
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
      // Save to "Database" - passing null for results as Gemini is removed
      if (userInfo) {
        await db.saveSubmission(userInfo, finalResponses, null as any);
      }
      setCurrentStep(AppState.THANK_YOU);
    } catch (err) {
      console.error(err);
      // Even on error, we proceed to Thank You as the user has finished their part
      setCurrentStep(AppState.THANK_YOU);
    }
  }, [userInfo]);

  const restart = () => {
    setResponses([]);
    setUserInfo(null);
    setCurrentStep(AppState.WELCOME);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-white sm:bg-slate-50">
      <div className="w-full max-w-4xl bg-white sm:rounded-[2.5rem] sm:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)] overflow-hidden sm:border sm:border-slate-100 transition-all duration-500">
        {currentStep === AppState.WELCOME && (
          <Welcome onStart={startDetails} />
        )}

        {currentStep === AppState.DETAILS && (
          <UserDetailsForm onSubmit={handleDetailsSubmit} onBack={backToWelcome} />
        )}

        {currentStep === AppState.QUIZ && (
          <Quiz 
            questions={QUIZ_QUESTIONS} 
            onComplete={handleQuizComplete} 
          />
        )}

        {currentStep === AppState.THANK_YOU && (
          <ThankYou onRestart={restart} />
        )}
      </div>
      
      <footer className="mt-8 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 opacity-50">
        <span>PM Decision Challenge</span>
        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
        <span>Educational Resource</span>
      </footer>
    </div>
  );
};

export default App;
