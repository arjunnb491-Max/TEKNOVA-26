import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, Mail, Phone, ExternalLink, Shield, Users, UserCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#020713] pt-20 pb-12 border-t border-[#00E5FF]/10 relative overflow-hidden">
      {/* Background neon accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#00E5FF]/40 to-transparent"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Identity & Institution */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-[#00E5FF]/40 bg-[#07172B]">
                <Image 
                  src="/images/TEKNOVA_26_logo_300x300.png"
                  alt="TEKNOVA '26"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold font-space-grotesk text-white tracking-wider">
                  TEKNOVA <span className="text-[#00E5FF]">’26</span>
                </h2>
                <p className="text-xs font-mono text-[#00E5FF] tracking-widest uppercase">
                  IDEAS TODAY. A BRIGHTER TOMORROW.
                </p>
              </div>
            </div>

            <p className="text-sm text-[#A9B8D0] leading-relaxed max-w-lg">
              The premier intercollegiate technical & cultural confluence organized by the 
              <span className="text-[#F5F8FF] font-semibold"> Department of MCA</span>, 
              <span className="text-[#F5F8FF] font-semibold"> KMM College of Arts and Science, Thrikkakara</span>.
            </p>

            <div className="p-3 bg-[#07172B]/70 border border-white/5 rounded-xl max-w-lg text-xs font-mono text-[#A9B8D0] space-y-1">
              <div className="text-[#00E5FF] font-bold">IDEAS • PEOPLE • POSSIBILITIES</div>
              <div>MORE THAN JUST TECH</div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold tracking-wider mb-5 uppercase text-xs font-mono text-[#00E5FF]">
              Festival Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-[#A9B8D0] hover:text-[#00E5FF] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-[#A9B8D0] hover:text-[#00E5FF] transition-colors">
                  Explore Events
                </Link>
              </li>
              <li>
                <Link href="/#schedule" className="text-[#A9B8D0] hover:text-[#00E5FF] transition-colors">
                  Fest Schedule (Dec 2–3)
                </Link>
              </li>
              <li>
                <Link href="/lookup" className="text-[#A9B8D0] hover:text-[#00E5FF] transition-colors">
                  Print Registration Receipt
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-[#A9B8D0] hover:text-[#00E5FF] transition-colors">
                  About TEKNOVA & KMM
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Institution Contact */}
          <div>
            <h3 className="text-white font-bold tracking-wider mb-5 uppercase text-xs font-mono text-[#00E5FF]">
              Campus Venue & Contact
            </h3>
            <div className="space-y-3 text-sm text-[#A9B8D0]">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-[#00E5FF] mt-1 shrink-0" />
                <span>KMM College of Arts and Science, Thrikkakara, Kochi, Kerala</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Calendar size={16} className="text-[#00E5FF] shrink-0" />
                <span className="font-medium text-[#F5F8FF]">December 2–3, 2026</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={16} className="text-[#00E5FF] shrink-0" />
                <span>mca@kmmcollege.edu.in</span>
              </div>
              <div className="pt-2 flex flex-wrap gap-2">
                <Link 
                  href="/coordinator/login" 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#07172B] hover:bg-[#008CFF]/20 text-[#00E5FF] border border-[#00E5FF]/30 rounded-lg text-xs font-mono transition-colors"
                >
                  <Users size={12} /> Coordinator Portal
                </Link>
                <Link 
                  href="/receptionist/login" 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#07172B] hover:bg-[#008CFF]/20 text-[#00E5FF] border border-[#00E5FF]/30 rounded-lg text-xs font-mono transition-colors"
                >
                  <UserCheck size={12} /> Reception Desk
                </Link>
                <Link 
                  href="/admin/login" 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#07172B] hover:bg-[#7B2CFF]/20 text-[#B44CFF] border border-[#7B2CFF]/30 rounded-lg text-xs font-mono transition-colors"
                >
                  <Shield size={12} /> Admin Portal
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 text-center flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#627694]">
          <p>
            &copy; 2026 TEKNOVA ’26. Department of MCA, KMM College of Arts and Science.
          </p>
          <div className="flex gap-6">
            <span className="hover:text-[#A9B8D0] transition-colors">Prize Pool: ₹69,234 (Published Subtotal)</span>
            <Link href="/lookup" className="text-[#00E5FF] hover:underline">Verify Registration</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
