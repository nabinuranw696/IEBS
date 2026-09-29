import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { SchoolSettings } from '../types';
import {
  GraduationCap,
  History,
  Target,
  Sparkles,
  Award,
  Users,
  CheckCircle2,
  Calendar,
  BookOpen,
} from 'lucide-react';

interface AboutPageProps {
  settings: SchoolSettings;
  subroute?: 'overview' | 'history' | 'vision-mission' | 'principal-message';
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings, subroute = 'overview' }) => {
  const { path, navigate } = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'vision-mission' | 'principal-message'>('overview');

  useEffect(() => {
    if (path === '/about/history') setActiveTab('history');
    else if (path === '/about/vision-mission') setActiveTab('vision-mission');
    else if (path === '/about/principal-message') setActiveTab('principal-message');
    else setActiveTab('overview');
  }, [path]);

  const handleTab = (t: 'overview' | 'history' | 'vision-mission' | 'principal-message') => {
    setActiveTab(t);
    if (t === 'overview') navigate('/about');
    else navigate(`/about/${t}`);
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Page Header Banner */}
      <section className="bg-slate-900 text-white py-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <GraduationCap className="w-4 h-4" />
            <span>Institutional Profile</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-crest">
            About Inaruwa English Boarding School
          </h1>
          <p className="text-slate-300 max-w-2xl text-sm sm:text-base">
            Cultivating academic competence, civic character, and human values in Sunsari District since 1995 AD.
          </p>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
          <button
            onClick={() => handleTab('overview')}
            className={`py-3 px-5 font-semibold text-sm border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => handleTab('history')}
            className={`py-3 px-5 font-semibold text-sm border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'history'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            History & Heritage
          </button>
          <button
            onClick={() => handleTab('vision-mission')}
            className={`py-3 px-5 font-semibold text-sm border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'vision-mission'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Vision, Mission & Values
          </button>
          <button
            onClick={() => handleTab('principal-message')}
            className={`py-3 px-5 font-semibold text-sm border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'principal-message'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Principal's Message
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-crest">
                  A Beacon of Holistic Education in Koshi Province
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  {settings.history}
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <span className="text-2xl font-bold text-emerald-800 font-crest">1995 AD</span>
                    <p className="text-xs text-slate-600 font-medium mt-1">Year of Foundation (2052 BS)</p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <span className="text-2xl font-bold text-amber-800 font-crest">1,450+</span>
                    <p className="text-xs text-slate-600 font-medium mt-1">Learners from Nursery to SEE</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <img
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80"
                  alt="School Campus"
                  className="rounded-2xl shadow-lg border border-slate-200 object-cover w-full h-80"
                />
              </div>
            </div>

            {/* Core Values */}
            <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-6">
              <h3 className="text-xl font-bold text-slate-900 font-crest">Our Core Commitments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {settings.coreValues.map((val, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold text-slate-800">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-widest">
                <History className="w-4 h-4" />
                <span>Three Decades of Educational Legacy</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-crest">
                The Journey of Inaruwa English Boarding School
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {settings.history}
              </p>
            </div>

            {/* Milestones Timeline */}
            <div className="space-y-6 border-l-2 border-emerald-600/30 pl-6 ml-4">
              <div className="relative">
                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-emerald-100"></div>
                <h4 className="text-base font-bold text-slate-900">2052 BS (1995 AD) – The Inception</h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Started with three rented classrooms in Inaruwa Bazaar with 60 students and a vision to make fluent English education accessible to all families.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-emerald-100"></div>
                <h4 className="text-base font-bold text-slate-900">2061 BS (2004 AD) – First Batch of SLC / SEE</h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Achieved 100% first division pass rate in national board examinations, earning distinction across Koshi Province.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-emerald-100"></div>
                <h4 className="text-base font-bold text-slate-900">2075 BS (2018 AD) – Modern Campus & Science Wing</h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Expanded into dedicated new academic blocks, multi-tier sports grounds, digitized audio-visual classrooms, and full computer laboratories.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-emerald-100"></div>
                <h4 className="text-base font-bold text-slate-900">Present (2082 BS) – Digital Transformation & STEM</h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Integrated modern robotics education, online student/parent portals, automated report cards, and digital payment facilitation.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VISION & MISSION TAB */}
        {activeTab === 'vision-mission' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white p-6 sm:p-8 rounded-2xl shadow-md space-y-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold font-crest">Our Vision</h3>
                <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
                  {settings.vision}
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-2xl shadow-md space-y-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold font-crest">Our Mission</h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {settings.mission}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-slate-900 font-crest">Core Institutional Values</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {settings.coreValues.map((v, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm font-semibold text-slate-800">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PRINCIPAL'S MESSAGE TAB */}
        {activeTab === 'principal-message' && (
          <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-100">
              <img
                src={settings.principalPhoto}
                alt={settings.principalName}
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover object-top border-4 border-emerald-600/30 shadow-md shrink-0"
              />
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                  Official Message from the Principal
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-crest">
                  {settings.principalName}
                </h2>
                <p className="text-sm font-semibold text-emerald-800">{settings.principalDesignation}</p>
                <p className="text-xs text-slate-500">Inaruwa English Boarding School, Sunsari, Koshi Province</p>
              </div>
            </div>

            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4 text-sm sm:text-base">
              <p className="italic text-lg text-emerald-950 font-serif border-l-4 border-emerald-600 pl-4 py-1">
                "Welcome to Inaruwa English Boarding School. Education is the greatest gift of empowerment, and here in Inaruwa, we strive daily to make it transformative for every child."
              </p>
              <p>
                {settings.principalMessage}
              </p>
              <p>
                We believe that education must transcend textbooks and exam halls. Our students are challenged to think analytically, act ethically, speak fluently in English, and appreciate the glorious cultural heritage of Nepal. Whether in our scientific laboratories, robotics workshops, debate societies, or expansive football pitches, every student is encouraged to discover their unique voice.
              </p>
              <p>
                We invite parents, guardians, and well-wishers to partner with us in shaping confident, empathetic, and capable leaders of tomorrow.
              </p>
              <div className="pt-4">
                <p className="font-bold text-slate-900">{settings.principalName}</p>
                <p className="text-xs text-slate-500">Principal, IEBS Inaruwa</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
