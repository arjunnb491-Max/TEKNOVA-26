import * as fs from 'fs';
import * as path from 'path';

const sponsorsDir = path.join(process.cwd(), 'public', 'images', 'sponsors');

const logos: Record<string, string> = {
  'cyberx-networks.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80" fill="none">
    <defs>
      <linearGradient id="grad-cyberx" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#00E5FF" />
        <stop offset="100%" stop-color="#7B2CFF" />
      </linearGradient>
    </defs>
    <rect x="10" y="15" width="50" height="50" rx="12" fill="#07172B" stroke="#00E5FF" stroke-width="2"/>
    <path d="M25 28L45 52M45 28L25 52" stroke="url(#grad-cyberx)" stroke-width="5" stroke-linecap="round"/>
    <circle cx="35" cy="40" r="4" fill="#00E5FF"/>
    <text x="75" y="44" fill="#F5F8FF" font-family="'Space Grotesk', system-ui, sans-serif" font-weight="900" font-size="24" letter-spacing="1.5">CYBER<tspan fill="#00E5FF">X</tspan></text>
    <text x="75" y="58" fill="#A9B8D0" font-family="'JetBrains Mono', monospace" font-size="9" letter-spacing="3" text-transform="uppercase">NETWORKS LABS</text>
  </svg>`,

  'neoncloud.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 80" fill="none">
    <defs>
      <linearGradient id="grad-nc" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#008CFF" />
        <stop offset="100%" stop-color="#00E5FF" />
      </linearGradient>
    </defs>
    <path d="M42 48a12 12 0 0 1-10-6 14 14 0 0 1 1.5-16.5 15 15 0 0 1 20-2.5 17 17 0 0 1 24.5 14A11 11 0 0 1 68 48H42z" fill="#07172B" stroke="url(#grad-nc)" stroke-width="2.5" stroke-linejoin="round"/>
    <text x="85" y="44" fill="#F5F8FF" font-family="'Space Grotesk', system-ui, sans-serif" font-weight="800" font-size="22" letter-spacing="1">NEON<tspan fill="#00E5FF">CLOUD</tspan></text>
    <text x="85" y="58" fill="#627694" font-family="'JetBrains Mono', monospace" font-size="8.5" letter-spacing="2.5">AI COMPUTE CORE</text>
  </svg>`,

  'apex-gaming.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 80" fill="none">
    <defs>
      <linearGradient id="grad-apex" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FF3366" />
        <stop offset="100%" stop-color="#B44CFF" />
      </linearGradient>
    </defs>
    <polygon points="35,18 55,54 15,54" fill="#07172B" stroke="url(#grad-apex)" stroke-width="2.5"/>
    <polygon points="35,28 47,50 23,50" fill="url(#grad-apex)"/>
    <text x="72" y="44" fill="#F5F8FF" font-family="'Space Grotesk', system-ui, sans-serif" font-weight="800" font-size="22" letter-spacing="1">APEX<tspan fill="#B44CFF">RIG</tspan></text>
    <text x="72" y="58" fill="#A9B8D0" font-family="'JetBrains Mono', monospace" font-size="8.5" letter-spacing="2">ESPORTS HARDWARE</text>
  </svg>`,

  'vortex-devlabs.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 70" fill="none">
    <circle cx="32" cy="35" r="18" stroke="#00E5FF" stroke-width="2" stroke-dasharray="4 3"/>
    <circle cx="32" cy="35" r="8" fill="#008CFF"/>
    <text x="62" y="38" fill="#F5F8FF" font-family="'Space Grotesk', system-ui, sans-serif" font-weight="700" font-size="18">VORTEX<tspan fill="#00E5FF">.DEV</tspan></text>
    <text x="62" y="51" fill="#627694" font-family="'JetBrains Mono', monospace" font-size="8" letter-spacing="1.5">TOOLING PARTNER</text>
  </svg>`,

  'hyperbyte-sec.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 70" fill="none">
    <path d="M30 18L46 24V36C46 47 30 54 30 54C30 54 14 47 14 36V24L30 18Z" fill="#07172B" stroke="#00E5FF" stroke-width="2"/>
    <path d="M25 35L29 39L36 31" stroke="#00E5FF" stroke-width="2" stroke-linecap="round"/>
    <text x="58" y="38" fill="#F5F8FF" font-family="'Space Grotesk', system-ui, sans-serif" font-weight="700" font-size="17">HYPER<tspan fill="#00E5FF">BYTE</tspan></text>
    <text x="58" y="51" fill="#627694" font-family="'JetBrains Mono', monospace" font-size="8" letter-spacing="1.5">CYBERSECURITY</text>
  </svg>`,

  'quantum-pulse.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 70" fill="none">
    <path d="M14 35H24L28 22L34 48L38 28L42 38L45 35H54" stroke="#7B2CFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="64" y="38" fill="#F5F8FF" font-family="'Space Grotesk', system-ui, sans-serif" font-weight="700" font-size="17">QUANTUM<tspan fill="#B44CFF">PULSE</tspan></text>
    <text x="64" y="51" fill="#627694" font-family="'JetBrains Mono', monospace" font-size="8" letter-spacing="1.5">MEDIA VENTURES</text>
  </svg>`,

  'foss-united.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" fill="none">
    <rect x="10" y="12" width="36" height="36" rx="8" fill="#07172B" stroke="#00E5FF" stroke-width="1.5"/>
    <path d="M20 30H36M28 22V38" stroke="#00E5FF" stroke-width="2.5" stroke-linecap="round"/>
    <text x="54" y="34" fill="#F5F8FF" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="16">FOSS UNITED</text>
    <text x="54" y="46" fill="#A9B8D0" font-family="'JetBrains Mono', monospace" font-size="7.5" letter-spacing="1">KOCHI CHAPTER</text>
  </svg>`,

  'kochi-devs.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" fill="none">
    <circle cx="28" cy="30" r="18" fill="#07172B" stroke="#008CFF" stroke-width="1.5"/>
    <text x="21" y="36" fill="#00E5FF" font-family="'JetBrains Mono', monospace" font-weight="bold" font-size="14">&lt;&gt;</text>
    <text x="54" y="34" fill="#F5F8FF" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="16">KOCHI DEVS</text>
    <text x="54" y="46" fill="#627694" font-family="'JetBrains Mono', monospace" font-size="7.5" letter-spacing="1">COMMUNITY</text>
  </svg>`,

  'techmalayalam.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" fill="none">
    <polygon points="15,42 28,18 41,42" fill="#07172B" stroke="#7B2CFF" stroke-width="1.5"/>
    <circle cx="28" cy="33" r="4" fill="#B44CFF"/>
    <text x="50" y="34" fill="#F5F8FF" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="15">TECH MALAYALAM</text>
    <text x="50" y="46" fill="#627694" font-family="'JetBrains Mono', monospace" font-size="7.5" letter-spacing="1">MEDIA PARTNER</text>
  </svg>`,

  'campus-beats.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" fill="none">
    <rect x="12" y="14" width="32" height="32" rx="6" fill="#07172B" stroke="#00E5FF" stroke-width="1.5"/>
    <path d="M20 30L26 22L32 38L36 30" stroke="#00E5FF" stroke-width="2" stroke-linecap="round"/>
    <text x="52" y="34" fill="#F5F8FF" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="15">CAMPUS BEATS</text>
    <text x="52" y="46" fill="#627694" font-family="'JetBrains Mono', monospace" font-size="7.5" letter-spacing="1">YOUTH BROADCAST</text>
  </svg>`,

  'github-campus.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" fill="none">
    <circle cx="28" cy="30" r="16" fill="#07172B" stroke="#F5F8FF" stroke-width="1.5"/>
    <path d="M22 28C22 25 24 23 28 23C32 23 34 25 34 28C34 32 30 35 28 35C26 35 22 32 22 28Z" fill="#F5F8FF"/>
    <text x="52" y="34" fill="#F5F8FF" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="15">GITHUB CAMPUS</text>
    <text x="52" y="46" fill="#627694" font-family="'JetBrains Mono', monospace" font-size="7.5" letter-spacing="1">TECH ADVOCATE</text>
  </svg>`,

  'kmm-alumni.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" fill="none">
    <polygon points="28,14 42,22 28,30 14,22" fill="#07172B" stroke="#00E5FF" stroke-width="1.5"/>
    <path d="M19 25V35C19 38 28 41 28 41C28 41 37 38 37 35V25" stroke="#00E5FF" stroke-width="1.5"/>
    <text x="52" y="34" fill="#F5F8FF" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="15">KMM ALUMNI</text>
    <text x="52" y="46" fill="#627694" font-family="'JetBrains Mono', monospace" font-size="7.5" letter-spacing="1">MCA ASSOCIATION</text>
  </svg>`
};

for (const [filename, svg] of Object.entries(logos)) {
  fs.writeFileSync(path.join(sponsorsDir, filename), svg.trim(), 'utf-8');
}
console.log('Created ' + Object.keys(logos).length + ' sponsor SVG logos in public/images/sponsors');

