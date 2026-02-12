
import React, { useState, useEffect } from 'react';
import { LegalDocument } from '../types';
import { legalService } from '../services/legalService';

interface Props {
  context: string;
  onComplete: () => void;
  isInline?: boolean;
}

const DocumentAcceptanceModal: React.FC<Props> = ({ context, onComplete, isInline = false }) => {
  const [docs, setDocs] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    setLoading(true);
    legalService.getMandatoryDocuments(context).then(fetchedDocs => {
      setDocs(fetchedDocs);
      setLoading(false);
      // If no documents are pending, automatically advance the flow
      if (fetchedDocs.length === 0) {
        onComplete();
      }
    });
  }, [context, onComplete]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    if (element.scrollHeight - element.scrollTop <= element.clientHeight + 50) setHasScrolled(true);
  };

  const handleAccept = async () => {
    const currentDoc = docs[currentIndex];
    setAccepting(true);
    await legalService.acceptDocument(currentDoc.id);
    
    if (currentIndex < docs.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setHasScrolled(false);
      setAccepting(false);
    } else {
      onComplete();
    }
  };

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-20 bg-white rounded-3xl border-2 border-white shadow-xl">
        <div className="w-12 h-12 border-4 border-[#1877F2] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-black text-[#1877F2] uppercase tracking-widest">Loading Legal Documents...</p>
      </div>
    );
  }

  if (docs.length === 0) return null;

  const currentDoc = docs[currentIndex];
  const progress = ((currentIndex + 1) / docs.length) * 100;

  const content = (
    <div className={`bg-white w-full rounded-3xl ${!isInline ? 'shadow-2xl' : ''} flex flex-col max-h-[90vh] overflow-hidden border-2 border-white animate-in fade-in zoom-in duration-300`}>
      <div className="p-8 border-b border-blue-50">
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-[10px] font-black text-[#1877F2] uppercase tracking-widest mb-1">Current Agreement</p>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{currentDoc.title}</h2>
          </div>
          <span className="bg-blue-50 px-3 py-1 rounded-full text-[10px] font-black text-[#1877F2] uppercase">Rev. {currentDoc.current_version}</span>
        </div>
        <div className="w-full bg-blue-50 h-2.5 rounded-full overflow-hidden shadow-inner">
          <div className="bg-[#1877F2] h-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="flex justify-between mt-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Security ID: M360-S-{currentDoc.id}</p>
          <p className="text-[10px] font-black text-[#1877F2] uppercase tracking-widest">Document {currentIndex + 1} of {docs.length}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        <div className="bg-blue-50/50 p-6 rounded-2xl flex items-center gap-4 text-blue-900 ring-4 ring-blue-50/30">
           <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">📖</span>
           <p className="text-sm font-black leading-tight">Regulatory Protocol: Full scroll required before digital signature can be authorized.</p>
        </div>

        <div 
          onScroll={handleScroll}
          className="border-2 border-blue-50 rounded-2xl p-8 bg-blue-50/10 overflow-y-auto max-h-80 prose prose-slate prose-sm max-w-none shadow-inner"
        >
          <h3 className="text-lg font-black uppercase text-slate-900 border-b border-blue-100 pb-4 mb-6 tracking-tight">Binding Electronic Consent</h3>
          <p className="font-mono text-xs text-slate-600 leading-relaxed mb-6">
            This agreement is legally binding under the Information Technology Act, 2000. 
            By checking the box below, you provide a valid electronic signature as per Section 3.
            
            MANAS360 collects personal health information (PHI) which is categorized as "Sensitive Personal Data" under Digital Personal Data Protection Act, 2023.
          </p>
          
          <h4 className="font-black text-slate-900 mt-10">1. Data Consent</h4>
          <p className="text-slate-600">I hereby grant MANAS360 permission to process my health data for the sole purpose of providing therapeutic and coaching services.</p>
          
          <h4 className="font-black text-slate-900 mt-6">2. Rights Acknowledgement</h4>
          <p className="text-slate-600">I understand my rights to access, correction, and erasure as defined in the platform's Data Privacy Hub.</p>
          
          <div className="h-40"></div>
          <div className="text-center py-10 border-t border-dashed border-blue-200">
            <p className="text-[10px] font-black text-[#1877F2] uppercase tracking-widest">Document Terminus • Authoritative Version</p>
          </div>
        </div>

        <div className="p-6 bg-blue-50/20 border-2 border-blue-50 rounded-2xl ring-4 ring-transparent hover:ring-blue-100 transition-all">
          <label className="flex items-start gap-4 cursor-pointer">
            <input 
              type="checkbox" 
              className="mt-1 w-6 h-6 rounded-md accent-[#1877F2]" 
              checked={hasScrolled} 
              onChange={() => {}} 
              disabled={!hasScrolled}
            />
            <span className={`text-sm font-black leading-snug ${hasScrolled ? 'text-slate-900' : 'text-slate-400'}`}>
              I have read, understood, and accept the {currentDoc.document_type.replace('_', ' ')} (v{currentDoc.current_version}) as a legally binding signature.
            </span>
          </label>
        </div>

        <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-xs shadow-sm">⚖️</div>
          <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
            Legal Effect: This creates an immutable record in the MANAS360 Compliance Vault, linking your verified identity with this specific document version.
          </p>
        </div>
      </div>

      <div className="p-8 border-t border-blue-50 bg-white text-center">
        <button
          onClick={handleAccept}
          disabled={!hasScrolled || accepting}
          className={`w-full max-w-sm py-5 rounded-full font-black text-sm uppercase tracking-widest text-white shadow-xl transition-all transform active:scale-95 ${
            hasScrolled && !accepting ? 'bg-[#1877F2] hover:bg-blue-700 shadow-blue-200' : 'bg-slate-300 cursor-not-allowed'
          }`}
        >
          {accepting ? 'Executing Signature...' : 'Accept & Proceed to Next'}
        </button>
        {currentDoc.blocks_access && (
          <p className="mt-4 text-[10px] font-black text-amber-600 uppercase tracking-widest">
            Mandatory Requirement for Platform Access
          </p>
        )}
      </div>
    </div>
  );

  if (isInline) return content;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
      <div className="relative w-full max-w-3xl">
        {content}
      </div>
    </div>
  );
};

export default DocumentAcceptanceModal;
