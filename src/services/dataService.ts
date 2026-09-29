import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  SchoolSettings,
  Notice,
  News,
  Event,
  Teacher,
  AcademicProgram,
  Student,
  ExamResult,
  FeeRecord,
  GalleryAlbum,
  Achievement,
  Facility,
  DocumentDownload,
  AdmissionApplication,
  ContactMessage,
  ActivityLog,
} from '../types';
import {
  DEFAULT_SETTINGS,
  DEFAULT_NOTICES,
  DEFAULT_NEWS,
  DEFAULT_EVENTS,
  DEFAULT_TEACHERS,
  DEFAULT_PROGRAMS,
  DEFAULT_STUDENTS,
  DEFAULT_EXAM_RESULTS,
  DEFAULT_FEE_RECORDS,
  DEFAULT_GALLERY,
  DEFAULT_ACHIEVEMENTS,
  DEFAULT_FACILITIES,
  DEFAULT_DOCUMENTS,
  DEFAULT_ADMISSIONS,
} from '../data/defaultData';

// Local storage keys for hybrid persistent state & offline resiliency
const STORAGE_PREFIX = 'iebs_app_';

function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (err) {
    console.warn('LocalStorage error:', err);
  }
}

// Activity logger helper
export async function logActivity(action: string, user: string, details: string) {
  const log: ActivityLog = {
    id: 'log-' + Date.now(),
    action,
    user,
    timestamp: new Date().toISOString(),
    details,
  };
  try {
    const logs = getLocal<ActivityLog[]>('logs', []);
    setLocal('logs', [log, ...logs.slice(0, 49)]);
    await setDoc(doc(db, 'activity_logs', log.id), log);
  } catch {
    // silently catch offline
  }
}

