
import React, { useState } from 'react';

const PatientRightsPage: React.FC = () => {
  // Global View States
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<{name: string, ver: string, date: string} | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error' | 'warning'} | null>(null);
  
  // Patient Profile State (Legal Identity)
  const [profile, setProfile] = useState({
    name: "Demo Patient",
    email: "patient@example.com",
    phone: "+91 98765 43210"
  });

  // Granular Consent State (DPDPA Sec 6)
  const [consents, setConsents] = useState({
    marketing: true,
    research: true,
    thirdParty: false
  });

  // Local Form States
  const [formData, setFormData] = useState({ ...profile });
  const [isSubmittingCorrection, setIsSubmittingCorrection] = useState(false);
  const [tempConsents, setTempConsents] = useState({ ...consents });
  const [isUpdatingConsent, setIsUpdatingConsent] = useState(false);

  // Success Notification Helper
  const notify = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // 1. RIGHT TO PORTABILITY: JSON Data Export
  const handleDownloadData = () => {
    setIsDownloading(true);
    notify("Preparing your encrypted data export...", "success");
    
    setTimeout(() => {
      const dataToExport = {
        identity_vault: "MANAS360-DPDPA-PORTAL",
        export_id: `EXP-${Math.floor(Math.random()*1000000)}`,
        timestamp: new Date().toISOString(),
        subject_profile: profile,
        processing_consents: consents,
        legal_status: "Verified",
        clinical_history: "Access restricted to medical professionals. Contact DPO for full clinical raw data."
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `manas360_data_portability_${profile.name.toLowerCase().replace(' ', '_')}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      
      setIsDownloading(false);
      notify("Data export complete. File saved to downloads.");
    }, 2000);
  };

  // 2. RIGHT TO CORRECTION: Update Legal Identity
  const handleUpdateProfileClick = () => {
    setFormData({ ...profile });
    setShowCorrectionModal(true);
  };

  const handleCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingCorrection(true);
    
    // Simulate DPDPA verification protocol
    setTimeout(() => {
      setProfile({ ...formData });
      setIsSubmittingCorrection(false);
      setShowCorrectionModal(false);
      notify(`Profile corrected: Legal identity updated to ${formData.name}`);
    }, 1500);
  };

  // 3. WITHDRAW CONSENT: Granular Processing Controls
  const handleWithdrawConsentClick = () => {
    setTempConsents({ ...consents });
    setShowConsentModal(true);
  };

  const handleConsentSave = () => {
    setIsUpdatingConsent(true);
    setTimeout(() => {
      setConsents({ ...tempConsents });
      setIsUpdatingConsent(false);
      setShowConsentModal(false);
      notify("Processing consents updated in the Compliance Vault.");
    }, 1200);
  };

  // 4. RIGHT TO ERASURE: Data Wipe
  const handleRequestDeletion = () => {
    if (window.confirm("CRITICAL: Are you sure you want to exercise your 'Right to Erasure'? This will revoke all platform access and schedule your Personal Data for deletion in 30 days. This action is immutable.")) {
      setIsDeleting(true);
      notify("Initiating Data Erasure Protocol (M360-DEL)...", "warning");
      
      setTimeout(() => {
        setIsDeleting(false);
        alert(`DPDPA Right to Erasure: Request M360-DEL-9921 has been logged. Deletion scheduled for ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}. You will be logged out shortly.`);
      }, 2500);
    }
  };

  const getDocContent = (name: string) => {
    if (name === 'Privacy Policy') {
      return `This Privacy Policy describes how MANAS360 collects, uses, and discloses your personal information in accordance with the Digital Personal Data Protection Act (DPDPA) 2023. We collect health data to provide mental wellness services. You have the right to access, correct, and erase your data at any time through this portal. Your data is encrypted at rest using AES-256 and is stored exclusively on Indian soil.`;
    }
    if (name === 'Terms of Service') {
      return `By using MANAS360, you agree to abide by our platform guidelines. Services are provided 'as-is'. We are not an emergency service. In case of crisis, call 112. Misuse of the platform or falsifying medical history may result in immediate termination of access. All content provided on the platform is intellectual property of MANAS360 and cannot be redistributed without prior written consent.`;
    }
    if (name === 'NRI Jurisdiction Waiver') {
      return `I, ${profile.name}, hereby irrevocably submit to the EXCLUSIVE jurisdiction of the Session Courts of Bengaluru Urban District, Karnataka, India. I expressly WAIVE any right to bring legal proceedings in any court outside India, including but not limited to courts in the United States, UK, Canada, or Australia. All legal matters related to MANAS360 usage shall be governed by the laws of India.`;
    }
    return "Authoritative legal text pending server retrieval.";
  };

  const activeConsentCount = Object.values(consents).filter(Boolean).length;

  return (
    <div className="max-w-6xl mx-auto py-16 px-6 relative bg-[#F0F7FF]">
      {/* Dynamic Notification Toast */}
      {notification && (
        <div className={`fixed top-24 right-8 z-[200] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-8 duration-300 border-2 ${
          notification.type === 'success' ? 'bg-[#1877F2] text-white border-blue-400' : 
          notification.type === 'warning' ? 'bg-amber-500 text-white border-amber-400' :
          'bg-red-600 text-white border-red-500'
        }`}>
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-black">
            {notification.type === 'success' ? '✓' : notification.type === 'warning' ? '⚠️' : '!'}
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest opacity-80">Compliance Event</p>
            <p className="font-bold text-sm">{notification.message}</p>
          </div>
        </div>
      )}

      <header className="mb-16">
        <div className="inline-block px-3 py-1 bg-blue-50 text-[#1877F2] rounded-lg text-[10px] font-black uppercase tracking-widest mb-4 border border-blue-100">DPDPA Right to Transparency</div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Your Data Privacy Hub</h1>
        <p className="text-lg text-slate-500 mt-2 max-w-2xl leading-relaxed">Manage your binding agreements and exercise your rights under the Digital Personal Data Protection Act, 2023.</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Active Profile Summary Card */}
          <div className="bg-[#1877F2] p-10 rounded-3xl shadow-xl text-white relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-10 opacity-10 transform group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-40 w-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
             </div>
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">Authorized Legal Identity</p>
                </div>
                <div className="flex flex-col gap-1 mb-8">
                   <h2 className="text-4xl font-black tracking-tight">{profile.name}</h2>
                   <p className="text-xl font-medium text-blue-100 opacity-80">{profile.email}</p>
                   <p className="text-sm font-bold text-blue-200 mt-2">{profile.phone}</p>
                </div>
                <div className="flex flex-wrap gap-4">
                   <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold border border-white/20">
                      DPDPA Verified
                   </div>
                   <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold border border-white/20">
                      {activeConsentCount} Consents Active
                   </div>
                   <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold border border-white/20">
                      Karnataka Jurisdiction
                   </div>
                </div>
             </div>
          </div>

          {/* Binding Agreements History Table */}
          <div className="bg-white p-10 rounded-3xl shadow-xl border-2 border-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <span className="text-8xl font-black italic">DOCS</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <span className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl text-[#1877F2]">📋</span>
              Binding Agreements History
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-blue-50">
                    <th className="pb-4">Agreement Name</th>
                    <th className="pb-4">Version</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-50">
                  {[
                    { name: 'Privacy Policy', ver: '1.2', date: '2026-01-17', status: 'Active' },
                    { name: 'Terms of Service', ver: '1.0', date: '2026-01-17', status: 'Active' },
                    { name: 'NRI Jurisdiction Waiver', ver: '1.0', date: '2026-01-17', status: 'Active' }
                  ].map((doc, idx) => (
                    <tr key={idx} className="group hover:bg-blue-50/20 transition-all">
                      <td className="py-5">
                        <p className="font-bold text-slate-900 group-hover:text-[#1877F2] transition-colors">{doc.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">HASH: 4b29-92c1-a83d-{idx}</p>
                      </td>
                      <td className="py-5 text-slate-500 font-mono text-xs">{doc.ver}</td>
                      <td className="py-5">
                        <span className="bg-green-100 text-green-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wide border border-green-200">
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-5 text-right">
                        <button 
                          onClick={() => setPreviewDoc(doc)}
                          className="text-[10px] font-black text-[#1877F2] uppercase tracking-widest hover:underline px-2 py-1 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          View Copy
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* EXERCISE YOUR LEGAL RIGHTS SECTION */}
          <div className="bg-white p-10 rounded-3xl shadow-xl border-2 border-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-5">
              <span className="text-8xl font-black italic">DPDPA</span>
            </div>
             <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
               <span className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl text-[#1877F2]">🛡️</span>
               Exercise Your Legal Rights
             </h2>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* 1. RIGHT TO PORTABILITY CARD */}
                <div className="p-8 bg-blue-50/20 rounded-2xl border-2 border-transparent hover:border-[#1877F2] transition-all group relative overflow-hidden shadow-sm">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">📤</div>
                   <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl mb-4 group-hover:shadow-md transition-all">
                     {isDownloading ? <span className="animate-bounce">⬇️</span> : "📤"}
                   </div>
                   <h3 className="font-black text-slate-900 mb-1 tracking-tight">Right to Portability</h3>
                   <p className="text-[11px] text-slate-500 leading-relaxed mb-6">Download your complete medical and personal history in machine-readable JSON format.</p>
                   <button 
                     onClick={handleDownloadData}
                     disabled={isDownloading}
                     className="w-full bg-white border-2 border-blue-100 py-3 rounded-full text-[#1877F2] text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all disabled:opacity-50 shadow-sm"
                   >
                     {isDownloading ? 'Generating Archive...' : 'Download JSON Data'}
                   </button>
                </div>

                {/* 2. RIGHT TO CORRECTION CARD */}
                <div className="p-8 bg-blue-50/20 rounded-2xl border-2 border-transparent hover:border-[#1877F2] transition-all group relative overflow-hidden shadow-sm">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">✏️</div>
                   <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl mb-4 group-hover:shadow-md transition-all">✏️</div>
                   <h3 className="font-black text-slate-900 mb-1 tracking-tight">Right to Correction</h3>
                   <p className="text-[11px] text-slate-500 leading-relaxed">Update incorrect personal data or add supplementary information to your legal record.</p>
                   <p className="text-[10px] font-black text-[#1877F2] uppercase mt-4 mb-2">CURRENT: {profile.name}</p>
                   <button 
                     onClick={handleUpdateProfileClick}
                     className="w-full bg-white border-2 border-blue-100 py-3 rounded-full text-[#1877F2] text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all shadow-sm"
                   >
                     Update Profile Record
                   </button>
                </div>

                {/* 3. WITHDRAW CONSENT CARD */}
                <div className="p-8 bg-blue-50/20 rounded-2xl border-2 border-transparent hover:border-[#1877F2] transition-all group relative overflow-hidden shadow-sm">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">🚫</div>
                   <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl mb-4 group-hover:shadow-md transition-all">🚫</div>
                   <h3 className="font-black text-slate-900 mb-1 tracking-tight">Withdraw Consent</h3>
                   <p className="text-[11px] text-slate-500 leading-relaxed">Manage specific permissions for marketing, research, or third-party data sharing.</p>
                   <div className="flex gap-2 mt-4 mb-2">
                      <span className={`w-2 h-2 rounded-full ${consents.marketing ? 'bg-green-500' : 'bg-slate-300'}`} title="Marketing"></span>
                      <span className={`w-2 h-2 rounded-full ${consents.research ? 'bg-green-500' : 'bg-slate-300'}`} title="Research"></span>
                      <span className={`w-2 h-2 rounded-full ${consents.thirdParty ? 'bg-green-500' : 'bg-slate-300'}`} title="3rd Party"></span>
                      <span className="text-[9px] font-black text-[#1877F2] uppercase ml-1">{activeConsentCount} Active</span>
                   </div>
                   <button 
                     onClick={handleWithdrawConsentClick}
                     className="w-full bg-white border-2 border-blue-100 py-3 rounded-full text-[#1877F2] text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all shadow-sm"
                   >
                     Granular Controls
                   </button>
                </div>

                {/* 4. RIGHT TO ERASURE CARD */}
                <div className="p-8 bg-red-50 rounded-2xl border-2 border-transparent hover:border-red-500 transition-all group relative overflow-hidden shadow-sm">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform text-red-600">🗑️</div>
                   <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl mb-4 group-hover:shadow-md transition-all">
                     {isDeleting ? <span className="animate-spin text-red-600">⏳</span> : "🗑️"}
                   </div>
                   <h3 className="font-black text-red-900 mb-1 tracking-tight">Right to Erasure</h3>
                   <p className="text-[11px] text-red-700/70 leading-relaxed mb-6">Revoke all consent and initiate 30-day "Right to be Forgotten" protocol under Sec 12.</p>
                   <button 
                     onClick={handleRequestDeletion} 
                     disabled={isDeleting}
                     className="w-full bg-white border-2 border-red-100 py-3 rounded-full text-red-600 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all disabled:opacity-50 shadow-sm"
                   >
                     {isDeleting ? 'Processing Wipe...' : 'Initiate Data Erasure'}
                   </button>
                </div>

             </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Legal Contact Card */}
          <div className="bg-slate-900 text-white p-10 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute -bottom-8 -right-8 opacity-20 transform rotate-12">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-40 w-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
               </svg>
            </div>
            <h3 className="font-black text-2xl mb-6 relative z-10">Legal Contact</h3>
            <div className="space-y-6 relative z-10">
              <div>
                <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-1">Data Protection Officer</p>
                <p className="font-bold text-lg">Mahan S.</p>
                <p className="text-sm text-slate-400">Compliance & Privacy Lead</p>
              </div>
              <div className="pt-6 border-t border-slate-800">
                <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-1">Inquiries</p>
                <p className="text-sm font-bold">privacy@manas360.com</p>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-[#1877F2] pl-4 py-1">
                "We operate with Radical Transparency. Every data byte processed is logged for your oversight."
              </p>
            </div>
          </div>

          <div className="bg-white border-2 border-white p-8 rounded-3xl shadow-sm">
            <h3 className="font-black text-amber-900 mb-4 flex items-center gap-2 uppercase tracking-tight text-sm">
               <span className="text-xl">⚖️</span> 
               Important Note
            </h3>
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              Exercising the "Right to Erasure" will result in immediate termination of the platform license. Mandatory clinical records are retained for 7 years as per Indian Health Ministry guidelines and cannot be erased by request.
            </p>
          </div>
        </div>
      </div>

      {/* DOCUMENT PREVIEW MODAL (VIEW COPY) */}
      {previewDoc && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setPreviewDoc(null)}></div>
           <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-white animate-in fade-in zoom-in duration-200">
              <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
                 <div>
                    <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-1">Authoritative Archive Copy</p>
                    <h2 className="text-2xl font-black">{previewDoc.name}</h2>
                 </div>
                 <button 
                   onClick={() => setPreviewDoc(null)}
                   className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
                 >
                   ✕
                 </button>
              </div>
              <div className="flex-1 overflow-y-auto p-12 bg-[#F0F7FF]/50">
                 <div className="max-w-3xl mx-auto bg-white p-12 shadow-sm rounded-lg border border-blue-50 font-serif leading-relaxed text-slate-800">
                    <div className="flex justify-between items-start mb-12 border-b-4 border-slate-900 pb-6">
                       <div className="font-black text-3xl tracking-tighter">MANAS360</div>
                       <div className="text-right text-[10px] font-sans font-bold text-slate-400">
                          VERSION: {previewDoc.ver}<br/>
                          ACCEPTED ON: {previewDoc.date}<br/>
                          UID: M360-S-{Math.floor(Math.random()*10000)}
                       </div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-8 text-slate-900 uppercase underline underline-offset-8 tracking-tight">Legal Binding Agreement</h3>
                    
                    <div className="space-y-6 text-sm">
                      <p>{getDocContent(previewDoc.name)}</p>
                      <p className="pt-4 border-t border-blue-50">The parties acknowledge that this document was signed electronically and is legally enforceable under the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023.</p>
                    </div>

                    {/* ELECTRONIC SIGNATURE STAMP */}
                    <div className="mt-16 p-8 border-2 border-blue-100 bg-blue-50/30 rounded-2xl relative overflow-hidden group hover:border-blue-300 transition-all">
                       <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform text-[#1877F2]">⚖️</div>
                       <p className="text-[10px] font-black uppercase text-blue-400 mb-4 tracking-widest flex items-center gap-2">
                          <span className="w-2 h-2 bg-[#1877F2] rounded-full"></span>
                          Electronic Signature Stamp
                       </p>
                       <div className="flex flex-col gap-1">
                          <p className="text-2xl font-black text-slate-900 italic tracking-tight">{profile.name}</p>
                          <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-tighter">Verified Identity: {profile.email}</p>
                          <p className="text-[10px] font-mono font-bold text-[#1877F2] uppercase tracking-tighter">Signed Date: {previewDoc.date} 10:30:00 UTC+5:30</p>
                       </div>
                       <div className="mt-6 flex items-center gap-2">
                          <div className="bg-[#1877F2] text-white text-[8px] font-black px-2 py-1 rounded tracking-tighter uppercase">Authentic</div>
                          <div className="bg-slate-900 text-white text-[8px] font-black px-2 py-1 rounded tracking-tighter uppercase">Immutable</div>
                       </div>
                    </div>
                    
                    <div className="flex justify-between border-t pt-8 mt-12 text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest">
                       <p>© 2026 MANAS360 Compliance Vault</p>
                       <p>Page 1 of 1</p>
                    </div>
                 </div>
              </div>
              <div className="p-8 border-t bg-white flex justify-end gap-4">
                 <button 
                   onClick={() => setPreviewDoc(null)}
                   className="px-8 py-3 font-black text-slate-500 uppercase tracking-widest text-xs hover:bg-blue-50 rounded-full transition-all"
                 >
                   Close Record
                 </button>
                 <button 
                   onClick={() => {
                     notify(`Downloading PDF copy of ${previewDoc.name}...`);
                     setTimeout(() => setPreviewDoc(null), 500);
                   }}
                   className="bg-[#1877F2] hover:bg-blue-700 text-white font-black uppercase tracking-widest text-xs px-8 py-4 rounded-full shadow-lg transition-all flex items-center gap-2"
                 >
                   Download Certified PDF
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* 2. RIGHT TO CORRECTION MODAL */}
      {showCorrectionModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowCorrectionModal(false)}></div>
           <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-white">
              <div className="bg-[#1877F2] p-10 text-white">
                 <h2 className="text-3xl font-black mb-1">Identity Correction</h2>
                 <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest opacity-80">Sec 12, DPDPA 2023 Enforcement</p>
              </div>
              <form onSubmit={handleCorrectionSubmit} className="p-10 space-y-8 bg-white">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Legal Full Name</label>
                    <input 
                       type="text" 
                       required
                       autoFocus
                       value={formData.name}
                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                       className="w-full px-5 py-5 bg-blue-50/50 border-2 border-white rounded-2xl focus:border-[#1877F2] focus:bg-white outline-none font-bold text-slate-900 transition-all text-lg shadow-inner"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Verified Email</label>
                    <input 
                       type="email" 
                       required
                       value={formData.email}
                       onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                       className="w-full px-5 py-5 bg-blue-50/50 border-2 border-white rounded-2xl focus:border-[#1877F2] focus:bg-white outline-none font-bold text-slate-900 transition-all text-lg shadow-inner"
                    />
                 </div>
                 
                 <div className="p-5 bg-amber-50 border-2 border-amber-100 rounded-2xl flex gap-4">
                    <span className="text-xl">⚠️</span>
                    <p className="text-[11px] text-amber-800 font-bold leading-relaxed">
                       Note: Corrected data will be automatically updated across all binding agreements. Falsifying identity is a legal offense.
                    </p>
                 </div>

                 <div className="flex gap-4 pt-4">
                    <button 
                       type="button"
                       onClick={() => setShowCorrectionModal(false)}
                       className="flex-1 py-5 font-black text-slate-500 uppercase tracking-widest text-[10px] hover:bg-blue-50 rounded-full transition-all border border-transparent"
                    >
                       Cancel
                    </button>
                    <button 
                       type="submit"
                       disabled={isSubmittingCorrection}
                       className="flex-[2] bg-[#1877F2] hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-full shadow-xl shadow-blue-200 transition-all disabled:opacity-50"
                    >
                       {isSubmittingCorrection ? 'Syncing Vault...' : 'Apply Correction'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* 3. WITHDRAW CONSENT / GRANULAR CONTROLS MODAL */}
      {showConsentModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowConsentModal(false)}></div>
           <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-white">
              <div className="bg-slate-900 p-10 text-white">
                 <h2 className="text-3xl font-black mb-1">Manage Consents</h2>
                 <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest opacity-80">Sec 6, DPDPA 2023 Granular Controls</p>
              </div>
              <div className="p-10 space-y-8 bg-white">
                 <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    You have the right to withdraw consent at any time. Revoking optional processing will not affect your core clinical service.
                 </p>
                 
                 <div className="space-y-4">
                    {/* Marketing Toggle */}
                    <button 
                       onClick={() => setTempConsents(prev => ({ ...prev, marketing: !prev.marketing }))}
                       className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all text-left ${
                         tempConsents.marketing ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-100'
                       }`}
                    >
                       <div className="max-w-[80%]">
                          <h4 className="font-black text-slate-900 text-sm mb-1">Marketing & Wellness News</h4>
                          <p className="text-[10px] text-slate-500 font-bold leading-tight">Revoke to stop receiving platform updates and newsletters.</p>
                       </div>
                       <div className={`w-14 h-7 rounded-full transition-all relative ${tempConsents.marketing ? 'bg-[#1877F2]' : 'bg-slate-300'}`}>
                          <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${tempConsents.marketing ? 'left-8' : 'left-1'}`}></div>
                       </div>
                    </button>

                    {/* Research Toggle */}
                    <button 
                       onClick={() => setTempConsents(prev => ({ ...prev, research: !prev.research }))}
                       className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all text-left ${
                         tempConsents.research ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-100'
                       }`}
                    >
                       <div className="max-w-[80%]">
                          <h4 className="font-black text-slate-900 text-sm mb-1">Research & Analytics</h4>
                          <p className="text-[10px] text-slate-500 font-bold leading-tight">Revoke to opt-out of anonymized clinical data studies.</p>
                       </div>
                       <div className={`w-14 h-7 rounded-full transition-all relative ${tempConsents.research ? 'bg-[#1877F2]' : 'bg-slate-300'}`}>
                          <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${tempConsents.research ? 'left-8' : 'left-1'}`}></div>
                       </div>
                    </button>

                    {/* Third Party Toggle */}
                    <button 
                       onClick={() => setTempConsents(prev => ({ ...prev, thirdParty: !prev.thirdParty }))}
                       className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all text-left ${
                         tempConsents.thirdParty ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-100'
                       }`}
                    >
                       <div className="max-w-[80%]">
                          <h4 className="font-black text-slate-900 text-sm mb-1">Third-party Partner Sharing</h4>
                          <p className="text-[10px] text-slate-500 font-bold leading-tight">Enable to share basic data with authorized health partners.</p>
                       </div>
                       <div className={`w-14 h-7 rounded-full transition-all relative ${tempConsents.thirdParty ? 'bg-[#1877F2]' : 'bg-slate-300'}`}>
                          <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${tempConsents.thirdParty ? 'left-8' : 'left-1'}`}></div>
                       </div>
                    </button>
                 </div>

                 <div className="flex gap-4 pt-4">
                    <button 
                       onClick={() => setShowConsentModal(false)}
                       className="flex-1 py-5 font-black text-slate-500 uppercase tracking-widest text-[10px] hover:bg-blue-50 rounded-full transition-all"
                    >
                       Discard
                    </button>
                    <button 
                       onClick={handleConsentSave}
                       disabled={isUpdatingConsent}
                       className="flex-[2] bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-full shadow-xl transition-all disabled:opacity-50"
                    >
                       {isUpdatingConsent ? 'Syncing...' : 'Update Legal Consent'}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default PatientRightsPage;