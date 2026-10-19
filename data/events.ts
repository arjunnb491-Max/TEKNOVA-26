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
    id: 'bug-slayer',
    slug: 'bug-slayer',
    name: 'BUG SLAYER',
    category: 'Technical',
    subCategory: 'Debugging',
    workingInterpretation: 'Debugging contest',
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
    image: '/images/Teknova \'26 Neon Tech Fest Poster.png'
  },
  {
    id: 'mirror-masters',
    slug: 'mirror-masters',
    name: 'MIRROR MASTERS',
    category: 'Technical',
    subCategory: 'Web Design',
    workingInterpretation: 'Replica / Replica of Website',
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
    image: '/images/TEKNOVA \'26_ Neon Tech Fest.png'
  },
  {
    id: 'fotonova',
    slug: 'fotonova',
    name: 'fotonova',
    category: 'Creative',
    subCategory: 'Photography',
    workingInterpretation: 'Photography contest',
    participationType: 'individual',
    description: 'Capture the neon essence, festival energy, and human stories across KMM campus.',
    rules: [
      'Solo participation.',
      'Theme will be announced on the morning of December 2, 2026.',
      'Photographs must be shot on campus during the festival hours.',
      'Basic color grading allowed; major manipulations or composite edits will result in disqualification.',
      'Submit original EXIF data with image upload.'
    ],
    prizes: [
      { position: '1st', amount: 1234 }
    ],
    prizePoolSubtotal: 1234,
    date: 'December 2–3, 2026',
    time: 'All Day',
    venue: 'Campus Grounds & Media Lounge',
    registrationFee: null,
    registrationOpen: true,
    image: '/images/TEKNOVA_ Neon Portal of Possibility.png'
  },
  {
    id: 'teknova-e-clash',
    slug: 'teknova-e-clash',
    name: 'TEKNOVA E-CLASH',
    category: 'Gaming',
    subCategory: 'E-Football / PES',
    workingInterpretation: 'E-Football / PES',
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
    image: '/images/TEKNOVA \'26_ Neon Tech Fest 1.png'
  },
  {
    id: 'tek-royale',
    slug: 'tek-royale',
    name: 'TEK ROYALE',
    category: 'Gaming',
    subCategory: 'Battle Royale',
    workingInterpretation: 'PUBG tournament',
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
    image: '/images/Neon TEKNOVA\'26 Tech Fest Poster.png'
  },
  {
    id: 'ideatek',
    slug: 'ideatek',
    name: 'IDEATEK',
    category: 'Flagship',
    subCategory: 'Ideathon',
    workingInterpretation: 'Ideathon; two-day flagship event',
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
    image: '/images/TEKNOVA \'26_ Neon Tech Fest.png'
  },
  {
    id: 'teksphere',
    slug: 'teksphere',
    name: 'TEKSPHERE',
    category: 'Exhibition',
    subCategory: 'Exhibition',
    workingInterpretation: 'Exhibition',
    participationType: 'team',
    teamSize: { min: 1, max: 4 },
    description: 'Showcase cutting-edge hardware prototypes, IoT rigs, AI agents, and engineering marvels.',
    rules: [
      'Open to individual exhibitors and teams up to 4 members.',
      'Exhibitors must set up working models by 09:30 AM on Dec 2.',
      'Live demonstration required for jury inspection and public walkthroughs.'
    ],
    prizes: [],
    prizePoolSubtotal: 0,
    prizeNote: 'Prize details to be announced',
    date: 'December 2–3, 2026',
    time: '10:00 AM – 04:00 PM',
    venue: 'Central Exhibition Courtyard',
    registrationFee: null,
    registrationOpen: true,
    image: '/images/TEKNOVA_ Neon Portal of Possibility.png'
  },
  {
    id: 'tektoniq',
    slug: 'tektoniq',
    name: 'TEKTONIQ',
    category: 'Technical',
    subCategory: 'Quiz',
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
    image: '/images/Teknova \'26 Neon Tech Fest Poster.png'
  },
  {
    id: 'beat-blitz',
    slug: 'beat-blitz',
    name: 'BEAT BLITZ',
    category: 'Cultural',
    subCategory: 'Spot Dance',
    workingInterpretation: 'Spot dance / Spot choreography',
    participationType: 'individual',
    description: 'Improvise on the spot. Feel the bass drops, electrify the crowd, and own the dance floor.',
    rules: [
      'Solo performance.',
      'Random music tracks will be played on the spot by the DJ.',
      'Prelims and Knockout battles.',
      'Judging based on musicality, rhythm adaptability, stage presence, and crowd impact.'
    ],
    prizes: [
      { position: '1st', amount: 3000 }
    ],
    prizePoolSubtotal: 3000,
    date: 'December 3, 2026',
    time: '02:00 PM',
    venue: 'Open Air Amphitheatre',
    registrationFee: null,
    registrationOpen: true,
    image: '/images/Neon TEKNOVA\'26 Tech Fest Poster.png'
  },
  {
    id: 'cinova',
    slug: 'cinova',
    name: 'CINOVA',
    category: 'Creative',
    subCategory: 'Film Fest',
    workingInterpretation: 'Film fest',
    participationType: 'team',
    teamSize: { min: 1, max: 5 },
    description: 'Celebrate cinematic storytelling. Short films that captivate, provoke thought, and inspire.',
    rules: [
      'Maximum runtime: 10 minutes including credits.',
      'Original screenplays and licensed/original audio only.',
      'Subtitles in English mandatory if dialogue is in regional languages.',
      'Films must be submitted in 1080p MP4 format prior to screening schedule.'
    ],
    prizes: [],
    prizePoolSubtotal: 0,
    prizeNote: 'Prize details to be announced',
    date: 'December 3, 2026',
    time: '03:00 PM',
    venue: 'Auditorium Mini Theatre',
    registrationFee: null,
    registrationOpen: true,
    image: '/images/TEKNOVA_ Neon Portal of Possibility.png'
  }
];

// Event categories
export const CATEGORIES = [
  {
    id: 'technical',
    name: 'TECHNICAL',
    description: 'Debugging, web design, and algorithmic mastery.',
    iconName: 'Cpu',
  },
  {
    id: 'gaming',
    name: 'GAMING & E-SPORTS',
    description: 'High stakes competitive E-Football and battle royale arenas.',
    iconName: 'Gamepad2',
  },
  {
    id: 'flagship',
    name: 'FLAGSHIP IDEATHON',
    description: 'Two-day innovation sprint tackling tomorrow\'s grand challenges.',
    iconName: 'Sparkles',
  },
  {
    id: 'cultural',
    name: 'CULTURAL & CREATIVE',
    description: 'Spot choreography, photography, and short films.',
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
); // Exactly ₹69,234

// Alias mapping for legacy event names from previous prototypes
export const LEGACY_EVENT_ALIASES: Record<string, string> = {
  'pes': 'teknova-e-clash',
  'e-football': 'teknova-e-clash',
  'pubg': 'tek-royale',
  'bgmi': 'tek-royale',
  'replica': 'mirror-masters',
  'replica-of-website': 'mirror-masters',
  'web-design': 'mirror-masters',
  'debugging': 'bug-slayer',
  'coding-challenge': 'bug-slayer',
  'spot-dance': 'beat-blitz',
  'spot-choreography': 'beat-blitz',
  'technical-quiz': 'tektoniq',
  'it-quiz': 'tektoniq',
  'tech-quiz': 'tektoniq',
  'ideathon': 'ideatek',
  'hackathon': 'ideatek',
  'exhibition': 'teksphere',
  'film-fest': 'cinova',
  'photography': 'fotonova'
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
