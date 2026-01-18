import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Student, Teacher, Assessment, Attendance, FeeStructure, 
  FeePayment, PayrollEntry, LibraryBook, TransportRoute, TimetableEntry,
  FeeItem, DEFAULT_FEE_ITEMS, SchoolInfo
} from '@/types';
import { 
  storageKeys, getFromStorage, saveToStorage, generateId 
} from '@/lib/storage';
import { 
  sampleStudents, sampleTeachers, sampleAssessments, 
  sampleAttendance, sampleFeeStructure, sampleFeePayments 
} from '@/lib/sampleData';

const DEFAULT_SCHOOL_INFO: SchoolInfo = {
  name: 'EduKenya CBC School',
  address: 'P.O. Box 12345-00100, Nairobi, Kenya',
  phone: '+254 700 123 456',
  email: 'info@edukenyaschool.ac.ke',
  motto: 'Excellence in CBC Education',
  logo: '',
  county: 'Nairobi',
  subCounty: 'Westlands',
};

interface SchoolContextType {
  // School Info
  schoolInfo: SchoolInfo;
  updateSchoolInfo: (info: Partial<SchoolInfo>) => void;
  
  // Students
  students: Student[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  
  // Teachers
  teachers: Teacher[];
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  
  // Assessments
  assessments: Assessment[];
  addAssessment: (assessment: Omit<Assessment, 'id'>) => void;
  updateAssessment: (id: string, assessment: Partial<Assessment>) => void;
  deleteAssessment: (id: string) => void;
  
  // Attendance
  attendance: Attendance[];
  addAttendance: (attendance: Omit<Attendance, 'id'>) => void;
  
  // Fee Items
  feeItems: FeeItem[];
  addFeeItem: (item: Omit<FeeItem, 'id'>) => void;
  updateFeeItem: (id: string, item: Partial<FeeItem>) => void;
  deleteFeeItem: (id: string) => void;
  
  // Fee Structure
  feeStructures: FeeStructure[];
  addFeeStructure: (structure: Omit<FeeStructure, 'id'>) => void;
  updateFeeStructure: (id: string, structure: Partial<FeeStructure>) => void;
  deleteFeeStructure: (id: string) => void;
  
  // Fee Payments
  feePayments: FeePayment[];
  addFeePayment: (payment: Omit<FeePayment, 'id'>) => void;
  deleteFeePayment: (id: string) => void;
  
  // Payroll
  payroll: PayrollEntry[];
  addPayrollEntry: (entry: Omit<PayrollEntry, 'id'>) => void;
  updatePayrollEntry: (id: string, entry: Partial<PayrollEntry>) => void;
  deletePayrollEntry: (id: string) => void;
  
  // Library
  books: LibraryBook[];
  addBook: (book: Omit<LibraryBook, 'id'>) => void;
  
  // Transport
  routes: TransportRoute[];
  addRoute: (route: Omit<TransportRoute, 'id'>) => void;
  
  // Timetable
  timetable: TimetableEntry[];
  addTimetableEntry: (entry: Omit<TimetableEntry, 'id'>) => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

// Initialize fee items with IDs
const initializeFeeItems = (): FeeItem[] => {
  const stored = getFromStorage<FeeItem[]>(storageKeys.feeItems, []);
  if (stored.length > 0) return stored;
  return DEFAULT_FEE_ITEMS.map(item => ({ ...item, id: generateId() }));
};

export function SchoolProvider({ children }: { children: ReactNode }) {
  // School Info
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(() => 
    getFromStorage(storageKeys.schoolInfo, DEFAULT_SCHOOL_INFO)
  );
  
  // Initialize state with localStorage data or sample data
  const [students, setStudents] = useState<Student[]>(() => 
    getFromStorage(storageKeys.students, sampleStudents)
  );
  
  const [teachers, setTeachers] = useState<Teacher[]>(() => 
    getFromStorage(storageKeys.teachers, sampleTeachers)
  );
  
  const [assessments, setAssessments] = useState<Assessment[]>(() => 
    getFromStorage(storageKeys.assessments, sampleAssessments)
  );
  
  const [attendance, setAttendance] = useState<Attendance[]>(() => 
    getFromStorage(storageKeys.attendance, sampleAttendance)
  );
  
  const [feeItems, setFeeItems] = useState<FeeItem[]>(() => initializeFeeItems());
  
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>(() => 
    getFromStorage(storageKeys.feeStructure, sampleFeeStructure)
  );
  
  const [feePayments, setFeePayments] = useState<FeePayment[]>(() => 
    getFromStorage(storageKeys.feePayments, sampleFeePayments)
  );
  
  const [payroll, setPayroll] = useState<PayrollEntry[]>(() => 
    getFromStorage(storageKeys.payroll, [])
  );
  
  const [books, setBooks] = useState<LibraryBook[]>(() => 
    getFromStorage(storageKeys.library, [])
  );
  
  const [routes, setRoutes] = useState<TransportRoute[]>(() => 
    getFromStorage(storageKeys.transport, [])
  );
  
  const [timetable, setTimetable] = useState<TimetableEntry[]>(() => 
    getFromStorage(storageKeys.timetable, [])
  );

  // Save to localStorage whenever data changes
  useEffect(() => { saveToStorage(storageKeys.schoolInfo, schoolInfo); }, [schoolInfo]);
  useEffect(() => { saveToStorage(storageKeys.students, students); }, [students]);
  useEffect(() => { saveToStorage(storageKeys.teachers, teachers); }, [teachers]);
  useEffect(() => { saveToStorage(storageKeys.assessments, assessments); }, [assessments]);
  useEffect(() => { saveToStorage(storageKeys.attendance, attendance); }, [attendance]);
  useEffect(() => { saveToStorage(storageKeys.feeItems, feeItems); }, [feeItems]);
  useEffect(() => { saveToStorage(storageKeys.feeStructure, feeStructures); }, [feeStructures]);
  useEffect(() => { saveToStorage(storageKeys.feePayments, feePayments); }, [feePayments]);
  useEffect(() => { saveToStorage(storageKeys.payroll, payroll); }, [payroll]);
  useEffect(() => { saveToStorage(storageKeys.library, books); }, [books]);
  useEffect(() => { saveToStorage(storageKeys.transport, routes); }, [routes]);
  useEffect(() => { saveToStorage(storageKeys.timetable, timetable); }, [timetable]);

  // School Info
  const updateSchoolInfo = (info: Partial<SchoolInfo>) => {
    setSchoolInfo(prev => ({ ...prev, ...info }));
  };

  // Student CRUD
  const addStudent = (student: Omit<Student, 'id'>) => {
    setStudents(prev => [...prev, { ...student, id: generateId() }]);
  };
  
  const updateStudent = (id: string, data: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  };
  
  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  // Teacher CRUD
  const addTeacher = (teacher: Omit<Teacher, 'id'>) => {
    setTeachers(prev => [...prev, { ...teacher, id: generateId() }]);
  };
  
  const updateTeacher = (id: string, data: Partial<Teacher>) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  };
  
  const deleteTeacher = (id: string) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
  };

