import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { Student, ExamResult, Notice, SchoolSettings } from '../types';
import { DataService } from '../services/dataService';
import {
  UserCheck,
  GraduationCap,
  Award,
  Calendar,
  Clock,
  Printer,
  KeyRound,
  LogOut,
  Bell,
  FileText,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  User,
  Phone,
  Mail,
  MapPin,
  Sparkles,
} from 'lucide-react';

interface StudentPortalProps {
  settings: SchoolSettings;
  notices: Notice[];
}

export const StudentPortal: React.FC<StudentPortalProps> = ({ settings, notices }) => {
  const { navigate } = useRouter();
  const { currentStudent, loginStudent, logoutStudent } = useAuth();

  // Login form state
  const [studentIdInput, setStudentIdInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // Portal tabs
  const [activeTab, setActiveTab] = useState<'results' | 'profile' | 'notices' | 'settings'>('results');

  // Student exam results
  const [results, setResults] = useState<ExamResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);

  // Load results when student is logged in
  useEffect(() => {
    if (currentStudent) {
      DataService.getResultsForStudent(currentStudent.studentId).then((res) => {
        setResults(res);
        if (res.length > 0) setSelectedResult(res[0]);
      });
    }
  }, [currentStudent]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    const success = await loginStudent(studentIdInput, pinInput);
    setLoading(false);
    if (!success) {
      setLoginError('Invalid Student ID or PIN. (Default demo PIN is 1234)');
    }
  };

  const handleQuickDemoLogin = async (id: string) => {
    setStudentIdInput(id);
    setPinInput('1234');
    setLoading(true);
    await loginStudent(id, '1234');
    setLoading(false);
  };

  // If not logged in, show student login screen
  if (!currentStudent) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-700 mx-auto flex items-center justify-center border border-blue-100 shadow-sm">
              <UserCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-crest">
              IEBS Student Portal
            </h1>
            <p className="text-xs text-slate-500">
              Sign in to view your terminal examination report cards, attendance, and official notices.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Student ID or Admission No</label>
              <input
                type="text"
                required
                placeholder="e.g. IEBS-STU-1001"
                value={studentIdInput}
                onChange={(e) => setStudentIdInput(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 focus:bg-white text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Security PIN (Default: 1234)</label>
              <input
                type="password"
                required
                placeholder="4-digit PIN"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 focus:bg-white text-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In to Student Portal'}
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              Instant Demo Access:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('IEBS-STU-1001')}
                className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold text-center truncate border border-blue-200"
              >
                Aarav (Grade 10)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('IEBS-STU-1002')}
                className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold text-center truncate border border-blue-200"
              >
                Priya (Grade 10)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Student Welcome Header */}
      <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <img
                src={currentStudent.photoUrl}
                alt={currentStudent.fullName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-blue-400/40 shadow-lg"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    Student Active
                  </span>
                  <span className="text-xs text-blue-300 font-mono">{currentStudent.studentId}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold font-crest">{currentStudent.fullName}</h1>
                <p className="text-xs text-slate-300">
                  {currentStudent.className} • Section: {currentStudent.section} • Roll No: {currentStudent.rollNumber}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => logoutStudent()}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/20"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Student Tabs */}
          <div className="flex gap-2 border-b border-slate-700/80 mt-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('results')}
              className={`py-2.5 px-4 font-semibold text-xs rounded-t-lg transition-colors ${
                activeTab === 'results'
                  ? 'bg-white text-slate-900 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Academic Report Cards
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2.5 px-4 font-semibold text-xs rounded-t-lg transition-colors ${
                activeTab === 'profile'
                  ? 'bg-white text-slate-900 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Student Profile & Attendance
            </button>
            <button
              onClick={() => setActiveTab('notices')}
              className={`py-2.5 px-4 font-semibold text-xs rounded-t-lg transition-colors ${
                activeTab === 'notices'
                  ? 'bg-white text-slate-900 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              School Circulars
            </button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ===================== REPORT CARD TAB ===================== */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            {/* Term Selector */}
            <div className="flex items-center justify-between flex-wrap gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm no-print">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Examination:</span>
                <div className="flex gap-2">
                  {results.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedResult(r)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        selectedResult?.id === r.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {r.term}
                    </button>
                  ))}
                </div>
              </div>

              {selectedResult && (
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-2 hover:bg-slate-800 transition-colors shadow"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Official Grade-Sheet</span>
                </button>
              )}
            </div>

            {selectedResult ? (
              /* OFFICIAL PRINTABLE REPORT CARD / MARKSHEET */
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm printable-card space-y-6">
                {/* School Header */}
                <div className="border-b-2 border-emerald-900 pb-4 text-center space-y-1">
                  <div className="flex items-center justify-center gap-2 text-emerald-900 font-bold font-crest text-xl sm:text-2xl">
                    <GraduationCap className="w-6 h-6 text-emerald-700" />
                    <span>{settings.schoolName}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-600">{settings.address}</p>
                  <p className="text-[11px] text-slate-400">Affiliated to NEB Nepal • Examination Code: Sunsari</p>
                  <div className="pt-2">
                    <span className="inline-block px-4 py-1 rounded bg-slate-900 text-white font-bold text-xs uppercase tracking-widest">
                      ACADEMIC PROGRESS REPORT CARD
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 mt-1">{selectedResult.term} – {selectedResult.academicYear}</p>
                </div>

                {/* Student Particulars Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Student Name</span>
                    <strong className="text-slate-900 text-sm">{selectedResult.studentName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Student ID / Roll No</span>
                    <strong className="text-slate-900 text-sm">{selectedResult.studentId} / #{selectedResult.rollNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Class & Section</span>
                    <strong className="text-slate-900 text-sm">{selectedResult.className} - {selectedResult.section}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Attendance</span>
                    <strong className="text-slate-900 text-sm">{selectedResult.attendance}</strong>
                  </div>
                </div>

                {/* Subject Marksheet Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-100 text-slate-800 uppercase tracking-wider font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">SN</th>
                        <th className="p-3">Subject</th>
                        <th className="p-3 text-center">Full Marks</th>
                        <th className="p-3 text-center">Pass Marks</th>
                        <th className="p-3 text-center">Theory (75)</th>
                        <th className="p-3 text-center">Practical (25)</th>
                        <th className="p-3 text-center">Total (100)</th>
                        <th className="p-3 text-center">Grade</th>
                        <th className="p-3 text-center">Grade Point</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedResult.subjects.map((sub, i) => (
                        <tr key={i} className="hover:bg-slate-50/80">
                          <td className="p-3 text-slate-400 font-mono">{i + 1}</td>
                          <td className="p-3 font-bold text-slate-900">{sub.name}</td>
                          <td className="p-3 text-center text-slate-500">{sub.fullMarks}</td>
                          <td className="p-3 text-center text-slate-500">{sub.passMarks}</td>
                          <td className="p-3 text-center font-mono">{sub.theoryMarks}</td>
                          <td className="p-3 text-center font-mono">{sub.practicalMarks}</td>
                          <td className="p-3 text-center font-bold text-slate-900 font-mono">{sub.totalMarks}</td>
                          <td className="p-3 text-center font-bold text-emerald-700">{sub.grade}</td>
                          <td className="p-3 text-center font-mono font-semibold">{sub.gradePoint.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-200">
                      <tr>
                        <td colSpan={2} className="p-3 text-slate-900">GRAND TOTAL</td>
                        <td className="p-3 text-center text-slate-600">{selectedResult.totalMarks}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className="p-3 text-center text-emerald-800 text-sm font-mono">{selectedResult.obtainedMarks}</td>
                        <td className="p-3 text-center text-emerald-800 font-bold">{selectedResult.letterGrade}</td>
                        <td className="p-3 text-center text-emerald-800 font-mono">{selectedResult.gpa}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Result Summary Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                  <div>
                    <span className="text-[11px] text-emerald-800 font-medium uppercase tracking-wider block">Grade Point Average</span>
                    <span className="text-2xl font-black text-emerald-950 font-mono">{selectedResult.gpa} / 4.0</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-emerald-800 font-medium uppercase tracking-wider block">Overall Letter Grade</span>
                    <span className="text-2xl font-black text-emerald-950">{selectedResult.letterGrade}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-emerald-800 font-medium uppercase tracking-wider block">Percentage</span>
                    <span className="text-2xl font-black text-emerald-950 font-mono">{selectedResult.percentage.toFixed(2)}%</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-emerald-800 font-medium uppercase tracking-wider block">Class Position</span>
                    <span className="text-2xl font-black text-emerald-950">{selectedResult.rank}</span>
                  </div>
                </div>

                {/* Remarks & Signatures */}
                <div className="space-y-4 pt-4">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <strong>Class Teacher Remarks:</strong>
                    <p className="text-slate-700 italic mt-1">"{selectedResult.remarks}"</p>
                  </div>

                  <div className="pt-8 grid grid-cols-3 gap-6 text-center text-xs">
                    <div>
                      <div className="w-32 border-b border-dashed border-slate-400 mx-auto mb-1"></div>
                      <span className="text-slate-600 font-semibold">Class Teacher</span>
                    </div>
                    <div>
                      <div className="w-32 border-b border-dashed border-slate-400 mx-auto mb-1"></div>
                      <span className="text-slate-600 font-semibold">Exam Controller</span>
                    </div>
                    <div>
                      <div className="w-32 border-b border-dashed border-slate-400 mx-auto mb-1"></div>
                      <span className="text-slate-600 font-semibold">Principal's Seal & Signature</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-400">
                <Award className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <p>No published exam records found for your student ID.</p>
              </div>
            )}
          </div>
        )}

        {/* ===================== PROFILE TAB ===================== */}
        {activeTab === 'profile' && (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900 font-crest">Student Enrollment Profile</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400">Admission Number:</span>
                <p className="text-sm font-bold text-slate-900">{currentStudent.admissionNo}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400">Date of Birth:</span>
                <p className="text-sm font-bold text-slate-900">{currentStudent.dob}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400">Gender & Blood Group:</span>
                <p className="text-sm font-bold text-slate-900">{currentStudent.gender} • {currentStudent.bloodGroup}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400">Parent / Guardian:</span>
                <p className="text-sm font-bold text-slate-900">{currentStudent.guardianName}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400">Guardian Contact:</span>
                <p className="text-sm font-bold text-slate-900">{currentStudent.guardianPhone}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400">Residential Address:</span>
                <p className="text-sm font-bold text-slate-900">{currentStudent.address}</p>
              </div>
            </div>
          </div>
        )}

        {/* ===================== NOTICES TAB ===================== */}
        {activeTab === 'notices' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <h2 className="text-xl font-bold text-slate-900 font-crest">Recent Circulars & Reminders</h2>
            <div className="space-y-3">
              {notices.map((n) => (
                <div key={n.id} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">{n.category}</span>
                    <span className="text-slate-400">{n.publishedDate}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{n.title}</h3>
                  <p className="text-xs text-slate-600">{n.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
