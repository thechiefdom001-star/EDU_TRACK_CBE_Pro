import { Student, Teacher, Assessment, Attendance, FeePayment, FeeStructure } from '@/types';
import { generateId, generateReceiptNumber } from './storage';

// Sample Students
export const sampleStudents: Student[] = [
  {
    id: generateId(),
    admissionNumber: 'P24001',
    firstName: 'Amina',
    lastName: 'Wanjiku',
    gender: 'female',
    dateOfBirth: '2016-03-15',
    schoolLevel: 'primary',
    grade: 3,
    stream: 'A',
    guardianName: 'James Wanjiku',
    guardianPhone: '0712345678',
    guardianEmail: 'james.wanjiku@email.com',
    address: 'Nairobi, Westlands',
    enrollmentDate: '2022-01-10',
    status: 'active'
  },
  {
    id: generateId(),
    admissionNumber: 'P24002',
    firstName: 'Brian',
    lastName: 'Ochieng',
    gender: 'male',
    dateOfBirth: '2015-07-22',
    schoolLevel: 'primary',
    grade: 4,
    stream: 'B',
    guardianName: 'Grace Ochieng',
    guardianPhone: '0723456789',
    address: 'Kisumu, Milimani',
    enrollmentDate: '2021-01-08',
    status: 'active'
  },
  {
    id: generateId(),
    admissionNumber: 'J24001',
    firstName: 'Faith',
    lastName: 'Muthoni',
    gender: 'female',
    dateOfBirth: '2012-11-30',
    schoolLevel: 'junior',
    grade: 7,
    stream: 'A',
    guardianName: 'Peter Muthoni',
    guardianPhone: '0734567890',
    address: 'Mombasa, Nyali',
    enrollmentDate: '2020-01-06',
    status: 'active'
  },
  {
    id: generateId(),
    admissionNumber: 'J24002',
    firstName: 'Kevin',
    lastName: 'Kimani',
    gender: 'male',
    dateOfBirth: '2011-05-18',
    schoolLevel: 'junior',
    grade: 8,
    stream: 'A',
    guardianName: 'Mary Kimani',
    guardianPhone: '0745678901',
    address: 'Nakuru, Milimani',
    enrollmentDate: '2019-01-07',
    status: 'active'
  },
  {
    id: generateId(),
    admissionNumber: 'S24001',
    firstName: 'Diana',
    lastName: 'Akinyi',
    gender: 'female',
    dateOfBirth: '2009-02-14',
    schoolLevel: 'senior',
    grade: 10,
    stream: 'A',
    pathway: 'STEM',
    track: 'Pure Sciences',
    electiveSubjects: ['Biology', 'Chemistry', 'Physics'],
    guardianName: 'John Akinyi',
    guardianPhone: '0756789012',
    address: 'Eldoret, Central',
    enrollmentDate: '2018-01-08',
    status: 'active'
  },
  {
    id: generateId(),
    admissionNumber: 'S24002',
    firstName: 'Victor',
    lastName: 'Njoroge',
    gender: 'male',
    dateOfBirth: '2008-09-25',
    schoolLevel: 'senior',
    grade: 11,
    stream: 'B',
    pathway: 'Social Sciences',
    track: 'Business Studies',
    electiveSubjects: ['Accounting', 'Economics', 'Commerce'],
    guardianName: 'Susan Njoroge',
    guardianPhone: '0767890123',
    address: 'Thika, CBD',
    enrollmentDate: '2017-01-09',
    status: 'active'
  },
  {
    id: generateId(),
    admissionNumber: 'S24003',
    firstName: 'Lucy',
    lastName: 'Wambui',
    gender: 'female',
    dateOfBirth: '2007-12-01',
    schoolLevel: 'senior',
    grade: 12,
    stream: 'A',
    pathway: 'Arts and Sports Science',
    track: 'Arts',
    electiveSubjects: ['Fine Arts', 'Music and Dance', 'Theatre and Film'],
    guardianName: 'David Wambui',
    guardianPhone: '0778901234',
    address: 'Naivasha, Lake View',
    enrollmentDate: '2016-01-04',
    status: 'active'
  }
];

// Sample Teachers
export const sampleTeachers: Teacher[] = [
  {
    id: generateId(),
    employeeId: 'T001',
    firstName: 'Sarah',
    lastName: 'Kamau',
    gender: 'female',
    email: 'sarah.kamau@school.ac.ke',
    phone: '0711111111',
    subjects: ['English', 'Literature in English'],
    classes: ['Grade 10A', 'Grade 11A', 'Grade 12A'],
    qualification: 'B.Ed English',
    joinDate: '2018-01-15',
    status: 'active',
    salary: 85000
  },
  {
    id: generateId(),
    employeeId: 'T002',
    firstName: 'Michael',
    lastName: 'Otieno',
    gender: 'male',
    email: 'michael.otieno@school.ac.ke',
    phone: '0722222222',
    subjects: ['Mathematics'],
    classes: ['Grade 7A', 'Grade 8A', 'Grade 9A'],
    qualification: 'B.Sc Mathematics',
    joinDate: '2019-02-01',
    status: 'active',
    salary: 78000
  },
  {
    id: generateId(),
    employeeId: 'T003',
    firstName: 'Grace',
    lastName: 'Njeri',
    gender: 'female',
    email: 'grace.njeri@school.ac.ke',
    phone: '0733333333',
    subjects: ['Biology', 'Chemistry'],
    classes: ['Grade 10B', 'Grade 11B'],
    qualification: 'B.Sc Biological Sciences',
    joinDate: '2017-09-01',
    status: 'active',
    salary: 82000
  },
  {
    id: generateId(),
    employeeId: 'T004',
    firstName: 'Joseph',
    lastName: 'Kiprop',
    gender: 'male',
    email: 'joseph.kiprop@school.ac.ke',
    phone: '0744444444',
    subjects: ['Kiswahili', 'Fasihi ya Kiswahili'],
    classes: ['Grade 6A', 'Grade 6B', 'Grade 7A'],
    qualification: 'B.A Kiswahili',
    joinDate: '2020-01-06',
    status: 'active',
    salary: 72000
  }
];

