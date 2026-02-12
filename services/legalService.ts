
import { DocumentType, LegalDocument, LocationData, ComplianceStatus, DocumentCategory, ComplianceAlert } from '../types';

// Mock data storage
let acceptedDocuments: number[] = [];
let languageAcknowledged = false;
let nriWaiverSigned = false;

export const legalService = {
  getMandatoryDocuments: async (context: string): Promise<LegalDocument[]> => {
    const documents: LegalDocument[] = [
      {
        id: 1,
        title: 'MANAS360 Privacy Policy',
        category: DocumentCategory.PATIENT,
        document_type: DocumentType.PRIVACY_POLICY,
        current_version: '1.2',
        status: 'active',
        uploaded_at: '2026-01-10T08:00:00Z',
        blocks_access: true
      },
      {
        id: 2,
        title: 'Platform Terms of Service',
        category: DocumentCategory.PATIENT,
        document_type: DocumentType.TERMS_OF_SERVICE,
        current_version: '1.0',
        status: 'active',
        uploaded_at: '2026-01-12T10:30:00Z',
        blocks_access: true
      },
      {
        id: 3,
        title: 'Consent for Data Processing',
        category: DocumentCategory.PATIENT,
        document_type: DocumentType.DATA_PROCESSING,
        current_version: '2.1',
        status: 'active',
        uploaded_at: '2026-01-15T14:20:00Z',
        blocks_access: true
      }
    ];
    
    const filtered = documents.filter(doc => !acceptedDocuments.includes(doc.id));
    
    // For demo purposes, if everything is signed, we reset or return the set anyway
    // to ensure the 'Binding Docs' section in the flow doesn't appear blank.
    return filtered.length > 0 ? filtered : documents;
  },

  getAllRepositoryDocuments: async (): Promise<LegalDocument[]> => {
    const docs: LegalDocument[] = [
      { id: 101, title: 'Patient Data Consent v1.2', category: DocumentCategory.PATIENT, document_type: DocumentType.CONSENT_FORM, current_version: '1.2', status: 'active', uploaded_at: '2026-01-01', blocks_access: true },
      { id: 102, title: 'Privacy Policy (Global)', category: DocumentCategory.PATIENT, document_type: DocumentType.PRIVACY_POLICY, current_version: '3.0', status: 'active', uploaded_at: '2026-01-05', blocks_access: true },
      { id: 201, title: 'Therapist Service Agreement', category: DocumentCategory.THERAPIST, document_type: DocumentType.THERAPIST_AGREEMENT, current_version: '2.4', status: 'active', uploaded_at: '2025-12-15', blocks_access: true },
      { id: 202, title: 'Confidentiality & Non-Compete', category: DocumentCategory.THERAPIST, document_type: DocumentType.NDA, current_version: '1.1', status: 'active', uploaded_at: '2026-01-10', blocks_access: true },
      { id: 501, title: 'AWS Cloud Services SLA', category: DocumentCategory.VENDOR, document_type: DocumentType.OTHER, current_version: '2026-Q1', status: 'active', uploaded_at: '2026-01-01', blocks_access: true, expiry_date: '2026-12-31' },
      { id: 602, title: 'Board Resolution: DPDPA Adoption', category: DocumentCategory.CORPORATE, document_type: DocumentType.OTHER, current_version: '1.0', status: 'active', uploaded_at: '2026-01-15', blocks_access: false }
    ];
    return docs;
  },

  detectLocation: async (): Promise<LocationData> => {
    return {
      is_nri: true,
      country_code: 'US',
      country_name: 'United States',
      city: 'San Francisco',
      ip_address: '142.250.185.78'
    };
  },

  checkCompliance: async (userId: number): Promise<ComplianceStatus> => {
    const areas: ComplianceStatus['areas'] = {
      dpdpa: {
        label: 'DPDPA 2023',
        score: 92.4,
        weight: 0.30,
        status: 'excellent',
        metrics: [
          { label: 'Consent Coverage', value: '98.2%', target: '>95%' },
          { label: 'Avg Deletion Time', value: '4 days', target: '<30' },
          { label: 'Breach Incidents', value: '0', target: '0' }
        ]
      },
      nmc: {
        label: 'NMC Guidelines',
        score: 88.0,
        weight: 0.25,
        status: 'good',
        metrics: [
          { label: 'Verified Credentials', value: '100%', target: '100%' },
          { label: 'Prescription Templates', value: 'Compliant' }
        ]
      },
      mha: {
        label: 'Mental Health Act',
        score: 75.0,
        weight: 0.20,
        status: 'acceptable',
        metrics: [
          { label: 'Patient Rights Docs', value: 'Verified' },
          { label: 'Emergency Resp', value: '2.4 min' }
        ]
      },
      it_act: {
        label: 'IT Act 2000',
        score: 100.0,
        weight: 0.15,
        status: 'excellent',
        metrics: [
          { label: 'Digital Signatures', value: 'Valid' },
          { label: 'Hash Integrity', value: '100%' }
        ]
      },
      documents: {
        label: 'Document Coverage',
        score: 85.0,
        weight: 0.10,
        status: 'good',
        metrics: [
          { label: 'Required Available', value: '18/20' },
          { label: 'Expired', value: '0', target: '0' }
        ]
      }
    };

    const overallScore = Object.values(areas).reduce((acc, curr) => acc + (curr.score * curr.weight), 0);

    return {
      overall_score: parseFloat(overallScore.toFixed(1)),
      grade: overallScore >= 95 ? 'A+' : overallScore >= 90 ? 'A' : overallScore >= 80 ? 'B+' : 'B',
      status: 'Excellent',
      areas,
      alerts: {
        critical: [
          { id: 1, alert_title: '3 Legal Documents Expired', alert_message: 'Critical vendor agreements need renewal.', created_at: new Date().toISOString(), priority: 'high' }
        ],
        warning: [
          { id: 2, alert_title: '12 Agreements Expiring Soon', alert_message: 'Institutional agreements worth ₹2.4Cr expiring in 30 days.', created_at: new Date().toISOString(), priority: 'medium' },
          { id: 3, alert_title: 'Missing Consent Tracking', alert_message: '142 active users missing v1.2 Privacy Policy signature.', created_at: new Date().toISOString(), priority: 'medium' }
        ],
        info: [],
        total_count: 3
      }
    };
  },

  acceptDocument: async (docId: number) => {
    if (!acceptedDocuments.includes(docId)) {
      acceptedDocuments.push(docId);
    }
    return { success: true };
  },

  acknowledgeLanguage: async () => {
    languageAcknowledged = true;
    return { success: true };
  },

  signNRIWaiver: async (signature: string) => {
    nriWaiverSigned = true;
    return { success: true };
  }
};
