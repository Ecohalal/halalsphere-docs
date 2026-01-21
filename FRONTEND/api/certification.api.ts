/**
 * API Service for Certification Module - Frontend Integration
 *
 * Example implementation using fetch/axios pattern
 * Adapt to your frontend framework (React, Vue, Angular)
 */

import {
  Certification,
  CreateCertificationDto,
  UpdateCertificationDto,
  CertificationFilterDto,
  CertificationRequest,
  CreateCertificationRequestDto,
  UpdateCertificationRequestDto,
  RequestWorkflow,
  UpdateWorkflowDto,
  AssignAnalystDto,
  AssignAuditorDto,
  AdvancePhaseDto,
  CertificationScope,
  UpdateScopeDto,
  CreateScopeProductDto,
  CreateScopeFacilityDto,
  CreateScopeBrandDto,
  CreateScopeSupplierDto,
  Certificate,
  CreateCertificateDto,
  CertificationHistory,
  PaginatedResponse,
  CertificationStatistics,
  WorkflowStatistics,
  FlowInfo,
  StatusDetails,
  ScopeSummary,
  RequestType,
  ProcessPhase,
} from '../types/certification.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// ============================================
// HTTP Client Helper
// ============================================

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('access_token');

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP Error: ${response.status}`);
  }

  return response.json();
}

// ============================================
// CERTIFICATIONS API
// ============================================

export const certificationsApi = {
  /**
   * List certifications with filters
   */
  list: (filters?: CertificationFilterDto): Promise<PaginatedResponse<Certification>> =>
    apiRequest(`/certifications?${new URLSearchParams(filters as any)}`),

  /**
   * Get certification by ID
   */
  getById: (id: string): Promise<Certification> =>
    apiRequest(`/certifications/${id}`),

  /**
   * Get certifications by company
   */
  getByCompany: (companyId: string): Promise<Certification[]> =>
    apiRequest(`/certifications/company/${companyId}`),

  /**
   * Create new certification
   */
  create: (data: CreateCertificationDto): Promise<Certification> =>
    apiRequest('/certifications', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Update certification
   */
  update: (id: string, data: UpdateCertificationDto): Promise<Certification> =>
    apiRequest(`/certifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * Update certification status
   */
  updateStatus: (id: string, status: string): Promise<Certification> =>
    apiRequest(`/certifications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  /**
   * Assign analyst to certification
   */
  assignAnalyst: (id: string, analystId: string): Promise<Certification> =>
    apiRequest(`/certifications/${id}/analyst`, {
      method: 'PATCH',
      body: JSON.stringify({ analystId }),
    }),

  /**
   * Get certification timeline/history
   */
  getTimeline: (id: string, limit?: number): Promise<CertificationHistory[]> =>
    apiRequest(`/certifications/${id}/timeline?limit=${limit || 50}`),

  /**
   * Get certification statistics
   */
  getStatistics: (): Promise<CertificationStatistics> =>
    apiRequest('/certifications/statistics'),

  /**
   * Get expiring certifications
   */
  getExpiring: (days?: number): Promise<Certification[]> =>
    apiRequest(`/certifications/expiring?days=${days || 90}`),

  /**
   * Get status calculation details
   */
  getStatusDetails: (id: string): Promise<StatusDetails> =>
    apiRequest(`/certifications/${id}/status-details`),

  /**
   * Recalculate certification status
   */
  recalculateStatus: (id: string): Promise<Certification> =>
    apiRequest(`/certifications/${id}/recalculate-status`, { method: 'PATCH' }),
};

// ============================================
// CERTIFICATION REQUESTS API
// ============================================

export const certificationRequestsApi = {
  /**
   * List requests with filters
   */
  list: (filters?: any): Promise<PaginatedResponse<CertificationRequest>> =>
    apiRequest(`/certification-requests?${new URLSearchParams(filters)}`),

  /**
   * Get request by ID
   */
  getById: (id: string): Promise<CertificationRequest> =>
    apiRequest(`/certification-requests/${id}`),

  /**
   * Get request by protocol number
   */
  getByProtocol: (protocol: string): Promise<CertificationRequest> =>
    apiRequest(`/certification-requests/protocol/${protocol}`),

  /**
   * Get requests by certification
   */
  getByCertification: (certificationId: string): Promise<CertificationRequest[]> =>
    apiRequest(`/certification-requests/certification/${certificationId}`),

  /**
   * Create new request
   */
  create: (data: CreateCertificationRequestDto): Promise<CertificationRequest> =>
    apiRequest('/certification-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Update request (draft only)
   */
  update: (id: string, data: UpdateCertificationRequestDto): Promise<CertificationRequest> =>
    apiRequest(`/certification-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * Submit request for review
   */
  submit: (id: string): Promise<CertificationRequest> =>
    apiRequest(`/certification-requests/${id}/submit`, { method: 'PATCH' }),

  /**
   * Start review (analyst)
   */
  startReview: (id: string): Promise<CertificationRequest> =>
    apiRequest(`/certification-requests/${id}/review`, { method: 'PATCH' }),

  /**
   * Approve request
   */
  approve: (id: string, notes?: string): Promise<CertificationRequest> =>
    apiRequest(`/certification-requests/${id}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({ notes }),
    }),

  /**
   * Reject request
   */
  reject: (id: string, reason: string, notes?: string): Promise<CertificationRequest> =>
    apiRequest(`/certification-requests/${id}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ reason, notes }),
    }),

  /**
   * Cancel request
   */
  cancel: (id: string, reason: string): Promise<CertificationRequest> =>
    apiRequest(`/certification-requests/${id}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    }),

  /**
   * Get statistics
   */
  getStatistics: (): Promise<any> =>
    apiRequest('/certification-requests/statistics'),
};

// ============================================
// WORKFLOWS API
// ============================================

export const workflowsApi = {
  /**
   * List workflows
   */
  list: (filters?: any): Promise<PaginatedResponse<RequestWorkflow>> =>
    apiRequest(`/workflows?${new URLSearchParams(filters)}`),

  /**
   * Get workflow by ID
   */
  getById: (id: string): Promise<RequestWorkflow> =>
    apiRequest(`/workflows/${id}`),

  /**
   * Get workflow by request ID
   */
  getByRequestId: (requestId: string): Promise<RequestWorkflow> =>
    apiRequest(`/workflows/request/${requestId}`),

  /**
   * Get flow info by request type
   */
  getFlowInfo: (requestType: RequestType): Promise<FlowInfo> =>
    apiRequest(`/workflows/flow/${requestType}`),

  /**
   * Get valid next phases for workflow
   */
  getNextPhases: (id: string): Promise<{
    currentPhase: ProcessPhase;
    requestType: RequestType;
    validNextPhases: ProcessPhase[];
    progress: number;
    totalPhases: number;
  }> =>
    apiRequest(`/workflows/${id}/next-phases`),

  /**
   * Update workflow
   */
  update: (id: string, data: UpdateWorkflowDto): Promise<RequestWorkflow> =>
    apiRequest(`/workflows/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  /**
   * Assign analyst
   */
  assignAnalyst: (id: string, data: AssignAnalystDto): Promise<RequestWorkflow> =>
    apiRequest(`/workflows/${id}/assign-analyst`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  /**
   * Assign auditor
   */
  assignAuditor: (id: string, data: AssignAuditorDto): Promise<RequestWorkflow> =>
    apiRequest(`/workflows/${id}/assign-auditor`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  /**
   * Advance to next phase
   */
  advancePhase: (id: string, data: AdvancePhaseDto): Promise<RequestWorkflow> =>
    apiRequest(`/workflows/${id}/advance`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  /**
   * Get statistics
   */
  getStatistics: (): Promise<WorkflowStatistics> =>
    apiRequest('/workflows/statistics'),
};

// ============================================
// SCOPE API
// ============================================

export const scopeApi = {
  /**
   * Get full scope for certification
   */
  getScope: (certificationId: string): Promise<CertificationScope> =>
    apiRequest(`/certifications/${certificationId}/scope`),

  /**
   * Get scope summary (counts)
   */
  getSummary: (certificationId: string): Promise<ScopeSummary> =>
    apiRequest(`/certifications/${certificationId}/scope/summary`),

  /**
   * Update scope general info
   */
  updateScope: (certificationId: string, data: UpdateScopeDto): Promise<CertificationScope> =>
    apiRequest(`/certifications/${certificationId}/scope`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Products
  products: {
    list: (certificationId: string, includeRemoved?: boolean) =>
      apiRequest(`/certifications/${certificationId}/scope/products?includeRemoved=${includeRemoved}`),
    add: (certificationId: string, data: CreateScopeProductDto) =>
      apiRequest(`/certifications/${certificationId}/scope/products`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (certificationId: string, productId: string, data: any) =>
      apiRequest(`/certifications/${certificationId}/scope/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    remove: (certificationId: string, productId: string) =>
      apiRequest(`/certifications/${certificationId}/scope/products/${productId}`, {
        method: 'DELETE',
      }),
  },

  // Facilities
  facilities: {
    list: (certificationId: string, includeRemoved?: boolean) =>
      apiRequest(`/certifications/${certificationId}/scope/facilities?includeRemoved=${includeRemoved}`),
    add: (certificationId: string, data: CreateScopeFacilityDto) =>
      apiRequest(`/certifications/${certificationId}/scope/facilities`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (certificationId: string, facilityId: string, data: any) =>
      apiRequest(`/certifications/${certificationId}/scope/facilities/${facilityId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    remove: (certificationId: string, facilityId: string) =>
      apiRequest(`/certifications/${certificationId}/scope/facilities/${facilityId}`, {
        method: 'DELETE',
      }),
  },

  // Brands
  brands: {
    list: (certificationId: string, includeRemoved?: boolean) =>
      apiRequest(`/certifications/${certificationId}/scope/brands?includeRemoved=${includeRemoved}`),
    add: (certificationId: string, data: CreateScopeBrandDto) =>
      apiRequest(`/certifications/${certificationId}/scope/brands`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (certificationId: string, brandId: string, data: any) =>
      apiRequest(`/certifications/${certificationId}/scope/brands/${brandId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    remove: (certificationId: string, brandId: string) =>
      apiRequest(`/certifications/${certificationId}/scope/brands/${brandId}`, {
        method: 'DELETE',
      }),
  },

  // Suppliers
  suppliers: {
    list: (certificationId: string, includeRemoved?: boolean) =>
      apiRequest(`/certifications/${certificationId}/scope/suppliers?includeRemoved=${includeRemoved}`),
    add: (certificationId: string, data: CreateScopeSupplierDto) =>
      apiRequest(`/certifications/${certificationId}/scope/suppliers`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (certificationId: string, supplierId: string, data: any) =>
      apiRequest(`/certifications/${certificationId}/scope/suppliers/${supplierId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    remove: (certificationId: string, supplierId: string) =>
      apiRequest(`/certifications/${certificationId}/scope/suppliers/${supplierId}`, {
        method: 'DELETE',
      }),
  },
};

// ============================================
// CERTIFICATES API
// ============================================

export const certificatesApi = {
  /**
   * List certificates
   */
  list: (filters?: any): Promise<PaginatedResponse<Certificate>> =>
    apiRequest(`/certificates?${new URLSearchParams(filters)}`),

  /**
   * Get certificate by ID
   */
  getById: (id: string): Promise<Certificate> =>
    apiRequest(`/certificates/${id}`),

  /**
   * Get certificate by number
   */
  getByNumber: (number: string): Promise<Certificate> =>
    apiRequest(`/certificates/number/${number}`),

  /**
   * Get certificates by certification
   */
  getByCertification: (certificationId: string): Promise<Certificate[]> =>
    apiRequest(`/certificates/certification/${certificationId}`),

  /**
   * Issue new certificate
   */
  issue: (data: CreateCertificateDto): Promise<Certificate> =>
    apiRequest('/certificates', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Verify certificate (public - no auth required)
   */
  verify: async (number: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/certificates/verify/${number}`);
    return response.json();
  },

  /**
   * Suspend certificate
   */
  suspend: (id: string, reason: string): Promise<Certificate> =>
    apiRequest(`/certificates/${id}/suspend`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    }),

  /**
   * Reactivate certificate
   */
  reactivate: (id: string): Promise<Certificate> =>
    apiRequest(`/certificates/${id}/reactivate`, { method: 'PATCH' }),

  /**
   * Cancel certificate
   */
  cancel: (id: string, reason: string): Promise<Certificate> =>
    apiRequest(`/certificates/${id}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    }),

  /**
   * Get expiring certificates
   */
  getExpiring: (days?: number): Promise<Certificate[]> =>
    apiRequest(`/certificates/expiring?daysAhead=${days || 90}`),

  /**
   * Get statistics
   */
  getStatistics: (): Promise<any> =>
    apiRequest('/certificates/statistics'),
};