// Sample Assessments
export const sampleAssessments: Assessment[] = [
  {
    id: generateId(),
    studentId: sampleStudents[4].id,
    subject: 'Biology',
    term: 1,
    year: 2024,
    examType: 'endTerm',
    marks: 92,
    grade: 'EE1',
    points: 8,
    remarks: 'Excellent performance',
    teacherId: sampleTeachers[2].id,
    dateRecorded: '2024-03-15'
  },
  {
    id: generateId(),
    studentId: sampleStudents[4].id,
    subject: 'Chemistry',
    term: 1,
    year: 2024,
    examType: 'opener',
    marks: 72,
    grade: 'ME1',
    points: 6,
    remarks: 'Good understanding of concepts',
    teacherId: sampleTeachers[2].id,
    dateRecorded: '2024-03-15'
  },
  {
    id: generateId(),
    studentId: sampleStudents[5].id,
    subject: 'Accounting',
    term: 1,
    year: 2024,
    examType: 'endTerm',
    marks: 85,
    grade: 'EE2',
    points: 7,
    remarks: 'Very good performance',
    teacherId: sampleTeachers[0].id,
    dateRecorded: '2024-03-16'
  }
];

// Sample Attendance
export const sampleAttendance: Attendance[] = [
  {
    id: generateId(),
    studentId: sampleStudents[0].id,
    date: '2024-01-15',
    status: 'present'
  },
  {
    id: generateId(),
    studentId: sampleStudents[1].id,
    date: '2024-01-15',
    status: 'present'
  },
  {
    id: generateId(),
    studentId: sampleStudents[2].id,
    date: '2024-01-15',
    status: 'late',
    remarks: 'Traffic delay'
  }
];

// Sample Fee Structure
export const sampleFeeStructure: FeeStructure[] = [
  {
    id: generateId(),
    term: 1,
    year: 2024,
    schoolLevel: 'primary',
    tuitionFees: 25000,
    admissionFees: 5000,
    assessmentFees: 2000,
    schoolIdFees: 500,
    remedialFees: 1500,
    bookFund: 3000,
    uniformFees: 4500,
    boardingFees: 0,
    lunchFees: 8000,
    breakfastFees: 4000,
    tripFees: 2000,
    diaryFees: 300,
    projectFees: 1000,
    ptaFees: 500,
    developmentFees: 2000
  },
  {
    id: generateId(),
    term: 1,
    year: 2024,
    schoolLevel: 'junior',
    tuitionFees: 35000,
    admissionFees: 7000,
    assessmentFees: 3000,
    schoolIdFees: 500,
    remedialFees: 2000,
    bookFund: 4000,
    uniformFees: 5000,
    boardingFees: 0,
    lunchFees: 10000,
    breakfastFees: 5000,
    tripFees: 3000,
    diaryFees: 400,
    projectFees: 2000,
    ptaFees: 700,
    developmentFees: 3000
  },
  {
    id: generateId(),
    term: 1,
    year: 2024,
    schoolLevel: 'senior',
    tuitionFees: 50000,
    admissionFees: 10000,
    assessmentFees: 5000,
    schoolIdFees: 600,
    remedialFees: 3000,
    bookFund: 6000,
    uniformFees: 6000,
    boardingFees: 25000,
    lunchFees: 12000,
    breakfastFees: 6000,
    tripFees: 5000,
    diaryFees: 500,
    projectFees: 4000,
    ptaFees: 1000,
    developmentFees: 5000
  }
];

// Sample Fee Payments
export const sampleFeePayments: FeePayment[] = [
  {
    id: generateId(),
    receiptNumber: generateReceiptNumber(),
    studentId: sampleStudents[0].id,
    amount: 35000,
    paymentDate: '2024-01-05',
    paymentMethod: 'mpesa',
    term: 1,
    year: 2024,
    description: 'Tuition and lunch fees',
    receivedBy: 'Admin'
  },
  {
    id: generateId(),
    receiptNumber: generateReceiptNumber(),
    studentId: sampleStudents[4].id,
    amount: 75000,
    paymentDate: '2024-01-08',
    paymentMethod: 'bank_transfer',
    term: 1,
    year: 2024,
    description: 'Full term payment',
    receivedBy: 'Bursar'
  }
];
