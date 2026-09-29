import React, { useState, useMemo } from 'react';
import { useRouter } from '../context/RouterContext';
import { Notice, SchoolSettings } from '../types';
import {
  Bell,
  Calendar,
  Clock,
  Search,
  FileText,
  Download,
  Printer,
  ChevronRight,
  Pin,
  GraduationCap,
} from 'lucide-react';

interface NoticesPageProps {
  notices: Notice[];
  settings: SchoolSettings;
  selectedId?: string;
}

export const NoticesPage: React.FC<NoticesPageProps> = ({ notices, settings, selectedId }) => {
  const { navigate } = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedNotice = selectedId ? notices.find((n) => n.id === selectedId) : null;

  const categories = ['All', 'Examination', 'Admission', 'Holiday', 'General', 'Urgent'];

  const filteredNotices = useMemo(() => {
    return notices.filter((n) => {
      const matchCat = selectedCategory === 'All' || n.category === selectedCategory;
      const matchSearch =
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch && n.status === 'published';
    });
  }, [notices, selectedCategory, searchQuery]);

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-14 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <Bell className="w-4 h-4" />
            <span>Official Communications</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-crest">
            {selectedNotice ? selectedNotice.title : 'Notices & Circular Board'}
          </h1>
          <p className="text-slate-300 max-w-2xl text-sm sm:text-base">
            {selectedNotice
              ? `Published on ${selectedNotice.publishedDate} • Category: ${selectedNotice.category}`
              : 'Stay up to date with official administrative decrees, exam schedules, and holiday announcements.'}
          </p>
        </div>
      </section>

      {/* Notice Detail View */}
      {selectedNotice ? (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/notices')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5"
            >
              <span>← Back to All Notices</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Circular</span>
            </button>
          </div>

          {/* Printable Letterhead Notice */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8 printable-card">
            {/* Letterhead Header */}
            <div className="border-b-2 border-emerald-800 pb-6 text-center space-y-1">
              <div className="flex items-center justify-center gap-2 text-emerald-900 font-bold font-crest text-xl sm:text-2xl">
                <GraduationCap className="w-6 h-6 text-emerald-700" />
                <span>{settings.schoolName}</span>
              </div>
              <p className="text-xs text-slate-500 font-semibold">{settings.address}</p>
              <p className="text-[11px] text-slate-400">Affiliated to NEB Nepal • Regd. Sunsari • Phone: {settings.phone}</p>
              <div className="pt-2">
                <span className="inline-block px-3 py-1 rounded bg-slate-900 text-white font-bold text-xs uppercase tracking-widest">
                  OFFICIAL NOTICE
                </span>
              </div>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3">
              <span><strong>Category:</strong> {selectedNotice.category}</span>
              <span><strong>Circular ID:</strong> {selectedNotice.id}</span>
              <span><strong>Date:</strong> {selectedNotice.publishedDate}</span>
            </div>

            {/* Notice Body */}
            <div className="space-y-4 text-slate-800 leading-relaxed text-sm sm:text-base">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-crest">
                {selectedNotice.title}
              </h2>
              <p className="whitespace-pre-line text-slate-700 leading-relaxed">
                {selectedNotice.description}
              </p>
            </div>

            {/* Official Signatory */}
            <div className="pt-10 border-t border-slate-100 flex items-end justify-between text-xs">
              <div className="text-slate-400">
                <p>Distribution:</p>
                <p>• All Students, Guardians & Teachers</p>
                <p>• School Digital Portal / Notice Board</p>
              </div>
              <div className="text-right space-y-1">
                <div className="w-32 h-10 border-b border-dashed border-slate-400 mx-auto"></div>
                <p className="font-bold text-slate-900">{settings.principalName}</p>
                <p className="text-slate-500">Principal / Academic Director</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Notices List View */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search circulars..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 text-slate-800"
              />
            </div>
          </div>

          {/* Notices Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNotices.map((n) => (
              <div
                key={n.id}
                onClick={() => navigate(`/notices/${n.id}`)}
                className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group ${
                  n.isFeatured ? 'border-amber-300 ring-2 ring-amber-100 bg-amber-50/20' : 'border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        {n.category}
                      </span>
                      {n.isFeatured && (
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                          <Pin className="w-3 h-3" /> Pinned
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {n.publishedDate}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {n.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {n.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-900">
                  <span>Read Full Notice Details</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          {filteredNotices.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Bell className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p>No notices found in this category.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
