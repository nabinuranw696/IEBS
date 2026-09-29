import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { Event } from '../types';
import { Calendar, Clock, MapPin, Users, ChevronRight, CheckCircle2 } from 'lucide-react';

interface EventsPageProps {
  events: Event[];
  selectedSlug?: string;
}

export const EventsPage: React.FC<EventsPageProps> = ({ events, selectedSlug }) => {
  const { navigate } = useRouter();
  const [filter, setFilter] = useState<'upcoming' | 'completed'>('upcoming');

  const selectedEvent = selectedSlug ? events.find((e) => e.slug === selectedSlug) : null;

  const filteredEvents = events.filter((e) => (filter === 'upcoming' ? e.status === 'upcoming' : e.status !== 'upcoming'));

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-14 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">
            <Calendar className="w-4 h-4" />
            <span>School Calendar</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-crest">
            {selectedEvent ? selectedEvent.title : 'Events & Academic Meets'}
          </h1>
          <p className="text-slate-300 max-w-2xl text-sm sm:text-base">
            {selectedEvent
              ? `${selectedEvent.eventDate} • Location: ${selectedEvent.location}`
              : 'Sports meets, cultural galas, inter-house debates, and parent-teacher assemblies.'}
          </p>
        </div>
      </section>

      {selectedEvent ? (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <button
            onClick={() => navigate('/events')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5"
          >
            <span>← Back to All Events</span>
          </button>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm space-y-6">
            <img
              src={selectedEvent.imageUrl}
              alt={selectedEvent.title}
              className="w-full h-72 sm:h-96 object-cover"
            />

            <div className="p-6 sm:p-10 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="text-slate-400">Date</span>
                    <p className="font-bold text-slate-800">{selectedEvent.eventDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="text-slate-400">Timing</span>
                    <p className="font-bold text-slate-800">{selectedEvent.startTime} - {selectedEvent.endTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <div>
                    <span className="text-slate-400">Venue</span>
                    <p className="font-bold text-slate-800">{selectedEvent.location}</p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-crest">
                {selectedEvent.title}
              </h2>

              <p className="text-slate-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {selectedEvent.description}
              </p>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Organized by: <strong>{selectedEvent.organizer}</strong></span>
                <span className="px-2.5 py-0.5 rounded font-bold uppercase text-[10px] bg-emerald-100 text-emerald-800">
                  {selectedEvent.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Filter */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                filter === 'upcoming'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                filter === 'completed'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Past Events Archive
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => navigate(`/events/${evt.slug}`)}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={evt.imageUrl}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-md shadow">
                      {evt.eventDate}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {evt.description}
                    </p>
                    <div className="space-y-1 text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{evt.startTime} - {evt.endTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{evt.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700 group-hover:text-amber-900">
                  <span>View Details & Schedule</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Calendar className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p>No events found under this filter.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
