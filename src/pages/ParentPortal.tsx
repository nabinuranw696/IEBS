import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { Student, ExamResult, FeeRecord, Notice, SchoolSettings } from '../types';
import { DataService } from '../services/dataService';
import {
  Users,
  CreditCard,
  GraduationCap,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Printer,
  Clock,
  LogOut,
  User,
  ArrowRight,
  ShieldCheck,
  Building,
  Sparkles,
  QrCode,
  DollarSign,
} from 'lucide-react';

interface ParentPortalProps {
  settings: SchoolSettings;
  notices: Notice[];
}

export const ParentPortal: React.FC<ParentPortalProps> = ({ settings, notices }) => {
  const { navigate } = useRouter();
  const { currentParent, loginParent, logoutParent } = useAuth();

  // Login form
  const [identifierInput, setIdentifierInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // Active child selector
  const [activeChildIndex, setActiveChildIndex] = useState(0);

  // Portal tabs
  const [activeTab, setActiveTab] = useState<'fees' | 'results' | 'profile' | 'notices'>('fees');

  // Fee records & Exam results for active child
  const [childFees, setChildFees] = useState<FeeRecord[]>([]);
  const [childResults, setChildResults] = useState<ExamResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);

  // Fee payment modal state
  const [payingInvoice, setPayingInvoice] = useState<FeeRecord | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'eSewa' | 'Khalti' | 'ConnectIPS' | 'Bank Transfer'>('eSewa');
  const [payingAmount, setPayingAmount] = useState<number>(0);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paidReceipt, setPaidReceipt] = useState<FeeRecord | null>(null);

  const activeChild = currentParent?.children[activeChildIndex] || null;

  // Load child data
  useEffect(() => {
    if (activeChild) {
      DataService.getFeeRecordsForStudent(activeChild.studentId).then((fees) => {
        setChildFees(fees);
      });
      DataService.getResultsForStudent(activeChild.studentId).then((res) => {
        setChildResults(res);
        if (res.length > 0) setSelectedResult(res[0]);
      });
    }
  }, [activeChild]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    const success = await loginParent(identifierInput, pinInput);
    setLoading(false);
    if (!success) {
      setLoginError('Invalid Guardian Phone or Student ID. (Default demo PIN is 1234)');
    }
  };

  const handleQuickDemo = async (phone: string) => {
    setIdentifierInput(phone);
    setPinInput('1234');
    setLoading(true);
    await loginParent(phone, '1234');
    setLoading(false);
  };

  const openPaymentModal = (invoice: FeeRecord) => {
    setPayingInvoice(invoice);
    setPayingAmount(invoice.dueAmount > 0 ? invoice.dueAmount : invoice.totalAmount);
    setPaymentMethod('eSewa');
  };

  const executePayment = async () => {
    if (!payingInvoice) return;
    setIsProcessingPayment(true);

    try {
      const updated = await DataService.recordFeePayment(
        payingInvoice.id,
        paymentMethod,
        payingAmount
      );
      if (updated) {
        setPaidReceipt(updated);
        // Refresh child fees
        const refreshed = await DataService.getFeeRecordsForStudent(activeChild!.studentId);
        setChildFees(refreshed);
        setPayingInvoice(null);
      }
    } catch (err) {
      console.error(err);
      alert('Payment processing failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // If not logged in, show Parent Login screen
  if (!currentParent) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-700 mx-auto flex items-center justify-center border border-purple-100 shadow-sm">
              <Users className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-crest">
              IEBS Parent Portal
            </h1>
            <p className="text-xs text-slate-500">
              Access your child's automated grade sheets, attendance tracking, fee payment ledger, and online payments.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Registered Guardian Phone / Student ID</label>
              <input
                type="text"
                required
                placeholder="e.g. 9852011223 or IEBS-STU-1001"
                value={identifierInput}
                onChange={(e) => setIdentifierInput(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-600 focus:bg-white text-slate-900"
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
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-600 focus:bg-white text-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md disabled:opacity-50"
            >
              {loading ? 'Verifying Guardian Records...' : 'Sign In to Parent Portal'}
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              Quick Demo Access:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemo('9852011223')}
                className="p-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 font-semibold text-center truncate border border-purple-200"
              >
                Dr. Binod Mehta (Parent)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('9807123456')}
                className="p-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 font-semibold text-center truncate border border-purple-200"
              >
                Mrs. Laxmi Chaudhary
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Parent Welcome Bar */}
      <section className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Guardian Portal
                </span>
                <span className="text-xs text-purple-300">{currentParent.guardianPhone}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-crest">
                Namaste, {currentParent.guardianName}
              </h1>
              <p className="text-xs text-slate-300">
                Linked Children: {currentParent.children.length} Enrolled Student(s)
              </p>
            </div>

            <button
              onClick={() => logoutParent()}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/20"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Multi-Child Selector */}
          <div className="flex items-center gap-2 pt-2 overflow-x-auto">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Select Child:
            </span>
            {currentParent.children.map((child, idx) => (
              <button
                key={child.id}
                onClick={() => setActiveChildIndex(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  activeChildIndex === idx
                    ? 'bg-white text-purple-950 shadow-md font-extrabold'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                <img
                  src={child.photoUrl}
                  alt={child.fullName}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span>{child.fullName} ({child.className})</span>
              </button>
            ))}
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 border-b border-slate-700/80 pt-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('fees')}
              className={`py-2.5 px-4 font-semibold text-xs rounded-t-lg transition-colors ${
                activeTab === 'fees'
                  ? 'bg-white text-slate-900 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Fee Invoices & Online Payments
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`py-2.5 px-4 font-semibold text-xs rounded-t-lg transition-colors ${
                activeTab === 'results'
                  ? 'bg-white text-slate-900 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Automated Report Cards
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2.5 px-4 font-semibold text-xs rounded-t-lg transition-colors ${
                activeTab === 'profile'
                  ? 'bg-white text-slate-900 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Child Profile & Attendance
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

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ===================== 1. FEE MANAGEMENT & ONLINE PAYMENT TAB ===================== */}
        {activeTab === 'fees' && activeChild && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-crest">
                  Tuition & Examination Fee Ledger
                </h2>
                <p className="text-xs text-slate-500">
                  Student: <strong>{activeChild.fullName}</strong> ({activeChild.studentId}) • {activeChild.className}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Payment Gateways Supported:</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">eSewa</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">Khalti</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">ConnectIPS</span>
              </div>
            </div>

            {/* Invoices List */}
            <div className="space-y-4">
              {childFees.map((fee) => (
                <div
                  key={fee.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-purple-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-bold text-slate-900">{fee.month}</span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          fee.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : fee.status === 'partial'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {fee.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600">
                      <div>
                        <span className="text-slate-400">Invoice No:</span>
                        <p className="font-semibold text-slate-800">{fee.invoiceNo}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Tuition Fee:</span>
                        <p className="font-semibold text-slate-800">NPR {fee.tuitionFee}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Lab & Transport:</span>
                        <p className="font-semibold text-slate-800">NPR {fee.computerFee + fee.transportFee}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Total Billed:</span>
                        <p className="font-bold text-slate-900">NPR {fee.totalAmount}</p>
                      </div>
                    </div>

                    {fee.transactionId && (
                      <p className="text-[11px] text-emerald-700 font-medium">
                        Paid via {fee.paymentMethod} on {fee.paymentDate} (Ref: {fee.transactionId})
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {fee.status !== 'paid' ? (
                      <button
                        onClick={() => openPaymentModal(fee)}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs uppercase tracking-wider hover:from-emerald-700 hover:to-teal-800 transition-colors shadow flex items-center gap-2"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Pay Online (NPR {fee.dueAmount || fee.totalAmount})</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setPaidReceipt(fee)}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-200"
                      >
                        <Printer className="w-4 h-4 text-slate-600" />
                        <span>Print Fee Receipt</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {childFees.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-400">
                  <CreditCard className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  <p>No fee records found for this student.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================== 2. AUTOMATED REPORT CARD TAB ===================== */}
        {activeTab === 'results' && activeChild && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm no-print">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Examination:</span>
                <div className="flex gap-2">
                  {childResults.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedResult(r)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        selectedResult?.id === r.id
                          ? 'bg-purple-700 text-white'
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
                  <span>Print Official Report Card</span>
                </button>
              )}
            </div>

            {selectedResult ? (
              /* Printable Grade Sheet */
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm printable-card space-y-6">
                <div className="border-b-2 border-emerald-900 pb-4 text-center space-y-1">
                  <div className="flex items-center justify-center gap-2 text-emerald-900 font-bold font-crest text-xl sm:text-2xl">
                    <GraduationCap className="w-6 h-6 text-emerald-700" />
                    <span>{settings.schoolName}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-600">{settings.address}</p>
                  <p className="text-[11px] text-slate-400">National Examination Board Affiliated • Inaruwa, Sunsari</p>
                  <div className="pt-2">
                    <span className="inline-block px-4 py-1 rounded bg-purple-900 text-white font-bold text-xs uppercase tracking-widest">
                      STUDENT ACADEMIC PERFORMANCE REPORT
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 mt-1">{selectedResult.term} ({selectedResult.academicYear})</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Student Name</span>
                    <strong className="text-slate-900 text-sm">{selectedResult.studentName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Student ID / Roll</span>
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

                {/* Marksheet Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-100 text-slate-800 uppercase tracking-wider font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">SN</th>
                        <th className="p-3">Subject</th>
                        <th className="p-3 text-center">Full Marks</th>
                        <th className="p-3 text-center">Pass Marks</th>
                        <th className="p-3 text-center">Theory</th>
                        <th className="p-3 text-center">Practical</th>
                        <th className="p-3 text-center">Total Marks</th>
                        <th className="p-3 text-center">Letter Grade</th>
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
                          <td className="p-3 text-center font-bold text-purple-800">{sub.grade}</td>
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
                        <td className="p-3 text-center text-purple-900 text-sm font-mono">{selectedResult.obtainedMarks}</td>
                        <td className="p-3 text-center text-purple-900 font-bold">{selectedResult.letterGrade}</td>
                        <td className="p-3 text-center text-purple-900 font-mono">{selectedResult.gpa}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Score Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-purple-50 border border-purple-200 text-center">
                  <div>
                    <span className="text-[11px] text-purple-800 font-medium uppercase tracking-wider block">GPA (4.0 Scale)</span>
                    <span className="text-2xl font-black text-purple-950 font-mono">{selectedResult.gpa}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-purple-800 font-medium uppercase tracking-wider block">Grade</span>
                    <span className="text-2xl font-black text-purple-950">{selectedResult.letterGrade}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-purple-800 font-medium uppercase tracking-wider block">Percentage</span>
                    <span className="text-2xl font-black text-purple-950 font-mono">{selectedResult.percentage.toFixed(2)}%</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-purple-800 font-medium uppercase tracking-wider block">Rank</span>
                    <span className="text-2xl font-black text-purple-950">{selectedResult.rank}</span>
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
                <GraduationCap className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <p>No terminal examination records published yet for this child.</p>
              </div>
            )}
          </div>
        )}

        {/* ===================== 3. PROFILE & ATTENDANCE TAB ===================== */}
        {activeTab === 'profile' && activeChild && (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900 font-crest">Child Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400">Full Student Name:</span>
                <p className="text-sm font-bold text-slate-900">{activeChild.fullName}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400">Student ID / Roll No:</span>
                <p className="text-sm font-bold text-slate-900">{activeChild.studentId} / #{activeChild.rollNumber}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400">Class & Section:</span>
                <p className="text-sm font-bold text-slate-900">{activeChild.className} - {activeChild.section}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400">Date of Birth:</span>
                <p className="text-sm font-bold text-slate-900">{activeChild.dob}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400">Blood Group:</span>
                <p className="text-sm font-bold text-slate-900">{activeChild.bloodGroup}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400">Registered Guardian Phone:</span>
                <p className="text-sm font-bold text-slate-900">{activeChild.guardianPhone}</p>
              </div>
            </div>
          </div>
        )}

        {/* ===================== 4. NOTICES TAB ===================== */}
        {activeTab === 'notices' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <h2 className="text-xl font-bold text-slate-900 font-crest">Notices for Parents</h2>
            <div className="space-y-3">
              {notices.map((n) => (
                <div key={n.id} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded">{n.category}</span>
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

      {/* ===================== ONLINE PAYMENT MODAL ===================== */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Digital Fee Gateway</span>
                <h3 className="text-xl font-bold text-slate-900 font-crest">Pay School Fee Online</h3>
              </div>
              <button
                onClick={() => setPayingInvoice(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Student:</span>
                <strong className="text-slate-800">{payingInvoice.studentName} ({payingInvoice.className})</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Month / Session:</span>
                <strong className="text-slate-800">{payingInvoice.month}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice Number:</span>
                <strong className="text-slate-800">{payingInvoice.invoiceNo}</strong>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 text-sm">
                <span className="font-bold text-slate-700">Amount Due:</span>
                <strong className="font-bold text-emerald-800 font-mono">NPR {payingInvoice.dueAmount || payingInvoice.totalAmount}</strong>
              </div>
            </div>

            {/* Select Gateway */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Select Payment Method</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('eSewa')}
                  className={`p-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'eSewa'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <span>eSewa Wallet</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Khalti')}
                  className={`p-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'Khalti'
                      ? 'border-purple-600 bg-purple-50 text-purple-800 ring-2 ring-purple-500/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                  <span>Khalti Wallet</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('ConnectIPS')}
                  className={`p-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'ConnectIPS'
                      ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-500/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  <span>ConnectIPS</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Bank Transfer')}
                  className={`p-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'Bank Transfer'
                      ? 'border-amber-600 bg-amber-50 text-amber-800 ring-2 ring-amber-500/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                  <span>Bank Deposit</span>
                </button>
              </div>
            </div>

            {/* Enter Amount */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Amount to Pay (NPR)</label>
              <input
                type="number"
                min={100}
                max={payingInvoice.dueAmount || payingInvoice.totalAmount}
                value={payingAmount}
                onChange={(e) => setPayingAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-base font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 font-mono"
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={executePayment}
                disabled={isProcessingPayment || payingAmount <= 0}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs uppercase tracking-wider hover:from-emerald-700 hover:to-teal-800 transition-all shadow-lg shadow-emerald-950/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessingPayment ? (
                  <span>Securing Bank Transaction...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Pay NPR {payingAmount} via {paymentMethod}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== PRINTABLE OFFICIAL FEE RECEIPT MODAL ===================== */}
      {paidReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 max-w-xl w-full shadow-2xl space-y-6 printable-card">
            {/* Header */}
            <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
              <div className="flex items-center justify-center gap-2 text-emerald-900 font-bold font-crest text-xl">
                <GraduationCap className="w-6 h-6 text-emerald-700" />
                <span>{settings.schoolName}</span>
              </div>
              <p className="text-xs text-slate-500 font-semibold">{settings.address}</p>
              <p className="text-[11px] text-slate-400">Phone: {settings.phone}</p>
              <div className="pt-2">
                <span className="inline-block px-3 py-1 rounded bg-emerald-800 text-white font-bold text-xs uppercase tracking-widest">
                  FEE PAYMENT RECEIPT
                </span>
              </div>
            </div>

            {/* Particulars */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400">Receipt / Invoice No:</span>
                <p className="font-bold text-slate-900">{paidReceipt.invoiceNo}</p>
              </div>
              <div>
                <span className="text-slate-400">Date of Payment:</span>
                <p className="font-bold text-slate-900">{paidReceipt.paymentDate || new Date().toISOString().split('T')[0]}</p>
              </div>
              <div>
                <span className="text-slate-400">Student Name:</span>
                <p className="font-bold text-slate-900">{paidReceipt.studentName}</p>
              </div>
              <div>
                <span className="text-slate-400">Class & ID:</span>
                <p className="font-bold text-slate-900">{paidReceipt.className} ({paidReceipt.studentId})</p>
              </div>
            </div>

            {/* Ledger breakdown */}
            <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 font-bold text-slate-800 border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Fee Head</th>
                    <th className="p-2.5 text-right">Amount (NPR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-2.5">Tuition Fee ({paidReceipt.month})</td>
                    <td className="p-2.5 text-right font-mono">{paidReceipt.tuitionFee}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">Examination Fee</td>
                    <td className="p-2.5 text-right font-mono">{paidReceipt.examFee}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">Computer Lab & Internet</td>
                    <td className="p-2.5 text-right font-mono">{paidReceipt.computerFee}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">Transportation Service</td>
                    <td className="p-2.5 text-right font-mono">{paidReceipt.transportFee}</td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-200">
                  <tr>
                    <td className="p-2.5 text-slate-900">Total Billed</td>
                    <td className="p-2.5 text-right text-slate-900 font-mono">NPR {paidReceipt.totalAmount}</td>
                  </tr>
                  <tr className="text-emerald-800">
                    <td className="p-2.5">Paid Amount</td>
                    <td className="p-2.5 text-right font-mono">NPR {paidReceipt.paidAmount}</td>
                  </tr>
                  <tr className="text-red-700">
                    <td className="p-2.5">Balance Due</td>
                    <td className="p-2.5 text-right font-mono">NPR {paidReceipt.dueAmount}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <div className="flex items-center justify-between">
                <span>Method: <strong>{paidReceipt.paymentMethod}</strong></span>
                <span className="font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 uppercase text-[10px]">
                  {paidReceipt.status}
                </span>
              </div>
              <p className="font-mono text-[11px]">Transaction ID: {paidReceipt.transactionId}</p>
            </div>

            <div className="pt-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100">
              <span>This is a computer-generated official receipt.</span>
              <div className="space-y-1 text-right">
                <div className="w-24 border-b border-dashed border-slate-400 ml-auto"></div>
                <p className="text-slate-600 font-semibold">Accountant Signature</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 no-print pt-2">
              <button
                onClick={() => setPaidReceipt(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
