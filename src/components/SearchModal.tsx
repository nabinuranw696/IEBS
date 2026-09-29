import React, { useState, useMemo } from 'react';
import { useRouter } from '../context/RouterContext';
import { Notice, News, Event, Teacher, DocumentDownload } from '../types';
import { Search, X, Calendar, FileText, User, Bell, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  notices: Notice[];
  news: News[];
  events: Event[];
  teachers: Teacher[];
  documents: DocumentDownload[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  notices,
  news,
  events,
  teachers,
  documents,
}) => {
  const { navigate } = useRouter();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { notices: [], news: [], events: [], teachers: [], documents: [] };

    return {
      notices: notices.filter(
        (n) => n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q)
      ),
      news: news.filter(
        (n) => n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q)
      ),
      events: events.filter(
        (e) => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)
      ),
      teachers: teachers.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          t.department.toLowerCase().includes(q)
      ),
      documents: documents.filter(
        (d) => d.title.toLowerCase().includes(q) || d.category.toLowerCase().includes(q)
      ),
    };
  }, [query, notices, news, events, teachers, documents]);

  if (!isOpen) return null;

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  const totalResults =
    filtered.notices.length +
    filtered.news.length +
    filtered.events.length +
    filtered.teachers.length +
    filtered.documents.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-emerald-600 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notices, exams, admissions, events, teachers..."
            className="w-full text-slate-800 placeholder-slate-400 text-base outline-none bg-transparent"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600 text-xs">
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          {!query && (
            <div className="text-center py-8 text-slate-400 text-sm">
              <Search className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p>Type keywords like "examination", "admission", "mathematics", or "routine"</p>
            </div>
          )}

          {query && totalResults === 0 && (
            <div className="text-center py-8 text-slate-500 text-sm">
              <p>No results found matching "{query}".</p>
            </div>
          )}

          {/* Notices Results */}
          {filtered.notices.length > 0 && (
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Notices</span>
              <div className="mt-1 space-y-1">
                {filtered.notices.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleSelect(`/notices/${n.id}`)}
                    className="p-2.5 rounded-lg hover:bg-emerald-50 cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Bell className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-slate-800 group-hover:text-emerald-800">
                          {n.title}
                        </p>
                        <p className="text-xs text-slate-400">{n.publishedDate} • {n.category}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Teachers Results */}
          {filtered.teachers.length > 0 && (
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Faculty & Staff</span>
              <div className="mt-1 space-y-1">
                {filtered.teachers.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => handleSelect(`/teachers/${t.id}`)}
                    className="p-2.5 rounded-lg hover:bg-emerald-50 cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <User className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-slate-800 group-hover:text-emerald-800">
                          {t.name}
                        </p>
                        <p className="text-xs text-slate-400">{t.designation} • {t.subject}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Events Results */}
          {filtered.events.length > 0 && (
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Events</span>
              <div className="mt-1 space-y-1">
                {filtered.events.map((e) => (
                  <div
                    key={e.id}
                    onClick={() => handleSelect(`/events/${e.slug}`)}
                    className="p-2.5 rounded-lg hover:bg-emerald-50 cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-slate-800 group-hover:text-emerald-800">
                          {e.title}
                        </p>
                        <p className="text-xs text-slate-400">{e.eventDate} • {e.location}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* News Results */}
          {filtered.news.length > 0 && (
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">News</span>
              <div className="mt-1 space-y-1">
                {filtered.news.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(`/news/${item.slug}`)}
                    className="p-2.5 rounded-lg hover:bg-emerald-50 cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-teal-600 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-slate-800 group-hover:text-emerald-800">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-400">{item.publishedDate}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents Results */}
          {filtered.documents.length > 0 && (
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Downloads</span>
              <div className="mt-1 space-y-1">
                {filtered.documents.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => handleSelect('/downloads')}
                    className="p-2.5 rounded-lg hover:bg-emerald-50 cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-red-500 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-slate-800 group-hover:text-emerald-800">
                          {d.title}
                        </p>
                        <p className="text-xs text-slate-400">{d.category} • {d.fileSize}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
