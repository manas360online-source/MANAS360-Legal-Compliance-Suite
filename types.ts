
export enum UserType {
  PATIENT = 'patient',
  THERAPIST = 'therapist',
  COACH = 'coach',
  ADMIN = 'admin'
}

export enum DocumentCategory {
  PATIENT = 'Patient Documents',
  THERAPIST = 'Therapist Documents',
  COACH = 'Coach Documents',
  PARTNERSHIP = 'Partnership Documents',
  VENDOR = 'Vendor Agreements',
  CORPORATE = 'Corporate Documents'
}

export enum DocumentType {
  NDA = 'nda',
  PRIVACY_POLICY = 'privacy_policy',
  TERMS_OF_SERVICE = 'terms_of_service',
  CONSENT_FORM = 'consent_form',
  DATA_PROCESSING = 'data_processing',
  THERAPIST_AGREEMENT = 'therapist_agreement',
  EMPLOYMENT_CONTRACT = 'employment_contract',
  NRI_WAIVER = 'nri_waiver',
  OTHER = 'other'
}

export interface LegalDocument {
  id: number;
  title: string;
  category: DocumentCategory;
  document_type: DocumentType;
  current_version: string;
  status: 'active' | 'archived' | 'deleted';
  uploaded_at: string;
  file_path?: string;
  blocks_access: boolean;
  expiry_date?: string;
}

export interface LocationData {
  is_nri: boolean;
  country_code: string;
  country_name: string;
  city: string;
  ip_address: string;
}

export interface ComplianceAreaScore {
  label: string;
  score: number;
  weight: number;
  status: 'excellent' | 'good' | 'acceptable' | 'needs_improvement' | 'critical';
  metrics: { label: string; value: string; target?: string }[];
}

export interface ComplianceAlert {
  id: number;
  alert_title: string;
  alert_message: string;
  created_at: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ComplianceStatus {
  overall_score: number;
  grade: string;
  status: string;
  areas: {
    dpdpa: ComplianceAreaScore;
    nmc: ComplianceAreaScore;
    mha: ComplianceAreaScore;
    it_act: ComplianceAreaScore;
    documents: ComplianceAreaScore;
  };
  alerts: {
    critical: ComplianceAlert[];
    warning: ComplianceAlert[];
    info: ComplianceAlert[];
    total_count: number;
  };
}
