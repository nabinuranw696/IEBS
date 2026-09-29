import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { AdmissionApplication } from '../types';
import { DataService } from '../services/dataService';
import {
  Sparkles,
  FileCheck2,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  User,
  Users,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  FileText,
  Search,
} from 'lucide-react';

interface AdmissionsPageProps {
  isApplyMode?: boolean;
}

export const AdmissionsPage: React.FC<AdmissionsPageProps> = ({ isApplyMode = false }) => {
  const { path, navigate } = useRouter();
  const isApply = isApplyMode || path === '/admissions/apply';

  // Application Form State
  const [formData, setFormData] = useState({
    studentName: '',
    dob: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    applyingClass: 'Grade 1',
    previousSchool: '',
    parentName: '',
    relation: 'Father',
    parentPhone: '',
    parentEmail: '',
    address: 'Inaruwa, Sunsari',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<AdmissionApplication | null>(null);

  // Status check state
  const [searchAppId, setSearchAppId] = useState('');
  const [trackedApp, setTrackedApp] = useState<AdmissionApplication | null>(null);
  const [trackError, setTrackError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName || !formData.parentName || !formData.parentPhone) {
      alert('Please fill all mandatory fields (Student Name, Parent Name, and Contact Number).');
      return;
    }

    setIsSubmitting(true);
    try {
      const app = await DataService.submitAdmission({
        ...formData,
      });
      setSubmittedApp(app);
    } catch (err) {
      console.error(err);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError('');
    setTrackedApp(null);
    if (!searchAppId.trim()) return;

    const all = await DataService.getAdmissions();
    const clean = searchAppId.trim().toUpperCase();
    const found = all.find(
      (a) =>
        a.applicationId.toUpperCase() === clean ||
        a.parentPhone.replace(/\D/g, '') === clean.replace(/\D/g, '')
    );

    if (found) {
      setTrackedApp(found);
    } else {
      setTrackError('No application found with ID or Phone: ' + searchAppId);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-14 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Academic Year 2082/2083 BS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-crest">
            {isApply ? 'Online Admission Application' : 'Admissions at IEBS Inaruwa'}
          </h1>
          <p className="text-slate-300 max-w-2xl text-sm sm:text-base">
            Join the premier English boarding community in Sunsari. Transparent criteria, scholarship programs, and seamless digital registration.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex border-b border-slate-200 gap-4">
          <button
            onClick={() => navigate('/admissions')}
            className={`py-3 px-4 font-semibold text-sm border-b-2 transition-colors ${
              !isApply
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Admission Guidelines & Eligibility
          </button>
          <button
            onClick={() => navigate('/admissions/apply')}
            className={`py-3 px-4 font-semibold text-sm border-b-2 transition-colors ${
              isApply
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Apply Online (Application Form)
          </button>
        </div>
      </div>

      {isApply ? (
        /* =================== ONLINE APPLICATION FORM =================== */
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {submittedApp ? (
            /* Success confirmation card */
            <div className="bg-white rounded-3xl border border-emerald-200 p-8 sm:p-12 shadow-xl text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                  Application Successfully Registered
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-crest">
                  Welcome, {submittedApp.studentName}!
                </h2>
                <p className="text-sm text-slate-600">
                  Your admission form for <strong>{submittedApp.applyingClass}</strong> has been received by the Admissions Section.
                </p>
              </div>

              {/* Application Details Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Application Tracking ID</span>
                  <span className="text-base font-extrabold text-emerald-800 font-mono tracking-wider">
                    {submittedApp.applicationId}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">Class Applied:</span>
                    <p className="font-semibold text-slate-800">{submittedApp.applyingClass}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Parent/Guardian:</span>
                    <p className="font-semibold text-slate-800">{submittedApp.parentName} ({submittedApp.relation})</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Contact Number:</span>
                    <p className="font-semibold text-slate-800">{submittedApp.parentPhone}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Current Status:</span>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded font-bold text-[10px] uppercase bg-amber-100 text-amber-800">
                      {submittedApp.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 text-left space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <span>Next Step: Entrance Assessment</span>
                </p>
                <p>
                  Please visit the school administrative office in Inaruwa on any upcoming Saturday between 10:00 AM and 2:00 PM along with your child, 2 passport-size photographs, and a copy of the previous marksheet.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-colors"
                >
                  Print Admission Slip
                </button>
                <button
                  onClick={() => {
                    setSubmittedApp(null);
                    setFormData({
                      studentName: '',
                      dob: '',
                      gender: 'Male',
                      applyingClass: 'Grade 1',
                      previousSchool: '',
                      parentName: '',
                      relation: 'Father',
                      parentPhone: '',
                      parentEmail: '',
                      address: 'Inaruwa, Sunsari',
                    });
                  }}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors"
                >
                  Submit Another Application
                </button>
              </div>
            </div>
          ) : (
            /* Multi-field Form */
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-900 font-crest">
                  Online Admission Registration Form
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Please provide accurate student and guardian details. All official notifications will be sent via SMS/Phone.
                </p>
              </div>

              {/* Section 1: Student Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                  <User className="w-4 h-4" />
                  <span>Student Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700">
                      Full Student Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aarush Yadav"
                      value={formData.studentName}
                      onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white transition-all text-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Date of Birth (BS / AD)</label>
                    <input
                      type="text"
                      placeholder="e.g. 2073-05-18 or 2016-09-02"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white transition-all text-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white transition-all text-slate-900"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Class Applying For</label>
                    <select
                      value={formData.applyingClass}
                      onChange={(e) => setFormData({ ...formData, applyingClass: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white transition-all text-slate-900"
                    >
                      <option value="Playgroup / Nursery">Playgroup / Nursery</option>
                      <option value="LKG">LKG</option>
                      <option value="UKG">UKG</option>
                      <option value="Grade 1">Grade 1</option>
                      <option value="Grade 2">Grade 2</option>
                      <option value="Grade 3">Grade 3</option>
                      <option value="Grade 4">Grade 4</option>
                      <option value="Grade 5">Grade 5</option>
                      <option value="Grade 6">Grade 6</option>
                      <option value="Grade 7">Grade 7</option>
                      <option value="Grade 8 (BLE)">Grade 8 (BLE)</option>
                      <option value="Grade 9">Grade 9</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Previous School Attended</label>
                    <input
                      type="text"
                      placeholder="e.g. Little Angels Academy, Inaruwa"
                      value={formData.previousSchool}
                      onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white transition-all text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Parent / Guardian Information */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                  <Users className="w-4 h-4" />
                  <span>Parent / Guardian Information</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      Parent / Guardian Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Manoj Yadav"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white transition-all text-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Relationship to Student</label>
                    <select
                      value={formData.relation}
                      onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white transition-all text-slate-900"
                    >
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Local Guardian">Local Guardian</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      Mobile / WhatsApp Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9842012345"
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white transition-all text-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. manoj.y@gmail.com"
                      value={formData.parentEmail}
                      onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white transition-all text-slate-900"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700">Residential Address</label>
                    <input
                      type="text"
                      placeholder="e.g. Ward No. 3, Main Chowk, Inaruwa, Sunsari"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white transition-all text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-sm uppercase tracking-wider hover:from-emerald-700 hover:to-teal-800 transition-all shadow-lg shadow-emerald-950/20 disabled:opacity-50"
                >
                  {isSubmitting ? 'Registering Application...' : 'Submit Admission Application'}
                </button>
              </div>
            </form>
          )}

          {/* Status Tracker Box */}
          <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Search className="w-4 h-4 text-emerald-600" />
              <span>Already Applied? Track Application Status</span>
            </div>

            <form onSubmit={handleTrack} className="flex gap-2">
              <input
                type="text"
                value={searchAppId}
                onChange={(e) => setSearchAppId(e.target.value)}
                placeholder="Enter Application ID (e.g. IEBS-ADM-2082-...) or Phone No"
                className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 text-slate-900"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800"
              >
                Track Status
              </button>
            </form>

            {trackError && <p className="text-xs text-red-500">{trackError}</p>}

            {trackedApp && (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{trackedApp.studentName} ({trackedApp.applyingClass})</span>
                  <span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] bg-emerald-200 text-emerald-800">
                    {trackedApp.status}
                  </span>
                </div>
                <p className="text-slate-600">ID: {trackedApp.applicationId} • Submitted: {new Date(trackedApp.submittedAt).toLocaleDateString()}</p>
                {trackedApp.adminRemarks && (
                  <p className="text-emerald-900 bg-white p-2 rounded border border-emerald-100 font-medium">
                    Remarks: {trackedApp.adminRemarks}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* =================== ADMISSION GUIDELINES =================== */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-crest">
                  Admission Policy & Enrollment Guidelines 2082
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  Inaruwa English Boarding School welcomes inquiries from students and guardians from all backgrounds. We assess children on foundational aptitude, willingness to learn, and parental support.
                </p>
              </div>

              {/* Step by step process */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 font-crest">4-Step Enrollment Procedure</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0">
                      1
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-900">Online or Counter Application</h4>
                      <p className="text-xs text-slate-600">
                        Fill the online admission form on this website or obtain the printed prospectus kit from the school administration in Inaruwa.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <span className="w-8 h-8 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center shrink-0">
                      2
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-900">Entrance Assessment & Interview</h4>
                      <p className="text-xs text-slate-600">
                        Applicants appear for an informal evaluation (Nursery/KG) or written diagnostic assessment in English, Math, and Science (Grades 1-9) held every Saturday.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
                      3
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-900">Result & Parent Orientation</h4>
                      <p className="text-xs text-slate-600">
                        Results are communicated within 48 hours via SMS. Parents participate in a brief meeting with the Principal to discuss academic expectations.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <span className="w-8 h-8 rounded-xl bg-amber-600 text-white font-bold flex items-center justify-center shrink-0">
                      4
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-900">Fee Deposit & Final Enrollment</h4>
                      <p className="text-xs text-slate-600">
                        Complete admission fee formalities through online payment (eSewa/Khalti) or at the counter, collect booklists, uniforms, and student ID.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Required Documents */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3">
                <h3 className="text-base font-bold text-slate-900 font-crest">Mandatory Documents Required</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Copy of Birth Registration Certificate (Wada Sifaris)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Previous school Marksheet & Character Certificate</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Transfer Certificate (TC) for Grades 2 upwards</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>3 Passport-size photographs of the student</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Quick Info Card */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                <h3 className="text-xl font-bold font-crest">Admission Helpline</h3>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  Have questions about age criteria, bus routes, or fee subsidies? Contact our Admissions Office directly.
                </p>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>+977 25-560123 / 9852012345</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>admissions@inaruwaebs.edu.np</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>Sun - Fri: 9:00 AM – 4:30 PM</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/admissions/apply')}
                  className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs uppercase tracking-wider transition-colors shadow"
                >
                  Start Online Application
                </button>
              </div>

              {/* Scholarships */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm">
                <h4 className="text-sm font-bold text-slate-900 font-crest">Scholarships & Concessions</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Special tuition waivers available for students securing SEE Grade 10 distinctions, district athletic medalists, and underprivileged wards of Sunsari.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
