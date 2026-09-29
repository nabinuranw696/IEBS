import React from 'react';
import { useRouter } from '../context/RouterContext';
import {
  SchoolSettings,
  Notice,
  News,
  Event,
  Teacher,
  AcademicProgram,
  Achievement,
  Facility,
  GalleryAlbum,
} from '../types';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Sparkles,
  Users,
  ShieldCheck,
  ArrowRight,
  Clock,
  MapPin,
  Bell,
  Monitor,
  Trophy,
  Cpu,
  FileText,
  ExternalLink,
} from 'lucide-react';

interface HomePageProps {
  settings: SchoolSettings;
  notices: Notice[];
  news: News[];
  events: Event[];
  teachers: Teacher[];
  programs: AcademicProgram[];
  achievements: Achievement[];
  facilities: Facility[];
  gallery: GalleryAlbum[];
}

export const HomePage: React.FC<HomePageProps> = ({
  settings,
  notices,
  news,
  events,
  teachers,
  programs,
  achievements,
  facilities,
  gallery,
}) => {
  const { navigate } = useRouter();

  const publishedNotices = notices.filter((n) => n.status === 'published').slice(0, 4);
  const publishedNews = news.filter((n) => n.status === 'published').slice(0, 3);
  const upcomingEvents = events.filter((e) => e.status === 'upcoming').slice(0, 3);
  const featuredTeachers = teachers.filter((t) => t.status === 'active').slice(0, 4);
  const activePrograms = programs.filter((p) => p.status === 'active');

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[580px] lg:min-h-[660px] flex items-center bg-slate-950 overflow-hidden text-white">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={settings.heroImage}
            alt="Inaruwa English Boarding School Campus"
            className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-emerald-950/70"></div>
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
              <span>Admissions Open for 2082/83 BS • Playgroup to Grade 9</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12] font-crest">
              {settings.heroHeadline}
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed font-normal">
              {settings.heroSubheadline}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigate('/admissions/apply')}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-950/50 hover:shadow-emerald-500/20 transition-all flex items-center gap-2 group"
              >
                <span>Apply for Admission</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/academics')}
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm sm:text-base border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-amber-300" />
                <span>Explore Academics</span>
              </button>

              <button
                onClick={() => navigate('/portal/student')}
                className="px-5 py-3.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/40 text-blue-200 font-semibold text-sm sm:text-base border border-blue-400/30 backdrop-blur-md transition-all flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-blue-300" />
                <span>Student / Parent Portal</span>
              </button>
            </div>

            {/* Affiliation Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400 border-t border-slate-800/80">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Recognized by Ministry of Education, Nepal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>National Examination Board (NEB) SEE Affiliated</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-teal-400" />
                <span>Inaruwa, Sunsari, Koshi Province</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="-mt-10 lg:-mt-16 relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-2xl shadow-xl border border-slate-100 p-6 lg:p-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {settings.stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center p-3 text-center">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-800 tracking-tight font-crest">
                {stat.value}{stat.suffix}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-600 mt-1 uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. LATEST NOTICES & ANNOUNCEMENTS TICKER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-5 lg:p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-200/60 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-sm">
                <Bell className="w-5 h-5 animate-bounce-subtle" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Official Circulars & Notice Board</h2>
                <p className="text-xs text-slate-600">Real-time examination routines, holiday circulars & announcements</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/notices')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 self-start md:self-auto"
            >
              <span>View All Circulars</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {publishedNotices.map((n) => (
              <div
                key={n.id}
                onClick={() => navigate(`/notices/${n.id}`)}
                className="bg-white p-4 rounded-xl border border-emerald-100 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {n.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {n.publishedDate}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                    {n.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {n.description}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ABOUT SCHOOL & LEADERSHIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100/60 px-3 py-1 rounded-full">
              <span>About Inaruwa English Boarding School</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-crest leading-tight">
              3 Decades of Academic Dignity & Child Development in Sunsari
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              {settings.history}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                  V
                </div>
                <h3 className="text-sm font-bold text-slate-900">Our Vision</h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {settings.vision}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold text-xs">
                  M
                </div>
                <h3 className="text-sm font-bold text-slate-900">Our Mission</h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {settings.mission}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={() => navigate('/about')}
                className="px-5 py-2.5 rounded-lg bg-slate-900 text-white text-xs sm:text-sm font-bold hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <span>Read Full School History</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/about/principal-message')}
                className="text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
              >
                <span>Principal's Desk</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Principal & Chairman Spotlight Cards */}
          <div className="lg:col-span-5 space-y-5">
            {/* Principal Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 space-y-4 hover:border-emerald-300 transition-colors">
              <div className="flex items-center gap-4">
                <img
                  src={settings.principalPhoto}
                  alt={settings.principalName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover object-top border-2 border-emerald-600/40 shadow"
                />
                <div>
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                    Message from Principal
                  </span>
                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    {settings.principalName}
                  </h3>
                  <p className="text-xs text-slate-500">{settings.principalDesignation}</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                "{settings.principalMessage.slice(0, 160)}..."
              </p>
              <button
                onClick={() => navigate('/about/principal-message')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
              >
                <span>Read Full Message</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Chairman Card */}
            <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-md p-5 space-y-3">
              <div className="flex items-center gap-4">
                <img
                  src={settings.chairmanPhoto}
                  alt={settings.chairmanName}
                  className="w-14 h-14 rounded-2xl object-cover object-top border-2 border-amber-400/40 shadow"
                />
                <div>
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                    From School Management Committee
                  </span>
                  <h3 className="text-sm font-bold text-white font-heading">
                    {settings.chairmanName}
                  </h3>
                  <p className="text-xs text-slate-400">Chairman, Managing Board</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 italic bg-slate-800/80 p-3 rounded-xl leading-relaxed">
                "{settings.chairmanMessage.slice(0, 140)}..."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE OUR SCHOOL */}
      <section className="bg-slate-900 text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              Institutional Pillars
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-crest">
              Why Parents Choose Inaruwa English Boarding School
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Setting benchmarks for holistic student development, scientific inquiry, and board exam honors in Sunsari.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {settings.whyChooseUs.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-3 hover:bg-slate-800 hover:border-emerald-500/40 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                  {idx === 0 && <Award className="w-6 h-6 text-amber-300" />}
                  {idx === 1 && <Monitor className="w-6 h-6 text-emerald-200" />}
                  {idx === 2 && <Users className="w-6 h-6 text-white" />}
                  {idx === 3 && <Trophy className="w-6 h-6 text-amber-300" />}
                  {idx === 4 && <ShieldCheck className="w-6 h-6 text-teal-200" />}
                  {idx === 5 && <Cpu className="w-6 h-6 text-emerald-300" />}
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ACADEMIC PROGRAMS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100/60 px-3 py-1 rounded-full">
              Curriculum & Programs
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-crest">
              Educational Pathways for Every Learning Stage
            </h2>
          </div>
          <button
            onClick={() => navigate('/academics')}
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
          >
            <span>Explore All Syllabi</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activePrograms.map((prog) => (
            <div
              key={prog.id}
              onClick={() => navigate(`/academics/${prog.slug}`)}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all cursor-pointer flex flex-col group"
            >
              <div className="h-44 overflow-hidden relative">
                <img
                  src={prog.imageUrl}
                  alt={prog.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent"></div>
                <span className="absolute bottom-3 left-3 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow">
                  {prog.classes}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {prog.level}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {prog.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {prog.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-900">
                  <span>View Curriculum</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FEATURED FACULTY / TEACHERS */}
      <section className="bg-slate-50 border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100/60 px-3 py-1 rounded-full">
                Educators & Mentors
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-crest">
                Learn from Distinguished Faculty
              </h2>
            </div>
            <button
              onClick={() => navigate('/teachers')}
              className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              <span>View All Faculty Members</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTeachers.map((t) => (
              <div
                key={t.id}
                onClick={() => navigate(`/teachers/${t.id}`)}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all cursor-pointer text-center p-5 space-y-3 group"
              >
                <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden ring-4 ring-emerald-600/10 group-hover:ring-emerald-600/30 transition-all">
                  <img
                    src={t.photo}
                    alt={t.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform"
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {t.name}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-700">{t.designation}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{t.qualification}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-600 font-medium">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.subject}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. LATEST NEWS & EVENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* News (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100/60 px-3 py-1 rounded-full">
                  Campus Stories
                </span>
                <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-crest mt-2">
                  Latest School News
                </h2>
              </div>
              <button
                onClick={() => navigate('/news')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
              >
                <span>All News</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {publishedNews.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/news/${item.slug}`)}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden p-4 sm:p-5 flex flex-col sm:flex-row gap-4 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full sm:w-44 h-36 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="font-semibold text-emerald-700">{item.category}</span>
                        <span>•</span>
                        <span>{item.publishedDate}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 mt-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                        {item.summary}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 self-start">
                      Read article <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Events (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-100/60 px-3 py-1 rounded-full">
                  Calendar
                </span>
                <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-crest mt-2">
                  Upcoming Events
                </h2>
              </div>
              <button
                onClick={() => navigate('/events')}
                className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1"
              >
                <span>Full Calendar</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5">
              {upcomingEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => navigate(`/events/${evt.slug}`)}
                  className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer flex items-center gap-4 group"
                >
                  {/* Date badge */}
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex flex-col items-center justify-center font-bold shrink-0 shadow">
                    <span className="text-lg font-black leading-none">{evt.eventDate.split('-')[2] || '15'}</span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold opacity-90">
                      {new Date(evt.eventDate).toLocaleString('default', { month: 'short' }) || 'OCT'}
                    </span>
                  </div>

                  <div className="space-y-1 flex-1">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{evt.startTime} - {evt.endTime}</span>
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{evt.location}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. CAMPUS FACILITIES */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                Infrastructure
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-crest">
                Modern Campus Amenities
              </h2>
            </div>
            <button
              onClick={() => navigate('/facilities')}
              className="text-xs sm:text-sm font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>Explore All Facilities</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {facilities.slice(0, 3).map((fac) => (
              <div
                key={fac.id}
                onClick={() => navigate('/facilities')}
                className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-emerald-500/50 shadow-md group cursor-pointer transition-all"
              >
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={fac.imageUrl}
                    alt={fac.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                  <span className="absolute bottom-3 left-3 text-base font-bold text-white font-crest">
                    {fac.name}
                  </span>
                </div>
                <div className="p-5 space-y-3">
                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
                    {fac.description}
                  </p>
                  <div className="space-y-1">
                    {fac.features.slice(0, 2).map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. PHOTO GALLERY PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100/60 px-3 py-1 rounded-full">
              Vibrant Campus Life
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-crest">
              Glimpses of Celebrations & Activities
            </h2>
          </div>
          <button
            onClick={() => navigate('/gallery')}
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
          >
            <span>Browse Full Gallery</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.slice(0, 3).map((alb) => (
            <div
              key={alb.id}
              onClick={() => navigate(`/gallery/${alb.slug}`)}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all cursor-pointer group"
            >
              <div className="h-52 overflow-hidden relative">
                <img
                  src={alb.coverImage}
                  alt={alb.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-full">
                  {alb.images.length} Photos
                </span>
                <span className="absolute bottom-3 left-3 text-white font-bold text-sm sm:text-base leading-snug">
                  {alb.title}
                </span>
              </div>
              <div className="p-4 flex items-center justify-between text-xs text-slate-500">
                <span>{alb.category}</span>
                <span>{alb.eventDate}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. ADMISSIONS CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-900 to-indigo-950 text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <span>Enrollment Open for 2082/83 BS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight font-crest leading-tight">
              Give Your Child the Inaruwa Boarding Advantage
            </h2>
            <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
              Join thousands of proud parents across Sunsari. Submit your application online in just 3 minutes, schedule entrance counseling, and download our complete prospectus.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigate('/admissions/apply')}
                className="px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-sm sm:text-base shadow-lg transition-all flex items-center gap-2"
              >
                <span>Start Online Application</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/downloads')}
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-emerald-300" />
                <span>Download Prospectus</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
