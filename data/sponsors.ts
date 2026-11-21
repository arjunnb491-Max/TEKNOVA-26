export type SponsorTier = 
  | 'title' 
  | 'powered_by' 
  | 'associate' 
  | 'community' 
  | 'media' 
  | 'technology' 
  | 'supporting';

export interface Sponsor {
  id: string;
  name: string;
  slug: string;
  tier: SponsorTier;
  category: string;
  description?: string;
  logoUrl: string;
  websiteUrl?: string;
  isActive: boolean;
  displayOrder: number;
  highlighted?: boolean;
}

export const OFFICIAL_SPONSORS: Sponsor[] = [
  // SECTION 2 – TITLE SPONSOR
  {
    id: 'sp-title-1',
    name: 'CyberX Networks',
    slug: 'cyberx-networks',
    tier: 'title',
    category: 'Title Sponsor',
    description: 'Leading provider of decentralized high-performance cloud fabric and sovereign AI infrastructure. Powering the next generation of campus technocrats at TEKNOVA’26.',
    logoUrl: '/images/sponsors/cyberx-networks.svg',
    websiteUrl: 'https://teknova.co.in',
    isActive: true,
    displayOrder: 1,
    highlighted: true,
  },

  // SECTION 3 – POWERED BY
  {
    id: 'sp-pwr-1',
    name: 'NeonCloud Systems',
    slug: 'neoncloud-systems',
    tier: 'powered_by',
    category: 'Powered By • Cloud & AI Partner',
    description: 'Ultra-low latency serverless compute clusters and automated developer pipelines engineered for high-concurrency applications.',
    logoUrl: '/images/sponsors/neoncloud.svg',
    websiteUrl: 'https://teknova.co.in',
    isActive: true,
    displayOrder: 2,
  },
  {
    id: 'sp-pwr-2',
    name: 'Apex Gaming Rig',
    slug: 'apex-gaming-rig',
    tier: 'powered_by',
    category: 'Powered By • Esports Arena Partner',
    description: 'Precision-engineered tournament hardware, competitive rigs, and dedicated frame-rate telemetry for the TEKNOVA E-Clash arena.',
    logoUrl: '/images/sponsors/apex-gaming.svg',
    websiteUrl: 'https://teknova.co.in',
    isActive: true,
    displayOrder: 3,
  },

  // SECTION 4 – ASSOCIATE SPONSORS
  {
    id: 'sp-asc-1',
    name: 'Vortex DevLabs',
    slug: 'vortex-devlabs',
    tier: 'associate',
    category: 'Associate Sponsor • Dev Tools',
    description: 'Developer productivity ecosystem offering AI code assistance and rapid API scaffolding.',
    logoUrl: '/images/sponsors/vortex-devlabs.svg',
    websiteUrl: 'https://teknova.co.in',
    isActive: true,
    displayOrder: 4,
  },
  {
    id: 'sp-asc-2',
    name: 'HyperByte Security',
    slug: 'hyperbyte-security',
    tier: 'associate',
    category: 'Associate Sponsor • Cyber Defense',
    description: 'Zero-trust network defense and automated bug hunting suites for mission-critical web applications.',
    logoUrl: '/images/sponsors/hyperbyte-sec.svg',
    websiteUrl: 'https://teknova.co.in',
    isActive: true,
    displayOrder: 5,
  },
  {
    id: 'sp-asc-3',
    name: 'Quantum Pulse Media',
    slug: 'quantum-pulse-media',
    tier: 'associate',
    category: 'Associate Sponsor • Digital Media',
    description: 'Next-gen streaming network, live-broadcast production, and multi-channel youth media syndication.',
    logoUrl: '/images/sponsors/quantum-pulse.svg',
    websiteUrl: 'https://teknova.co.in',
    isActive: true,
    displayOrder: 6,
  },

  // SECTION 5 – COMMUNITY & MEDIA PARTNERS
  // Community Partners
  {
    id: 'sp-com-1',
    name: 'FOSS United Kochi',
    slug: 'foss-united-kochi',
    tier: 'community',
    category: 'Community Partner',
    description: 'Promoting free and open-source software culture and grassroots hacker spaces across Kerala.',
    logoUrl: '/images/sponsors/foss-united.svg',
    websiteUrl: 'https://teknova.co.in',
    isActive: true,
    displayOrder: 7,
  },
  {
    id: 'sp-com-2',
    name: 'Kochi Devs Hub',
    slug: 'kochi-devs-hub',
    tier: 'community',
    category: 'Community Partner',
    description: 'Kerala tech collective fostering peer learning, developer meetups, and open mentorship.',
    logoUrl: '/images/sponsors/kochi-devs.svg',
    websiteUrl: 'https://teknova.co.in',
    isActive: true,
    displayOrder: 8,
  },

  // Media Partners
  {
    id: 'sp-med-1',
    name: 'Tech Malayalam',
    slug: 'tech-malayalam',
    tier: 'media',
    category: 'Media Partner',
    description: 'Leading regional technology news portal and digital creator collective covering South India tech events.',
    logoUrl: '/images/sponsors/techmalayalam.svg',
    websiteUrl: 'https://teknova.co.in',
    isActive: true,
    displayOrder: 9,
  },
  {
    id: 'sp-med-2',
    name: 'Campus Beats',
    slug: 'campus-beats',
    tier: 'media',
    category: 'Media Partner',
    description: 'Intercollegiate youth radio and campus fest reporting network reaching 50,000+ college students.',
    logoUrl: '/images/sponsors/campus-beats.svg',
    websiteUrl: 'https://teknova.co.in',
    isActive: true,
    displayOrder: 10,
  },

  // Technology Partners
  {
    id: 'sp-tch-1',
    name: 'GitHub Campus',
    slug: 'github-campus',
    tier: 'technology',
    category: 'Technology Partner',
    description: 'Empowering student developers with developer packs, codespaces, and open-source toolkits.',
    logoUrl: '/images/sponsors/github-campus.svg',
    websiteUrl: 'https://teknova.co.in',
    isActive: true,
    displayOrder: 11,
  },

  // Supporting Partners
  {
    id: 'sp-sup-1',
    name: 'KMM MCA Alumni Network',
    slug: 'kmm-mca-alumni-network',
    tier: 'supporting',
    category: 'Supporting Partner',
    description: 'Global network of MCA alumni driving sponsorship endowments, mentoring, and technical juries.',
    logoUrl: '/images/sponsors/kmm-alumni.svg',
    websiteUrl: 'https://teknova.co.in',
    isActive: true,
    displayOrder: 12,
  },
];

export const SPONSOR_TIER_LABELS: Record<SponsorTier, string> = {
  title: 'Title Sponsor',
  powered_by: 'Powered By',
  associate: 'Associate Sponsors',
  community: 'Community Partners',
  media: 'Media Partners',
  technology: 'Technology Partners',
  supporting: 'Supporting Partners',
};

export const OFFICIAL_SPONSORSHIP_CONTACT = {
  department: 'Department of Computer Applications (MCA)',
  institution: 'KMM College of Arts and Science',
  affiliations: 'Approved by AICTE & Govt. of Kerala • Affiliated to M.G. University',
  address: 'Thrikkakara, Kochi, Kerala – 682021',
  email: 'mca@kmmcollege.edu.in',
  phone: '+91 484 257 6500',
  convenor: 'Staff & Student Fest Secretariat, TEKNOVA’26',
  brochureUrl: '/brochures/TEKNOVA_26_Sponsorship_Brochure.pdf',
};

