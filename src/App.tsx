/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataService } from './services/dataService';
import { testConnection } from './lib/firebase';
import {
  SchoolSettings,
  Notice,
  News,
  Event,
  Teacher,
  AcademicProgram,
  AdmissionApplication,
  Student,
  ExamResult,
  FeeRecord,
  GalleryAlbum,
  Achievement,
  Facility,
  DocumentDownload,
  ContactMessage,
  ActivityLog,
} from './types';
import { DEFAULT_SETTINGS } from './data/defaultData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { AcademicsPage } from './pages/AcademicsPage';
import { TeachersPage } from './pages/TeachersPage';
import { AdmissionsPage } from './pages/AdmissionsPage';
import { NoticesPage } from './pages/NoticesPage';
import { NewsPage } from './pages/NewsPage';
import { EventsPage } from './pages/EventsPage';
import { GalleryPage } from './pages/GalleryPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { DownloadsPage } from './pages/DownloadsPage';
import { ContactPage } from './pages/ContactPage';
import { StudentPortal } from './pages/StudentPortal';
import { ParentPortal } from './pages/ParentPortal';
import { AdminPortal } from './pages/AdminPortal';

function MainApp() {
  const { path } = useRouter();
  const [settings, setSettings] = useState<SchoolSettings>(DEFAULT_SETTINGS);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [programs, setPrograms] = useState<AcademicProgram[]>([]);
  const [admissions, setAdmissions] = useState<AdmissionApplication[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([]);
  const [gallery, setGallery] = useState<GalleryAlbum[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [documents, setDocuments] = useState<DocumentDownload[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadAllData = async () => {
    try {
      const [
        loadedSettings,
        loadedNotices,
        loadedNews,
        loadedEvents,
        loadedTeachers,
        loadedPrograms,
        loadedAdmissions,
        loadedStudents,
        loadedResults,
        loadedFees,
        loadedGallery,
        loadedAchievements,
        loadedFacilities,
        loadedDocuments,
        loadedMessages,
        loadedLogs,
      ] = await Promise.all([
        DataService.getSettings(),
        DataService.getNotices(),
        DataService.getNews(),
        DataService.getEvents(),
        DataService.getTeachers(),
        DataService.getPrograms(),
        DataService.getAdmissions(),
        DataService.getStudents(),
        DataService.getExamResults(),
        DataService.getFeeRecords(),
        DataService.getGalleryAlbums(),
        DataService.getAchievements(),
        DataService.getFacilities(),
        DataService.getDocuments(),
        DataService.getContactMessages(),
        DataService.getActivityLogs(),
      ]);

      setSettings(loadedSettings);
      setNotices(loadedNotices);
      setNews(loadedNews);
      setEvents(loadedEvents);
      setTeachers(loadedTeachers);
      setPrograms(loadedPrograms);
      setAdmissions(loadedAdmissions);
      setStudents(loadedStudents);
      setExamResults(loadedResults);
      setFeeRecords(loadedFees);
      setGallery(loadedGallery);
      setAchievements(loadedAchievements);
      setFacilities(loadedFacilities);
      setDocuments(loadedDocuments);
      setContactMessages(loadedMessages);
      setActivityLogs(loadedLogs);
    } catch (err) {
      console.error('Data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Run connection test required by skill
    testConnection();
    loadAllData();
  }, []);

  const isAdminRoute = path.startsWith('/admin');

  // Route Dispatcher
  const renderContent = () => {
    if (path === '/' || path === '') {
      return (
        <HomePage
          settings={settings}
          notices={notices}
          news={news}
          events={events}
          teachers={teachers}
          programs={programs}
          achievements={achievements}
          facilities={facilities}
          gallery={gallery}
        />
      );
    }

    if (path.startsWith('/about')) {
      return <AboutPage settings={settings} />;
    }

    if (path.startsWith('/academics')) {
      const parts = path.split('/');
      const slug = parts[2];
      return <AcademicsPage programs={programs} selectedSlug={slug} />;
    }

    if (path.startsWith('/teachers')) {
      const parts = path.split('/');
      const id = parts[2];
      return <TeachersPage teachers={teachers} selectedId={id} />;
    }

    if (path.startsWith('/students')) {
      return <StudentPortal settings={settings} notices={notices} />;
    }

    if (path.startsWith('/admissions')) {
      const isApply = path === '/admissions/apply';
      return <AdmissionsPage isApplyMode={isApply} />;
    }

    if (path.startsWith('/notices')) {
      const parts = path.split('/');
      const id = parts[2];
      return <NoticesPage notices={notices} settings={settings} selectedId={id} />;
    }

    if (path.startsWith('/news')) {
      const parts = path.split('/');
      const slug = parts[2];
      return <NewsPage news={news} selectedSlug={slug} />;
    }

    if (path.startsWith('/events')) {
      const parts = path.split('/');
      const slug = parts[2];
      return <EventsPage events={events} selectedSlug={slug} />;
    }

    if (path.startsWith('/gallery')) {
      const parts = path.split('/');
      const slug = parts[2];
      return <GalleryPage gallery={gallery} selectedSlug={slug} />;
    }

    if (path === '/achievements') {
      return <AchievementsPage achievements={achievements} />;
    }

    if (path === '/facilities') {
      return <FacilitiesPage facilities={facilities} />;
    }

    if (path === '/downloads') {
      return <DownloadsPage documents={documents} />;
    }

    if (path === '/contact') {
      return <ContactPage settings={settings} />;
    }

    if (path.startsWith('/portal/student')) {
      return <StudentPortal settings={settings} notices={notices} />;
    }

    if (path.startsWith('/portal/parent')) {
      return <ParentPortal settings={settings} notices={notices} />;
    }

    if (path.startsWith('/admin')) {
      return (
        <AdminPortal
          settings={settings}
          onUpdateSettings={(newSettings) => setSettings(newSettings)}
          notices={notices}
          news={news}
          events={events}
          teachers={teachers}
          programs={programs}
          admissions={admissions}
          students={students}
          examResults={examResults}
          feeRecords={feeRecords}
          gallery={gallery}
          achievements={achievements}
          facilities={facilities}
          documents={documents}
          contactMessages={contactMessages}
          activityLogs={activityLogs}
          refreshData={loadAllData}
        />
      );
    }

    // Default fallback
    return (
      <HomePage
        settings={settings}
        notices={notices}
        news={news}
        events={events}
        teachers={teachers}
        programs={programs}
        achievements={achievements}
        facilities={facilities}
        gallery={gallery}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      {!isAdminRoute && (
        <Header settings={settings} onOpenSearch={() => setIsSearchOpen(true)} />
      )}

      <main className="flex-1">{renderContent()}</main>

      {!isAdminRoute && <Footer settings={settings} />}

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        notices={notices}
        news={news}
        events={events}
        teachers={teachers}
        documents={documents}
      />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </RouterProvider>
  );
}
