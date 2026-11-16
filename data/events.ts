export interface PrizePosition {
  position: string;
  amount: number;
}

export interface OfficialEvent {
  id: string;
  slug: string;
  name: string;
  category: 'Technical' | 'Cultural' | 'Gaming' | 'Flagship' | 'Creative' | 'Exhibition';
  subCategory: string;
  workingInterpretation: string;
  participationType: 'individual' | 'team';
  teamSize?: { min: number; max: number };
  description: string;
  rules: string[];
  prizes: PrizePosition[];
  prizePoolSubtotal: number;
  prizeNote?: string;
  date: string;
  time: string;
  venue: string;
  registrationFee: number | null;
  registrationOpen: boolean;
  coordinator?: {
    name: string;
    phone: string;
    email: string;
  };
  image: string;
}

export const OFFICIAL_EVENTS: OfficialEvent[] = [
  {
    id: 'ideatek',
    slug: 'ideatek',
    name: 'IDEATEK',
    category: 'Flagship',
    subCategory: 'Ideathon',
    workingInterpretation: 'Idea Thon + Flagship',
    participationType: 'team',
    teamSize: { min: 2, max: 4 },
    description: 'The premier 2-day flagship Ideathon: Build disruptive technology solutions for tomorrow\'s grand challenges.',
    rules: [
      'Team of 2 to 4 members.',
      'Two-day intensive hack & ideation sprint (Dec 2 & Dec 3).',
      'Day 1: Problem selection, architecture pitch, milestone checkpoints.',
      'Day 2: Prototype demo, jury Q&A, and grand finale stage.',
      'Evaluation criteria: Innovation (30%), Technical Feasibility (30%), Impact (20%), Pitch (20%).'
    ],
    prizes: [
      { position: '1st', amount: 20000 },
      { position: '2nd', amount: 10000 },
      { position: '3rd', amount: 5000 }
    ],
    prizePoolSubtotal: 35000,
    date: 'December 2–3, 2026',
    time: '09:00 AM (Day 1) to 04:00 PM (Day 2)',
    venue: 'Innovation Hub & Main Auditorium',
    registrationFee: null,
    registrationOpen: true,
    image: '/images/events/thumbnails/ideatek.webp'
  },
  {
    id: 'bug-slayer',
    slug: 'bug-slayer',
    name: 'BUG SLAYER',
    category: 'Technical',
    subCategory: 'Debugging',
    workingInterpretation: 'Debugging Event',
    participationType: 'individual',
    description: 'Enter the neon simulation to hunt, isolate, and eradicate code vulnerabilities against the clock.',
    rules: [
      'Individual participation only.',
      'Participants must bring college ID card.',
      'Programming languages supported: C, C++, Java, Python.',
      'Round 1: Rapid syntax & logic debugging (30 mins).',
      'Round 2: Algorithmic fix and performance optimization (45 mins).',
      'Decision of the judges and coordinators is final.'
    ],
    prizes: [
      { position: '1st', amount: 4000 },
      { position: '2nd', amount: 2000 }
    ],
    prizePoolSubtotal: 6000,
    date: 'December 2, 2026',
    time: '10:00 AM',
    venue: 'Lab Alpha (MCA Department)',
    registrationFee: null,
    registrationOpen: true,
    image: '/images/events/thumbnails/bug-slayer.webp'
  },
  {
    id: 'mirror-master',
    slug: 'mirror-master',
    name: 'MIRROR MASTER',
    category: 'Technical',
    subCategory: 'Web Design',
    workingInterpretation: 'Replica Event',
    participationType: 'team',
    teamSize: { min: 1, max: 2 },
    description: 'Recreate a high-fidelity cyberpunk web interface with pixel perfection and dynamic responsiveness.',
    rules: [
      'Team of 1 to 2 members.',
      'Target website mockup will be revealed at the commencement of the event.',
      'Allowed stack: HTML5, CSS3/Tailwind, Vanilla JS or React.',
      'No external pre-built templates or AI generators allowed.',
      'Submissions evaluated on visual fidelity, responsive fluidity, and clean semantics.'
    ],
    prizes: [
      { position: '1st', amount: 4000 },
      { position: '2nd', amount: 2000 }
    ],
    prizePoolSubtotal: 6000,
    date: 'December 2, 2026',
    time: '11:30 AM',
    venue: 'Web Systems Studio',
    registrationFee: null,
    registrationOpen: true,
    image: '/images/events/thumbnails/mirror-master.webp'
  },
  {
    id: 'fotonova',
    slug: 'fotonova',
    name: 'FOTONOVA',
    category: 'Creative',
    subCategory: 'Photography',
    workingInterpretation: 'Photography Contest',
    participationType: 'individual',
    description: 'Capture the pulse, light, and cyberpunk festival moments across the campus through your creative lens.',
    rules: [
      'Individual participation only.',
      'Theme will be announced at the commencement of the event.',
      'All photos must be taken inside the campus during festival hours.',
      'Basic color grading and cropping permitted; AI generative modification prohibited.',
      'Participants must submit raw EXIF metadata alongside final entries.',
      'Judging criteria: Composition, Storytelling, Lighting, and Thematic Impact.'
    ],
    prizes: [
      { position: '1st', amount: 4000 },
      { position: '2nd', amount: 2000 }
    ],
    prizePoolSubtotal: 6000,
    date: 'December 2, 2026',
    time: '02:00 PM',
    venue: 'Campus Grounds & Media Studio',
    registrationFee: null,
    registrationOpen: true,
    image: '/images/events/thumbnails/fotonova.webp'
  },
  {
    id: 'teknova-e-clash',
    slug: 'teknova-e-clash',
    name: 'TEKNOVA E-CLASH',
    category: 'Gaming',
    subCategory: 'E-Football',
    workingInterpretation: 'E-Football',
    participationType: 'individual',
    description: 'Command the virtual pitch in an electrifying knockout e-football tournament.',
    rules: [
      'Solo 1v1 console/PC tournament.',
      'Match duration: 10 minutes regular time.',
      'Knockout format; extra time and penalties if tied.',
      'Controllers will be provided, but participants may bring personal certified controllers.'
    ],
    prizes: [
      { position: '1st', amount: 4000 },
      { position: '2nd', amount: 2000 }
    ],
    prizePoolSubtotal: 6000,
    date: 'December 2, 2026',
    time: '01:30 PM',
    venue: 'Gaming Arena (Auditorium)',
    registrationFee: null,
    registrationOpen: true,
    image: '/images/events/thumbnails/teknova-e-clash.webp'
  },
  {
    id: 'tek-royal',
    slug: 'tek-royal',
    name: 'TEK ROYAL',
    category: 'Gaming',
    subCategory: 'Battle Royale',
    workingInterpretation: 'PUBG',
    participationType: 'team',
    teamSize: { min: 4, max: 4 },
    description: 'Drop into the battleground with your squad. Strategy, precision, and survival till the last zone.',
    rules: [
      'Squad participation (strictly 4 players).',
      'Mobile devices only (no emulators, triggers, or tablet displays).',
      'Matches will be hosted on custom rooms.',
      'Points system: Placement points + Kill points as per official tournament standards.'
    ],
    prizes: [
      { position: '1st', amount: 4000 },
      { position: '2nd', amount: 2000 }
    ],
    prizePoolSubtotal: 6000,
    date: 'December 3, 2026',
    time: '10:00 AM',
    venue: 'E-Sports Hub',
    registrationFee: null,
    registrationOpen: true,
    image: '/images/events/thumbnails/tek-royal.webp'
  },
  {
    id: 'find-x',
    slug: 'find-x',
    name: 'FIND-X',
    category: 'Cultural',
    subCategory: 'Treasure Hunt',
    workingInterpretation: 'Treasure Hunt',
    participationType: 'team',
    teamSize: { min: 3, max: 4 },
    description: 'Decrypt cryptic riddles, scour hidden campus coordinates, and race against rival squads to uncover the ultimate digital-physical artifact.',
    rules: [
      'Team of 3 to 4 members.',
      'Teams will receive cryptographic and physical clues leading across campus coordinates.',
      'All clues must be solved sequentially; skipping checkpoints leads to disqualification.',
      'Use of electronic navigation and campus maps permitted.',
      'First team to unearth the final artifact and report to the central base wins.'
    ],
    prizes: [
      { position: '1st', amount: 4000 },
      { position: '2nd', amount: 2000 }
    ],
    prizePoolSubtotal: 6000,
    date: 'December 3, 2026',
    time: '01:30 PM',
    venue: 'Campus Grounds & Central Base',
    registrationFee: null,
    registrationOpen: true,
    image: '/images/events/thumbnails/find-x.webp'
  },
  {
    id: 'tektoniq',
    slug: 'tektoniq',
    name: 'TEKTONIQ',
    category: 'Technical',
    subCategory: 'Technical Quiz',
    workingInterpretation: 'Technical Quiz',
    participationType: 'team',
    teamSize: { min: 2, max: 2 },
    description: 'High-octane technical quiz testing your depth in computing history, algorithms, cryptography, and modern AI.',
    rules: [
      'Teams of 2 members.',
      'Preliminary written round for all registered teams.',
      'Top 6 teams qualify for the buzzer stage round on main stage.',
      'Negative marking applies in final rounds.'
    ],
    prizes: [
      { position: '1st', amount: 4000 },
      { position: '2nd', amount: 2000 }
    ],
    prizePoolSubtotal: 6000,
    date: 'December 3, 2026',
    time: '11:00 AM',
    venue: 'Seminar Hall B',
    registrationFee: null,
    registrationOpen: true,
    image: '/images/events/thumbnails/tektoniq.webp'
  }
];