  // Assessment CRUD
  const addAssessment = (assessment: Omit<Assessment, 'id'>) => {
    setAssessments(prev => [...prev, { ...assessment, id: generateId() }]);
  };
  
  const updateAssessment = (id: string, data: Partial<Assessment>) => {
    setAssessments(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
  };
  
  const deleteAssessment = (id: string) => {
    setAssessments(prev => prev.filter(a => a.id !== id));
  };

  // Attendance
  const addAttendance = (att: Omit<Attendance, 'id'>) => {
    setAttendance(prev => [...prev, { ...att, id: generateId() }]);
  };

  // Fee Items CRUD
  const addFeeItem = (item: Omit<FeeItem, 'id'>) => {
    setFeeItems(prev => [...prev, { ...item, id: generateId() }]);
  };
  
  const updateFeeItem = (id: string, data: Partial<FeeItem>) => {
    setFeeItems(prev => prev.map(f => f.id === id ? { ...f, ...data } : f));
  };
  
  const deleteFeeItem = (id: string) => {
    setFeeItems(prev => prev.filter(f => f.id !== id));
  };

  // Fee Structure
  const addFeeStructure = (structure: Omit<FeeStructure, 'id'>) => {
    setFeeStructures(prev => [...prev, { ...structure, id: generateId() }]);
  };
  
  const updateFeeStructure = (id: string, data: Partial<FeeStructure>) => {
    setFeeStructures(prev => prev.map(f => f.id === id ? { ...f, ...data } : f));
  };
  
  const deleteFeeStructure = (id: string) => {
    setFeeStructures(prev => prev.filter(f => f.id !== id));
  };

  // Fee Payments
  const addFeePayment = (payment: Omit<FeePayment, 'id'>) => {
    setFeePayments(prev => [...prev, { ...payment, id: generateId() }]);
  };
  
  const deleteFeePayment = (id: string) => {
    setFeePayments(prev => prev.filter(p => p.id !== id));
  };

  // Payroll
  const addPayrollEntry = (entry: Omit<PayrollEntry, 'id'>) => {
    setPayroll(prev => [...prev, { ...entry, id: generateId() }]);
  };
  
  const updatePayrollEntry = (id: string, data: Partial<PayrollEntry>) => {
    setPayroll(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };
  
  const deletePayrollEntry = (id: string) => {
    setPayroll(prev => prev.filter(p => p.id !== id));
  };

  // Library
  const addBook = (book: Omit<LibraryBook, 'id'>) => {
    setBooks(prev => [...prev, { ...book, id: generateId() }]);
  };

  // Transport
  const addRoute = (route: Omit<TransportRoute, 'id'>) => {
    setRoutes(prev => [...prev, { ...route, id: generateId() }]);
  };

  // Timetable
  const addTimetableEntry = (entry: Omit<TimetableEntry, 'id'>) => {
    setTimetable(prev => [...prev, { ...entry, id: generateId() }]);
  };

  return (
    <SchoolContext.Provider value={{
      schoolInfo, updateSchoolInfo,
      students, addStudent, updateStudent, deleteStudent,
      teachers, addTeacher, updateTeacher, deleteTeacher,
      assessments, addAssessment, updateAssessment, deleteAssessment,
      attendance, addAttendance,
      feeItems, addFeeItem, updateFeeItem, deleteFeeItem,
      feeStructures, addFeeStructure, updateFeeStructure, deleteFeeStructure,
      feePayments, addFeePayment, deleteFeePayment,
      payroll, addPayrollEntry, updatePayrollEntry, deletePayrollEntry,
      books, addBook,
      routes, addRoute,
      timetable, addTimetableEntry
    }}>
      {children}
    </SchoolContext.Provider>
  );
}

export function useSchool() {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
}
