/**
 * TypeScript Types for Certification Module - Frontend Integration
 *
 * Generated from backend NestJS/Prisma schema
 * Use these types for API integration
 */

// ============================================
// ENUMS
// ============================================

export enum CertificationStatus {
  em_solicitacao = 'em_solicitacao',
  ativa = 'ativa',
  suspensa = 'suspensa',
  cancelada = 'cancelada',
  expirada = 'expirada',
}

export enum CertificationType {
  C1 = 'C1',  // Abate (Slaughter)
  C2 = 'C2',  // Processamento (Processing)
  C3 = 'C3',  // Armazenamento (Storage)
  C4 = 'C4',  // Restaurantes/Food Service
  C5 = 'C5',  // Varejo (Retail)
}

export enum RequestType {
  nova = 'nova',           // Nova certificação
  renovacao = 'renovacao', // Renovação
  ampliacao = 'ampliacao', // Ampliação de escopo
  inicial = 'inicial',     // Certificação inicial
  manutencao = 'manutencao', // Manutenção/ajuste menor
  adequacao = 'adequacao', // Adequação/correção
}

export enum RequestStatus {
  rascunho = 'rascunho',
  pendente = 'pendente',
  em_analise = 'em_analise',
  aprovado = 'aprovado',
  rejeitado = 'rejeitado',
  cancelado = 'cancelado',
}

export enum WorkflowStatus {
  rascunho = 'rascunho',
  pendente = 'pendente',
  em_andamento = 'em_andamento',
  aguardando_documentos = 'aguardando_documentos',
  aguardando_empresa = 'aguardando_empresa',
  aguardando_pagamento = 'aguardando_pagamento',
  em_auditoria = 'em_auditoria',
  parecer_tecnico = 'parecer_tecnico',
  aprovado = 'aprovado',
  reprovado = 'reprovado',
  certificado = 'certificado',
  cancelado = 'cancelado',
}

export enum ProcessPhase {
  triagem = 'triagem',
  analise_documental = 'analise_documental',
  elaboracao_proposta = 'elaboracao_proposta',
  aprovacao_proposta = 'aprovacao_proposta',
  elaboracao_contrato = 'elaboracao_contrato',
  assinatura_contrato = 'assinatura_contrato',
  pagamento = 'pagamento',
  planejamento_auditoria = 'planejamento_auditoria',
  auditoria = 'auditoria',
  relatorio_auditoria = 'relatorio_auditoria',
  analise_nao_conformidades = 'analise_nao_conformidades',
  parecer_tecnico = 'parecer_tecnico',
  decisao_certificacao = 'decisao_certificacao',
  emissao_certificado = 'emissao_certificado',
  entrega_certificado = 'entrega_certificado',
  monitoramento = 'monitoramento',
  encerrado = 'encerrado',
}

export enum ScopeItemStatus {
  ativo = 'ativo',
  suspenso = 'suspenso',
  removido = 'removido',
}

export enum CertificateStatus {
  ativo = 'ativo',
  suspenso = 'suspenso',
  cancelado = 'cancelado',
  expirado = 'expirado',
}

export enum ProductOrigin {
  animal = 'animal',
  vegetal = 'vegetal',
  misto = 'misto',
  quimico = 'quimico',
}

// ============================================
// CERTIFICATION
// ============================================

export interface Certification {
  id: string;
  certificationNumber: string;
  companyId: string;
  certificationType: CertificationType;
  status: CertificationStatus;
  analystId?: string;
  industrialGroupId?: string;
  industrialCategoryId?: string;
  industrialSubcategoryId?: string;
  validFrom?: Date;
  validUntil?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations (when included)
  company?: Company;
  analyst?: User;
  scope?: CertificationScope;
  requests?: CertificationRequest[];
  certificates?: Certificate[];
  history?: CertificationHistory[];
}

export interface CreateCertificationDto {
  companyId: string;
  certificationType: CertificationType;
  industrialGroupId?: string;
  industrialCategoryId?: string;
  industrialSubcategoryId?: string;
  analystId?: string;
}

export interface UpdateCertificationDto {
  status?: CertificationStatus;
  analystId?: string;
  validFrom?: Date;
  validUntil?: Date;
  notes?: string;
}

export interface CertificationFilterDto {
  companyId?: string;
  status?: CertificationStatus;
  certificationType?: CertificationType;
  analystId?: string;
  page?: number;
  limit?: number;
}

// ============================================
// CERTIFICATION REQUEST
// ============================================

export interface CertificationRequest {
  id: string;
  certificationId: string;
  requestType: RequestType;
  status: RequestStatus;
  protocolNumber?: string;
  changeDescription?: string;
  changeType?: string;
  reviewedById?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  certification?: Certification;
  workflow?: RequestWorkflow;
}

export interface CreateCertificationRequestDto {
  certificationId: string;
  requestType: RequestType;
  changeDescription?: string;
  changeType?: string;
}

export interface UpdateCertificationRequestDto {
  changeDescription?: string;
  changeType?: string;
}

