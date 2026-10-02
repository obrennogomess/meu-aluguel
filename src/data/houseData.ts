import { HouseDetails } from '../types/rental';

// Exact 17 photos from the OLX listing 1524691859
import house01 from '../assets/images/olx_house/house_01.jpg';
import house02 from '../assets/images/olx_house/house_02.jpg';
import house03 from '../assets/images/olx_house/house_03.jpg';
import house04 from '../assets/images/olx_house/house_04.jpg';
import house05 from '../assets/images/olx_house/house_05.jpg';
import house06 from '../assets/images/olx_house/house_06.jpg';
import house07 from '../assets/images/olx_house/house_07.jpg';
import house08 from '../assets/images/olx_house/house_08.jpg';
import house09 from '../assets/images/olx_house/house_09.jpg';
import house10 from '../assets/images/olx_house/house_10.jpg';
import house11 from '../assets/images/olx_house/house_11.jpg';
import house12 from '../assets/images/olx_house/house_12.jpg';
import house13 from '../assets/images/olx_house/house_13.jpg';
import house14 from '../assets/images/olx_house/house_14.jpg';
import house15 from '../assets/images/olx_house/house_15.jpg';
import house16 from '../assets/images/olx_house/house_16.jpg';
import house17 from '../assets/images/olx_house/house_17.jpg';

export const HOUSE_DATA: HouseDetails = {
  title: 'Alugo casa em Itaquera',
  subtitle: 'Casa com 3 quartos (1 suíte), jardim de inverno e vagas para 3 carros - Direto com o proprietário',
  neighborhood: 'Jardim Soraia (Itaquera)',
  city: 'São Paulo',
  state: 'SP',
  addressHint: 'Jardim Soraia / Itaquera, São Paulo - SP · Perto de mercados, escolas, paradas de ônibus e campus',
  olxUrl: 'https://sp.olx.com.br/sao-paulo-e-regiao/imoveis/alugo-casa-em-itaquera-1524691859?',
  olxId: '1524691859',
  rentAmount: 1250, // VALOR EXATO DO ANÚNCIO NA OLX: R$ 1.250 / mês
  condoFee: 0,     // Sem condomínio (aluguel direto)
  iptuFee: 0,      // Incluso ou sem cobrança adicional discriminada
  bedrooms: 3,     // 3 quartos (1 suíte)
  bathrooms: 2,    // 1 suíte + 1 banheiro social
  parkingSpots: 3, // Vagas para três carros
  areaSquareMeters: 90,
  description: `Casa três quartos; 1 suíte;
Jardim de inverno;
Vagas para três carros;
Perto de mercados, escolas, paradas de ônibus, campus UNB, etc;
Aluga direto com o proprietário;`,
  amenities: [
    '3 Quartos espaçosos (sendo 1 suíte)',
    'Jardim de inverno com excelente luz natural',
    'Vagas de garagem para 3 carros',
    'Aluguel direto com o proprietário',
    'Cozinha e área de serviço',
    'Banheiro social completo e banheiro privativo da suíte',
    'Ambiente familiar, seguro e tranquilo',
    'Próximo a transporte coletivo e comércios locais',
  ],
  nearbyHighlights: [
    'Perto de mercados, padarias e farmácias',
    'Escolas públicas e particulares da região',
    'Paradas de ônibus com linhas diretas para o Metrô Itaquera',
    'Fácil acesso à Estação Corinthians-Itaquera e Radial Leste',
    'Próximo a campus universitário e polos de ensino',
    'Bairro residencial sossegado (Jardim Soraia / Itaquera)',
  ],
  images: [
    {
      url: house01,
      title: 'Fachada & Área Frontal',
      description: 'Vista frontal da casa com portão e espaço de garagem para até 3 carros.',
    },
    {
      url: house02,
      title: 'Jardim de Inverno',
      description: 'Charme do jardim de inverno interno proporcionando iluminação e ventilação natural.',
    },
    {
      url: house03,
      title: 'Sala de Estar',
      description: 'Ambiente de estar amplo com piso cerâmico e ótima iluminação.',
    },
    {
      url: house04,
      title: 'Suíte Principal',
      description: 'Dormitório de casal com banheiro privativo.',
    },
    {
      url: house05,
      title: 'Banheiro da Suíte',
      description: 'Banheiro completo com revestimento cerâmico e box.',
    },
    {
      url: house06,
      title: 'Segundo Quarto',
      description: 'Segundo dormitório ventilado e bem iluminado.',
    },
    {
      url: house07,
      title: 'Terceiro Quarto',
      description: 'Terceiro quarto versátil para dormitório infantil ou home office.',
    },
    {
      url: house08,
      title: 'Cozinha',
      description: 'Cozinha com bancada, azulejos até o teto e espaço para armários.',
    },
    {
      url: house09,
      title: 'Banheiro Social',
      description: 'Banheiro social que atende aos dois quartos e às visitas.',
    },
    {
      url: house10,
      title: 'Área de Serviço / Lavanderia',
      description: 'Espaço funcional para máquina de lavar, tanque e varal.',
    },
    {
      url: house11,
      title: 'Corredor Lateral & Acesso',
      description: 'Circulação lateral arejada facilitando a passagem.',
    },
    {
      url: house12,
      title: 'Vagas de Garagem (3 Carros)',
      description: 'Área coberta e descoberta comportando até 3 veículos com portão seguro.',
    },
    {
      url: house13,
      title: 'Detalhes da Sala e Circulação',
      description: 'Integração dos ambientes internos com piso bem conservado.',
    },
    {
      url: house14,
      title: 'Vista Interna Adicional',
      description: 'Perspectiva interna mostrando a amplitude dos cômodos.',
    },
    {
      url: house15,
      title: 'Ambiente Íntimo / Dormitório',
      description: 'Detalhe dos acabamentos e janelas com boa ventilação.',
    },
    {
      url: house16,
      title: 'Perspectiva da Cozinha / Copa',
      description: 'Outro ângulo da cozinha demonstrando excelente espaço.',
    },
    {
      url: house17,
      title: 'Entrada Principal do Imóvel',
      description: 'Acesso privativo seguro para o morador e sua família.',
    },
  ],
};