// Event categories
export const CATEGORIES = [
  {
    id: 'flagship',
    name: 'FLAGSHIP IDEATHON',
    description: 'Two-day premier innovation sprint tackling tomorrow\'s grand challenges.',
    iconName: 'Sparkles',
  },
  {
    id: 'technical',
    name: 'TECHNICAL',
    description: 'Debugging, web replication, and algorithmic IT quiz showdowns.',
    iconName: 'Cpu',
  },
  {
    id: 'gaming',
    name: 'GAMING & E-SPORTS',
    description: 'High-stakes competitive E-Football and PUBG battle royale arenas.',
    iconName: 'Gamepad2',
  },
  {
    id: 'creative',
    name: 'CREATIVE & GENERAL',
    description: 'Photography visual storytelling and campus-wide mystery treasure hunt.',
    iconName: 'Music',
  }
];

export const FEATURED_EVENTS = OFFICIAL_EVENTS;

// Helper to format Indian Rupees
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

// Calculate the known prize pool subtotal across official events
export const TOTAL_KNOWN_PRIZE_POOL = OFFICIAL_EVENTS.reduce(
  (acc, event) => acc + event.prizePoolSubtotal,
  0
); // Exactly ₹77,000

// Alias mapping for legacy event names from previous prototypes
export const LEGACY_EVENT_ALIASES: Record<string, string> = {
  'pes': 'teknova-e-clash',
  'e-football': 'teknova-e-clash',
  'pubg': 'tek-royal',
  'bgmi': 'tek-royal',
  'tek-royale': 'tek-royal',
  'replica': 'mirror-master',
  'replica-of-website': 'mirror-master',
  'web-design': 'mirror-master',
  'mirror-masters': 'mirror-master',
  'debugging': 'bug-slayer',
  'coding-challenge': 'bug-slayer',
  'technical-quiz': 'tektoniq',
  'it-quiz': 'tektoniq',
  'tech-quiz': 'tektoniq',
  'ideathon': 'ideatek',
  'hackathon': 'ideatek',
  'photography': 'fotonova',
  'photo': 'fotonova',
  'treasure-hunt': 'find-x',
  'hunt': 'find-x',
  'spot-dance': 'find-x',
  'beat-blitz': 'find-x',
  'teksphere': 'ideatek',
  'exhibition': 'ideatek'
};

export function resolveEventByIdOrSlug(idOrSlug: string): OfficialEvent | undefined {
  const normalized = idOrSlug.toLowerCase().trim();
  const direct = OFFICIAL_EVENTS.find(e => e.id.toLowerCase() === normalized || e.slug.toLowerCase() === normalized);
  if (direct) return direct;
  
  const mappedSlug = LEGACY_EVENT_ALIASES[normalized];
  if (mappedSlug) {
    return OFFICIAL_EVENTS.find(e => e.slug === mappedSlug);
  }
  return undefined;
}
