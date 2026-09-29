import React, { useState } from 'react';
import { DocumentDownload } from '../types';
import { DataService } from '../services/dataService';
import { Download, FileText, CheckCircle2, Search, ArrowDownToLine } from 'lucide-react';

interface DownloadsPageProps {
  documents: DocumentDownload[];
}

export const DownloadsPage: React.FC<DownloadsPageProps> = ({ documents }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const categories = [
    'All',
    'Prospectus',
    'Academic Calendar',
    'Exam Routine',
    'Admission Form',
    'School Policies',
  ];

  const filtered = documents.filter((d) => activeCategory === 'All' || d.category === activeCategory);

  const handleDownload = (docItem: DocumentDownload) => {
    setDownloadSuccess(`Downloaded "${docItem.title}".`);
    setTimeout(() => setDownloadSuccess(null), 4000);
    // Trigger virtual download of school document
    const element = document.createElement('a');
    const file = new Blob([
      `INARUWA ENGLISH BOARDING SCHOOL (IEBS)\nOfficial Document: ${docItem.title}\nCategory: ${docItem.category}\nPublished: ${docItem.publishedDate}\nInaruwa, Sunsari, Koshi Province, Nepal\n\n[Official Educational Record]`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${docItem.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-14 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <Download className="w-4 h-4" />
            <span>Resource Center</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-crest">
            School Downloads & Documents
          </h1>
          <p className="text-slate-300 max-w-2xl text-sm sm:text-base">
            Download our latest academic calendars, terminal examination routines, syllabi, and physical admission forms.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {downloadSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* List Table */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm divide-y divide-slate-100">
          {filtered.map((d) => (
            <div
              key={d.id}
              className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {d.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{d.title}</h3>
                  <p className="text-xs text-slate-500">
                    File size: {d.fileSize} • Published: {d.publishedDate} • Downloads: {d.downloadCount}+
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDownload(d)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors self-start sm:self-auto shrink-0 shadow"
              >
                <ArrowDownToLine className="w-4 h-4" />
                <span>Download File</span>
              </button>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <FileText className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p>No documents found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
