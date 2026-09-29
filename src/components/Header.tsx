import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { SchoolSettings } from '../types';
import {
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  ChevronDown,
  Search,
  UserCheck,
  Users,
  ShieldCheck,
  FileText,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface HeaderProps {
  settings: SchoolSettings;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ settings, onOpenSearch }) => {
  const { path, navigate } = useRouter();
  const { adminUser, currentStudent, currentParent } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [academicsDropdownOpen, setAcademicsDropdownOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on navigation
  const handleNav = (target: string) => {
    navigate(target);
    setMobileMenuOpen(false);
    setAboutDropdownOpen(false);
    setAcademicsDropdownOpen(false);
    setPortalDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm transition-all duration-200">
      {/* Top Announcement Bar */}
      {settings.announcementActive && settings.announcementBar && (
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-indigo-950 text-white text-xs sm:text-sm py-2 px-4">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
              <span className="bg-amber-400 text-amber-950 font-bold px-2 py-0.5 rounded text-[11px] uppercase tracking-wider shrink-0">
                Notice
              </span>
              <span className="truncate">{settings.announcementBar}</span>
            </div>
            <div className="hidden lg:flex items-center gap-6 shrink-0 text-xs text-emerald-100">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-300" /> {settings.phone.split('/')[0]}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-300" /> {settings.email}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-300" /> Inaruwa, Sunsari, Koshi
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Branding Bar */}
      <div className="border-b border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          {/* Logo & School Name */}
          <div
            onClick={() => handleNav('/')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 p-1 flex items-center justify-center shadow-md ring-2 ring-emerald-600/20 group-hover:scale-105 transition-transform shrink-0">
              <div className="w-full h-full rounded-full border border-amber-300/40 flex flex-col items-center justify-center text-white">
                <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300" />
                <span className="text-[8px] font-bold tracking-tighter text-emerald-200">IEBS</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-xl md:text-2xl font-black tracking-tight text-slate-900 leading-tight font-crest">
                  {settings.schoolName}
                </h1>
              </div>
              <p className="text-xs sm:text-xs font-semibold text-emerald-700 tracking-wide flex items-center gap-1.5">
                <span>Inaruwa, Sunsari, Koshi Province</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-normal">Est. 1995 AD</span>
              </p>
            </div>
          </div>

          {/* Quick Actions (Desktop) */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
              title="Search school resources"
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span>Search...</span>
            </button>

            <button
              onClick={() => handleNav('/portal/student')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
                currentStudent
                  ? 'bg-blue-50 border-blue-200 text-blue-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-700'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>{currentStudent ? `Student: ${currentStudent.fullName.split(' ')[0]}` : 'Student Portal'}</span>
            </button>

            <button
              onClick={() => handleNav('/portal/parent')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
                currentParent
                  ? 'bg-purple-50 border-purple-200 text-purple-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-purple-400 hover:text-purple-700'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-purple-600" />
              <span>{currentParent ? 'Parent Portal' : 'Parent Portal'}</span>
            </button>

            <button
              onClick={() => handleNav('/admissions/apply')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 rounded-lg shadow-sm hover:shadow transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Online Admission</span>
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenSearch}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar (Desktop) */}
      <nav className="hidden lg:block bg-slate-900 text-white shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleNav('/')}
              className={`px-3.5 py-3 font-semibold transition-colors hover:bg-slate-800 ${
                path === '/' ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-800/60' : 'text-slate-200'
              }`}
            >
              Home
            </button>

            {/* About Dropdown */}
            <div className="relative group">
              <button
                className={`flex items-center gap-1 px-3.5 py-3 font-semibold transition-colors hover:bg-slate-800 ${
                  path.startsWith('/about') ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-800/60' : 'text-slate-200'
                }`}
                onClick={() => handleNav('/about')}
              >
                <span>About School</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <div className="absolute left-0 top-full hidden group-hover:block w-64 bg-white text-slate-800 shadow-xl rounded-b-xl border border-slate-100 py-2 z-50">
                <button
                  onClick={() => handleNav('/about')}
                  className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-sm font-medium hover:text-emerald-800"
                >
                  School Overview
                </button>
                <button
                  onClick={() => handleNav('/about/history')}
                  className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-sm font-medium hover:text-emerald-800"
                >
                  Our History & Heritage
                </button>
                <button
                  onClick={() => handleNav('/about/vision-mission')}
                  className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-sm font-medium hover:text-emerald-800"
                >
                  Vision, Mission & Values
                </button>
                <button
                  onClick={() => handleNav('/about/principal-message')}
                  className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-sm font-medium hover:text-emerald-800"
                >
                  Principal's Message
                </button>
              </div>
            </div>

            {/* Academics Dropdown */}
            <div className="relative group">
              <button
                className={`flex items-center gap-1 px-3.5 py-3 font-semibold transition-colors hover:bg-slate-800 ${
                  path.startsWith('/academics') ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-800/60' : 'text-slate-200'
                }`}
                onClick={() => handleNav('/academics')}
              >
                <span>Academics</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <div className="absolute left-0 top-full hidden group-hover:block w-64 bg-white text-slate-800 shadow-xl rounded-b-xl border border-slate-100 py-2 z-50">
                <button
                  onClick={() => handleNav('/academics')}
                  className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-sm font-medium hover:text-emerald-800"
                >
                  Academic Programs
                </button>
                <button
                  onClick={() => handleNav('/academics/pre-primary-montessori')}
                  className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-sm font-medium hover:text-emerald-800"
                >
                  Pre-Primary & Montessori
                </button>
                <button
                  onClick={() => handleNav('/academics/primary-level')}
                  className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-sm font-medium hover:text-emerald-800"
                >
                  Primary Education (1 - 5)
                </button>
                <button
                  onClick={() => handleNav('/academics/lower-secondary')}
                  className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-sm font-medium hover:text-emerald-800"
                >
                  Lower Secondary (6 - 8)
                </button>
                <button
                  onClick={() => handleNav('/academics/secondary-education-see')}
                  className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-sm font-medium hover:text-emerald-800"
                >
                  Secondary (SEE Grade 9 - 10)
                </button>
              </div>
            </div>

            <button
              onClick={() => handleNav('/teachers')}
              className={`px-3.5 py-3 font-semibold transition-colors hover:bg-slate-800 ${
                path.startsWith('/teachers') ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-800/60' : 'text-slate-200'
              }`}
            >
              Faculty & Staff
            </button>

            <button
              onClick={() => handleNav('/admissions')}
              className={`px-3.5 py-3 font-semibold transition-colors hover:bg-slate-800 ${
                path.startsWith('/admissions') ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-800/60' : 'text-slate-200'
              }`}
            >
              Admissions
            </button>

            <button
              onClick={() => handleNav('/notices')}
              className={`px-3.5 py-3 font-semibold transition-colors hover:bg-slate-800 ${
                path.startsWith('/notices') ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-800/60' : 'text-slate-200'
              }`}
            >
              Notices
            </button>

            <button
              onClick={() => handleNav('/news')}
              className={`px-3.5 py-3 font-semibold transition-colors hover:bg-slate-800 ${
                path.startsWith('/news') ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-800/60' : 'text-slate-200'
              }`}
            >
              News
            </button>

            <button
              onClick={() => handleNav('/events')}
              className={`px-3.5 py-3 font-semibold transition-colors hover:bg-slate-800 ${
                path.startsWith('/events') ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-800/60' : 'text-slate-200'
              }`}
            >
              Events
            </button>

            <button
              onClick={() => handleNav('/facilities')}
              className={`px-3.5 py-3 font-semibold transition-colors hover:bg-slate-800 ${
                path === '/facilities' ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-800/60' : 'text-slate-200'
              }`}
            >
              Facilities
            </button>

            <button
              onClick={() => handleNav('/gallery')}
              className={`px-3.5 py-3 font-semibold transition-colors hover:bg-slate-800 ${
                path.startsWith('/gallery') ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-800/60' : 'text-slate-200'
              }`}
            >
              Gallery
            </button>

            <button
              onClick={() => handleNav('/achievements')}
              className={`px-3.5 py-3 font-semibold transition-colors hover:bg-slate-800 ${
                path === '/achievements' ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-800/60' : 'text-slate-200'
              }`}
            >
              Achievements
            </button>

            <button
              onClick={() => handleNav('/downloads')}
              className={`px-3.5 py-3 font-semibold transition-colors hover:bg-slate-800 ${
                path === '/downloads' ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-800/60' : 'text-slate-200'
              }`}
            >
              Downloads
            </button>

            <button
              onClick={() => handleNav('/contact')}
              className={`px-3.5 py-3 font-semibold transition-colors hover:bg-slate-800 ${
                path === '/contact' ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-800/60' : 'text-slate-200'
              }`}
            >
              Contact
            </button>
          </div>

          <div className="flex items-center">
            <button
              onClick={() => handleNav(adminUser ? '/admin/dashboard' : '/admin/login')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{adminUser ? 'Admin Panel' : 'Staff / Admin'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[69px] bottom-0 bg-white z-50 overflow-y-auto border-t border-slate-200 p-4 space-y-3 shadow-2xl">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100">
            <button
              onClick={() => handleNav('/portal/student')}
              className="flex items-center justify-center gap-2 p-3 bg-blue-50 text-blue-800 text-xs font-bold rounded-xl border border-blue-200"
            >
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>Student Portal</span>
            </button>
            <button
              onClick={() => handleNav('/portal/parent')}
              className="flex items-center justify-center gap-2 p-3 bg-purple-50 text-purple-800 text-xs font-bold rounded-xl border border-purple-200"
            >
              <Users className="w-4 h-4 text-purple-600" />
              <span>Parent Portal</span>
            </button>
          </div>

          <button
            onClick={() => handleNav('/admissions/apply')}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold rounded-xl shadow-md"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Apply Online Admission 2082</span>
          </button>

          <div className="space-y-1 text-sm font-medium text-slate-800 pt-2">
            <button
              onClick={() => handleNav('/')}
              className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-100"
            >
              Home
            </button>
            <button
              onClick={() => handleNav('/about')}
              className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-100"
            >
              About School
            </button>
            <button
              onClick={() => handleNav('/academics')}
              className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-100"
            >
              Academic Programs
            </button>
            <button
              onClick={() => handleNav('/teachers')}
              className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-100"
            >
              Teachers & Staff
            </button>
            <button
              onClick={() => handleNav('/admissions')}
              className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-100"
            >
              Admissions Info & Criteria
            </button>
            <button
              onClick={() => handleNav('/notices')}
              className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-100"
            >
              Notices & Circulars
            </button>
            <button
              onClick={() => handleNav('/news')}
              className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-100"
            >
              Latest News
            </button>
            <button
              onClick={() => handleNav('/events')}
              className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-100"
            >
              Events Calendar
            </button>
            <button
              onClick={() => handleNav('/facilities')}
              className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-100"
            >
              Campus Facilities
            </button>
            <button
              onClick={() => handleNav('/gallery')}
              className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-100"
            >
              Photo & Video Gallery
            </button>
            <button
              onClick={() => handleNav('/achievements')}
              className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-100"
            >
              Student Achievements
            </button>
            <button
              onClick={() => handleNav('/downloads')}
              className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-100"
            >
              Downloads Center
            </button>
            <button
              onClick={() => handleNav('/contact')}
              className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-100"
            >
              Contact Us
            </button>
            <button
              onClick={() => handleNav(adminUser ? '/admin/dashboard' : '/admin/login')}
              className="w-full text-left py-2.5 px-3 rounded-lg bg-slate-100 text-slate-900 font-semibold"
            >
              {adminUser ? 'Open Admin Panel' : 'Staff / Admin Login'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
