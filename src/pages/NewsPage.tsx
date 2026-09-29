import React from 'react';
import { useRouter } from '../context/RouterContext';
import { News } from '../types';
import { FileText, Calendar, Clock, User, ChevronRight, ArrowRight, Share2 } from 'lucide-react';

interface NewsPageProps {
  news: News[];
  selectedSlug?: string;
}

export const NewsPage: React.FC<NewsPageProps> = ({ news, selectedSlug }) => {
  const { navigate } = useRouter();

  const selectedArticle = selectedSlug ? news.find((n) => n.slug === selectedSlug) : null;

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-14 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <FileText className="w-4 h-4" />
            <span>School Press & Highlights</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-crest">
            {selectedArticle ? selectedArticle.title : 'School News & Happenings'}
          </h1>
          <p className="text-slate-300 max-w-2xl text-sm sm:text-base">
            {selectedArticle
              ? `Published on ${selectedArticle.publishedDate} by ${selectedArticle.author}`
              : 'Discover academic milestones, athletic triumphs, and life on the IEBS campus.'}
          </p>
        </div>
      </section>

      {selectedArticle ? (
        /* Single News View */
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <button
            onClick={() => navigate('/news')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5"
          >
            <span>← Back to All News</span>
          </button>

          <article className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm space-y-6">
            <img
              src={selectedArticle.imageUrl}
              alt={selectedArticle.title}
              className="w-full h-80 sm:h-96 object-cover"
            />

            <div className="p-6 sm:p-10 space-y-6">
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pb-4 border-b border-slate-100">
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded">
                  {selectedArticle.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {selectedArticle.publishedDate}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {selectedArticle.author}
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-crest leading-tight">
                {selectedArticle.title}
              </h2>

              <p className="text-base sm:text-lg text-emerald-950 font-medium italic bg-emerald-50/50 p-4 rounded-xl border-l-4 border-emerald-600">
                {selectedArticle.summary}
              </p>

              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {selectedArticle.content}
              </div>
            </div>
          </article>
        </div>
      ) : (
        /* All News Grid */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/news/${item.slug}`)}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all cursor-pointer flex flex-col group"
              >
                <div className="h-52 overflow-hidden relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-emerald-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow">
                    {item.category}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <span className="text-xs text-slate-400">{item.publishedDate}</span>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-900">
                    <span>Read Full Article</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
