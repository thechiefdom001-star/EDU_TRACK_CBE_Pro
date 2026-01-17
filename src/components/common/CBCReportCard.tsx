import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Student, Assessment, GRADE_POINTS, GRADE_LABELS, GradeLevel, Term } from '@/types';
import { GradeBadge } from './GradeBadge';
import { Printer, Download, GraduationCap } from 'lucide-react';
import { formatDate } from '@/lib/storage';

interface CBCReportCardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
  assessments: Assessment[];
  term?: Term;
  year?: number;
}

const CORE_SUBJECTS = ['English', 'Kiswahili', 'Mathematics', 'Community Service Learning'];

export function CBCReportCard({ 
  open, 
  onOpenChange, 
  student, 
  assessments,
  term = 1,
  year = new Date().getFullYear()
}: CBCReportCardProps) {
  if (!student) return null;

  // Filter assessments for this student, term, and year
  const studentAssessments = assessments.filter(
    a => a.studentId === student.id && a.term === term && a.year === year
  );

  // Group by subject and exam type
  const subjectGrades: Record<string, { cat1?: Assessment; cat2?: Assessment; endTerm?: Assessment }> = {};
  
  studentAssessments.forEach(assessment => {
    const examType = assessment.examType || 'endTerm';
    if (!subjectGrades[assessment.subject]) {
      subjectGrades[assessment.subject] = {};
    }
    subjectGrades[assessment.subject][examType as 'cat1' | 'cat2' | 'endTerm'] = assessment;
  });

  // Calculate averages
  const calculateAverage = (grades: { cat1?: Assessment; cat2?: Assessment; endTerm?: Assessment }) => {
    const points: number[] = [];
    if (grades.cat1) points.push(grades.cat1.points);
    if (grades.cat2) points.push(grades.cat2.points);
    if (grades.endTerm) points.push(grades.endTerm.points);
    return points.length > 0 ? (points.reduce((a, b) => a + b, 0) / points.length).toFixed(1) : '-';
  };

  const getAverageGrade = (avg: string): GradeLevel | null => {
    const num = parseFloat(avg);
    if (isNaN(num)) return null;
    if (num >= 7.5) return 'EE1';
    if (num >= 6.5) return 'EE2';
    if (num >= 5.5) return 'ME1';
    if (num >= 4.5) return 'ME2';
    if (num >= 3.5) return 'AE1';
    if (num >= 2.5) return 'AE2';
    if (num >= 1.5) return 'BE1';
    return 'BE2';
  };

  // Overall performance
  const allPoints = studentAssessments.map(a => a.points);
  const overallAverage = allPoints.length > 0 
    ? (allPoints.reduce((a, b) => a + b, 0) / allPoints.length).toFixed(2)
    : 'N/A';
  const overallGrade = getAverageGrade(overallAverage);

  const handlePrint = () => {
    const printContent = document.getElementById('cbc-report-card');
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>CBC Report Card - ${student.firstName} ${student.lastName}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', sans-serif; padding: 20px; font-size: 11px; }
            .report-header { text-align: center; border-bottom: 3px double #333; padding-bottom: 15px; margin-bottom: 15px; }
            .school-name { font-size: 22px; font-weight: bold; }
            .school-motto { font-style: italic; color: #666; margin: 5px 0; }
            .report-title { font-size: 16px; font-weight: bold; background: #1a1a1a; color: white; padding: 8px; margin: 15px 0; text-align: center; }
            .student-info { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; padding: 10px; background: #f5f5f5; }
            .info-item { display: flex; gap: 8px; }
            .info-label { font-weight: bold; min-width: 80px; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th, td { border: 1px solid #333; padding: 6px 8px; text-align: center; }
            th { background: #e8e8e8; font-weight: bold; text-transform: uppercase; font-size: 10px; }
            .subject-cell { text-align: left; font-weight: 500; }
            .grade-legend { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 15px 0; font-size: 10px; }
            .grade-item { padding: 5px; border: 1px solid #ddd; }
            .summary-box { background: #f0f0f0; padding: 15px; margin: 15px 0; }
            .summary-row { display: flex; justify-content: space-between; margin: 5px 0; }
            .signatures { display: flex; justify-content: space-between; margin-top: 40px; }
            .signature-block { text-align: center; }
            .signature-line { width: 180px; border-top: 1px solid #333; margin-top: 40px; padding-top: 5px; }
            .remarks { margin: 15px 0; padding: 10px; border: 1px solid #ddd; min-height: 60px; }
            @media print { body { padding: 10px; } }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 250);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            CBC Progress Report Card
          </DialogTitle>
        </DialogHeader>

        <div id="cbc-report-card" className="bg-white p-6 space-y-4">
          {/* Header */}
          <div className="text-center border-b-4 border-double border-foreground pb-4">
            <h1 className="text-2xl font-bold">EduKenya CBC School</h1>
            <p className="text-sm text-muted-foreground italic">"Excellence in CBC Education"</p>
            <p className="text-xs text-muted-foreground mt-1">
              P.O. Box 12345-00100, Nairobi | Tel: +254 700 123 456 | Email: info@edukenyaschool.ac.ke
            </p>
          </div>

          {/* Title */}
          <div className="bg-primary text-primary-foreground py-2 px-4 text-center font-bold uppercase tracking-wide">
            Competency Based Curriculum (CBC) Progress Report - Term {term}, {year}
          </div>

          {/* Student Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="space-y-2">
              <p><span className="font-semibold">Name:</span> {student.firstName} {student.lastName}</p>
              <p><span className="font-semibold">Admission No:</span> {student.admissionNumber}</p>
              <p><span className="font-semibold">Grade:</span> {student.grade}{student.stream}</p>
            </div>
            <div className="space-y-2">
              <p><span className="font-semibold">School Level:</span> <span className="capitalize">{student.schoolLevel}</span></p>
              {student.pathway && <p><span className="font-semibold">Pathway:</span> {student.pathway}</p>}
              <p><span className="font-semibold">Date:</span> {formatDate(new Date())}</p>
            </div>
          </div>

          {/* Grades Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Subject</th>
                  <th className="border p-2 text-center">CAT 1</th>
                  <th className="border p-2 text-center">CAT 2</th>
                  <th className="border p-2 text-center">End Term</th>
                  <th className="border p-2 text-center">Average</th>
                  <th className="border p-2 text-center">Grade</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(subjectGrades).length > 0 ? (
                  Object.entries(subjectGrades).map(([subject, grades]) => {
                    const avg = calculateAverage(grades);
                    const avgGrade = getAverageGrade(avg);
                    return (
                      <tr key={subject}>
                        <td className="border p-2 font-medium">{subject}</td>
                        <td className="border p-2 text-center">
                          {grades.cat1 ? <GradeBadge grade={grades.cat1.grade} showPoints /> : '-'}
                        </td>
                        <td className="border p-2 text-center">
                          {grades.cat2 ? <GradeBadge grade={grades.cat2.grade} showPoints /> : '-'}
                        </td>
                        <td className="border p-2 text-center">
                          {grades.endTerm ? <GradeBadge grade={grades.endTerm.grade} showPoints /> : '-'}
                        </td>
                        <td className="border p-2 text-center font-semibold">{avg}</td>
                        <td className="border p-2 text-center">
                          {avgGrade && <GradeBadge grade={avgGrade} />}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="border p-4 text-center text-muted-foreground">
                      No assessments recorded for this term
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Grade Legend */}
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div className="p-2 bg-success/10 border border-success/30 rounded">
              <p className="font-semibold text-success">Exceeding Expectation</p>
              <p>EE1 (8pts) | EE2 (7pts)</p>
            </div>
            <div className="p-2 bg-info/10 border border-info/30 rounded">
              <p className="font-semibold text-info">Meeting Expectation</p>
              <p>ME1 (6pts) | ME2 (5pts)</p>
            </div>
            <div className="p-2 bg-warning/10 border border-warning/30 rounded">
              <p className="font-semibold text-warning">Approaching Expectation</p>
              <p>AE1 (4pts) | AE2 (3pts)</p>
            </div>
            <div className="p-2 bg-destructive/10 border border-destructive/30 rounded">
              <p className="font-semibold text-destructive">Below Expectation</p>
              <p>BE1 (2pts) | BE2 (1pt)</p>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <h3 className="font-bold">Overall Performance Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Subjects</p>
                <p className="text-xl font-bold">{Object.keys(subjectGrades).length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Points</p>
                <p className="text-xl font-bold text-primary">{overallAverage}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overall Grade</p>
                {overallGrade && <GradeBadge grade={overallGrade} />}
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">Class Teacher's Remarks</h3>
            <p className="text-muted-foreground italic min-h-[40px]">
              {overallGrade?.startsWith('EE') 
                ? 'Excellent performance! Keep up the outstanding work.'
                : overallGrade?.startsWith('ME')
                ? 'Good progress. Continue working hard to improve.'
                : overallGrade?.startsWith('AE')
                ? 'Fair performance. More effort and attention needed.'
                : 'Needs significant improvement. Please consult with teachers.'}
            </p>
          </div>

          {/* Signatures */}
          <div className="flex justify-between pt-8">
            <div className="text-center">
              <div className="w-48 border-t border-foreground mt-10 pt-2">
                Class Teacher's Signature
              </div>
            </div>
            <div className="text-center">
              <div className="w-48 border-t border-foreground mt-10 pt-2">
                Principal's Signature
              </div>
            </div>
            <div className="text-center">
              <div className="w-48 border-t border-foreground mt-10 pt-2">
                Parent's Signature
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print Report Card
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
