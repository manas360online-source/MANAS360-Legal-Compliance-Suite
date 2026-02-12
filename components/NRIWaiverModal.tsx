
import React, { useState } from 'react';
import { LocationData } from '../types';

interface Props {
  location: LocationData | null;
  onComplete: () => void;
  isInline?: boolean;
}

const NRIWaiverModal: React.FC<Props> = ({ location, onComplete, isInline = false }) => {
  const [step, setStep] = useState<'jurisdiction' | 'medical' | 'signature'>('jurisdiction');
  const [hasScrolledJurisdiction, setHasScrolledJurisdiction] = useState(false);
  const [hasScrolledMedical, setHasScrolledMedical] = useState(false);
  const [acceptedJurisdiction, setAcceptedJurisdiction] = useState(false);
  const [acceptedMedical, setAcceptedMedical] = useState(false);
  const [digitalSignature, setDigitalSignature] = useState('');
  const [signing, setSigning] = useState(false);

  const handleJurisdictionScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrolledToBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;
    if (scrolledToBottom) setHasScrolledJurisdiction(true);
  };

  const handleMedicalScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrolledToBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;
    if (scrolledToBottom) setHasScrolledMedical(true);
  };

  const handleNextToMedical = () => {
    setStep('medical');
  };

  const handleNextToSignature = () => {
    setStep('signature');
  };

  const handleSign = async () => {
    if (!digitalSignature.trim()) return alert('Please type your full name as digital signature');
    setSigning(true);
    // Simulate API call to record waiver
    setTimeout(() => {
      onComplete();
      setSigning(false);
    }, 1500);
  };

  const content = (
    <div className={`bg-white w-full rounded-3xl ${!isInline ? 'shadow-2xl' : ''} flex flex-col max-h-[95vh] overflow-hidden border-2 border-white`}>
      {/* Header - High Priority / Critical Styling */}
      <div className="bg-red-600 p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
           <span className="text-8xl font-black italic">NRI</span>
        </div>
        <h2 className="text-2xl font-black flex items-center gap-3 tracking-tight relative z-10">
          ⚖️ INTERNATIONAL USER: Legal Requirements
        </h2>
        <p className="mt-3 inline-flex items-center gap-2 bg-red-700/50 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-500/50 relative z-10">
          Accessing from: {location?.country_name} ({location?.ip_address})
        </p>
      </div>

      <div className="p-1 bg-slate-100 flex gap-1">
        {['Jurisdiction', 'Medical', 'Signature'].map((s, idx) => {
          const isActive = idx <= (step === 'jurisdiction' ? 0 : step === 'medical' ? 1 : 2);
          return (
            <div key={s} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${isActive ? 'bg-[#1877F2]' : 'bg-slate-300'}`}></div>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#F0F7FF]/30">
        {/* Step Indicator */}
        <div className="text-[10px] font-black text-[#1877F2] uppercase tracking-widest flex items-center gap-2">
           <span className="w-6 h-px bg-blue-200"></span>
           Step {step === 'jurisdiction' ? '1' : step === 'medical' ? '2' : '3'} of 3: {step.toUpperCase()}
        </div>

        {/* STEP 1: JURISDICTION */}
        {step === 'jurisdiction' && (
          <div className="space-y-6">
            <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-2xl text-red-900">
              <h3 className="font-black flex items-center gap-2 uppercase tracking-tight text-sm mb-2">
                🇮🇳 ACCEPTANCE OF INDIAN JURISDICTION
              </h3>
              <p className="text-sm font-bold leading-relaxed">
                You are accessing from outside India. You must accept Indian jurisdiction for all legal matters.
              </p>
            </div>

            <div 
              onScroll={handleJurisdictionScroll} 
              className="bg-white border-2 border-blue-50 rounded-2xl p-8 font-serif text-[13px] leading-relaxed max-h-80 overflow-y-auto whitespace-pre-wrap text-slate-700 shadow-inner"
            >
              <h4 className="font-black text-slate-900 mb-4 underline uppercase">1. GOVERNING LAW</h4>
              This agreement and all services provided by MANAS360 shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles.

              <h4 className="font-black text-slate-900 mt-8 mb-4 underline uppercase">2. EXCLUSIVE JURISDICTION - BENGALURU COURTS</h4>
              I hereby irrevocably and unconditionally submit to the EXCLUSIVE jurisdiction of:
              a) Session Courts of Bengaluru Urban District, Karnataka, India
              b) High Court of Karnataka at Bengaluru, India
              
              For all disputes, claims, or legal proceedings arising from or relating to my use of MANAS360 services.

              <h4 className="font-black text-slate-900 mt-8 mb-4 underline uppercase">3. WAIVER OF FOREIGN JURISDICTION</h4>
              I hereby expressly WAIVE any right to bring legal proceedings in any court outside India, including but not limited to courts in:
              - United States of America
              - United Kingdom
              - Canada
              - Australia
              - Singapore
              - United Arab Emirates
              - Any other foreign jurisdiction

              I agree that Bengaluru, Karnataka, India shall be the sole and exclusive venue for all legal disputes.

              <h4 className="font-black text-slate-900 mt-8 mb-4 underline uppercase">4. IP ADDRESS TRACKING ACKNOWLEDGMENT</h4>
              I acknowledge that my current IP address shows I am accessing MANAS360 from outside India (Country: {location?.country_name}, IP: {location?.ip_address}).
              
              Despite accessing from outside India, I explicitly agree that:
              - All legal matters are governed by Indian law
              - All disputes must be resolved in Bengaluru courts
              - I will not claim lack of jurisdiction due to my physical location
              - I am fully responsible and accountable for using this service from my current location.
            </div>

            <div className="p-6 bg-white border-2 border-white rounded-2xl shadow-sm ring-4 ring-transparent hover:ring-blue-50 transition-all">
              <label className="flex items-start gap-4 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="mt-1 w-6 h-6 rounded-md accent-[#1877F2]" 
                  checked={acceptedJurisdiction} 
                  onChange={(e) => setAcceptedJurisdiction(e.target.checked)} 
                  disabled={!hasScrolledJurisdiction} 
                />
                <span className={`text-sm font-black leading-snug ${hasScrolledJurisdiction ? 'text-slate-900' : 'text-slate-400'}`}>
                  I accept Indian jurisdiction (Bengaluru Session Courts / Karnataka High Court) for all legal disputes, even though I am in {location?.country_name}.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* STEP 2: MEDICAL LIABILITY */}
        {step === 'medical' && (
          <div className="space-y-6">
            <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-2xl text-red-900">
              <h3 className="font-black flex items-center gap-2 uppercase tracking-tight text-sm mb-2">
                ⚕️ MEDICAL LIABILITY WAIVER / RELEASE OF LIABILITY
              </h3>
              <p className="text-sm font-bold leading-relaxed">
                You must understand and accept limitations of telemedicine and release certain liability claims.
              </p>
            </div>

            <div 
              onScroll={handleMedicalScroll} 
              className="bg-white border-2 border-blue-50 rounded-2xl p-8 font-serif text-[13px] leading-relaxed max-h-80 overflow-y-auto whitespace-pre-wrap text-slate-700 shadow-inner"
            >
              <h4 className="font-black text-slate-900 mb-4 underline uppercase">1. NATURE OF TELEMEDICINE SERVICES</h4>
              I understand that MANAS360 provides online mental health services through licensed therapists, psychiatrists, and wellness coaches via video, audio, and text communication.

              <h4 className="font-black text-slate-900 mt-8 mb-4 underline uppercase">2. TELEMEDICINE LIMITATIONS</h4>
              I acknowledge the following limitations:
              a) Not suitable for medical emergencies
              b) Technology failures may occur (internet, video, audio issues)
              c) Physical examination not possible
              d) Diagnostic accuracy may be limited
              e) Privacy/security risks inherent in electronic communication
              f) Cross-border practice limitations

              <h4 className="font-black text-slate-900 mt-8 mb-4 underline uppercase">4. RELEASE OF LIABILITY - PLATFORM</h4>
              I hereby RELEASE and hold HARMLESS MANAS360, its owners, directors, employees, and affiliates from any and all liability for:
              a) Technology failures or interruptions
              b) Miscommunication due to technical issues
              c) Delays in response time
              d) Platform downtime or service unavailability
              e) Third-party service failures
              f) Data breaches despite reasonable security measures
              
              EXCEPT in cases of gross negligence or willful misconduct.

              <h4 className="font-black text-slate-900 mt-8 mb-4 underline uppercase">5. INDEPENDENT CONTRACTOR STATUS</h4>
              I understand that therapists, psychiatrists, and coaches on MANAS360 are INDEPENDENT CONTRACTORS, not employees of MANAS360. Any medical malpractice or professional negligence claims must be brought against the individual practitioner, NOT against MANAS360 platform.

              <h4 className="font-black text-slate-900 mt-8 mb-4 underline uppercase">7. EMERGENCY SITUATIONS</h4>
              I understand that MANAS360 is NOT for emergencies. In crisis:
              - Call 112 (Emergency Services)
              - Call 9152987821 (Vandrevala Foundation)
              - Visit nearest hospital emergency room
            </div>

            <div className="p-6 bg-white border-2 border-white rounded-2xl shadow-sm ring-4 ring-transparent hover:ring-blue-50 transition-all">
              <label className="flex items-start gap-4 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="mt-1 w-6 h-6 rounded-md accent-[#1877F2]" 
                  checked={acceptedMedical} 
                  onChange={(e) => setAcceptedMedical(e.target.checked)} 
                  disabled={!hasScrolledMedical} 
                />
                <span className={`text-sm font-black leading-snug ${hasScrolledMedical ? 'text-slate-900' : 'text-slate-400'}`}>
                  I accept this Medical Liability Waiver and Release of Liability. I understand the risks of cross-border telemedicine.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* STEP 3: DIGITAL SIGNATURE */}
        {step === 'signature' && (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">✍️ Digital Signature Required</h3>
              <p className="text-sm text-slate-500 font-bold">By typing your full name below, you are digitally signing both waivers.</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border-2 border-blue-50 space-y-4 shadow-sm">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Summary of What You're Signing:</h4>
              <div className="bg-[#F0F7FF]/50 p-5 rounded-2xl shadow-sm space-y-3 text-xs font-bold text-slate-700">
                <p>1. <span className="text-[#1877F2]">Indian Jurisdiction:</span> Disputes resolved in Bengaluru Courts only.</p>
                <p>2. <span className="text-[#1877F2]">No Foreign Lawsuits:</span> You waive the right to sue in {location?.country_name}.</p>
                <p>3. <span className="text-[#1877F2]">Medical Liability:</span> You release MANAS360 from platform-related claims.</p>
                <p>4. <span className="text-[#1877F2]">Cross-Border Risks:</span> You assume all risks of using telemedicine internationally.</p>
                <p>5. <span className="text-[#1877F2]">Not for Emergencies:</span> You confirm this is not for emergency crisis care.</p>
              </div>
            </div>

            <div className="space-y-4">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Type your full legal name to sign:</label>
               <input 
                 type="text"
                 autoFocus
                 value={digitalSignature}
                 onChange={(e) => setDigitalSignature(e.target.value)}
                 placeholder="Your Full Name (e.g., John D'Souza)"
                 className="w-full p-6 bg-white border-2 border-blue-50 rounded-2xl focus:border-[#1877F2] outline-none text-xl font-black shadow-sm transition-all"
               />
               <p className="text-[10px] text-slate-400 font-bold italic">This is your digital signature. It has the same legal effect as a handwritten signature under IT Act 2000.</p>
            </div>

            <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">⚖️</div>
               <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-6">Legal Proof Generated:</h4>
               <div className="space-y-4 text-xs font-mono">
                  <p className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="opacity-60 uppercase tracking-tighter">✓ Signature:</span>
                    <span className="font-bold text-blue-400 underline">{digitalSignature || '[Pending]'}</span>
                  </p>
                  <p className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="opacity-60 uppercase tracking-tighter">✓ Date & Time:</span>
                    <span className="font-bold">{new Date().toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="opacity-60 uppercase tracking-tighter">✓ Location:</span>
                    <span className="font-bold">{location?.city}, {location?.country_name}</span>
                  </p>
                  <p className="flex justify-between items-center">
                    <span className="opacity-60 uppercase tracking-tighter">✓ IP Address:</span>
                    <span className="font-bold">{location?.ip_address}</span>
                  </p>
               </div>
               <p className="mt-8 text-[9px] font-black uppercase tracking-widest text-center text-blue-400 bg-blue-400/10 py-2 rounded-lg">
                  Immutable Legal Record Created
               </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="border-t p-8 bg-white flex justify-between items-center">
        {step !== 'jurisdiction' && (
          <button 
            onClick={() => setStep(step === 'medical' ? 'jurisdiction' : 'medical')}
            className="px-10 py-4 bg-white border-2 border-blue-50 text-slate-500 rounded-full font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all"
          >
            ← Back
          </button>
        )}
        
        {step === 'jurisdiction' && (
          <button 
            onClick={handleNextToMedical}
            disabled={!acceptedJurisdiction}
            className={`ml-auto px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest text-white transition-all transform active:scale-95 shadow-xl ${acceptedJurisdiction ? 'bg-[#1877F2] hover:bg-blue-700 shadow-blue-200' : 'bg-slate-300 cursor-not-allowed'}`}
          >
            Next: Medical Liability Waiver →
          </button>
        )}

        {step === 'medical' && (
          <button 
            onClick={handleNextToSignature}
            disabled={!acceptedMedical}
            className="ml-auto px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest text-white transition-all transform active:scale-95 shadow-xl bg-[#1877F2] hover:bg-blue-700 shadow-blue-200"
          >
            Next: Digital Signature →
          </button>
        )}

        {step === 'signature' && (
          <button 
            onClick={handleSign}
            disabled={!digitalSignature.trim() || signing}
            className={`flex-1 ml-4 py-6 rounded-full font-black text-sm uppercase tracking-widest text-white transition-all transform active:scale-95 shadow-xl ${digitalSignature.trim() && !signing ? 'bg-[#1877F2] hover:bg-blue-700 shadow-blue-200' : 'bg-slate-300 cursor-not-allowed'}`}
          >
            {signing ? 'Recording Immutable Evidence...' : '✍️ Sign & Accept (Legally Binding)'}
          </button>
        )}
      </div>
    </div>
  );

  if (isInline) return content;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"></div>
      <div className="relative w-full max-w-4xl">
        {content}
      </div>
    </div>
  );
};

export default NRIWaiverModal;