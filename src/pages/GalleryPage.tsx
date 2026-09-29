import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { GalleryAlbum } from '../types';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface GalleryPageProps {
  gallery: GalleryAlbum[];
  selectedSlug?: string;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ gallery, selectedSlug }) => {
  const { navigate } = useRouter();
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const selectedAlbum = selectedSlug ? gallery.find((g) => g.slug === selectedSlug) : null;

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-14 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <ImageIcon className="w-4 h-4" />
            <span>Campus Visuals</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-crest">
            {selectedAlbum ? selectedAlbum.title : 'Photo & Video Gallery'}
          </h1>
          <p className="text-slate-300 max-w-2xl text-sm sm:text-base">
            {selectedAlbum
              ? `${selectedAlbum.category} • Event Date: ${selectedAlbum.eventDate}`
              : 'Cherished memories from annual days, athletic tournaments, science fairs, and daily student life.'}
          </p>
        </div>
      </section>

      {selectedAlbum ? (
        /* Album View */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/gallery')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5"
            >
              <span>← Back to All Albums</span>
            </button>
            <span className="text-xs text-slate-500">{selectedAlbum.images.length} Photos in Album</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-crest">{selectedAlbum.title}</h2>
            <p className="text-xs text-slate-500">{selectedAlbum.category} • {selectedAlbum.eventDate}</p>
            <p className="text-sm text-slate-600 pt-1">{selectedAlbum.description}</p>
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {selectedAlbum.images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActivePhotoIndex(idx)}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md cursor-pointer group"
              >
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={img.url}
                    alt={img.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                {img.caption && (
                  <div className="p-3 text-xs text-slate-700 font-medium">
                    {img.caption}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Lightbox Viewer */}
          {activePhotoIndex !== null && (
            <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
              <button
                onClick={() => setActivePhotoIndex(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <X className="w-6 h-6" />
              </button>

              <button
                onClick={() =>
                  setActivePhotoIndex((prev) => (prev! > 0 ? prev! - 1 : selectedAlbum.images.length - 1))
                }
                className="absolute left-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="max-w-4xl max-h-[80vh] flex flex-col items-center">
                <img
                  src={selectedAlbum.images[activePhotoIndex].url}
                  alt="Enlarged view"
                  className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl"
                />
                <p className="text-white text-sm mt-4 text-center">
                  {selectedAlbum.images[activePhotoIndex].caption} ({activePhotoIndex + 1} of{' '}
                  {selectedAlbum.images.length})
                </p>
              </div>

              <button
                onClick={() =>
                  setActivePhotoIndex((prev) => (prev! < selectedAlbum.images.length - 1 ? prev! + 1 : 0))
                }
                className="absolute right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Albums Grid */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {gallery.map((album) => (
              <div
                key={album.id}
                onClick={() => navigate(`/gallery/${album.slug}`)}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all cursor-pointer flex flex-col group"
              >
                <div className="h-60 overflow-hidden relative">
                  <img
                    src={album.coverImage}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  <span className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
                    {album.images.length} Photos
                  </span>
                  <span className="absolute bottom-4 left-4 right-4 text-white text-lg font-bold font-crest">
                    {album.title}
                  </span>
                </div>

                <div className="p-5 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                  <span className="font-semibold text-emerald-700">{album.category}</span>
                  <span>{album.eventDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
