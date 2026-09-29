import React, { useState, useMemo } from 'react';
import { useRouter } from '../context/RouterContext';
import { Teacher } from '../types';
import {
  Users,
  Search,
  Mail,
  Phone,
  BookOpen,
  Award,
  ChevronRight,
  GraduationCap,
  Briefcase,
} from 'lucide-react';

interface TeachersPageProps {
  teachers: Teacher[];
  selectedId?: string;
}

export const TeachersPage: React.FC<TeachersPageProps> = ({ teachers, selectedId }) => {
  const { navigate } = useRouter();
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedTeacher = selectedId ? teachers.find((t) => t.id === selectedId) : null;

  const departments = useMemo(() => {
    const set = new Set<string>();
    teachers.forEach((t) => {
      if (t.department) set.add(t.department);
    });
    return ['All', ...Array.from(set)];
  }, [teachers]);

  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const matchDept = selectedDept === 'All' || t.department === selectedDept;
      const matchSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.designation.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDept && matchSearch && t.status === 'active';
    });
  }, [teachers, selectedDept, searchQuery]);

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-14 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <Users className="w-4 h-4" />
            <span>Faculty Directory</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-crest">
            {selectedTeacher ? selectedTeacher.name : 'Our Dedicated Teachers & Staff'}
          </h1>
          <p className="text-slate-300 max-w-2xl text-sm sm:text-base">
            {selectedTeacher
              ? `${selectedTeacher.designation} • ${selectedTeacher.department}`
              : 'Passionate subject specialists, experienced pedagogical leaders, and nurturing mentors inspiring learners in Inaruwa.'}
          </p>
        </div>
      </section>

      {/* Detail View */}
      {selectedTeacher ? (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <button
            onClick={() => navigate('/teachers')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5"
          >
            <span>← Back to Faculty Directory</span>
          </button>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-100">
              <img
                src={selectedTeacher.photo}
                alt={selectedTeacher.name}
                className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl object-cover object-top border-4 border-emerald-600/20 shadow-md shrink-0"
              />
              <div className="space-y-2 text-center sm:text-left flex-1">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-md">
                  {selectedTeacher.department}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-crest">
                  {selectedTeacher.name}
                </h2>
                <p className="text-sm font-bold text-slate-700">{selectedTeacher.designation}</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <strong>Subject:</strong> {selectedTeacher.subject}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-teal-600" />
                    <strong>Experience:</strong> {selectedTeacher.experience}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900 font-crest">Educational Qualifications</h3>
              <p className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-800 font-medium">
                {selectedTeacher.qualification}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900 font-crest">Professional Biography & Philosophy</h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {selectedTeacher.bio}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-600">
              {selectedTeacher.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  <span>{selectedTeacher.email}</span>
                </div>
              )}
              {selectedTeacher.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>{selectedTeacher.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Directory Grid View */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Controls: Department filter + search */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            {/* Dept Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedDept === dept
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>

            {/* Search input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search teacher or subject..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 text-slate-800"
              />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map((t) => (
              <div
                key={t.id}
                onClick={() => navigate(`/teachers/${t.id}`)}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all cursor-pointer p-6 flex flex-col justify-between space-y-4 group"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={t.photo}
                    alt={t.name}
                    className="w-20 h-20 rounded-2xl object-cover object-top border-2 border-slate-100 shadow shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {t.department}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {t.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-600">{t.designation}</p>
                    <p className="text-[11px] text-slate-400">{t.qualification}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>Subject:</strong> {t.subject}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span><strong>Experience:</strong> {t.experience}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-900">
                  <span>View Full Profile</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          {filteredTeachers.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Users className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p>No faculty members found matching your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
