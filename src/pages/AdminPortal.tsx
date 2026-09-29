import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
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
  UserRole,
} from '../types';
import { DataService } from '../services/dataService';
import {
  ShieldCheck,
  LayoutDashboard,
  Settings,
  Bell,
  FileText,
  Calendar,
  Users,
  GraduationCap,
  Award,
  CreditCard,
  Building2,
  Download,
  MessageSquare,
  History,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  LogOut,
  Save,
  Search,
  Printer,
  Sparkles,
  RefreshCw,
  Eye,
} from 'lucide-react';

interface AdminPortalProps {
  settings: SchoolSettings;
  onUpdateSettings: (s: SchoolSettings) => void;
  notices: Notice[];
  news: News[];
  events: Event[];
  teachers: Teacher[];
  programs: AcademicProgram[];
  admissions: AdmissionApplication[];
  students: Student[];
  examResults: ExamResult[];
  feeRecords: FeeRecord[];
  gallery: GalleryAlbum[];
  achievements: Achievement[];
  facilities: Facility[];
  documents: DocumentDownload[];
  contactMessages: ContactMessage[];
  activityLogs: ActivityLog[];
  refreshData: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  settings,
  onUpdateSettings,
  notices,
  news,
  events,
  teachers,
  programs,
  admissions,
  students,
  examResults,
  feeRecords,
  gallery,
  achievements,
  facilities,
  documents,
  contactMessages,
  activityLogs,
  refreshData,
}) => {
  const { navigate } = useRouter();
  const { adminUser, loginAdmin, logoutAdmin } = useAuth();

  // Login form state
  const [emailInput, setEmailInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [roleSelect, setRoleSelect] = useState<UserRole>('SUPER_ADMIN');
  const [loginError, setLoginError] = useState('');

  // Sidebar navigation
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Success toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // CMS Settings Editor state
  const [cmsSettings, setCmsSettings] = useState<SchoolSettings>(settings);
  useEffect(() => {
    setCmsSettings(settings);
  }, [settings]);

  // Modal / form states for various entities
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);

  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);

  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  const [editingResult, setEditingResult] = useState<ExamResult | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  const [editingFee, setEditingFee] = useState<FeeRecord | null>(null);
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);

  // Handle Admin Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = loginAdmin(emailInput, passInput, roleSelect);
    if (!success) {
      setLoginError('Invalid credentials. You may use admin@inaruwaebs.edu.np with password admin123 or select a Quick Demo role.');
    } else {
      showToast('Logged in as ' + roleSelect);
    }
  };

  const handleQuickRoleLogin = (role: UserRole) => {
    loginAdmin(`${role.toLowerCase()}@inaruwaebs.edu.np`, 'admin123', role);
    showToast(`Logged in as ${role}`);
  };

  // Save Settings CMS
  const handleSaveCMS = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await DataService.updateSettings(cmsSettings);
      onUpdateSettings(updated);
      showToast('School settings & homepage CMS updated successfully!');
    } catch {
      alert('Error updating settings.');
    }
  };

  // Save Notice
  const handleSaveNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNotice) return;
    await DataService.saveNotice(editingNotice);
    setIsNoticeModalOpen(false);
    refreshData();
    showToast('Notice saved successfully.');
  };

  const handleDeleteNotice = async (id: string) => {
    if (confirm('Are you sure you want to delete this notice?')) {
      await DataService.deleteNotice(id);
      refreshData();
      showToast('Notice deleted.');
    }
  };

  // Save Teacher
  const handleSaveTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;
    await DataService.saveTeacher(editingTeacher);
    setIsTeacherModalOpen(false);
    refreshData();
    showToast('Teacher profile saved.');
  };

  const handleDeleteTeacher = async (id: string) => {
    if (confirm('Delete teacher record?')) {
      await DataService.deleteTeacher(id);
      refreshData();
      showToast('Teacher record deleted.');
    }
  };

  // Save Student
  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    await DataService.saveStudent(editingStudent);
    setIsStudentModalOpen(false);
    refreshData();
    showToast('Student record saved.');
  };

  const handleDeleteStudent = async (id: string) => {
    if (confirm('Delete student record?')) {
      await DataService.deleteStudent(id);
      refreshData();
      showToast('Student deleted.');
    }
  };

  // Save Exam Result
  const handleSaveResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResult) return;
    // Calculate totals automatically
    const totalMarks = editingResult.subjects.reduce((acc, s) => acc + s.totalMarks, 0);
    const maxMarks = editingResult.subjects.length * 100;
    const percentage = Number(((totalMarks / maxMarks) * 100).toFixed(2));
    const avgGpa = (editingResult.subjects.reduce((acc, s) => acc + s.gradePoint, 0) / editingResult.subjects.length).toFixed(2);
    const letterGrade = Number(avgGpa) >= 3.6 ? 'A+' : Number(avgGpa) >= 3.2 ? 'A' : Number(avgGpa) >= 2.8 ? 'B+' : 'B';

    const calculated: ExamResult = {
      ...editingResult,
      obtainedMarks: totalMarks,
      totalMarks: maxMarks,
      percentage,
      gpa: avgGpa,
      letterGrade,
    };

    await DataService.saveExamResult(calculated);
    setIsResultModalOpen(false);
    refreshData();
    showToast('Exam report card saved & published!');
  };

  // Save Fee Invoice
  const handleSaveFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFee) return;
    const total = editingFee.tuitionFee + editingFee.examFee + editingFee.computerFee + editingFee.transportFee;
    const due = Math.max(0, total - editingFee.paidAmount);
    const status: FeeRecord['status'] = due === 0 ? 'paid' : editingFee.paidAmount > 0 ? 'partial' : 'unpaid';

    await DataService.saveFeeRecord({
      ...editingFee,
      totalAmount: total,
      dueAmount: due,
      status,
    });
    setIsFeeModalOpen(false);
    refreshData();
    showToast('Fee invoice updated.');
  };

  // Update Admission Status
  const handleAdmissionStatus = async (id: string, status: AdmissionApplication['status']) => {
    const remark = prompt('Enter remarks for applicant / status change:', `Status updated to ${status}`);
    await DataService.updateAdmissionStatus(id, status, remark || undefined);
    refreshData();
    showToast(`Application set to ${status}`);
  };

  // ===================== LOGIN VIEW =====================
  if (!adminUser) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-800 mx-auto flex items-center justify-center border border-emerald-100 shadow-sm">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-crest">
              IEBS Administration Portal
            </h1>
            <p className="text-xs text-slate-500">
              Role-Based Access for School Management, Admissions, CMS, and Academics.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 text-center font-medium">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Official Staff Email</label>
              <input
                type="email"
                required
                placeholder="admin@inaruwaebs.edu.np"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passInput}
                onChange={(e) => setPassInput(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Role Authority</label>
              <select
                value={roleSelect}
                onChange={(e) => setRoleSelect(e.target.value as UserRole)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 text-slate-900 font-semibold"
              >
                <option value="SUPER_ADMIN">SUPER_ADMIN (Full Institutional Authority)</option>
                <option value="ADMIN">ADMIN (School Management & Content)</option>
                <option value="TEACHER">TEACHER (Exam Results & Attendance)</option>
                <option value="ACCOUNTANT">ACCOUNTANT (Fee Management & Receipts)</option>
                <option value="EDITOR">EDITOR (Notices, News & Events)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
            >
              Sign In to Admin Console
            </button>
          </form>

          {/* Quick Demo Role Logins */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              Quick Role-Based Access:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickRoleLogin('SUPER_ADMIN')}
                className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold text-center border border-emerald-200"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickRoleLogin('TEACHER')}
                className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold text-center border border-blue-200"
              >
                Teacher Role
              </button>
              <button
                type="button"
                onClick={() => handleQuickRoleLogin('ACCOUNTANT')}
                className="p-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 font-semibold text-center border border-purple-200"
              >
                Accountant
              </button>
              <button
                type="button"
                onClick={() => handleQuickRoleLogin('EDITOR')}
                className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-center border border-amber-200"
              >
                Content Editor
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===================== AUTHENTICATED ADMIN DASHBOARD =====================
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col pb-16">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-slate-700 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 px-6 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-amber-300 font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight font-crest">
              IEBS Management Suite
            </h1>
            <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
              {adminUser.role} • {adminUser.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Public Website</span>
          </button>
          <button
            onClick={() => logoutAdmin()}
            className="text-xs text-red-300 hover:text-red-100 px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/60 border border-red-800/40 flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Admin Layout with Sidebar */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-slate-900 text-slate-300 border-r border-slate-800 p-3 space-y-1 shrink-0 overflow-y-auto max-h-screen">
          <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Core Modules
          </div>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
              activeTab === 'dashboard' ? 'bg-emerald-700 text-white' : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('admissions')}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
              activeTab === 'admissions' ? 'bg-emerald-700 text-white' : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Online Admissions</span>
            </div>
            {admissions.filter((a) => a.status === 'pending').length > 0 && (
              <span className="bg-amber-400 text-amber-950 font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                {admissions.filter((a) => a.status === 'pending').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
              activeTab === 'students' ? 'bg-emerald-700 text-white' : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student Management</span>
          </button>

          <button
            onClick={() => setActiveTab('results')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
              activeTab === 'results' ? 'bg-emerald-700 text-white' : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Report Cards Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('fees')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
              activeTab === 'fees' ? 'bg-emerald-700 text-white' : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Fee Ledger & Payments</span>
          </button>

          <button
            onClick={() => setActiveTab('teachers')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
              activeTab === 'teachers' ? 'bg-emerald-700 text-white' : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Faculty & Staff Directory</span>
          </button>

          <div className="px-3 pt-4 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            CMS & Content
          </div>

          <button
            onClick={() => setActiveTab('cms_settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
              activeTab === 'cms_settings' ? 'bg-emerald-700 text-white' : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Homepage & CMS Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('notices')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
              activeTab === 'notices' ? 'bg-emerald-700 text-white' : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notices & Circulars</span>
          </button>

          <button
            onClick={() => setActiveTab('news')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
              activeTab === 'news' ? 'bg-emerald-700 text-white' : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>School News</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
              activeTab === 'events' ? 'bg-emerald-700 text-white' : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Calendar Events</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
              activeTab === 'gallery' ? 'bg-emerald-700 text-white' : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Gallery Albums</span>
          </button>

          <button
            onClick={() => setActiveTab('downloads')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
              activeTab === 'downloads' ? 'bg-emerald-700 text-white' : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Download Center</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
              activeTab === 'messages' ? 'bg-emerald-700 text-white' : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4" />
              <span>Contact Messages</span>
            </div>
            {contactMessages.filter((m) => m.status === 'unread').length > 0 && (
              <span className="bg-red-500 text-white font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                {contactMessages.filter((m) => m.status === 'unread').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
              activeTab === 'logs' ? 'bg-emerald-700 text-white' : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Activity Logs</span>
          </button>
        </aside>

        {/* Main Content Body */}
        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* ===================== TAB 1: DASHBOARD ===================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 font-crest">
                  Institutional Control Center
                </h2>
                <p className="text-xs text-slate-500">
                  Real-time operational metrics for Inaruwa English Boarding School.
                </p>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Students</span>
                  <p className="text-3xl font-black text-slate-900 font-crest">{students.length}</p>
                  <p className="text-[11px] text-emerald-700 font-semibold">Active in Database</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Admissions</span>
                  <p className="text-3xl font-black text-emerald-700 font-crest">{admissions.length}</p>
                  <p className="text-[11px] text-amber-700 font-semibold">
                    {admissions.filter((a) => a.status === 'pending').length} Pending Review
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Faculty & Staff</span>
                  <p className="text-3xl font-black text-slate-900 font-crest">{teachers.length}</p>
                  <p className="text-[11px] text-slate-500">Teachers Listed</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Notices / News</span>
                  <p className="text-3xl font-black text-slate-900 font-crest">{notices.length + news.length}</p>
                  <p className="text-[11px] text-slate-500">Published Content</p>
                </div>
              </div>

              {/* Recent Admissions Review */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 font-crest">
                    Recent Online Admission Applications
                  </h3>
                  <button
                    onClick={() => setActiveTab('admissions')}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
                  >
                    View All ({admissions.length})
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase">
                      <tr>
                        <th className="p-3">ID</th>
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Class</th>
                        <th className="p-3">Parent / Phone</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Quick Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {admissions.slice(0, 5).map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-semibold text-slate-800">{app.applicationId}</td>
                          <td className="p-3 font-bold text-slate-900">{app.studentName}</td>
                          <td className="p-3">{app.applyingClass}</td>
                          <td className="p-3 text-slate-600">{app.parentName} ({app.parentPhone})</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                                app.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : app.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {app.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-1">
                            {app.status !== 'approved' && (
                              <button
                                onClick={() => handleAdmissionStatus(app.id, 'approved')}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold"
                              >
                                Approve
                              </button>
                            )}
                            {app.status !== 'rejected' && (
                              <button
                                onClick={() => handleAdmissionStatus(app.id, 'rejected')}
                                className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-[10px] font-bold"
                              >
                                Reject
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => {
                    setEditingNotice({
                      id: 'not-' + Date.now(),
                      title: '',
                      category: 'General',
                      description: '',
                      publishedDate: new Date().toISOString().split('T')[0],
                      isFeatured: false,
                      status: 'published',
                      createdAt: new Date().toISOString(),
                    });
                    setIsNoticeModalOpen(true);
                  }}
                  className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 shadow-sm text-left space-y-1 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700">Publish New Notice</h4>
                  <p className="text-xs text-slate-500">Post immediate announcements, routines, or circulars.</p>
                </button>

                <button
                  onClick={() => {
                    setEditingStudent({
                      id: 'stu-' + Date.now(),
                      studentId: `IEBS-STU-${1000 + students.length + 1}`,
                      admissionNo: `ADM-2082-${String(students.length + 1).padStart(4, '0')}`,
                      fullName: '',
                      className: 'Grade 1',
                      section: 'A',
                      rollNumber: students.length + 1,
                      dob: '2070-01-01',
                      gender: 'Male',
                      guardianName: '',
                      guardianPhone: '',
                      guardianEmail: '',
                      address: 'Inaruwa, Sunsari',
                      bloodGroup: 'B+ve',
                      photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400',
                      status: 'active',
                      accessPin: '1234',
                    });
                    setIsStudentModalOpen(true);
                  }}
                  className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-500 shadow-sm text-left space-y-1 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700">Enroll New Student</h4>
                  <p className="text-xs text-slate-500">Add student identity, section, roll number & guardian credentials.</p>
                </button>

                <button
                  onClick={() => setActiveTab('cms_settings')}
                  className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-purple-500 shadow-sm text-left space-y-1 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
                    <Settings className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-700">Modify School Info (CMS)</h4>
                  <p className="text-xs text-slate-500">Update school phone, emails, principal message & banners.</p>
                </button>
              </div>
            </div>
          )}

          {/* ===================== TAB 2: CMS SETTINGS ===================== */}
          {activeTab === 'cms_settings' && (
            <form onSubmit={handleSaveCMS} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-crest">
                    Content Management System (CMS) Settings
                  </h2>
                  <p className="text-xs text-slate-500">
                    Edit institutional identity, announcements, principal/chairman statements, and contact details without editing code.
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>

              {/* General identity */}
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">1. School Identity & Contacts</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Official School Name</label>
                    <input
                      type="text"
                      value={cmsSettings.schoolName}
                      onChange={(e) => setCmsSettings({ ...cmsSettings, schoolName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Tagline / Motto</label>
                    <input
                      type="text"
                      value={cmsSettings.tagline}
                      onChange={(e) => setCmsSettings({ ...cmsSettings, tagline: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700">Campus Physical Address</label>
                    <input
                      type="text"
                      value={cmsSettings.address}
                      onChange={(e) => setCmsSettings({ ...cmsSettings, address: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Phone Numbers</label>
                    <input
                      type="text"
                      value={cmsSettings.phone}
                      onChange={(e) => setCmsSettings({ ...cmsSettings, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Email Address</label>
                    <input
                      type="email"
                      value={cmsSettings.email}
                      onChange={(e) => setCmsSettings({ ...cmsSettings, email: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* Announcement ticker */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">2. Announcement Banner</span>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="annActive"
                      checked={cmsSettings.announcementActive}
                      onChange={(e) => setCmsSettings({ ...cmsSettings, announcementActive: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <label htmlFor="annActive" className="font-bold text-slate-700">
                      Display Announcement Bar at top of public website
                    </label>
                  </div>
                  <input
                    type="text"
                    value={cmsSettings.announcementBar}
                    onChange={(e) => setCmsSettings({ ...cmsSettings, announcementBar: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 font-semibold text-slate-900"
                  />
                </div>
              </div>

              {/* Hero Banner */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">3. Hero Homepage Banner</span>
                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Hero Main Headline</label>
                    <input
                      type="text"
                      value={cmsSettings.heroHeadline}
                      onChange={(e) => setCmsSettings({ ...cmsSettings, heroHeadline: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 font-bold text-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Hero Subheadline</label>
                    <textarea
                      rows={2}
                      value={cmsSettings.heroSubheadline}
                      onChange={(e) => setCmsSettings({ ...cmsSettings, heroSubheadline: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Hero Background Image URL</label>
                    <input
                      type="text"
                      value={cmsSettings.heroImage}
                      onChange={(e) => setCmsSettings({ ...cmsSettings, heroImage: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              {/* Principal Message */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">4. Principal's Statement</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Principal's Name</label>
                    <input
                      type="text"
                      value={cmsSettings.principalName}
                      onChange={(e) => setCmsSettings({ ...cmsSettings, principalName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Designation / Degree</label>
                    <input
                      type="text"
                      value={cmsSettings.principalDesignation}
                      onChange={(e) => setCmsSettings({ ...cmsSettings, principalDesignation: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700">Message Content</label>
                    <textarea
                      rows={4}
                      value={cmsSettings.principalMessage}
                      onChange={(e) => setCmsSettings({ ...cmsSettings, principalMessage: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider shadow"
                >
                  Save and Publish CMS Changes
                </button>
              </div>
            </form>
          )}

          {/* ===================== TAB 3: ADMISSIONS ===================== */}
          {activeTab === 'admissions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-crest">Online Admission Inquiries</h2>
                  <p className="text-xs text-slate-500">Review prospective student applications and update status.</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase">
                      <tr>
                        <th className="p-3">Application ID</th>
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Class</th>
                        <th className="p-3">DOB / Gender</th>
                        <th className="p-3">Guardian Info</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Review Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {admissions.map((a) => (
                        <tr key={a.id} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-emerald-800">{a.applicationId}</td>
                          <td className="p-3 font-bold text-slate-900">{a.studentName}</td>
                          <td className="p-3 font-semibold text-slate-700">{a.applyingClass}</td>
                          <td className="p-3 text-slate-500">{a.dob} ({a.gender})</td>
                          <td className="p-3">
                            <span className="font-semibold text-slate-800 block">{a.parentName} ({a.relation})</span>
                            <span className="text-slate-400">{a.parentPhone}</span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                                a.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : a.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {a.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-1">
                            <button
                              onClick={() => handleAdmissionStatus(a.id, 'approved')}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleAdmissionStatus(a.id, 'under_review')}
                              className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded text-[10px] font-bold"
                            >
                              Review
                            </button>
                            <button
                              onClick={() => handleAdmissionStatus(a.id, 'rejected')}
                              className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded text-[10px] font-bold"
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 4: STUDENTS ===================== */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-crest">Student Enrollment Management</h2>
                  <p className="text-xs text-slate-500">Manage enrolled student profiles, sections, roll numbers & credentials.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingStudent({
                      id: 'stu-' + Date.now(),
                      studentId: `IEBS-STU-${1000 + students.length + 1}`,
                      admissionNo: `ADM-2082-${String(students.length + 1).padStart(4, '0')}`,
                      fullName: '',
                      className: 'Grade 1',
                      section: 'A',
                      rollNumber: students.length + 1,
                      dob: '2070-01-01',
                      gender: 'Male',
                      guardianName: '',
                      guardianPhone: '',
                      guardianEmail: '',
                      address: 'Inaruwa, Sunsari',
                      bloodGroup: 'B+ve',
                      photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400',
                      status: 'active',
                      accessPin: '1234',
                    });
                    setIsStudentModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Student</span>
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase">
                      <tr>
                        <th className="p-3">Student ID</th>
                        <th className="p-3">Full Name</th>
                        <th className="p-3">Class & Section</th>
                        <th className="p-3">Roll No</th>
                        <th className="p-3">Guardian & Phone</th>
                        <th className="p-3">Access PIN</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {students.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-slate-800">{s.studentId}</td>
                          <td className="p-3 font-bold text-slate-900">{s.fullName}</td>
                          <td className="p-3">{s.className} ({s.section})</td>
                          <td className="p-3 font-bold text-slate-700">#{s.rollNumber}</td>
                          <td className="p-3 text-slate-600">{s.guardianName} ({s.guardianPhone})</td>
                          <td className="p-3 font-mono text-emerald-700 font-semibold">{s.accessPin}</td>
                          <td className="p-3 text-right space-x-1">
                            <button
                              onClick={() => {
                                setEditingStudent(s);
                                setIsStudentModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                              title="Edit student"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(s.id)}
                              className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                              title="Delete student"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 5: REPORT CARDS & RESULTS GENERATOR ===================== */}
          {activeTab === 'results' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-crest">
                    Automated Report Cards & Exam Results
                  </h2>
                  <p className="text-xs text-slate-500">
                    Input student marks across subjects; system automatically computes grand total, percentage, GPA (4.0 scale), and grade rank.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const firstStudent = students[0];
                    setEditingResult({
                      id: 'res-' + Date.now(),
                      studentId: firstStudent ? firstStudent.studentId : 'IEBS-STU-1001',
                      studentName: firstStudent ? firstStudent.fullName : 'Aarav Mehta',
                      className: firstStudent ? firstStudent.className : 'Grade 10',
                      section: firstStudent ? firstStudent.section : 'A',
                      rollNumber: firstStudent ? firstStudent.rollNumber : 1,
                      term: 'Second Terminal Examination',
                      academicYear: '2082 BS (2025/2026 AD)',
                      subjects: [
                        { name: 'Compulsory English', fullMarks: 100, passMarks: 40, theoryMarks: 65, practicalMarks: 25, totalMarks: 90, grade: 'A+', gradePoint: 4.0 },
                        { name: 'Compulsory Nepali', fullMarks: 100, passMarks: 40, theoryMarks: 60, practicalMarks: 24, totalMarks: 84, grade: 'A', gradePoint: 3.6 },
                        { name: 'Compulsory Mathematics', fullMarks: 100, passMarks: 40, theoryMarks: 70, practicalMarks: 25, totalMarks: 95, grade: 'A+', gradePoint: 4.0 },
                        { name: 'Science & Technology', fullMarks: 100, passMarks: 40, theoryMarks: 68, practicalMarks: 24, totalMarks: 92, grade: 'A+', gradePoint: 4.0 },
                        { name: 'Social Studies', fullMarks: 100, passMarks: 40, theoryMarks: 62, practicalMarks: 24, totalMarks: 86, grade: 'A', gradePoint: 3.6 },
                      ],
                      totalMarks: 500,
                      obtainedMarks: 447,
                      percentage: 89.4,
                      gpa: '3.84',
                      letterGrade: 'A+',
                      rank: '1st in Class',
                      attendance: '97% (116/120 days)',
                      remarks: 'Consistently demonstrates exemplary scholarship and respectful leadership.',
                      publishedDate: new Date().toISOString().split('T')[0],
                    });
                    setIsResultModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish New Report Card</span>
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase">
                      <tr>
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Class</th>
                        <th className="p-3">Examination Term</th>
                        <th className="p-3">Marks</th>
                        <th className="p-3">GPA</th>
                        <th className="p-3">Grade</th>
                        <th className="p-3">Rank</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {examResults.map((res) => (
                        <tr key={res.id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{res.studentName} ({res.studentId})</td>
                          <td className="p-3">{res.className}</td>
                          <td className="p-3 font-semibold text-purple-900">{res.term}</td>
                          <td className="p-3 font-mono">{res.obtainedMarks} / {res.totalMarks}</td>
                          <td className="p-3 font-bold text-emerald-700 font-mono text-sm">{res.gpa}</td>
                          <td className="p-3 font-bold">{res.letterGrade}</td>
                          <td className="p-3 font-semibold">{res.rank}</td>
                          <td className="p-3 text-right space-x-1">
                            <button
                              onClick={() => {
                                setEditingResult(res);
                                setIsResultModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                              title="Edit result"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 6: FEES ===================== */}
          {activeTab === 'fees' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-crest">Student Fee Ledger & Receipts</h2>
                  <p className="text-xs text-slate-500">Generate monthly invoices and track eSewa/Khalti transactions.</p>
                </div>
                <button
                  onClick={() => {
                    const firstStudent = students[0];
                    setEditingFee({
                      id: 'fee-' + Date.now(),
                      invoiceNo: `IEBS-INV-2082-${String(feeRecords.length + 1).padStart(3, '0')}`,
                      studentId: firstStudent ? firstStudent.studentId : 'IEBS-STU-1001',
                      studentName: firstStudent ? firstStudent.fullName : 'Aarav Mehta',
                      className: firstStudent ? firstStudent.className : 'Grade 10',
                      month: 'Mangsir 2082',
                      academicYear: '2082/83',
                      tuitionFee: 4500,
                      examFee: 0,
                      computerFee: 800,
                      transportFee: 1500,
                      totalAmount: 6800,
                      paidAmount: 0,
                      dueAmount: 6800,
                      status: 'unpaid',
                    });
                    setIsFeeModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Generate New Fee Invoice</span>
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase">
                      <tr>
                        <th className="p-3">Invoice No</th>
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Billing Month</th>
                        <th className="p-3">Total Amount</th>
                        <th className="p-3">Paid Amount</th>
                        <th className="p-3">Due Balance</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {feeRecords.map((fee) => (
                        <tr key={fee.id} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-slate-800">{fee.invoiceNo}</td>
                          <td className="p-3 font-bold text-slate-900">{fee.studentName}</td>
                          <td className="p-3">{fee.month}</td>
                          <td className="p-3 font-mono font-semibold">NPR {fee.totalAmount}</td>
                          <td className="p-3 font-mono text-emerald-700">NPR {fee.paidAmount}</td>
                          <td className="p-3 font-mono text-red-600 font-bold">NPR {fee.dueAmount}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                                fee.status === 'paid'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : fee.status === 'partial'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {fee.status}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-1">
                            <button
                              onClick={() => {
                                setEditingFee(fee);
                                setIsFeeModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                              title="Edit invoice"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 7: TEACHERS ===================== */}
          {activeTab === 'teachers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-crest">Teacher & Staff Management</h2>
                  <p className="text-xs text-slate-500">Manage public teacher directory, qualifications and bios.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingTeacher({
                      id: 'tch-' + Date.now(),
                      name: '',
                      designation: 'Senior Educator',
                      department: 'Science & Technology',
                      subject: '',
                      qualification: '',
                      experience: '5+ Years',
                      bio: '',
                      email: '',
                      phone: '',
                      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500',
                      status: 'active',
                      order: teachers.length + 1,
                    });
                    setIsTeacherModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Teacher</span>
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase">
                      <tr>
                        <th className="p-3">Name</th>
                        <th className="p-3">Designation</th>
                        <th className="p-3">Department</th>
                        <th className="p-3">Subject</th>
                        <th className="p-3">Contact</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {teachers.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{t.name}</td>
                          <td className="p-3 font-semibold text-emerald-800">{t.designation}</td>
                          <td className="p-3">{t.department}</td>
                          <td className="p-3 font-bold text-slate-700">{t.subject}</td>
                          <td className="p-3 text-slate-500">{t.phone}</td>
                          <td className="p-3 text-right space-x-1">
                            <button
                              onClick={() => {
                                setEditingTeacher(t);
                                setIsTeacherModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteTeacher(t.id)}
                              className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 8: NOTICES ===================== */}
          {activeTab === 'notices' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-crest">Notice & Circular Management</h2>
                  <p className="text-xs text-slate-500">Post, pin, draft, or delete official school circulars.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingNotice({
                      id: 'not-' + Date.now(),
                      title: '',
                      category: 'General',
                      description: '',
                      publishedDate: new Date().toISOString().split('T')[0],
                      isFeatured: false,
                      status: 'published',
                      createdAt: new Date().toISOString(),
                    });
                    setIsNoticeModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Notice</span>
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase">
                      <tr>
                        <th className="p-3">Title</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Featured / Pin</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {notices.map((n) => (
                        <tr key={n.id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{n.title}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-50 text-emerald-800">
                              {n.category}
                            </span>
                          </td>
                          <td className="p-3 text-slate-500">{n.publishedDate}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] bg-slate-100 text-slate-800">
                              {n.status}
                            </span>
                          </td>
                          <td className="p-3">{n.isFeatured ? '⭐ Yes' : 'No'}</td>
                          <td className="p-3 text-right space-x-1">
                            <button
                              onClick={() => {
                                setEditingNotice(n);
                                setIsNoticeModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteNotice(n.id)}
                              className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 9: MESSAGES ===================== */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-crest">Public Contact & Inquiries Inbox</h2>
                <p className="text-xs text-slate-500">Messages sent through the public contact form.</p>
              </div>

              <div className="space-y-3">
                {contactMessages.map((msg) => (
                  <div key={msg.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{msg.fullName} ({msg.email} / {msg.phone})</span>
                      <span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] bg-slate-100 text-slate-800">
                        {msg.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-emerald-900">{msg.subject}</h4>
                    <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      "{msg.message}"
                    </p>
                    <div className="text-[11px] text-slate-400">Received on: {new Date(msg.createdAt).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== TAB 10: ACTIVITY LOGS ===================== */}
          {activeTab === 'logs' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-crest">System Audit Trail & Activity Logs</h2>
                <p className="text-xs text-slate-500">Immutable ledger of administrative actions.</p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
                {activityLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <History className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-900">{log.action}</strong>
                        <span className="text-slate-400 font-mono text-[10px]">{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-600">{log.details}</p>
                      <span className="text-[10px] text-emerald-700 font-semibold">User: {log.user}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ===================== MODAL: EDIT / ADD NOTICE ===================== */}
      {isNoticeModalOpen && editingNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <form onSubmit={handleSaveNotice} className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 text-xs">
            <h3 className="text-lg font-bold text-slate-900 font-crest">Notice Editor</h3>
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Notice Title</label>
              <input
                type="text"
                required
                value={editingNotice.title}
                onChange={(e) => setEditingNotice({ ...editingNotice, title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Category</label>
                <select
                  value={editingNotice.category}
                  onChange={(e) => setEditingNotice({ ...editingNotice, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600"
                >
                  <option value="General">General</option>
                  <option value="Examination">Examination</option>
                  <option value="Admission">Admission</option>
                  <option value="Holiday">Holiday</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Publish Date</label>
                <input
                  type="date"
                  value={editingNotice.publishedDate}
                  onChange={(e) => setEditingNotice({ ...editingNotice, publishedDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Full Description</label>
              <textarea
                required
                rows={4}
                value={editingNotice.description}
                onChange={(e) => setEditingNotice({ ...editingNotice, description: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="pinNotice"
                checked={editingNotice.isFeatured}
                onChange={(e) => setEditingNotice({ ...editingNotice, isFeatured: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <label htmlFor="pinNotice" className="font-bold text-slate-700">Pin as Featured Notice</label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsNoticeModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
              >
                Save Notice
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===================== MODAL: EDIT / ADD STUDENT ===================== */}
      {isStudentModalOpen && editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <form onSubmit={handleSaveStudent} className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 text-xs">
            <h3 className="text-lg font-bold text-slate-900 font-crest">Student Enrollment Editor</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Student ID</label>
                <input
                  type="text"
                  required
                  value={editingStudent.studentId}
                  onChange={(e) => setEditingStudent({ ...editingStudent, studentId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Admission No</label>
                <input
                  type="text"
                  required
                  value={editingStudent.admissionNo}
                  onChange={(e) => setEditingStudent({ ...editingStudent, admissionNo: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Full Name</label>
              <input
                type="text"
                required
                value={editingStudent.fullName}
                onChange={(e) => setEditingStudent({ ...editingStudent, fullName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Class</label>
                <input
                  type="text"
                  value={editingStudent.className}
                  onChange={(e) => setEditingStudent({ ...editingStudent, className: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Section</label>
                <input
                  type="text"
                  value={editingStudent.section}
                  onChange={(e) => setEditingStudent({ ...editingStudent, section: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Roll No</label>
                <input
                  type="number"
                  value={editingStudent.rollNumber}
                  onChange={(e) => setEditingStudent({ ...editingStudent, rollNumber: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Guardian Name</label>
                <input
                  type="text"
                  value={editingStudent.guardianName}
                  onChange={(e) => setEditingStudent({ ...editingStudent, guardianName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Guardian Phone</label>
                <input
                  type="tel"
                  value={editingStudent.guardianPhone}
                  onChange={(e) => setEditingStudent({ ...editingStudent, guardianPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Portal Security PIN</label>
                <input
                  type="text"
                  value={editingStudent.accessPin}
                  onChange={(e) => setEditingStudent({ ...editingStudent, accessPin: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-emerald-700"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Blood Group</label>
                <input
                  type="text"
                  value={editingStudent.bloodGroup}
                  onChange={(e) => setEditingStudent({ ...editingStudent, bloodGroup: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsStudentModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold"
              >
                Save Student
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===================== MODAL: EDIT / PUBLISH REPORT CARD ===================== */}
      {isResultModalOpen && editingResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <form onSubmit={handleSaveResult} className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-4 text-xs">
            <h3 className="text-lg font-bold text-slate-900 font-crest">Publish Terminal Report Card</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Student Name</label>
                <input
                  type="text"
                  required
                  value={editingResult.studentName}
                  onChange={(e) => setEditingResult({ ...editingResult, studentName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Student ID</label>
                <input
                  type="text"
                  required
                  value={editingResult.studentId}
                  onChange={(e) => setEditingResult({ ...editingResult, studentId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Class</label>
                <input
                  type="text"
                  value={editingResult.className}
                  onChange={(e) => setEditingResult({ ...editingResult, className: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Terminal Exam</label>
                <select
                  value={editingResult.term}
                  onChange={(e) => setEditingResult({ ...editingResult, term: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="First Terminal Examination">First Terminal Examination</option>
                  <option value="Second Terminal Examination">Second Terminal Examination</option>
                  <option value="Final Examination">Final Examination</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Class Rank</label>
                <input
                  type="text"
                  value={editingResult.rank}
                  onChange={(e) => setEditingResult({ ...editingResult, rank: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-purple-900"
                />
              </div>
            </div>

            {/* Subject Marks Inputs */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <label className="font-bold text-slate-800">Subject Marks (Theory + Practical)</label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {editingResult.subjects.map((sub, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="w-40 font-bold truncate">{sub.name}</span>
                    <input
                      type="number"
                      placeholder="Theory"
                      value={sub.theoryMarks}
                      onChange={(e) => {
                        const t = Number(e.target.value);
                        const tot = t + sub.practicalMarks;
                        const gp = tot >= 90 ? 4.0 : tot >= 80 ? 3.6 : tot >= 70 ? 3.2 : tot >= 60 ? 2.8 : 2.4;
                        const gr = tot >= 90 ? 'A+' : tot >= 80 ? 'A' : tot >= 70 ? 'B+' : tot >= 60 ? 'B' : 'C+';
                        const updated = [...editingResult.subjects];
                        updated[i] = { ...sub, theoryMarks: t, totalMarks: tot, gradePoint: gp, grade: gr };
                        setEditingResult({ ...editingResult, subjects: updated });
                      }}
                      className="w-16 px-2 py-1 bg-white border border-slate-200 rounded text-center font-mono"
                    />
                    <input
                      type="number"
                      placeholder="Practical"
                      value={sub.practicalMarks}
                      onChange={(e) => {
                        const p = Number(e.target.value);
                        const tot = sub.theoryMarks + p;
                        const gp = tot >= 90 ? 4.0 : tot >= 80 ? 3.6 : tot >= 70 ? 3.2 : tot >= 60 ? 2.8 : 2.4;
                        const gr = tot >= 90 ? 'A+' : tot >= 80 ? 'A' : tot >= 70 ? 'B+' : tot >= 60 ? 'B' : 'C+';
                        const updated = [...editingResult.subjects];
                        updated[i] = { ...sub, practicalMarks: p, totalMarks: tot, gradePoint: gp, grade: gr };
                        setEditingResult({ ...editingResult, subjects: updated });
                      }}
                      className="w-16 px-2 py-1 bg-white border border-slate-200 rounded text-center font-mono"
                    />
                    <span className="font-bold font-mono text-purple-900 w-16 text-center">{sub.totalMarks} / 100</span>
                    <span className="font-bold text-emerald-700 w-8">{sub.grade}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Teacher Remarks</label>
              <input
                type="text"
                value={editingResult.remarks}
                onChange={(e) => setEditingResult({ ...editingResult, remarks: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsResultModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold"
              >
                Compute & Publish Grade-Sheet
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===================== MODAL: EDIT / ADD FEE ===================== */}
      {isFeeModalOpen && editingFee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <form onSubmit={handleSaveFee} className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 text-xs">
            <h3 className="text-lg font-bold text-slate-900 font-crest">Fee Invoice Editor</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Invoice No</label>
                <input
                  type="text"
                  required
                  value={editingFee.invoiceNo}
                  onChange={(e) => setEditingFee({ ...editingFee, invoiceNo: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Student ID</label>
                <input
                  type="text"
                  required
                  value={editingFee.studentId}
                  onChange={(e) => setEditingFee({ ...editingFee, studentId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Month / Academic Session</label>
              <input
                type="text"
                required
                value={editingFee.month}
                onChange={(e) => setEditingFee({ ...editingFee, month: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Tuition Fee (NPR)</label>
                <input
                  type="number"
                  value={editingFee.tuitionFee}
                  onChange={(e) => setEditingFee({ ...editingFee, tuitionFee: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Exam Fee (NPR)</label>
                <input
                  type="number"
                  value={editingFee.examFee}
                  onChange={(e) => setEditingFee({ ...editingFee, examFee: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Computer / Lab Fee</label>
                <input
                  type="number"
                  value={editingFee.computerFee}
                  onChange={(e) => setEditingFee({ ...editingFee, computerFee: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Transport Fee</label>
                <input
                  type="number"
                  value={editingFee.transportFee}
                  onChange={(e) => setEditingFee({ ...editingFee, transportFee: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsFeeModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
              >
                Save Invoice
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
