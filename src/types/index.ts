export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' | 'ACCOUNTANT' | 'EDITOR';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface SchoolSettings {
  id?: string;
  schoolName: string;
  tagline: string;
  establishedYear: string;
  affiliation: string;
  address: string;
  district: string;
  province: string;
  phone: string;
  altPhone: string;
  email: string;
  officeHours: string;
  logoUrl: string;
  announcementBar: string;
  announcementActive: boolean;
  heroHeadline: string;
  heroSubheadline: string;
  heroImage: string;
  principalName: string;
  principalDesignation: string;
  principalMessage: string;
  principalPhoto: string;
  chairmanName: string;
  chairmanMessage: string;
  chairmanPhoto: string;
  history: string;
  vision: string;
  mission: string;
  coreValues: string[];
  whyChooseUs: Array<{ title: string; desc: string; icon: string }>;
  stats: Array<{ label: string; value: string; suffix?: string }>;
  facebookUrl: string;
  youtubeUrl: string;
  updatedAt?: string;
}

export interface Notice {
  id: string;
  title: string;
  category: 'Examination' | 'Admission' | 'Holiday' | 'General' | 'Urgent';
  description: string;
  publishedDate: string;
  isFeatured: boolean;
  status: 'published' | 'draft' | 'archived';
  attachmentUrl?: string;
  createdAt: string;
}

export interface News {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  author: string;
  category: string;
  imageUrl: string;
  publishedDate: string;
  status: 'published' | 'draft';
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  eventDate: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  location: string;
  organizer: string;
  imageUrl: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Teacher {
  id: string;
  name: string;
  designation: string;
  department: string;
  subject: string;
  qualification: string;
  experience: string;
  bio: string;
  email: string;
  phone: string;
  photo: string;
  status: 'active' | 'inactive';
  order: number;
}

export interface AcademicProgram {
  id: string;
  name: string;
  slug: string;
  level: string;
  classes: string;
  description: string;
  curriculum: string;
  features: string[];
  imageUrl: string;
  order: number;
  status: 'active' | 'inactive';
}

export interface AdmissionApplication {
  id: string;
  applicationId: string; // e.g. IEBS-2026-0042
  studentName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  applyingClass: string;
  previousSchool: string;
  parentName: string;
  relation: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  adminRemarks?: string;
  submittedAt: string;
}

export interface Student {
  id: string;
  studentId: string; // e.g. IEBS-STU-102
  admissionNo: string;
  fullName: string;
  className: string;
  section: string;
  rollNumber: number;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  address: string;
  bloodGroup: string;
  photoUrl: string;
  status: 'active' | 'graduated' | 'transferred';
  accessPin: string; // 4-digit PIN for simple student/parent verification
}

export interface SubjectScore {
  name: string;
  fullMarks: number;
  passMarks: number;
  theoryMarks: number;
  practicalMarks: number;
  totalMarks: number;
  grade: string;
  gradePoint: number;
  remarks?: string;
}

export interface ExamResult {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  section: string;
  rollNumber: number;
  term: 'First Terminal Examination' | 'Second Terminal Examination' | 'Final Examination';
  academicYear: string; // e.g. "2082 BS (2025/2026)"
  subjects: SubjectScore[];
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  gpa: string;
  letterGrade: string;
  rank: string;
  attendance: string;
  remarks: string;
  publishedDate: string;
}

export interface FeeRecord {
  id: string;
  invoiceNo: string;
  studentId: string;
  studentName: string;
  className: string;
  month: string;
  academicYear: string;
  tuitionFee: number;
  examFee: number;
  computerFee: number;
  transportFee: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: 'paid' | 'partial' | 'unpaid';
  paymentMethod?: 'eSewa' | 'Khalti' | 'ConnectIPS' | 'Bank Transfer' | 'Cash at Counter';
  transactionId?: string;
  paymentDate?: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  slug: string;
  category: string;
  coverImage: string;
  eventDate: string;
  description: string;
  images: Array<{ url: string; caption: string }>;
  status: 'published' | 'draft';
}

export interface Achievement {
  id: string;
  title: string;
  studentName?: string;
  className?: string;
  category: 'Academic' | 'Sports' | 'Science & Tech' | 'Cultural' | 'Olympiad' | 'Institutional';
  description: string;
  imageUrl: string;
  year: string;
}

export interface Facility {
  id: string;
  name: string;
  icon: string;
  description: string;
  imageUrl: string;
  features: string[];
  order: number;
}

export interface DocumentDownload {
  id: string;
  title: string;
  category: 'Prospectus' | 'Academic Calendar' | 'Exam Routine' | 'Syllabus' | 'Admission Form' | 'School Policies';
  fileSize: string;
  fileUrl: string;
  publishedDate: string;
  downloadCount: number;
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
}
