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

export interface EventGuidelineSection {
  title: string;
  items: string[];
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
  guidelinesAndChecklist?: {
    sections: EventGuidelineSection[];
    importantReminder?: string;
  };
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
      'Participants are responsible for the safety of their laptops, mobile phones and other personal belongings.',
      'Participants are strictly prohibited from preparing or bringing pre-made presentations.',
      'Problem statements will be announced by the college during the event.',
      'All presentations must be prepared only after the official announcement of the problem statements.',
      'Food and refreshments will be provided by the college.',
      'Team of 2 to 4 members with valid college ID cards.',
      'Overnight 24-hour innovation and prototype sprint (Dec 2–3, 2026).'
    ],
    guidelinesAndChecklist: {
      sections: [
        {
          title: '1. Mandatory Items',
          items: [
            'Laptop',
            'Laptop charger',
            'Mobile phone and charger',
            'Power bank (if available)',
            'College ID card or valid student ID',
            'Required cables, adapters and accessories',
            'Hardware components required for the prototype',
            'Personal medicines (if required)'
          ]
        },
        {
          title: '2. Personal Essentials',
          items: [
            'Towel',
            'Toothbrush and toothpaste',
            'Soap, face wash and other toiletries',
            'Extra set of clothes',
            'Comfortable clothing for the overnight stay',
            'Hand sanitizer and tissues',
            'Water bottle'
          ]
        },
        {
          title: '3. Overnight Stay Essentials',
          items: [
            'Bedsheet or light blanket',
            'Pillow',
            'Other personal sleeping essentials, if required'
          ]
        },
        {
          title: '4. Important Instructions',
          items: [
            'Participants are responsible for the safety of their laptops, mobile phones and other personal belongings.',
            'Participants are strictly prohibited from preparing or bringing pre-made presentations.',
            'Problem statements will be announced by the college during the event.',
            'All presentations must be prepared only after the official announcement of the problem statements.',
            'Food and refreshments will be provided by the college.'
          ]
        }
      ],
      importantReminder: 'Please ensure that you carry all the necessary items for a comfortable and productive 24-hour event. Be prepared. Be creative. Be innovative!'
    },
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
      'No internet access or external assistance is allowed.',
      'The judges\' decisions are final.',
      'Single participants only (Registration Fee: ₹100 per participant).',
      'Both Online Registration and Spot Registration are available. A QR code is provided to scan and register.'
    ],
    guidelinesAndChecklist: {
      sections: [
        {
          title: 'General Rules & Important Rules',
          items: [
            'No internet access or external assistance is allowed.',
            'The judges\' decisions are final.'
          ]
        },
        {
          title: 'Round 1: Code Quest',
          items: [
            'Consists of 25 multiple-choice questions.'
          ]
        },
        {
          title: 'Round 2: Code Sprint',
          items: [
            'Participants must solve a programming problem.',
            'Advancement: Only the first 10 participants to complete the task will advance to Round 3.'
          ]
        },
        {
          title: 'Round 3: Bug Hunter',
          items: [
            'The final debugging challenge.',
            'Participants must identify and fix the errors in the given program.'
          ]
        },
        {
          title: 'Registration Guidelines',
          items: [
            'Who can register: Single participants (Registration Fee: ₹100 per participant).',
            'Methods: Both Online Registration and Spot Registration are available. A QR code is provided to scan and register.'
          ]
        }
      ],
      importantReminder: 'No internet access or external assistance is allowed. The judges\' decisions are final.'
    },
    prizes: [
      { position: '1st', amount: 4000 },
      { position: '2nd', amount: 2000 }
    ],
    prizePoolSubtotal: 6000,
    date: 'December 3, 2026',
    time: '9:30 AM',
    venue: 'Lab Alpha (MCA Department)',
    registrationFee: 100,
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
      { position: '1st', amount: 7000 },
      { position: '2nd', amount: 4000 }
    ],
    prizePoolSubtotal: 11000,
    date: 'December 3, 2026',
    time: '9:30 AM',
    venue: 'Web Systems Studio',
    registrationFee: null,
    registrationOpen: true,
    image: '/images/events/thumbnails/mirror-master.webp'
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
      { position: '1st', amount: 7000 },
      { position: '2nd', amount: 4000 }
    ],
    prizePoolSubtotal: 11000,
    date: 'December 3, 2026',
    time: '9:30 AM',
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
      { position: '1st', amount: 7000 },
      { position: '2nd', amount: 4000 }
    ],
    prizePoolSubtotal: 11000,
    date: 'December 3, 2026',
    time: '9:30 AM',
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
      { position: '1st', amount: 7000 },
      { position: '2nd', amount: 4000 }
    ],
    prizePoolSubtotal: 11000,
    date: 'December 3, 2026',
    time: '9:30 AM',
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
    description: 'Premier Technical Quiz Competition testing technical knowledge, logical reasoning, problem-solving abilities and quick-thinking skills.',
    rules: [
      'Each team must consist of exactly two participants.',
      'Mobile phones, smartwatches, calculators and other electronic devices are strictly prohibited during the competition.',
      'Participants must maintain discipline throughout the event.',
      'All answers must be submitted within the specified time; no additional time will be provided after the deadline.',
      'During the rapid-fire round, only the team\'s final answer will be considered; once submitted, answers cannot be changed.',
      'Any form of malpractice or unfair practice will lead to immediate disqualification.',
      'In case of a tie, sudden-death tie-breaker questions will be conducted until a clear winner is determined.',
      'The decision of the quiz master and organizing committee will be final and binding.'
    ],
    guidelinesAndChecklist: {
      sections: [
        {
          title: 'Team Formation & Participation',
          items: [
            'Each team must consist of exactly two participants.',
            'Participants must complete registration before the competition.',
            'Both team members can discuss and answer questions together during the written rounds.'
          ]
        },
        {
          title: 'Round 1: TECH STARTER (Prelims – Easy Level)',
          items: [
            '25 Questions: Multiple Choice, True/False, Fill in the Blanks & Basic Technical Questions.',
            'Time Limit: 25 minutes for all 25 questions.',
            'Question Paper: The same question paper provided to all teams.',
            'Scoring: +2 points for correct answer, 0 for wrong (No negative marking).',
            'Advancement: Top-scoring teams qualify for Round 2.'
          ]
        },
        {
          title: 'Round 2: TECH EXPLORER (Intermediate – Moderate)',
          items: [
            '15 Questions: Technical Knowledge, Logical Reasoning and Problem-Solving.',
            'Question Paper Selection: Each team randomly selects a question paper via lot system (different sets provided).',
            'Time Limit: 20 minutes for all 15 questions.',
            'Scoring: +3 points for correct answer, 0 for wrong (No negative marking).',
            'Advancement: Top-performing teams qualify for the Final Round.'
          ]
        },
        {
          title: 'Round 3: TEKONIK (Final Round – Rapid Fire)',
          items: [
            '10 Questions per team asked directly by the Quiz Master.',
            'Time Limit: 10 seconds per question.',
            'Scoring: +2 points for correct answer, –0.5 points for wrong answer, +1 point for passed questions.',
            'Winner: Highest cumulative score declared TEKTONIQ Champion.'
          ]
        }
      ],
      importantReminder: 'Think Fast. Think Smart. Be a Tech Champion! Organized by the Department of Master of Computer Applications (MCA), KMM College of Arts and Science, Thrikkakara.'
    },
    prizes: [
      { position: '1st', amount: 7000 },
      { position: '2nd', amount: 4000 }
    ],
    prizePoolSubtotal: 11000,
    date: 'December 3, 2026',
    time: '9:30 AM',
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
    description: 'Campus-wide mystery cryptographic treasure hunt.',
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

