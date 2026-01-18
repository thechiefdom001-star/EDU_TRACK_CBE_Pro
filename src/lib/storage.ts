// Local Storage Utility for School Management System

const STORAGE_PREFIX = 'sms_kenya_';

export const storageKeys = {
  students: `${STORAGE_PREFIX}students`,
  teachers: `${STORAGE_PREFIX}teachers`,
  assessments: `${STORAGE_PREFIX}assessments`,
  attendance: `${STORAGE_PREFIX}attendance`,
  feeStructure: `${STORAGE_PREFIX}fee_structure`,
  feePayments: `${STORAGE_PREFIX}fee_payments`,
  feeItems: `${STORAGE_PREFIX}fee_items`,
  schoolInfo: `${STORAGE_PREFIX}school_info`,
  payroll: `${STORAGE_PREFIX}payroll`,
  library: `${STORAGE_PREFIX}library`,
  borrowings: `${STORAGE_PREFIX}borrowings`,
  transport: `${STORAGE_PREFIX}transport`,
  timetable: `${STORAGE_PREFIX}timetable`,
  settings: `${STORAGE_PREFIX}settings`,
};

export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateReceiptNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `RCT-${year}${month}-${random}`;
}

export function generateAdmissionNumber(level: string): string {
  const prefix = level === 'primary' ? 'P' : level === 'junior' ? 'J' : 'S';
  const year = new Date().getFullYear().toString().slice(-2);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${year}${random}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

// Calculate total fees for a fee structure
export function calculateTotalFees(structure: Record<string, number>): number {
  return Object.values(structure).reduce((sum, fee) => sum + (fee || 0), 0);
}
