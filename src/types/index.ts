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
export type ExamType = 'opener' | 'midTerm' | 'endTerm';

export interface Assessment {
  id: string;
  studentId: string;
  subject: string;
  term: Term;
  year: number;
  examType: ExamType;
  marks: number; // Raw marks out of 100
  grade: GradeLevel;
  points: number;
  remarks?: string;
  teacherId: string;
  dateRecorded: string;
}

export const EXAM_TYPE_LABELS: Record<ExamType, string> = {
  opener: 'Opener',
  midTerm: 'Mid-Term',
  endTerm: 'End Term',
};

// Grading boundaries for auto-grading (marks to grade)
export interface GradingBoundary {
  minMarks: number;
  maxMarks: number;
  grade: GradeLevel;
}

export const DEFAULT_GRADING_BOUNDARIES: GradingBoundary[] = [
  { minMarks: 90, maxMarks: 100, grade: 'EE1' },
  { minMarks: 80, maxMarks: 89, grade: 'EE2' },
  { minMarks: 70, maxMarks: 79, grade: 'ME1' },
  { minMarks: 60, maxMarks: 69, grade: 'ME2' },
  { minMarks: 50, maxMarks: 59, grade: 'AE1' },
  { minMarks: 40, maxMarks: 49, grade: 'AE2' },
  { minMarks: 25, maxMarks: 39, grade: 'BE1' },
  { minMarks: 0, maxMarks: 24, grade: 'BE2' },
];

// Get grade from marks
export const getGradeFromMarks = (marks: number): GradeLevel => {
  const boundary = DEFAULT_GRADING_BOUNDARIES.find(
    b => marks >= b.minMarks && marks <= b.maxMarks
  );
  return boundary?.grade || 'BE2';
};

// All subjects for selection
export const ALL_SUBJECTS = [
  // Core Subjects
  'English',
  'Kiswahili',
  'Mathematics',
  'Community Service Learning',
  // STEM
  'Biology',
  'Chemistry',
  'Physics',
  'General Science',
  'Agriculture',
  'Computer Studies',
  'Home Science',
  // Social Sciences
  'History and Citizenship',
  'Geography',
  'CRE',
  'IRE',
  'HRE',
  'Accounting',
  'Economics',
  'Commerce',
  'Marketing',
  'Literature in English',
  'Fasihi ya Kiswahili',
  // Arts & Sports
  'Fine Arts',
  'Music and Dance',
  'Theatre and Film',
  'Sports and Recreation',
];

// Attendance Interface
export interface Attendance {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
}

// Fee Item Interface (for managing individual fee types)
export interface FeeItem {
  id: string;
  key: string;
  label: string;
  enabled: boolean;
  description?: string;
}

// Default Fee Items
export const DEFAULT_FEE_ITEMS: Omit<FeeItem, 'id'>[] = [
  { key: 'tuitionFees', label: 'Tuition Fees', enabled: true, description: 'Main academic fees' },
  { key: 'admissionFees', label: 'Admission Fees', enabled: true, description: 'One-time admission charge' },
  { key: 'assessmentFees', label: 'Assessment Fees', enabled: true, description: 'Examination and assessment costs' },
  { key: 'schoolIdFees', label: 'School ID Fees', enabled: true, description: 'Student ID card fee' },
  { key: 'remedialFees', label: 'Remedial Fees', enabled: false, description: 'Extra classes support' },
  { key: 'bookFund', label: 'Book Fund', enabled: true, description: 'Textbooks and learning materials' },
  { key: 'uniformFees', label: 'Uniform Fees', enabled: true, description: 'School uniform costs' },
  { key: 'boardingFees', label: 'Boarding Fees', enabled: false, description: 'For boarding students' },
  { key: 'lunchFees', label: 'Lunch Fees', enabled: true, description: 'Daily lunch program' },
  { key: 'breakfastFees', label: 'Breakfast Fees', enabled: false, description: 'Morning meal program' },
  { key: 'tripFees', label: 'Trip Fees', enabled: true, description: 'Educational trips and excursions' },
  { key: 'diaryFees', label: 'Diary Fees', enabled: true, description: 'Student diary/planner' },
  { key: 'projectFees', label: 'Project Fees', enabled: true, description: 'Project materials and supplies' },
  { key: 'ptaFees', label: 'PTA Fees', enabled: true, description: 'Parent-Teacher Association dues' },
  { key: 'developmentFees', label: 'Development Fees', enabled: true, description: 'School infrastructure development' },
];

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

// School Info Interface
export interface SchoolInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  motto?: string;
  logo?: string;
  county?: string;
  subCounty?: string;
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
