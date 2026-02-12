
import React, { useState } from 'react';

interface Props {
  onAccept: () => void;
  userLanguage?: string;
  isInline?: boolean;
}

const LanguageDisclaimerModal: React.FC<Props> = ({ onAccept, userLanguage = 'hi', isInline = false }) => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [accepting, setAccepting] = useState(false);

  const disclaimerText = `
LANGUAGE ACKNOWLEDGMENT AND BINDING AGREEMENT

I hereby acknowledge and confirm the following:

1. ENGLISH-ONLY LEGAL DOCUMENTS
All legal documents provided by MANAS360, including but not limited to
the Privacy Policy, Terms of Service, Informed Consent, and Data Processing
Agreement, are drafted and provided ONLY in English language.

2. NO TRANSLATED VERSIONS
I understand that while the MANAS360 platform interface may be available
in my preferred language (Hindi, Tamil, Telugu, etc.) for ease of use,
all legal documents remain in English only.

3. LEGALLY BINDING IN ENGLISH
I acknowledge that the English version of all legal documents is the
ONLY legally binding version. No translated summary, interface text,
or verbal explanation supersedes the English legal documents.

4. UNDERSTANDING AND COMPETENCE
I confirm that I have sufficient understanding of English language to
read, comprehend, and agree to the legal documents presented. If I do
not understand English adequately, I have arranged for translation
assistance at my own expense before accepting these documents.

5. VOLUNTARY ACCEPTANCE
I am accepting these English-language legal documents voluntarily,
without any coercion, and with full understanding of their legal
implications.
`;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrolledToBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;
    if (scrolledToBottom) setHasScrolled(true);
  };

  const handleAccept = async () => {
    setAccepting(true);
    setTimeout(() => {
      onAccept();
      setAccepting(false);
    }, 800);
  };

  const content = (
    <div className={`bg-white w-full rounded-3xl ${!isInline ? 'shadow-2xl' : ''} flex flex-col max-h-[90vh] overflow-hidden border-2 border-white`}>
      <div className="bg-amber-50 border-b-2 border-amber-400 p-8">
        <h2 className="text-2xl font-black text-amber-900 flex items-center gap-3">
          ⚠️ Important: Language Notice
        </h2>
        <div className="mt-4 bg-red-600 text-white py-3 px-6 rounded-xl font-black text-center uppercase tracking-widest text-sm shadow-lg shadow-red-200">
          All legal documents are in ENGLISH ONLY
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        {userLanguage === 'hi' && (
          <div className="bg-blue-50 border-l-4 border-[#1877F2] p-6 rounded-2xl text-blue-900">
            <p className="font-black text-lg mb-3">यह अनवु ाद केवल आपकी सविुविधा के लि ए है। काननू ी सस्ं करण केवल अग्रं ेजी है।</p>
            <ul className="space-y-2 text-sm font-bold opacity-80 list-disc list-inside">
              <li>सभी काननू ी दस्तावेज केवल अग्रं ेजी में हैं</li>
              <li>प्लेटफ़ॉर्म हि दं ी में हो सकता है, लेकि न दस्तावेज अग्रं ेजी में रहेंगे</li>
              <li>केवल अग्रं ेजी सस्ं करण काननू ी रूप से बाध्यकारी है</li>
            </ul>
          </div>
        )}

        <div 
          onScroll={handleScroll}
          className="bg-[#F0F7FF] border-2 border-blue-50 p-6 rounded-2xl font-mono text-[13px] leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto text-slate-700 shadow-inner"
        >
          {disclaimerText}
        </div>

        <div className="bg-amber-50 border-2 border-amber-100 p-6 rounded-2xl ring-4 ring-transparent hover:ring-amber-100 transition-all">
          <label className="flex items-start gap-4 cursor-pointer">
            <input 
              type="checkbox" 
              className="mt-1 w-6 h-6 rounded-md accent-amber-600 transition-all" 
              checked={hasScrolled} 
              onChange={() => {}} 
              disabled={!hasScrolled}
            />
            <span className={`text-sm font-black leading-snug ${hasScrolled ? 'text-slate-900' : 'text-slate-400'}`}>
              I understand these documents are in English and are legally binding on me, even though the platform interface is available in my language for ease of use.
            </span>
          </label>
        </div>

        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-2xl">
          <p className="text-red-700 font-black uppercase tracking-widest text-xs mb-3">⚖️ LEGAL NOTICE:</p>
          <ul className="text-xs text-red-700/80 space-y-2 list-disc list-inside font-bold">
            <li>Only the English version is legally enforceable in court</li>
            <li>You confirm you have sufficient English competence</li>
            <li>You waive any future claim based on language barriers</li>
            <li>Digital acknowledgment creates a permanent legal record</li>
          </ul>
        </div>
      </div>

      <div className="border-t p-8 bg-white flex flex-col items-center">
        <button
          onClick={handleAccept}
          disabled={!hasScrolled || accepting}
          className={`w-full py-5 rounded-full font-black text-white transition-all transform active:scale-95 shadow-xl ${
            hasScrolled && !accepting ? 'bg-[#1877F2] hover:bg-blue-700 shadow-blue-200' : 'bg-slate-300 cursor-not-allowed'
          }`}
        >
          {accepting ? 'Recording Acknowledgment...' : 'I Acknowledge & Accept Binding Terms'}
        </button>
        <p className="mt-4 text-[10px] font-black text-red-600 uppercase tracking-widest">
          Required for platform access
        </p>
      </div>
    </div>
  );

  if (isInline) return content;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"></div>
      <div className="relative w-full max-w-2xl">
        {content}
      </div>
    </div>
  );
};

export default LanguageDisclaimerModal;