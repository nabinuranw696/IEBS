import React from 'react';
import { Facility } from '../types';
import {
  Building2,
  CheckCircle2,
  FlaskConical,
  Monitor,
  BookOpen,
  Trophy,
  Bus,
  Utensils,
  ShieldCheck,
} from 'lucide-react';

interface FacilitiesPageProps {
  facilities: Facility[];
}

export const FacilitiesPage: React.FC<FacilitiesPageProps> = ({ facilities }) => {
  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-14 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <Building2 className="w-4 h-4" />
            <span>Infrastructure & Environment</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-crest">
            World-Class Campus Facilities
          </h1>
          <p className="text-slate-300 max-w-2xl text-sm sm:text-base">
            Providing modern science labs, computer suites, expansive athletic grounds, and secure transportation across Sunsari.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((fac) => (
            <div
              key={fac.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-56 overflow-hidden relative">
                  <img
                    src={fac.imageUrl}
                    alt={fac.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  <span className="absolute bottom-4 left-4 text-white text-lg font-bold font-crest">
                    {fac.name}
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {fac.description}
                  </p>

                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Features</span>
                    {fac.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
