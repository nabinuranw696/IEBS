import React from 'react';
import { useRouter } from '../context/RouterContext';
import { AcademicProgram } from '../types';
import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Clock,
  Award,
} from 'lucide-react';

interface AcademicsPageProps {
  programs: AcademicProgram[];
  selectedSlug?: string;
}

export const AcademicsPage: React.FC<AcademicsPageProps> = ({ programs, selectedSlug }) => {
  const { navigate } = useRouter();

  const selectedProgram = selectedSlug ? programs.find((p) => p.slug === selectedSlug) : null;

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-14 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <BookOpen className="w-4 h-4" />
            <span>Academic Excellence</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-crest">
            {selectedProgram ? selectedProgram.name : 'Academic Programs & Curriculum'}
          </h1>
          <p className="text-slate-300 max-w-2xl text-sm sm:text-base">
            {selectedProgram
              ? `${selectedProgram.level} • Classes: ${selectedProgram.classes}`
              : 'Holistic English-medium schooling aligned with Nepal CDC curriculum and modern 21st-century pedagogy.'}
          </p>
        </div>
      </section>

      {/* Program Detail View if slug is present */}
      {selectedProgram ? (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <button
            onClick={() => navigate('/academics')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5"
          >
            <span>← Back to All Academic Programs</span>
          </button>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="h-72 sm:h-96 relative overflow-hidden">
              <img
                src={selectedProgram.imageUrl}
                alt={selectedProgram.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="bg-emerald-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {selectedProgram.level}
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold font-crest">
                  {selectedProgram.name}
                </h2>
                <p className="text-sm text-emerald-200">Classes: {selectedProgram.classes}</p>
              </div>
            </div>

            <div className="p-6 sm:p-10 space-y-8">
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-900 font-crest">Program Overview</h3>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  {selectedProgram.description}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-900 font-crest">Curriculum Framework</h3>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-slate-700 text-sm sm:text-base leading-relaxed">
                  {selectedProgram.curriculum}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 font-crest">Key Pedagogical Highlights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedProgram.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-sm font-semibold text-slate-800">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-lg font-bold">Interested in Enrolling for {selectedProgram.classes}?</h4>
                  <p className="text-xs text-emerald-200">Admissions are open for the academic session 2082/83 BS.</p>
                </div>
                <button
                  onClick={() => navigate('/admissions/apply')}
                  className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs uppercase tracking-wider shrink-0 transition-colors shadow"
                >
                  Apply Online Now
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* All Programs Grid View */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programs.map((prog) => (
              <div
                key={prog.id}
                onClick={() => navigate(`/academics/${prog.slug}`)}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all cursor-pointer flex flex-col group"
              >
                <div className="h-60 overflow-hidden relative">
                  <img
                    src={prog.imageUrl}
                    alt={prog.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                    {prog.classes}
                  </span>
                  <span className="absolute bottom-4 left-4 right-4 text-white text-xl font-bold font-crest">
                    {prog.name}
                  </span>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {prog.level}
                    </span>
                    <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {prog.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    {prog.features.slice(0, 2).map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-900">
                    <span>View Curriculum Details & Requirements</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
