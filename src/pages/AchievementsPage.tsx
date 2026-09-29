import React, { useState } from 'react';
import { Achievement } from '../types';
import { Trophy, Award, Medal, Sparkles, Filter } from 'lucide-react';

interface AchievementsPageProps {
  achievements: Achievement[];
}

export const AchievementsPage: React.FC<AchievementsPageProps> = ({ achievements }) => {
  const [category, setCategory] = useState<string>('All');

  const categories = ['All', 'Academic', 'Sports', 'Science & Tech', 'Cultural', 'Institutional'];

  const filtered = achievements.filter((a) => category === 'All' || a.category === category);

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-14 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">
            <Trophy className="w-4 h-4" />
            <span>Honors & Accolades</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-crest">
            Student & School Achievements
          </h1>
          <p className="text-slate-300 max-w-2xl text-sm sm:text-base">
            Celebrating regional titles, board exam distinctions, national karate golds, and scientific innovations.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                category === cat
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all p-6 flex flex-col sm:flex-row gap-5 items-start"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full sm:w-40 h-36 rounded-xl object-cover shrink-0 border border-slate-100"
              />
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{item.year}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 font-crest">
                  {item.title}
                </h3>
                {item.studentName && (
                  <p className="text-xs font-semibold text-emerald-700">
                    Winner: {item.studentName} {item.className ? `(${item.className})` : ''}
                  </p>
                )}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
