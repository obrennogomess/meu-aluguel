import { TenantApplication } from '../types/rental';

export function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
}

export function validateCPF(cpf: string): boolean {
  const clean = cpf.replace(/\D/g, '');
  if (clean.length !== 11) return false;
  // All same digits like 111.111.111-11
  if (/^(\d)\1{10}$/.test(clean)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(clean.charAt(i), 10) * (10 - i);
  }
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(clean.charAt(9), 10)) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(clean.charAt(i), 10) * (11 - i);
  }
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(clean.charAt(10), 10)) return false;

  return true;
}

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits.length > 0 ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

export function formatCEP(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}

export async function fetchAddressByCep(cep: string): Promise<{
  street: string;
  neighborhood: string;
  city: string;
  state: string;
} | null> {
  const clean = cep.replace(/\D/g, '');
  if (clean.length !== 8) return null;
  try {
    const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.erro) return null;
    return {
      street: data.logradouro || '',
      neighborhood: data.bairro || '',
      city: data.localidade || '',
      state: data.uf || '',
    };
  } catch (err) {
    console.warn('ViaCEP offline or network error', err);
    return null;
  }
}

export function generateProtocolNumber(): string {
  const year = new Date().getFullYear();
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `ITAQ-${year}-${randomPart}`;
}

export function getSampleTenantData(): Partial<TenantApplication> {
  return {
    fullName: 'Lucas Oliveira Santos',
    cpf: '384.921.878-40',
    rg: '49.812.345-6',
    rgIssuer: 'SSP/SP',
    birthDate: '1992-05-14',
    maritalStatus: 'casado',
    nationality: 'Brasileira',
    phone: '(11) 98721-4432',
    email: 'lucas.santos.dev@gmail.com',
    currentAddress: {
      cep: '08210-040',
      street: 'Rua São Teodoro',
      number: '450',
      complement: 'Apto 32',
      neighborhood: 'Vila Carmosina',
      city: 'São Paulo',
      state: 'SP',
    },
    housingStatus: 'alugada',
    occupation: 'Analista de Sistemas Pleno',
    employmentType: 'clt',
    companyName: 'TechLog Soluções Digitais Ltda',
    employmentDuration: '3 anos e 6 meses',
    monthlyGrossIncome: 6800,
    additionalIncome: 1200,
    additionalIncomeSource: 'Projetos freelancer pontuais',
    hasCreditRestriction: false,
    creditRestrictionDetails: '',
    totalResidents: 3,
    members: [
      {
        id: '1',
        name: 'Mariana Alves Santos',
        relationship: 'Esposa',
        age: 31,
        hasIncome: true,
        monthlyIncome: 3200,
      },
      {
        id: '2',
        name: 'Enzo Alves Santos',
        relationship: 'Filho',
        age: 5,
        hasIncome: false,
      },
    ],
    hasPets: true,
    petDetails: '1 cachorro pequeno porte (Shih-tzu, dócil e silencioso)',
    hasVehicle: true,
    vehicleDetails: '1 carro (Chevrolet Onix 2021)',
    intendedMoveDate: 'Imediata (dentro de 15 a 20 dias)',
    guaranteeType: 'caucao',
    guaranteeNotes: 'Tenho os 3 meses de caução disponíveis para depósito imediato (R$ 3.750,00).',
    proposalNotes: 'Procuramos um lar tranquilo e seguro para nossa família. Gostamos muito da localização em Itaquera.',
    authorizedCreditCheck: true,
    declaredAccurate: true,
    documents: [
      {
        id: 'doc-1',
        category: 'rg_cnh',
        title: 'CNH do Titular e Cônjuge',
        fileName: 'cnh_lucas_mariana.pdf',
        fileSize: '1.2 MB',
        fileType: 'application/pdf',
        uploadedAt: new Date().toISOString(),
      },
      {
        id: 'doc-2',
        category: 'holerite_renda',
        title: '3 Últimos Holerites CLT',
        fileName: 'holerites_ultimos_meses.pdf',
        fileSize: '2.4 MB',
        fileType: 'application/pdf',
        uploadedAt: new Date().toISOString(),
      },
      {
        id: 'doc-3',
        category: 'comprovante_residencia',
        title: 'Conta de Energia (Enel)',
        fileName: 'comprovante_enel_setembro.pdf',
        fileSize: '850 KB',
        fileType: 'application/pdf',
        uploadedAt: new Date().toISOString(),
      },
    ],
  };
}
