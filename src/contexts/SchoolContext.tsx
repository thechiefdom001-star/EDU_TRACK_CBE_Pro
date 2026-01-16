import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Student, Teacher, Assessment, Attendance, FeeStructure, 
  FeePayment, PayrollEntry, LibraryBook, TransportRoute, TimetableEntry 
} from '@/types';
import { 
  storageKeys, getFromStorage, saveToStorage, generateId 
} from '@/lib/storage';
import { 
  sampleStudents, sampleTeachers, sampleAssessments, 
  sampleAttendance, sampleFeeStructure, sampleFeePayments 
} from '@/lib/sampleData';

interface SchoolContextType {
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
  
  // Attendance
  attendance: Attendance[];
  addAttendance: (attendance: Omit<Attendance, 'id'>) => void;
  
  // Fee Structure
  feeStructures: FeeStructure[];
  addFeeStructure: (structure: Omit<FeeStructure, 'id'>) => void;
  updateFeeStructure: (id: string, structure: Partial<FeeStructure>) => void;
  
  // Fee Payments
  feePayments: FeePayment[];
  addFeePayment: (payment: Omit<FeePayment, 'id'>) => void;
  
  // Payroll
  payroll: PayrollEntry[];
  addPayrollEntry: (entry: Omit<PayrollEntry, 'id'>) => void;
  
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

export function SchoolProvider({ children }: { children: ReactNode }) {
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
  useEffect(() => { saveToStorage(storageKeys.students, students); }, [students]);
  useEffect(() => { saveToStorage(storageKeys.teachers, teachers); }, [teachers]);
  useEffect(() => { saveToStorage(storageKeys.assessments, assessments); }, [assessments]);
  useEffect(() => { saveToStorage(storageKeys.attendance, attendance); }, [attendance]);
  useEffect(() => { saveToStorage(storageKeys.feeStructure, feeStructures); }, [feeStructures]);
  useEffect(() => { saveToStorage(storageKeys.feePayments, feePayments); }, [feePayments]);
  useEffect(() => { saveToStorage(storageKeys.payroll, payroll); }, [payroll]);
  useEffect(() => { saveToStorage(storageKeys.library, books); }, [books]);
  useEffect(() => { saveToStorage(storageKeys.transport, routes); }, [routes]);
  useEffect(() => { saveToStorage(storageKeys.timetable, timetable); }, [timetable]);

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

  // Attendance
  const addAttendance = (att: Omit<Attendance, 'id'>) => {
    setAttendance(prev => [...prev, { ...att, id: generateId() }]);
  };

  // Fee Structure
  const addFeeStructure = (structure: Omit<FeeStructure, 'id'>) => {
    setFeeStructures(prev => [...prev, { ...structure, id: generateId() }]);
  };
  
  const updateFeeStructure = (id: string, data: Partial<FeeStructure>) => {
    setFeeStructures(prev => prev.map(f => f.id === id ? { ...f, ...data } : f));
  };

  // Fee Payments
  const addFeePayment = (payment: Omit<FeePayment, 'id'>) => {
    setFeePayments(prev => [...prev, { ...payment, id: generateId() }]);
  };

  // Payroll
  const addPayrollEntry = (entry: Omit<PayrollEntry, 'id'>) => {
    setPayroll(prev => [...prev, { ...entry, id: generateId() }]);
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
      students, addStudent, updateStudent, deleteStudent,
      teachers, addTeacher, updateTeacher, deleteTeacher,
      assessments, addAssessment, updateAssessment,
      attendance, addAttendance,
      feeStructures, addFeeStructure, updateFeeStructure,
      feePayments, addFeePayment,
      payroll, addPayrollEntry,
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
