export type EmploymentType =
  | 'clt'
  | 'servidor'
  | 'pj_mei'
  | 'autonomo'
  | 'aposentado_pensionista'
  | 'empresario';

export type GuaranteeType =
  | 'caucao'
  | 'seguro_fianca'
  | 'fiador'
  | 'titulo_capitalizacao';

export interface HouseholdMember {
  id: string;
  name: string;
  relationship: string;
  age: number | string;
  hasIncome: boolean;
  monthlyIncome?: number;
}

export interface AttachedDocument {
  id: string;
  category: 'rg_cnh' | 'comprovante_residencia' | 'holerite_renda' | 'declaracao_ir' | 'outros';
  title: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  previewUrl?: string;
  uploadedAt: string;
}

export interface TenantApplication {
  id: string;
  protocolNumber: string;
  createdAt: string;
  updatedAt: string;
  status: 'pendente' | 'em_analise' | 'documentos_aprovados' | 'aprovado' | 'rejeitado';
  
  // Step 1: Personal Data
  fullName: string;
  cpf: string;
  rg: string;
  rgIssuer: string;
  birthDate: string;
  maritalStatus: 'solteiro' | 'casado' | 'uniao_estavel' | 'divorciado' | 'viuvo';
  nationality: string;
  phone: string;
  email: string;
  currentAddress: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  housingStatus: 'propria' | 'alugada' | 'familiar' | 'outra';

  // Step 2: Financial & Employment
  occupation: string;
  employmentType: EmploymentType;
  companyName: string;
  employmentDuration: string;
  monthlyGrossIncome: number;
  additionalIncome: number;
  additionalIncomeSource?: string;
  hasCreditRestriction: boolean;
  creditRestrictionDetails?: string;

  // Step 3: Household
  totalResidents: number;
  members: HouseholdMember[];
  hasPets: boolean;
  petDetails?: string;
  hasVehicle: boolean;
  vehicleDetails?: string;
  intendedMoveDate: string;

  // Step 4: Guarantee & Terms
  guaranteeType: GuaranteeType;
  guaranteeNotes?: string;
  proposalNotes?: string;

  // Step 5: Documents
  documents: AttachedDocument[];

  // Step 6: Confirmation & Signature
  authorizedCreditCheck: boolean;
  declaredAccurate: boolean;
  signatureDataUrl?: string;

  // Admin notes
  landlordNotes?: string;
}

export interface HouseDetails {
  title: string;
  subtitle: string;
  neighborhood: string;
  city: string;
  state: string;
  addressHint: string;
  olxUrl: string;
  olxId: string;
  rentAmount: number;
  condoFee: number;
  iptuFee: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpots: number;
  areaSquareMeters: number;
  description: string;
  amenities: string[];
  nearbyHighlights: string[];
  images: {
    url: string;
    title: string;
    description: string;
  }[];
}
