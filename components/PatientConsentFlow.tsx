
import React, { useState, useEffect } from 'react';
import LanguageDisclaimerModal from './LanguageDisclaimerModal';
import NRIWaiverModal from './NRIWaiverModal';
import DocumentAcceptanceModal from './DocumentAcceptanceModal';
import { legalService } from '../services/legalService';
import { LocationData } from '../types';

interface Props {
  onComplete: () => void;
  trigger?: string;
}

const PatientConsentFlow: React.FC<Props> = ({ onComplete, trigger = 'registration' }) => {
  const [step, setStep] = useState<'checking' | 'disclaimer' | 'nri-waiver' | 'documents' | 'complete'>('checking');
  const [location, setLocation] = useState<LocationData | null>(null);

  useEffect(() => {
    startFlow();
  }, []);

  const startFlow = async () => {
    setStep('checking');
    setTimeout(() => {
      setStep('disclaimer');
    }, 1200);
  };

  const handleDisclaimerComplete = async () => {
    const loc = await legalService.detectLocation();
    setLocation(loc);
    if (loc.is_nri) {
      setStep('nri-waiver');
    } else {
      setStep('documents');
    }
  };

  const handleNRIWaiverComplete = () => {
    setStep('documents');
  };

  const handleDocumentsComplete = () => {
    setStep('complete');
    onComplete();
  };

  if (step === 'checking') {
    return (
      <div className="w-full flex flex-col items-center justify-center bg-[#F0F7FF] p-20">
        <div className="w-16 h-16 border-4 border-[#1877F2] border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Legal Security Check</h2>
        <p className="text-slate-500 font-medium animate-pulse">Scanning jurisdiction and verifying platform protocols...</p>
      </div>
    );
  }

  const steps = [
    { id: 'disclaimer', label: 'Language Notice', icon: '🌐' },
    { id: 'nri-waiver', label: 'Jurisdiction', icon: '🇮🇳' },
    { id: 'documents', label: 'Binding Docs', icon: '📄' },
    { id: 'complete', label: 'Complete', icon: '✅' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);

  return (
    <div className="w-full flex flex-col md:flex-row bg-[#F0F7FF]">
      {/* Sidebar Progress Tracker */}
      <aside className="w-full md:w-80 bg-slate-900 text-white p-8 md:min-h-full">
        <div className="mb-10">
          <h2 className="text-xl font-black mb-1">Onboarding</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Legal Compliance Sequence</p>
        </div>
        <div className="space-y-6">
          {steps.map((s, idx) => {
            if (s.id === 'nri-waiver' && location && !location.is_nri) return null;
            const isCompleted = idx < currentStepIndex;
            const isActive = s.id === step;
            return (
              <div key={s.id} className="flex items-center gap-4 group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all border-2 ${
                  isActive ? 'bg-[#1877F2] border-[#1877F2] shadow-lg shadow-blue-500/20' : 
                  isCompleted ? 'bg-green-500 border-green-500' : 'bg-transparent border-slate-700 text-slate-500'
                }`}>
                  {isCompleted ? '✓' : s.icon}
                </div>
                <div>
                  <p className={`text-sm font-black ${isActive ? 'text-white' : isCompleted ? 'text-green-400' : 'text-slate-500'}`}>
                    {s.label}
                  </p>
                  {isActive && <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest">In Progress</p>}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-20 p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
           <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3">Identity Proof</p>
           <div className="space-y-2 font-mono text-[10px] text-slate-400">
             <p className="flex justify-between"><span>IPv4:</span> <span>Verified</span></p>
             <p className="flex justify-between"><span>GEO:</span> <span>Detected</span></p>
             <p className="flex justify-between"><span>SIGN:</span> <span>Awaiting</span></p>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <section className="flex-1 bg-[#F0F7FF] relative overflow-hidden flex flex-col">
        {step === 'disclaimer' && (
          <div className="flex-1 p-8 md:p-16 flex flex-col items-center">
             <div className="w-full max-w-2xl">
                <LanguageDisclaimerModal onAccept={handleDisclaimerComplete} userLanguage="hi" isInline />
             </div>
          </div>
        )}
        {step === 'nri-waiver' && (
          <div className="flex-1 p-8 md:p-16 flex flex-col items-center">
             <div className="w-full max-w-4xl">
                <NRIWaiverModal location={location} onComplete={handleNRIWaiverComplete} isInline />
             </div>
          </div>
        )}
        {step === 'documents' && (
          <div className="flex-1 p-8 md:p-16 flex flex-col items-center">
             <div className="w-full max-w-3xl">
                <DocumentAcceptanceModal context={trigger} onComplete={handleDocumentsComplete} isInline />
             </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default PatientConsentFlow;