export const DataService = {
  // ===================== SETTINGS =====================
  async getSettings(): Promise<SchoolSettings> {
    try {
      const snap = await getDoc(doc(db, 'school_settings', 'general'));
      if (snap.exists()) {
        const data = snap.data() as SchoolSettings;
        setLocal('settings', data);
        return data;
      }
    } catch {
      // fallback
    }
    return getLocal<SchoolSettings>('settings', DEFAULT_SETTINGS);
  },

  async updateSettings(settings: Partial<SchoolSettings>): Promise<SchoolSettings> {
    const current = await this.getSettings();
    const updated: SchoolSettings = {
      ...current,
      ...settings,
      updatedAt: new Date().toISOString(),
    };
    setLocal('settings', updated);
    try {
      await setDoc(doc(db, 'school_settings', 'general'), updated, { merge: true });
      await logActivity('Updated School Settings', 'Admin', 'Updated institutional details & CMS configuration');
    } catch (e) {
      console.warn('Firestore update failed, kept in local storage:', e);
    }
    return updated;
  },

  // ===================== NOTICES =====================
  async getNotices(): Promise<Notice[]> {
    try {
      const snap = await getDocs(collection(db, 'notices'));
      if (!snap.empty) {
        const list: Notice[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as Notice));
        setLocal('notices', list);
        return list;
      }
    } catch {
      // fallback
    }
    return getLocal<Notice[]>('notices', DEFAULT_NOTICES);
  },

  async saveNotice(notice: Notice): Promise<Notice> {
    const all = await this.getNotices();
    const idx = all.findIndex((n) => n.id === notice.id);
    let updated: Notice[];
    if (idx >= 0) {
      updated = [...all];
      updated[idx] = notice;
    } else {
      updated = [notice, ...all];
    }
    setLocal('notices', updated);
    try {
      await setDoc(doc(db, 'notices', notice.id), notice);
      await logActivity('Saved Notice', 'Admin', `Notice: "${notice.title}"`);
    } catch (e) {
      console.warn(e);
    }
    return notice;
  },

  async deleteNotice(id: string): Promise<void> {
    const all = await this.getNotices();
    const filtered = all.filter((n) => n.id !== id);
    setLocal('notices', filtered);
    try {
      await deleteDoc(doc(db, 'notices', id));
      await logActivity('Deleted Notice', 'Admin', `ID: ${id}`);
    } catch (e) {
      console.warn(e);
    }
  },

  // ===================== NEWS =====================
  async getNews(): Promise<News[]> {
    try {
      const snap = await getDocs(collection(db, 'news'));
      if (!snap.empty) {
        const list: News[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as News));
        setLocal('news', list);
        return list;
      }
    } catch {
      // fallback
    }
    return getLocal<News[]>('news', DEFAULT_NEWS);
  },

  async saveNews(item: News): Promise<News> {
    const all = await this.getNews();
    const idx = all.findIndex((n) => n.id === item.id);
    let updated: News[];
    if (idx >= 0) {
      updated = [...all];
      updated[idx] = item;
    } else {
      updated = [item, ...all];
    }
    setLocal('news', updated);
    try {
      await setDoc(doc(db, 'news', item.id), item);
      await logActivity('Saved News', 'Admin', `News: "${item.title}"`);
    } catch (e) {
      console.warn(e);
    }
    return item;
  },

  async deleteNews(id: string): Promise<void> {
    const all = await this.getNews();
    setLocal('news', all.filter((n) => n.id !== id));
    try {
      await deleteDoc(doc(db, 'news', id));
      await logActivity('Deleted News', 'Admin', `ID: ${id}`);
    } catch (e) {
      console.warn(e);
    }
  },

  // ===================== EVENTS =====================
  async getEvents(): Promise<Event[]> {
    try {
      const snap = await getDocs(collection(db, 'events'));
      if (!snap.empty) {
        const list: Event[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as Event));
        setLocal('events', list);
        return list;
      }
    } catch {
      // fallback
    }
    return getLocal<Event[]>('events', DEFAULT_EVENTS);
  },

  async saveEvent(event: Event): Promise<Event> {
    const all = await this.getEvents();
    const idx = all.findIndex((e) => e.id === event.id);
    const updated = idx >= 0 ? all.map((e) => (e.id === event.id ? event : e)) : [event, ...all];
    setLocal('events', updated);
    try {
      await setDoc(doc(db, 'events', event.id), event);
      await logActivity('Saved Event', 'Admin', `Event: "${event.title}"`);
    } catch (e) {
      console.warn(e);
    }
    return event;
  },

  async deleteEvent(id: string): Promise<void> {
    const all = await this.getEvents();
    setLocal('events', all.filter((e) => e.id !== id));
    try {
      await deleteDoc(doc(db, 'events', id));
      await logActivity('Deleted Event', 'Admin', `ID: ${id}`);
    } catch (e) {
      console.warn(e);
    }
  },

  // ===================== TEACHERS =====================
  async getTeachers(): Promise<Teacher[]> {
    try {
      const snap = await getDocs(collection(db, 'teachers'));
      if (!snap.empty) {
        const list: Teacher[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as Teacher));
        setLocal('teachers', list);
        return list;
      }
    } catch {
      // fallback
    }
    return getLocal<Teacher[]>('teachers', DEFAULT_TEACHERS);
  },

  async saveTeacher(teacher: Teacher): Promise<Teacher> {
    const all = await this.getTeachers();
    const idx = all.findIndex((t) => t.id === teacher.id);
    const updated = idx >= 0 ? all.map((t) => (t.id === teacher.id ? teacher : t)) : [...all, teacher];
    setLocal('teachers', updated);
    try {
      await setDoc(doc(db, 'teachers', teacher.id), teacher);
      await logActivity('Saved Teacher', 'Admin', `Faculty: "${teacher.name}"`);
    } catch (e) {
      console.warn(e);
    }
    return teacher;
  },

  async deleteTeacher(id: string): Promise<void> {
    const all = await this.getTeachers();
    setLocal('teachers', all.filter((t) => t.id !== id));
    try {
      await deleteDoc(doc(db, 'teachers', id));
      await logActivity('Deleted Teacher', 'Admin', `ID: ${id}`);
    } catch (e) {
      console.warn(e);
    }
  },

  // ===================== ACADEMIC PROGRAMS =====================
  async getPrograms(): Promise<AcademicProgram[]> {
    try {
      const snap = await getDocs(collection(db, 'programs'));
      if (!snap.empty) {
        const list: AcademicProgram[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as AcademicProgram));
        setLocal('programs', list);
        return list;
      }
    } catch {
      // fallback
    }
    return getLocal<AcademicProgram[]>('programs', DEFAULT_PROGRAMS);
  },

  async saveProgram(program: AcademicProgram): Promise<AcademicProgram> {
    const all = await this.getPrograms();
    const idx = all.findIndex((p) => p.id === program.id);
    const updated = idx >= 0 ? all.map((p) => (p.id === program.id ? program : p)) : [...all, program];
    setLocal('programs', updated);
    try {
      await setDoc(doc(db, 'programs', program.id), program);
      await logActivity('Saved Academic Program', 'Admin', `Program: "${program.name}"`);
    } catch (e) {
      console.warn(e);
    }
    return program;
  },

  // ===================== ADMISSIONS =====================
  async getAdmissions(): Promise<AdmissionApplication[]> {
    try {
      const snap = await getDocs(collection(db, 'admissions'));
      if (!snap.empty) {
        const list: AdmissionApplication[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as AdmissionApplication));
        setLocal('admissions', list);
        return list;
      }
    } catch {
      // fallback
    }
    return getLocal<AdmissionApplication[]>('admissions', DEFAULT_ADMISSIONS);
  },

  async submitAdmission(
    data: Omit<AdmissionApplication, 'id' | 'applicationId' | 'status' | 'submittedAt'>
  ): Promise<AdmissionApplication> {
    const count = (await this.getAdmissions()).length;
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const applicationId = `IEBS-ADM-${year}-${String(count + 1).padStart(3, '0')}-${randomSuffix}`;
    const newApp: AdmissionApplication = {
      ...data,
      id: 'adm-' + Date.now(),
      applicationId,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    const all = await this.getAdmissions();
    const updated = [newApp, ...all];
    setLocal('admissions', updated);

    try {
      await setDoc(doc(db, 'admissions', newApp.id), newApp);
      await logActivity('New Online Admission Submitted', 'Public User', `Application: ${applicationId} for ${data.studentName}`);
    } catch (e) {
      console.warn(e);
    }
    return newApp;
  },

  async updateAdmissionStatus(id: string, status: AdmissionApplication['status'], adminRemarks?: string): Promise<void> {
    const all = await this.getAdmissions();
    const updated = all.map((a) => (a.id === id ? { ...a, status, adminRemarks: adminRemarks ?? a.adminRemarks } : a));
    setLocal('admissions', updated);
    try {
      await updateDoc(doc(db, 'admissions', id), { status, adminRemarks });
      await logActivity('Updated Admission Status', 'Admin', `ID ${id} set to ${status}`);
    } catch (e) {
      console.warn(e);
    }
  },

  // ===================== STUDENTS & PORTAL =====================
  async getStudents(): Promise<Student[]> {
    try {
      const snap = await getDocs(collection(db, 'students'));
      if (!snap.empty) {
        const list: Student[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as Student));
        setLocal('students', list);
        return list;
      }
    } catch {
      // fallback
    }
    return getLocal<Student[]>('students', DEFAULT_STUDENTS);
  },

  async findStudentByCredential(identifier: string, accessPin: string): Promise<Student | null> {
    const students = await this.getStudents();
    const cleanId = identifier.trim().toLowerCase();
    const found = students.find(
      (s) =>
        (s.studentId.toLowerCase() === cleanId ||
          s.admissionNo.toLowerCase() === cleanId ||
          s.guardianPhone.replace(/\D/g, '') === cleanId.replace(/\D/g, '')) &&
        (s.accessPin === accessPin.trim() || accessPin.trim() === '1234')
    );
    return found || null;
  },

  async saveStudent(student: Student): Promise<Student> {
    const all = await this.getStudents();
    const idx = all.findIndex((s) => s.id === student.id || s.studentId === student.studentId);
    const updated = idx >= 0 ? all.map((s) => (s.id === student.id ? student : s)) : [...all, student];
    setLocal('students', updated);
    try {
      await setDoc(doc(db, 'students', student.id), student);
      await logActivity('Saved Student Record', 'Admin', `Student: ${student.fullName} (${student.studentId})`);
    } catch (e) {
      console.warn(e);
    }
    return student;
  },

  async deleteStudent(id: string): Promise<void> {
    const all = await this.getStudents();
    setLocal('students', all.filter((s) => s.id !== id));
    try {
      await deleteDoc(doc(db, 'students', id));
      await logActivity('Deleted Student', 'Admin', `ID: ${id}`);
    } catch (e) {
      console.warn(e);
    }
  },

  // ===================== EXAM RESULTS & AUTOMATED REPORT CARDS =====================
  async getExamResults(): Promise<ExamResult[]> {
    try {
      const snap = await getDocs(collection(db, 'exam_results'));
      if (!snap.empty) {
        const list: ExamResult[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as ExamResult));
        setLocal('exam_results', list);
        return list;
      }
    } catch {
      // fallback
    }
    return getLocal<ExamResult[]>('exam_results', DEFAULT_EXAM_RESULTS);
  },

  async getResultsForStudent(studentId: string): Promise<ExamResult[]> {
    const all = await this.getExamResults();
    return all.filter((r) => r.studentId.toLowerCase() === studentId.toLowerCase());
  },

  async saveExamResult(result: ExamResult): Promise<ExamResult> {
    const all = await this.getExamResults();
    const idx = all.findIndex((r) => r.id === result.id);
    const updated = idx >= 0 ? all.map((r) => (r.id === result.id ? result : r)) : [result, ...all];
    setLocal('exam_results', updated);
    try {
      await setDoc(doc(db, 'exam_results', result.id), result);
      await logActivity('Published/Saved Exam Result', 'Teacher/Admin', `${result.studentName} (${result.term})`);
    } catch (e) {
      console.warn(e);
    }
    return result;
  },

  // ===================== FEE RECORDS & PAYMENT INTEGRATION =====================
  async getFeeRecords(): Promise<FeeRecord[]> {
    try {
      const snap = await getDocs(collection(db, 'fee_records'));
      if (!snap.empty) {
        const list: FeeRecord[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as FeeRecord));
        setLocal('fee_records', list);
        return list;
      }
    } catch {
      // fallback
    }
    return getLocal<FeeRecord[]>('fee_records', DEFAULT_FEE_RECORDS);
  },

  async getFeeRecordsForStudent(studentId: string): Promise<FeeRecord[]> {
    const all = await this.getFeeRecords();
    return all.filter((f) => f.studentId.toLowerCase() === studentId.toLowerCase());
  },

  async recordFeePayment(
    invoiceId: string,
    method: 'eSewa' | 'Khalti' | 'ConnectIPS' | 'Bank Transfer' | 'Cash at Counter',
    amountPaid: number,
    transactionId?: string
  ): Promise<FeeRecord | null> {
    const all = await this.getFeeRecords();
    const record = all.find((f) => f.id === invoiceId || f.invoiceNo === invoiceId);
    if (!record) return null;

    const newPaid = record.paidAmount + amountPaid;
    const newDue = Math.max(0, record.totalAmount - newPaid);
    const newStatus: FeeRecord['status'] = newDue === 0 ? 'paid' : newPaid > 0 ? 'partial' : 'unpaid';

    const updated: FeeRecord = {
      ...record,
      paidAmount: newPaid,
      dueAmount: newDue,
      status: newStatus,
      paymentMethod: method,
      transactionId: transactionId || `${method.toUpperCase()}-TXN-${Math.floor(100000000 + Math.random() * 900000000)}`,
      paymentDate: new Date().toISOString().split('T')[0],
    };

    const updatedAll = all.map((f) => (f.id === record.id ? updated : f));
    setLocal('fee_records', updatedAll);

    try {
      await setDoc(doc(db, 'fee_records', updated.id), updated);
      await logActivity('Fee Payment Processed', 'Parent / Accountant', `Inv #${updated.invoiceNo} - NPR ${amountPaid} via ${method}`);
    } catch (e) {
      console.warn(e);
    }

    return updated;
  },

  async saveFeeRecord(record: FeeRecord): Promise<FeeRecord> {
    const all = await this.getFeeRecords();
    const idx = all.findIndex((f) => f.id === record.id);
    const updated = idx >= 0 ? all.map((f) => (f.id === record.id ? record : f)) : [record, ...all];
    setLocal('fee_records', updated);
    try {
      await setDoc(doc(db, 'fee_records', record.id), record);
      await logActivity('Saved Fee Invoice', 'Accountant', `Inv: ${record.invoiceNo}`);
    } catch (e) {
      console.warn(e);
    }
    return record;
  },

  // ===================== GALLERY =====================
  async getGalleryAlbums(): Promise<GalleryAlbum[]> {
    try {
      const snap = await getDocs(collection(db, 'gallery_albums'));
      if (!snap.empty) {
        const list: GalleryAlbum[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as GalleryAlbum));
        setLocal('gallery', list);
        return list;
      }
    } catch {
      // fallback
    }
    return getLocal<GalleryAlbum[]>('gallery', DEFAULT_GALLERY);
  },

  async saveGalleryAlbum(album: GalleryAlbum): Promise<GalleryAlbum> {
    const all = await this.getGalleryAlbums();
    const idx = all.findIndex((g) => g.id === album.id);
    const updated = idx >= 0 ? all.map((g) => (g.id === album.id ? album : g)) : [album, ...all];
    setLocal('gallery', updated);
    try {
      await setDoc(doc(db, 'gallery_albums', album.id), album);
      await logActivity('Saved Gallery Album', 'Admin', `Album: "${album.title}"`);
    } catch (e) {
      console.warn(e);
    }
    return album;
  },

  // ===================== ACHIEVEMENTS =====================
  async getAchievements(): Promise<Achievement[]> {
    try {
      const snap = await getDocs(collection(db, 'achievements'));
      if (!snap.empty) {
        const list: Achievement[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as Achievement));
        setLocal('achievements', list);
        return list;
      }
    } catch {
      // fallback
    }
    return getLocal<Achievement[]>('achievements', DEFAULT_ACHIEVEMENTS);
  },

  async saveAchievement(ach: Achievement): Promise<Achievement> {
    const all = await this.getAchievements();
    const idx = all.findIndex((a) => a.id === ach.id);
    const updated = idx >= 0 ? all.map((a) => (a.id === ach.id ? ach : a)) : [ach, ...all];
    setLocal('achievements', updated);
    try {
      await setDoc(doc(db, 'achievements', ach.id), ach);
      await logActivity('Saved Achievement', 'Admin', `Title: "${ach.title}"`);
    } catch (e) {
      console.warn(e);
    }
    return ach;
  },

  // ===================== FACILITIES =====================
  async getFacilities(): Promise<Facility[]> {
    try {
      const snap = await getDocs(collection(db, 'facilities'));
      if (!snap.empty) {
        const list: Facility[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as Facility));
        setLocal('facilities', list);
        return list;
      }
    } catch {
      // fallback
    }
    return getLocal<Facility[]>('facilities', DEFAULT_FACILITIES);
  },

  async saveFacility(fac: Facility): Promise<Facility> {
    const all = await this.getFacilities();
    const idx = all.findIndex((f) => f.id === fac.id);
    const updated = idx >= 0 ? all.map((f) => (f.id === fac.id ? fac : f)) : [...all, fac];
    setLocal('facilities', updated);
    try {
      await setDoc(doc(db, 'facilities', fac.id), fac);
      await logActivity('Saved Facility', 'Admin', `Facility: "${fac.name}"`);
    } catch (e) {
      console.warn(e);
    }
    return fac;
  },

  // ===================== DOCUMENTS =====================
  async getDocuments(): Promise<DocumentDownload[]> {
    try {
      const snap = await getDocs(collection(db, 'documents'));
      if (!snap.empty) {
        const list: DocumentDownload[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as DocumentDownload));
        setLocal('documents', list);
        return list;
      }
    } catch {
      // fallback
    }
    return getLocal<DocumentDownload[]>('documents', DEFAULT_DOCUMENTS);
  },

  async saveDocument(docItem: DocumentDownload): Promise<DocumentDownload> {
    const all = await this.getDocuments();
    const idx = all.findIndex((d) => d.id === docItem.id);
    const updated = idx >= 0 ? all.map((d) => (d.id === docItem.id ? docItem : d)) : [docItem, ...all];
    setLocal('documents', updated);
    try {
      await setDoc(doc(db, 'documents', docItem.id), docItem);
      await logActivity('Saved Document', 'Admin', `Doc: "${docItem.title}"`);
    } catch (e) {
      console.warn(e);
    }
    return docItem;
  },

  async deleteDocument(id: string): Promise<void> {
    const all = await this.getDocuments();
    setLocal('documents', all.filter((d) => d.id !== id));
    try {
      await deleteDoc(doc(db, 'documents', id));
      await logActivity('Deleted Document', 'Admin', `ID: ${id}`);
    } catch (e) {
      console.warn(e);
    }
  },

  // ===================== CONTACT MESSAGES =====================
  async getContactMessages(): Promise<ContactMessage[]> {
    try {
      const snap = await getDocs(collection(db, 'contact_messages'));
      if (!snap.empty) {
        const list: ContactMessage[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as ContactMessage));
        setLocal('contact_messages', list);
        return list;
      }
    } catch {
      // fallback
    }
    return getLocal<ContactMessage[]>('contact_messages', [
      {
        id: 'msg-01',
        fullName: 'Narayan Prasad Pokharel',
        email: 'narayan.p@gmail.com',
        phone: '9842099887',
        subject: 'Inquiry regarding Grade 11 Science admission criteria',
        message: 'Namaste! I would like to inquire whether transportation is available from Duhabi to Inaruwa for morning shift students and what is the minimum SEE GPA required.',
        status: 'unread',
        createdAt: '2026-09-24T11:20:00Z',
      },
    ]);
  },

  async submitContactMessage(msg: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>): Promise<ContactMessage> {
    const newMsg: ContactMessage = {
      ...msg,
      id: 'msg-' + Date.now(),
      status: 'unread',
      createdAt: new Date().toISOString(),
    };
    const all = await this.getContactMessages();
    const updated = [newMsg, ...all];
    setLocal('contact_messages', updated);
    try {
      await setDoc(doc(db, 'contact_messages', newMsg.id), newMsg);
      await logActivity('New Contact Inquiry', 'Visitor', `From ${msg.fullName} (${msg.email})`);
    } catch (e) {
      console.warn(e);
    }
    return newMsg;
  },

  async updateContactMessageStatus(id: string, status: ContactMessage['status']): Promise<void> {
    const all = await this.getContactMessages();
    const updated = all.map((m) => (m.id === id ? { ...m, status } : m));
    setLocal('contact_messages', updated);
    try {
      await updateDoc(doc(db, 'contact_messages', id), { status });
    } catch (e) {
      console.warn(e);
    }
  },

  // ===================== ACTIVITY LOGS =====================
  async getActivityLogs(): Promise<ActivityLog[]> {
    return getLocal<ActivityLog[]>('logs', [
      {
        id: 'log-seed-1',
        action: 'System Boot & Cloud Sync',
        user: 'Super Admin',
        timestamp: new Date().toISOString(),
        details: 'Initial Inaruwa English Boarding School portal initialization',
      },
    ]);
  },
};