// ============================================
// WORKFLOW
// ============================================

export interface RequestWorkflow {
  id: string;
  requestId: string;
  status: WorkflowStatus;
  currentPhase: ProcessPhase;
  priority?: string;
  analystId?: string;
  auditorId?: string;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  request?: CertificationRequest;
  analyst?: User;
  auditor?: User;
}

export interface UpdateWorkflowDto {
  status?: WorkflowStatus;
  currentPhase?: ProcessPhase;
  priority?: string;
}

export interface AssignAnalystDto {
  analystId: string;
}

export interface AssignAuditorDto {
  auditorId: string;
}

export interface AdvancePhaseDto {
  targetPhase: ProcessPhase;
  notes?: string;
}

export interface FlowInfo {
  requestType: RequestType;
  requiredPhases: ProcessPhase[];
  totalPhases: number;
  description: string;
}

// ============================================
// CERTIFICATION SCOPE
// ============================================

export interface CertificationScope {
  id: string;
  certificationId: string;
  description?: string;
  productionCapacity?: string;
  numEmployees?: number;
  numShifts?: number;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  products?: ScopeProduct[];
  facilities?: ScopeFacility[];
  brands?: ScopeBrand[];
  suppliers?: ScopeSupplier[];
}

export interface UpdateScopeDto {
  description?: string;
  productionCapacity?: string;
  numEmployees?: number;
  numShifts?: number;
}

export interface ScopeSummary {
  totalProducts: number;
  totalFacilities: number;
  totalBrands: number;
  totalSuppliers: number;
  activeProducts: number;
  activeFacilities: number;
  activeBrands: number;
  activeSuppliers: number;
}

// ============================================
// SCOPE ITEMS
// ============================================

export interface ScopeProduct {
  id: string;
  scopeId: string;
  name: string;
  description?: string;
  category?: string;
  origin?: ProductOrigin;
  status: ScopeItemStatus;
  addedAt: Date;
  removedAt?: Date;
}

export interface CreateScopeProductDto {
  name: string;
  description?: string;
  category?: string;
  origin?: ProductOrigin;
}

export interface ScopeFacility {
  id: string;
  scopeId: string;
  name?: string;
  address: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  facilityType?: string;
  status: ScopeItemStatus;
  addedAt: Date;
  removedAt?: Date;
}

export interface CreateScopeFacilityDto {
  name?: string;
  address: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  facilityType?: string;
}

export interface ScopeBrand {
  id: string;
  scopeId: string;
  name: string;
  description?: string;
  logoUrl?: string;
  status: ScopeItemStatus;
  addedAt: Date;
  removedAt?: Date;
}

export interface CreateScopeBrandDto {
  name: string;
  description?: string;
  logoUrl?: string;
}

export interface ScopeSupplier {
  id: string;
  scopeId: string;
  name: string;
  cnpj?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  productSupplied?: string;
  status: ScopeItemStatus;
  addedAt: Date;
  removedAt?: Date;
}

export interface CreateScopeSupplierDto {
  name: string;
  cnpj?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  productSupplied?: string;
}

// ============================================
// CERTIFICATE
// ============================================

export interface Certificate {
  id: string;
  certificationId?: string;
  processId?: string;
  certificateNumber: string;
  status: CertificateStatus;
  issuedAt: Date;
  expiresAt: Date;
  issuedById?: string;
  version: number;
  pdfUrl?: string;
  qrCodeUrl?: string;
  suspendedAt?: Date;
  suspendedReason?: string;
  cancelledAt?: Date;
  cancelledReason?: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  certification?: Certification;
  issuedBy?: User;
}

export interface CreateCertificateDto {
  processId?: string;
  certificationId?: string;
  validityMonths?: number;
}

export interface CertificateVerification {
  valid: boolean;
  certificate?: Certificate;
  company?: Company;
  message: string;
}

// ============================================
// CERTIFICATION HISTORY
// ============================================

export interface CertificationHistory {
  id: string;
  certificationId: string;
  action: string;
  description?: string;
  previousValue?: any;
  newValue?: any;
  performedById?: string;
  createdAt: Date;

  // Relations
  performedBy?: User;
}

// ============================================
// SUPPORT TYPES
// ============================================

export interface Company {
  id: string;
  name: string;
  cnpj?: string;
  tradeName?: string;
  // ... other company fields
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  // ... other user fields
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CertificationStatistics {
  total: number;
  byStatus: Record<CertificationStatus, number>;
  byType: Record<CertificationType, number>;
  expiringSoon: number;
}

export interface WorkflowStatistics {
  total: number;
  byStatus: Record<WorkflowStatus, number>;
  byPhase: Record<ProcessPhase, number>;
  averageCompletionDays: number;
}

export interface StatusDetails {
  currentStatus: CertificationStatus;
  calculatedStatus: CertificationStatus;
  reasons: string[];
  hasActiveRequest: boolean;
  hasValidCertificate: boolean;
  isExpired: boolean;
  validUntil?: Date;
}
