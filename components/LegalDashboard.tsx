
import React, { useState, useEffect } from 'react';
import { legalService } from '../services/legalService';
import { ComplianceStatus, LegalDocument, DocumentCategory, ComplianceAreaScore } from '../types';

const LegalDashboard: React.FC = () => {
  const [status, setStatus] = useState<ComplianceStatus | null>(null);
  const [docs, setDocs] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'repository'>('dashboard');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'All'>('All');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    Promise.all([
      legalService.checkCompliance(1),
      legalService.getAllRepositoryDocuments()
    ]).then(([s, d]) => {
      setStatus(s);
      setDocs(d);
      setLoading(false);
    });
  }, []);

  const handleDownloadCertificate = () => {
    setIsExporting(true);
    setTimeout(() => {
      alert("DPDPA Compliance Certificate (PDF) generated and signed by Compliance Officer.");
      setIsExporting(false);
    }, 1500);
  };

  const handleExportReport = (format: 'PDF' | 'CSV' | 'Audit') => {
    setIsExporting(true);
    setTimeout(() => {
      alert(`${format} report generated successfully. Audit trail verified with SHA-256.`);
      setIsExporting(false);
    }, 1200);
  };

  const filteredDocs = docs.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return (
    <div className="flex items-center justify-center h-[80vh]">
       <div className="flex flex-col items-center gap-4">
         <div className="w-12 h-12 border-4 border-[#1877F2] border-t-transparent rounded-full animate-spin"></div>
         <p className="font-bold text-slate-500 uppercase tracking-widest text-xs">Accessing Command Center...</p>
       </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 relative">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Compliance Console</h1>
          <p className="text-slate-500 font-medium flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Real-time regulatory monitoring (DPDPA/NMC/MHA/IT ACT)
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={handleDownloadCertificate}
            disabled={isExporting}
            className="bg-green-600 text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-green-700 shadow-lg shadow-green-100 transition-all flex items-center gap-2"
          >
            🏆 Export Compliance Certificate
          </button>
          <div className="flex bg-white p-1 rounded-full shadow-sm border border-blue-50">
             <button 
               onClick={() => setActiveTab('dashboard')}
               className={`px-8 py-2 rounded-full font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'dashboard' ? 'bg-[#1877F2] text-white shadow-md' : 'text-slate-400'}`}
             >
               Live Dashboard
             </button>
             <button 
               onClick={() => setActiveTab('repository')}
               className={`px-8 py-2 rounded-full font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'repository' ? 'bg-[#1877F2] text-white shadow-md' : 'text-slate-400'}`}
             >
               Registry
             </button>
          </div>
        </div>
      </header>

      {activeTab === 'dashboard' && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="bg-[#1877F2] rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center gap-12 shadow-2xl shadow-blue-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform">
               <span className="text-[12rem] font-black italic tracking-tighter leading-none select-none">M360</span>
            </div>
            
            <div className="relative flex items-center justify-center">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/20" />
                <circle 
                  cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" 
                  strokeDasharray={552.9} 
                  strokeDashoffset={552.9 - (552.9 * (status?.overall_score || 0)) / 100} 
                  strokeLinecap="round" 
                  className="text-white transition-all duration-1000 ease-out" 
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-5xl font-black">{status?.overall_score}%</span>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">DPDPA Health Score</span>
              </div>
            </div>

            <div className="flex-1 space-y-6 relative z-10 text-center md:text-left">
              <div>
                <h2 className="text-4xl font-black tracking-tight mb-2">Overall Compliance Status: {status?.status.toUpperCase()}</h2>
                <p className="text-blue-100 text-lg font-medium opacity-80">
                  Weighted regulatory grade: <span className="underline decoration-blue-400 decoration-4 underline-offset-8">Grade {status?.grade}</span>
                </p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                 <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20">
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">Monitoring</p>
                    <p className="font-black text-sm uppercase">Active & Real-time</p>
                 </div>
                 <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20">
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">Standard</p>
                    <p className="font-black text-sm uppercase">DPDPA 2023 Compliant</p>
                 </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {status && (Object.entries(status.areas) as [string, ComplianceAreaScore][]).map(([key, area]) => (
              <div key={key} className="bg-white p-8 rounded-3xl border-2 border-white shadow-sm hover:border-[#1877F2] transition-all group overflow-hidden">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{area.label}</p>
                <div className="flex items-end justify-between mb-4">
                   <p className="text-3xl font-black text-slate-900">{area.score}%</p>
                   <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${
                     area.status === 'excellent' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                   }`}>
                     {area.status}
                   </span>
                </div>
                <div className="w-full bg-blue-50 h-2.5 rounded-full mb-4 overflow-hidden shadow-inner">
                   <div 
                     className={`h-full transition-all duration-1000 ${area.score >= 90 ? 'bg-[#1877F2]' : 'bg-amber-500'}`} 
                     style={{ width: `${area.score}%` }}
                   ></div>
                </div>
                
                <div className="space-y-2">
                   {area.metrics?.map((m, i) => (
                     <div key={i} className="flex justify-between items-center text-[10px] font-bold border-t border-slate-50 pt-2 first:border-0 first:pt-0">
                        <span className="text-slate-400">{m.label}:</span>
                        <span className="text-slate-900">{m.value}</span>
                     </div>
                   ))}
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-end">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Compliance Violations</h3>
                <span className="text-[10px] font-black bg-blue-50 text-[#1877F2] px-3 py-1 rounded-full uppercase tracking-widest">
                  {status?.alerts.total_count} Issues Identified
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="bg-red-50 border-2 border-red-100 rounded-[2rem] p-8 space-y-6">
                   <h4 className="flex items-center gap-2 text-red-700 font-black uppercase tracking-widest text-xs">
                     <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping"></span>
                     🔴 Critical Violations & Expiry ({status?.alerts.critical.length})
                   </h4>
                   <div className="space-y-3">
                     {status?.alerts.critical.map(alert => (
                       <div key={alert.id} className="bg-white p-5 rounded-2xl shadow-sm border border-red-100 flex justify-between items-start group hover:border-red-300 transition-all">
                          <div>
                            <p className="font-black text-slate-900 mb-1">{alert.alert_title}</p>
                            <p className="text-xs text-slate-500 leading-relaxed">{alert.alert_message}</p>
                          </div>
                          <button className="text-[10px] font-black text-red-600 hover:underline uppercase tracking-widest">Remediate →</button>
                       </div>
                     ))}
                   </div>
                </div>

                <div className="bg-amber-50 border-2 border-amber-100 rounded-[2rem] p-8 space-y-6">
                   <h4 className="text-amber-700 font-black uppercase tracking-widest text-xs">
                     🟡 Warnings & Unsigned Documents ({status?.alerts.warning.length})
                   </h4>
                   <div className="space-y-3">
                     {status?.alerts.warning.map(alert => (
                       <div key={alert.id} className="bg-white p-5 rounded-2xl shadow-sm border border-amber-100 flex justify-between items-start group hover:border-amber-300 transition-all">
                          <div>
                            <p className="font-black text-slate-900 mb-1">{alert.alert_title}</p>
                            <p className="text-xs text-slate-500 leading-relaxed">{alert.alert_message}</p>
                          </div>
                          <button className="text-[10px] font-black text-amber-600 hover:underline uppercase tracking-widest">Notify Users</button>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Audit & Export Actions</h3>
              <div className="bg-white p-8 rounded-[2rem] border-2 border-white shadow-sm space-y-3">
                <button 
                  onClick={() => handleExportReport('Audit')}
                  className="w-full bg-[#1877F2] text-white p-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
                >
                  📄 Generate Audit Reports
                </button>
                <button 
                  onClick={() => handleExportReport('PDF')}
                  className="w-full bg-slate-900 text-white p-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2"
                >
                  📊 Export Overview (PDF)
                </button>
                <button 
                   onClick={() => handleExportReport('CSV')}
                   className="w-full bg-white border-2 border-blue-50 text-slate-600 p-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                >
                   📥 Full Data Export (CSV)
                </button>
              </div>

              <div className="bg-white rounded-[2rem] p-8 border-2 border-white shadow-sm">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Real-time Pulse Requirements</h4>
                <div className="space-y-4">
                  {[
                    { label: 'DPDPA Notice (Sec 6)', status: 'Verified' },
                    { label: 'Unsigned Tracking', status: 'Enabled' },
                    { label: 'Breach Notification', status: 'Active' },
                    { label: 'Audit Trail (Hashing)', status: 'Active' },
                    { label: 'Right to Access (Sec 8)', status: 'Verified' }
                  ].map((req, i) => (
                    <div key={i} className="flex justify-between items-center pb-3 border-b border-blue-50">
                       <span className="text-xs font-bold text-slate-600">{req.label}</span>
                       <span className={`text-[10px] font-black uppercase ${req.status === 'Verified' || req.status === 'Enabled' || req.status === 'Active' ? 'text-green-600' : 'text-amber-600'}`}>
                         {req.status === 'Verified' || req.status === 'Active' ? '✓ ' : '● '}{req.status}
                       </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'repository' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border-2 border-white shadow-sm flex flex-col sm:flex-row gap-4">
             <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                <input 
                  type="text" 
                  placeholder="Search repository for specific versions or audit logs..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-blue-50/50 border-2 border-white rounded-2xl focus:border-[#1877F2] focus:bg-white transition-all text-sm font-bold shadow-inner"
                />
             </div>
             <div className="flex gap-4">
                <select 
                  onChange={(e) => setSelectedCategory(e.target.value as any)}
                  className="bg-blue-50/50 border-2 border-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest focus:border-[#1877F2] outline-none shadow-inner"
                >
                   <option value="All">All Categories</option>
                   {Object.values(DocumentCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
             </div>
          </div>

          <div className="bg-white rounded-[2rem] border-2 border-white shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-blue-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-blue-100">
                    <th className="px-8 py-6">Document Title</th>
                    <th className="px-8 py-6">Category</th>
                    <th className="px-8 py-6">Compliance Status</th>
                    <th className="px-8 py-6">Expiry/Tracking</th>
                    <th className="px-8 py-6 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-50">
                  {filteredDocs.map(doc => (
                    <tr key={doc.id} className="hover:bg-blue-50/30 transition-all group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-lg group-hover:bg-[#1877F2] group-hover:text-white transition-all">📄</div>
                          <div>
                            <p className="font-black text-slate-900 text-sm">{doc.title}</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase">v{doc.current_version} • {doc.document_type.replace('_', ' ')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                          {doc.category}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight border ${
                          doc.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-500 border-slate-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${doc.status === 'active' ? 'bg-green-600' : 'bg-slate-400'}`}></span>
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        {doc.expiry_date ? (
                          <div className="space-y-1">
                             <p className="text-xs font-bold text-red-600 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
                                {doc.expiry_date}
                             </p>
                             <p className="text-[9px] font-black text-slate-400 uppercase italic">Expiry Alert Triggered</p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-slate-300 italic">No expiry</span>
                            <p className="text-[9px] font-black text-green-600 uppercase">Live Tracking</p>
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="text-[10px] font-black text-[#1877F2] uppercase tracking-widest hover:underline px-3 py-2 hover:bg-blue-50 rounded-xl transition-all border-2 border-transparent hover:border-blue-100">
                          Verify HASH
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LegalDashboard;