// Calculate the known prize pool subtotal across official events (₹1 Lakh+ Grand Prize Pool)
export const TOTAL_KNOWN_PRIZE_POOL = OFFICIAL_EVENTS.reduce(
  (acc, event) => acc + event.prizePoolSubtotal,
  0
); // ₹1,01,000 across 7 official events (₹1 Lakh+)

export const TOTAL_PRIZE_POOL_LABEL = '1 Lakh+';

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

// Official coordinator passwords configured in the format: <event_name>@2026
export const COORDINATOR_PASSWORDS: Record<string, string> = {
  'ideatek': 'ideatek@2026',
  'bug-slayer': 'bugslayer@2026',
  'mirror-master': 'mirrormaster@2026',
  'teknova-e-clash': 'teknova-e-clash@2026',
  'tek-royal': 'tekroyal@2026',
  'find-x': 'find-x@2026',
  'tektoniq': 'tektoniq@2026',
};

// Formatted display names and password listing for coordinators
export const COORDINATOR_CREDENTIALS_LIST = OFFICIAL_EVENTS.map(evt => {
  const password = COORDINATOR_PASSWORDS[evt.slug] || `${evt.slug.replace(/[^a-z0-9]/g, '')}@2026`;
  return {
    eventId: evt.id,
    eventSlug: evt.slug,
    eventName: evt.name,
    subCategory: evt.subCategory,
    workingInterpretation: evt.workingInterpretation,
    password,
    displayFormat: `${evt.name.toLowerCase()}@2026`
  };
});

export function getCoordinatorPassword(eventSlug: string): string {
  const normalized = eventSlug.toLowerCase().trim();
  const matchedEvent = resolveEventByIdOrSlug(normalized);
  const slug = matchedEvent ? matchedEvent.slug : normalized;
  return COORDINATOR_PASSWORDS[slug] || `${slug.replace(/[^a-z0-9]/g, '')}@2026`;
}

export function verifyCoordinatorPassword(eventSlug: string, inputPass: string): boolean {
  if (!inputPass || !inputPass.trim()) return false;
  
  const cleanInput = inputPass.trim().toLowerCase().replace(/[\s\-_]/g, '');
  const matchedEvent = resolveEventByIdOrSlug(eventSlug);
  if (!matchedEvent) return false;

  const validVariations = [
    `${matchedEvent.slug.replace(/[\s\-_]/g, '')}@2026`,
    `${matchedEvent.name.toLowerCase().replace(/[\s\-_]/g, '')}@2026`,
    `${matchedEvent.id.replace(/[\s\-_]/g, '')}@2026`,
    COORDINATOR_PASSWORDS[matchedEvent.slug]?.toLowerCase().replace(/[\s\-_]/g, '')
  ].filter(Boolean);

  return validVariations.some(v => cleanInput === v);
}
