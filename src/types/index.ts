// School Management System Types for Kenya CBC Curriculum

export type SchoolLevel = 'primary' | 'junior' | 'senior';
export type Term = 1 | 2 | 3;
export type Gender = 'male' | 'female';

// CBC Assessment Grading
export type GradeLevel = 'EE1' | 'EE2' | 'ME1' | 'ME2' | 'AE1' | 'AE2' | 'BE1' | 'BE2';

export const GRADE_POINTS: Record<GradeLevel, number> = {
  EE1: 8, EE2: 7,
  ME1: 6, ME2: 5,
  AE1: 4, AE2: 3,
  BE1: 2, BE2: 1
};

export const GRADE_LABELS: Record<GradeLevel, string> = {
  EE1: 'Exceeding Expectation 1',
  EE2: 'Exceeding Expectation 2',
  ME1: 'Meeting Expectation 1',
  ME2: 'Meeting Expectation 2',
  AE1: 'Approaching Expectation 1',
  AE2: 'Approaching Expectation 2',
  BE1: 'Below Expectation 1',
  BE2: 'Below Expectation 2'
};

// Senior School Pathways
export type SeniorPathway = 'STEM' | 'Social Sciences' | 'Arts and Sports Science';
export type STEMTrack = 'Pure Sciences' | 'Applied Sciences' | 'Technical & Engineering' | 'Career Technology';
export type SocialSciencesTrack = 'Humanities' | 'Business Studies' | 'Languages & Literature';
export type ArtsSportsTrack = 'Arts' | 'Sports Science';

export const CORE_SUBJECTS = [
  'English',
  'Kiswahili',
  'Mathematics',
  'Community Service Learning'
];

export const STEM_SUBJECTS = {
  'Pure Sciences': ['Biology', 'Chemistry', 'Physics', 'General Science'],
  'Applied Sciences': ['Agriculture', 'Computer Studies', 'Home Science'],
  'Technical & Engineering': ['Aviation', 'Building Construction', 'Electricity', 'Metalwork', 'Power Mechanics', 'Woodwork'],
  'Career Technology': ['Media Technology', 'Marine and Fisheries Technology']
};

export const SOCIAL_SCIENCES_SUBJECTS = {
  'Humanities': ['History and Citizenship', 'Geography', 'CRE', 'IRE', 'HRE'],
  'Business Studies': ['Accounting', 'Economics', 'Commerce', 'Marketing'],
  'Languages & Literature': ['Literature in English', 'Fasihi ya Kiswahili', 'Sign Language', 'French', 'German', 'Arabic', 'Mandarin Chinese']
};

export const ARTS_SPORTS_SUBJECTS = {
  'Arts': ['Fine Arts', 'Music and Dance', 'Theatre and Film', 'Applied Art', 'Time-Based Media'],
  'Sports Science': ['Sports and Recreation', 'Human Physiology', 'Anatomy', 'Nutrition']
};

// Student Interface
export interface Student {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: string;
  schoolLevel: SchoolLevel;
  grade: number;
  stream?: string;
  pathway?: SeniorPathway;
  track?: string;
  electiveSubjects?: string[];
  guardianName: string;
  guardianPhone: string;
  guardianEmail?: string;
  address: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  photoUrl?: string;
}

// Teacher Interface
export interface Teacher {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  email: string;
  phone: string;
  subjects: string[];
  classes: string[];
  qualification: string;
  joinDate: string;
  status: 'active' | 'on_leave' | 'resigned';
  salary: number;
}

// Assessment/Grade Interface
export type ExamType = 'cat1' | 'cat2' | 'endTerm';

export interface Assessment {
  id: string;
  studentId: string;
  subject: string;
  term: Term;
  year: number;
  examType: ExamType;
  grade: GradeLevel;
  points: number;
  remarks?: string;
  teacherId: string;
  dateRecorded: string;
}

export const EXAM_TYPE_LABELS: Record<ExamType, string> = {
  cat1: 'CAT 1',
  cat2: 'CAT 2',
  endTerm: 'End Term',
};

// Attendance Interface
export interface Attendance {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
}

// Fee Structure Interface
export interface FeeStructure {
  id: string;
  term: Term;
  year: number;
  schoolLevel: SchoolLevel;
  tuitionFees: number;
  admissionFees: number;
  assessmentFees: number;
  schoolIdFees: number;
  remedialFees: number;
  bookFund: number;
  uniformFees: number;
  boardingFees: number;
  lunchFees: number;
  breakfastFees: number;
  tripFees: number;
  diaryFees: number;
  projectFees: number;
  ptaFees: number;
  developmentFees: number;
}

// Fee Payment Interface
export interface FeePayment {
  id: string;
  receiptNumber: string;
  studentId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'mpesa' | 'bank_transfer' | 'cheque';
  term: Term;
  year: number;
  description: string;
  receivedBy: string;
}

// Payroll Interface
export interface PayrollEntry {
  id: string;
  teacherId: string;
  month: number;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'pending' | 'paid';
  paymentDate?: string;
}

// Library Interface
export interface LibraryBook {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: string;
  copies: number;
  availableCopies: number;
}

export interface BookBorrowing {
  id: string;
  bookId: string;
  studentId: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'borrowed' | 'returned' | 'overdue';
}

// Transport Interface
export interface TransportRoute {
  id: string;
  routeName: string;
  driver: string;
  vehicleNumber: string;
  capacity: number;
  fee: number;
  stops: string[];
}

// Timetable Interface
export interface TimetableEntry {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startTime: string;
  endTime: string;
  subject: string;
  teacherId: string;
  classId: string;
  room?: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalRevenue: number;
  pendingFees: number;
  attendanceRate: number;
  averageGrade: number;
}
