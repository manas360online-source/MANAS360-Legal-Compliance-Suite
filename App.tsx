
import React, { useState, useEffect } from 'react';
import PatientConsentFlow from './components/PatientConsentFlow';
import LegalDashboard from './components/LegalDashboard';
import PatientRightsPage from './components/PatientRightsPage';
import { UserType, ComplianceStatus, ComplianceAreaScore } from './types';
import { legalService } from './services/legalService';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'registration' | 'patient_portal' | 'admin'>('landing');
  const [userRole, setUserRole] = useState<UserType>(UserType.PATIENT);
  const [complianceSummary, setComplianceSummary] = useState<ComplianceStatus | null>(null);

  useEffect(() => {
    legalService.checkCompliance(1).then(setComplianceSummary);
  }, []);

  const handleConsentComplete = () => {
    setView('patient_portal');
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF] selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-blue-100 sticky top-0 z-50 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('landing')}>
          <div className="bg-gradient-to-br from-[#1877F2] to-blue-700 text-white w-10 h-10 flex items-center justify-center rounded-xl font-black text-xl shadow-blue-200 shadow-lg">M</div>
          <div>
            <span className="text-xl font-black text-slate-900 tracking-tighter block leading-none">MANAS360</span>
            <span className="text-[10px] font-bold text-[#1877F2] uppercase tracking-widest">Compliance Suite</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          {view !== 'landing' && (
            <button 
              onClick={() => setView('landing')}
              className="text-slate-500 hover:text-[#1877F2] font-bold text-sm px-4 py-2 transition-all flex items-center gap-2 hover:bg-blue-50 rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Exit to Dashboard
            </button>
          )}
          <div className="h-8 w-px bg-blue-100"></div>
          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900">System Status</p>
                <p className="text-[10px] text-green-600 font-black uppercase">● Compliant</p>
             </div>
             <div className="w-8 h-8 rounded-full bg-white border-2 border-blue-50 shadow-sm flex items-center justify-center">
                <span className="text-xs">⚖️</span>
             </div>
          </div>
        </div>
      </nav>

      <main>
        {view === 'landing' && (
          <div className="relative animate-in fade-in duration-700">
            {/* Hero Section */}
            <div className="bg-white border-b border-blue-50 pt-20 pb-16 px-6 overflow-hidden">
               <div className="max-w-6xl mx-auto relative z-10 text-center">
                  <div className="inline-block px-4 py-1.5 bg-blue-50 text-[#1877F2] rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-blue-100">
                    Regulatory Hub v3.1
                  </div>
                  <h1 className="text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                    Centralized Legal <br/>
                    <span className="text-[#1877F2]">Document Management</span>
                  </h1>
                  <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
                    The single source of truth for platform agreements, DPDPA 2023 compliance oversight, and automated risk mitigation.
                  </p>
               </div>
               <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
               <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
            </div>

            {/* Feature Grid */}
            <div className="max-w-7xl mx-auto -mt-10 px-6 pb-20">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <button 
                  onClick={() => { setView('registration'); setUserRole(UserType.PATIENT); }}
                  className="group relative p-8 bg-white border-2 border-white rounded-3xl shadow-xl hover:shadow-2xl hover:border-[#1877F2] hover:-translate-y-2 transition-all text-left ring-4 ring-transparent hover:ring-blue-50"
                >
                  <div className="w-14 h-14 bg-[#1877F2] text-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg shadow-blue-200 group-hover:rotate-6 transition-transform">👤</div>
                  <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Patient Registration</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Legally binding consent flow with DPDPA-compliant digital signature acceptance.
                  </p>
                </button>

                <button 
                  onClick={() => { setView('registration'); setUserRole(UserType.PATIENT); }}
                  className="group relative p-8 bg-red-600 border-2 border-red-500 rounded-3xl shadow-xl hover:shadow-2xl hover:border-white hover:-translate-y-2 transition-all text-left overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10"><span className="text-8xl font-black italic text-white">NRI</span></div>
                  <div className="w-14 h-14 bg-white text-red-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg group-hover:rotate-6 transition-transform">⚖️</div>
                  <h3 className="text-xl font-black text-white mb-2 tracking-tight">NRI Legal Protection</h3>
                  <p className="text-red-100 text-xs leading-relaxed">
                    Explicit Indian jurisdiction acknowledgment and medical liability waivers for international users.
                  </p>
                </button>

                <button 
                  onClick={() => { setView('admin'); setUserRole(UserType.ADMIN); }}
                  className="group relative p-8 bg-slate-900 border-2 border-slate-800 rounded-3xl shadow-xl hover:shadow-2xl hover:border-[#1877F2] hover:-translate-y-2 transition-all text-left overflow-hidden ring-4 ring-transparent hover:ring-white/10"
                >
                  <div className="w-14 h-14 bg-white text-slate-900 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg group-hover:rotate-6 transition-transform">📋</div>
                  <h3 className="text-xl font-black text-white mb-2 tracking-tight">Compliance Console</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Admin tools for document versioning, repository management, and DPDPA oversight.
                  </p>
                </button>

                <button 
                  onClick={() => { setView('patient_portal'); setUserRole(UserType.PATIENT); }}
                  className="group relative p-8 bg-white border-2 border-white rounded-3xl shadow-xl hover:shadow-2xl hover:border-[#1877F2] hover:-translate-y-2 transition-all text-left ring-4 ring-transparent hover:ring-blue-50"
                >
                  <div className="w-14 h-14 bg-blue-50 text-slate-900 rounded-2xl flex items-center justify-center text-2xl mb-6 border border-blue-100 shadow-sm group-hover:rotate-6 transition-transform">🛡️</div>
                  <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Patient Rights Portal</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Exercise rights to access, correction, and erasure under the DPDPA 2023.
                  </p>
                </button>
              </div>
            </div>

            {/* Compiler Dashboard Section */}
            <section className="max-w-7xl mx-auto px-6 pb-20">
               <div className="bg-white border-2 border-white rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                     <span className="text-[10rem] font-black italic tracking-tighter leading-none select-none text-slate-900">PULSE</span>
                  </div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 relative z-10">
                     <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Compiler Dashboard</h2>
                        <p className="text-slate-500 font-medium flex items-center gap-2">
                           <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                           Executive overview of real-time regulatory status
                        </p>
                     </div>
                     <button 
                        onClick={() => setView('admin')}
                        className="bg-[#1877F2] text-white px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all flex items-center gap-3 active:scale-95"
                     >
                        Enter Compliance Console
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                     </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-12 relative z-10">
                     {/* Overall Score Card */}
                     <div className="lg:col-span-2 bg-[#1877F2] p-8 rounded-[2rem] text-white shadow-lg flex flex-col justify-between">
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-6">Aggregate Compliance</p>
                           <p className="text-7xl font-black tracking-tighter mb-2">{complianceSummary?.overall_score}%</p>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase">Grade {complianceSummary?.grade}</span>
                           <span className="text-[10px] font-bold opacity-80 uppercase tracking-wide">Excellent Standing</span>
                        </div>
                     </div>

                     {/* Area Breakdowns */}
                     {complianceSummary && (Object.entries(complianceSummary.areas) as [string, ComplianceAreaScore][]).map(([key, area]) => (
                        <div key={key} className="bg-blue-50/50 p-6 rounded-[2rem] border-2 border-transparent hover:border-[#1877F2] transition-all group">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{area.label}</p>
                           <p className="text-3xl font-black text-slate-900 mb-2">{area.score}%</p>
                           <div className="w-full bg-white h-2 rounded-full overflow-hidden shadow-inner">
                              <div className="bg-[#1877F2] h-full group-hover:bg-blue-400 transition-colors" style={{ width: `${area.score}%` }}></div>
                           </div>
                           <p className="text-[9px] font-bold text-slate-500 mt-4 uppercase">Weight: {area.weight * 100}%</p>
                        </div>
                     ))}
                  </div>

                  {/* Summary Footer items */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-blue-50">
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Document Expiry</p>
                        <p className="text-sm font-black text-red-600 flex items-center gap-2">
                           <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
                           3 Critical Alerts
                        </p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unsigned Docs</p>
                        <p className="text-sm font-black text-amber-600">142 Pending Signatures</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit Reports</p>
                        <p className="text-sm font-black text-green-600">Generated (Weekly)</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time status</p>
                        <p className="text-sm font-black text-[#1877F2] flex items-center gap-2">
                           <span className="w-2 h-2 bg-[#1877F2] rounded-full animate-pulse"></span>
                           Active Monitoring
                        </p>
                     </div>
                  </div>
               </div>
            </section>

            {/* Compliance Footer */}
            <div className="bg-white/50 border-t border-blue-50 py-12">
              <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center md:text-left">
                   <div>
                     <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Standard</p>
                     <p className="text-sm font-bold text-slate-600 italic">DPDPA 2023 Compliant</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Signatures</p>
                     <p className="text-sm font-bold text-slate-600 italic">IT Act 2000 Certified</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Security</p>
                     <p className="text-sm font-bold text-slate-600 italic">AES-256 Encryption</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Availability</p>
                     <p className="text-sm font-bold text-slate-600 italic">99.9% Uptime SLA</p>
                   </div>
                </div>
                <div className="text-xs text-slate-400 font-medium text-center md:text-right">
                  © 2026 MANAS360 Legal Compliance Unit.<br/>Regulatory ID: M360-LCS-4412
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'registration' && (
          <div className="min-h-[calc(100vh-73px)] flex items-stretch">
            <PatientConsentFlow onComplete={handleConsentComplete} trigger="registration" />
          </div>
        )}

        {view === 'patient_portal' && <PatientRightsPage />}
        {view === 'admin' && <LegalDashboard />}
      </main>
    </div>
  );
};

export default App;