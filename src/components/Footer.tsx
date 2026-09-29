import React from 'react';
import { useRouter } from '../context/RouterContext';
import { SchoolSettings } from '../types';
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Heart,
  Facebook,
  Youtube,
} from 'lucide-react';

interface FooterProps {
  settings: SchoolSettings;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const { navigate } = useRouter();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Top Banner / Accreditation Strip */}
      <div className="bg-slate-900/80 border-b border-slate-800 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Recognized by Government of Nepal, Ministry of Education, Science & Technology</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Affiliated with National Examination Board (NEB)</span>
            <span>•</span>
            <span>SEE Centre Code: Sunsari District</span>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1: Institutional Profile */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-800 flex items-center justify-center text-amber-300 shadow ring-2 ring-emerald-500/30">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-crest">
                  {settings.schoolName}
                </h3>
                <p className="text-xs text-emerald-400 font-medium">Inaruwa, Sunsari, Koshi Province</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Established in 1995 AD (2052 BS), Inaruwa English Boarding School is an esteemed English-medium academic institution fostering intellectual curiosity, ethical character, scientific mindset, and student leadership in Eastern Nepal.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center text-slate-300 transition-colors"
                aria-label="Facebook page"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={settings.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-red-600 hover:text-white flex items-center justify-center text-slate-300 transition-colors"
                aria-label="YouTube channel"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <button
                onClick={() => navigate('/admin/login')}
                className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1.5 ml-3"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </button>
            </div>
          </div>

          {/* Col 2: Academics & Admissions */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-400 pl-2">
              Academics
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => navigate('/academics')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Academic Levels</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/academics/pre-primary-montessori')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Montessori Wing</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/academics/primary-level')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Primary School</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/academics/secondary-education-see')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
                  <span>SEE Board Prep</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/admissions/apply')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 font-semibold text-emerald-300"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Apply Online (2082)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Portals & Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-400 pl-2">
              Portals & Services
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => navigate('/portal/student')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-blue-500" />
                  <span>Student Portal</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/portal/parent')}
                  className="hover:text-purple-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-purple-500" />
                  <span>Parent Portal & Fee Pay</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/notices')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Notices & Circulars</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/downloads')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Download Center</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/facilities')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Campus Facilities</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Office */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-400 pl-2">
              Get in Touch
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{settings.email}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{settings.officeHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Inaruwa English Boarding School (IEBS). All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/about')} className="hover:text-slate-300">About</button>
            <span>•</span>
            <button onClick={() => navigate('/contact')} className="hover:text-slate-300">Contact</button>
            <span>•</span>
            <button onClick={() => navigate('/downloads')} className="hover:text-slate-300">Prospectus</button>
            <span>•</span>
            <button onClick={() => navigate('/admin/login')} className="hover:text-amber-400">Staff Portal</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
