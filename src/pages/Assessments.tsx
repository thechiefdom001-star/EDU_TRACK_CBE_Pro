import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useSchool } from '@/contexts/SchoolContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GradeBadge } from '@/components/common/GradeBadge';
import { DeleteConfirmDialog } from '@/components/common/DeleteConfirmDialog';
import { PrintButton } from '@/components/common/PrintButton';
import { Plus, Search, ClipboardList, Edit, Trash2 } from 'lucide-react';
import { 
  Assessment, GradeLevel, GRADE_POINTS, Term, ExamType, 
  EXAM_TYPE_LABELS, ALL_SUBJECTS, getGradeFromMarks, DEFAULT_GRADING_BOUNDARIES 
} from '@/types';
import { formatDate } from '@/lib/storage';
import { toast } from 'sonner';

export default function Assessments() {
  const { students, teachers, assessments, addAssessment, updateAssessment, deleteAssessment } = useSchool();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  
  // Filters
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [termFilter, setTermFilter] = useState<string>('all');
  const [examTypeFilter, setExamTypeFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>(new Date().getFullYear().toString());
  const [classGradeFilter, setClassGradeFilter] = useState<string>('all');

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];

  const [formData, setFormData] = useState({
    studentId: '',
    subject: '',
    term: 1 as Term,
    year: currentYear,
    examType: 'opener' as ExamType,
    marks: 0,
    remarks: '',
    teacherId: '',
  });

  // Calculate grade automatically from marks
  const calculatedGrade = useMemo(() => getGradeFromMarks(formData.marks), [formData.marks]);

  // Filter students by class grade for the dropdown
  const filteredStudentsForForm = useMemo(() => {
    if (classGradeFilter === 'all') return students;
    return students.filter(s => s.grade.toString() === classGradeFilter);
  }, [students, classGradeFilter]);

  const filteredAssessments = assessments.filter(assessment => {
    const student = students.find(s => s.id === assessment.studentId);
    if (!student) return false;
    
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGrade = gradeFilter === 'all' || assessment.grade.startsWith(gradeFilter);
    const matchesTerm = termFilter === 'all' || assessment.term.toString() === termFilter;
    const matchesExamType = examTypeFilter === 'all' || assessment.examType === examTypeFilter;
    const matchesYear = yearFilter === 'all' || assessment.year.toString() === yearFilter;
    const matchesClassGrade = classGradeFilter === 'all' || student.grade.toString() === classGradeFilter;
    
    return matchesSearch && matchesGrade && matchesTerm && matchesExamType && matchesYear && matchesClassGrade;
  });

  const handleAddAssessment = () => {
    if (!formData.studentId || !formData.subject || !formData.teacherId) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const grade = getGradeFromMarks(formData.marks);
    const newAssessment: Omit<Assessment, 'id'> = {
      ...formData,
      grade,
      points: GRADE_POINTS[grade],
      dateRecorded: new Date().toISOString().split('T')[0],
    };
    addAssessment(newAssessment);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success('Assessment recorded successfully!');
  };

  const handleEditAssessment = () => {
    if (!selectedAssessment) return;
    
    const grade = getGradeFromMarks(formData.marks);
    updateAssessment(selectedAssessment.id, {
      ...formData,
      grade,
      points: GRADE_POINTS[grade],
    });
    setIsEditDialogOpen(false);
    setSelectedAssessment(null);
    resetForm();
    toast.success('Assessment updated successfully!');
  };

  const handleDeleteAssessment = () => {
    if (!selectedAssessment) return;
    deleteAssessment(selectedAssessment.id);
    setDeleteDialogOpen(false);
    setSelectedAssessment(null);
    toast.success('Assessment deleted successfully!');
  };

  const openEditDialog = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setFormData({
      studentId: assessment.studentId,
      subject: assessment.subject,
      term: assessment.term,
      year: assessment.year,
      examType: assessment.examType,
      marks: assessment.marks || 0,
      remarks: assessment.remarks || '',
      teacherId: assessment.teacherId,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      studentId: '', subject: '', term: 1, year: currentYear,
      examType: 'opener', marks: 0, remarks: '', teacherId: ''
    });
  };

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown';
  };

  const getStudentGrade = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? `Grade ${student.grade}${student.stream || ''}` : '';
  };

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unknown';
  };

  // Stats
  const avgPoints = assessments.length > 0
    ? (assessments.reduce((sum, a) => sum + a.points, 0) / assessments.length).toFixed(1)
    : '0';

  const gradeDistribution = {
    EE: assessments.filter(a => a.grade.startsWith('EE')).length,
    ME: assessments.filter(a => a.grade.startsWith('ME')).length,
    AE: assessments.filter(a => a.grade.startsWith('AE')).length,
    BE: assessments.filter(a => a.grade.startsWith('BE')).length,
  };

  const AssessmentForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-4 py-4">
      {/* Student Selection with Grade Filter */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Filter by Class Grade</Label>
          <Select value={classGradeFilter} onValueChange={setClassGradeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Grades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(g => (
                <SelectItem key={g} value={g.toString()}>Grade {g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Select Student *</Label>
          <Select value={formData.studentId} onValueChange={(v) => setFormData({...formData, studentId: v})}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a student" />
            </SelectTrigger>
            <SelectContent>
              {filteredStudentsForForm.map(student => (
                <SelectItem key={student.id} value={student.id}>
                  {student.firstName} {student.lastName} - Grade {student.grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Subject Selection */}
      <div className="space-y-2">
        <Label>Subject *</Label>
        <Select value={formData.subject} onValueChange={(v) => setFormData({...formData, subject: v})}>
          <SelectTrigger>
            <SelectValue placeholder="Select subject" />
          </SelectTrigger>
          <SelectContent>
            {ALL_SUBJECTS.map(subject => (
              <SelectItem key={subject} value={subject}>{subject}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Term, Year, Exam Type */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Term</Label>
          <Select 
            value={formData.term.toString()} 
            onValueChange={(v) => setFormData({...formData, term: parseInt(v) as Term})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Term 1</SelectItem>
              <SelectItem value="2">Term 2</SelectItem>
              <SelectItem value="3">Term 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Academic Year</Label>
          <Select 
            value={formData.year.toString()} 
            onValueChange={(v) => setFormData({...formData, year: parseInt(v)})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map(y => (
                <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Exam Type</Label>
          <Select 
            value={formData.examType} 
            onValueChange={(v) => setFormData({...formData, examType: v as ExamType})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(EXAM_TYPE_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Marks Input with Auto Grade */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Marks (out of 100) *</Label>
          <Input 
            type="number"
            min="0"
            max="100"
            value={formData.marks}
            onChange={(e) => setFormData({...formData, marks: Math.min(100, Math.max(0, parseInt(e.target.value) || 0))})}
            placeholder="Enter marks"
          />
        </div>
        <div className="space-y-2">
          <Label>Auto-Calculated Grade</Label>
          <div className="h-10 px-3 py-2 rounded-md border bg-muted flex items-center gap-2">
            <GradeBadge grade={calculatedGrade} />
            <span className="text-sm text-muted-foreground">
              ({GRADE_POINTS[calculatedGrade]} points)
            </span>
          </div>
        </div>
      </div>

      {/* Grading Scale Reference */}
      <div className="p-3 rounded-lg bg-muted/50 border">
        <p className="text-xs font-medium mb-2">Grading Scale:</p>
        <div className="grid grid-cols-4 gap-2 text-xs">
          {DEFAULT_GRADING_BOUNDARIES.map((b, i) => (
            <div key={i} className="text-muted-foreground">
              {b.grade}: {b.minMarks}-{b.maxMarks}%
            </div>
          ))}
        </div>
      </div>

      {/* Teacher Selection */}
      <div className="space-y-2">
        <Label>Assessed By (Teacher) *</Label>
        <Select value={formData.teacherId} onValueChange={(v) => setFormData({...formData, teacherId: v})}>
          <SelectTrigger>
            <SelectValue placeholder="Select teacher" />
          </SelectTrigger>
          <SelectContent>
            {teachers.map(teacher => (
              <SelectItem key={teacher.id} value={teacher.id}>
                {teacher.firstName} {teacher.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Remarks */}
      <div className="space-y-2">
        <Label>Remarks (Optional)</Label>
        <Textarea 
          value={formData.remarks}
          onChange={(e) => setFormData({...formData, remarks: e.target.value})}
          placeholder="Additional comments on performance..."
        />
      </div>
    </div>
  );

  return (
    <MainLayout title="Assessment" subtitle="CBC competency-based assessment records">
      <div className="space-y-6">
        {/* Grade Legend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              KNEC CBC Grading Scale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-success/10 border border-success/30">
                <p className="font-semibold text-success">Exceeding Expectation (EE)</p>
                <p className="text-sm text-muted-foreground">EE1: 90-100% | EE2: 80-89%</p>
              </div>
              <div className="p-3 rounded-lg bg-info/10 border border-info/30">
                <p className="font-semibold text-info">Meeting Expectation (ME)</p>
                <p className="text-sm text-muted-foreground">ME1: 70-79% | ME2: 60-69%</p>
              </div>
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/30">
                <p className="font-semibold text-warning">Approaching Expectation (AE)</p>
                <p className="text-sm text-muted-foreground">AE1: 50-59% | AE2: 40-49%</p>
              </div>
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                <p className="font-semibold text-destructive">Below Expectation (BE)</p>
                <p className="text-sm text-muted-foreground">BE1: 25-39% | BE2: 0-24%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Assessments</p>
              <p className="text-2xl font-bold">{assessments.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Average Points</p>
              <p className="text-2xl font-bold text-primary">{avgPoints}</p>
            </CardContent>
          </Card>
          <Card className="bg-success/5">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">EE Count</p>
              <p className="text-2xl font-bold text-success">{gradeDistribution.EE}</p>
            </CardContent>
          </Card>
          <Card className="bg-info/5">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">ME Count</p>
              <p className="text-2xl font-bold text-info">{gradeDistribution.ME}</p>
            </CardContent>
          </Card>
          <Card className="bg-warning/5">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">AE/BE Count</p>
              <p className="text-2xl font-bold text-warning">{gradeDistribution.AE + gradeDistribution.BE}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters Bar */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="relative col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search student or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={classGradeFilter} onValueChange={setClassGradeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(g => (
                    <SelectItem key={g} value={g.toString()}>Grade {g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={termFilter} onValueChange={setTermFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Terms</SelectItem>
                  <SelectItem value="1">Term 1</SelectItem>
                  <SelectItem value="2">Term 2</SelectItem>
                  <SelectItem value="3">Term 3</SelectItem>
                </SelectContent>
              </Select>
              <Select value={examTypeFilter} onValueChange={setExamTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Exam Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Exams</SelectItem>
                  {Object.entries(EXAM_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map(y => (
                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex gap-4 flex-1">
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Results</SelectItem>
                <SelectItem value="EE">EE Only</SelectItem>
                <SelectItem value="ME">ME Only</SelectItem>
                <SelectItem value="AE">AE Only</SelectItem>
                <SelectItem value="BE">BE Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <PrintButton 
              tableId="assessments-table" 
              title="Assessment Records"
            />
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Assessment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Record Assessment</DialogTitle>
                </DialogHeader>
                <AssessmentForm />
                <DialogFooter>
                  <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddAssessment}>
                    Record Assessment
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Assessments Table */}
        <div id="assessments-table" className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Date</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Term/Year</TableHead>
                <TableHead>Exam</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssessments.map((assessment) => (
                <TableRow key={assessment.id} className="hover:bg-muted/30">
                  <TableCell>{formatDate(assessment.dateRecorded)}</TableCell>
                  <TableCell className="font-medium">{getStudentName(assessment.studentId)}</TableCell>
                  <TableCell>{getStudentGrade(assessment.studentId)}</TableCell>
                  <TableCell>{assessment.subject}</TableCell>
                  <TableCell>Term {assessment.term}, {assessment.year}</TableCell>
                  <TableCell>{EXAM_TYPE_LABELS[assessment.examType]}</TableCell>
                  <TableCell>{assessment.marks || '-'}%</TableCell>
                  <TableCell>
                    <GradeBadge grade={assessment.grade} />
                  </TableCell>
                  <TableCell className="font-semibold">{assessment.points}</TableCell>
                  <TableCell>{getTeacherName(assessment.teacherId)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openEditDialog(assessment)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openDeleteDialog(assessment)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredAssessments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                    No assessments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Assessment</DialogTitle>
            </DialogHeader>
            <AssessmentForm isEdit />
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); setSelectedAssessment(null); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleEditAssessment}>
                Update Assessment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteAssessment}
          title="Delete Assessment"
          description="Are you sure you want to delete this assessment record? This action cannot be undone."
        />
      </div>
    </MainLayout>
  );
}
