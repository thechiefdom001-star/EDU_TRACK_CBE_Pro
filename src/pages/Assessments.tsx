import { useState } from 'react';
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
import { Plus, Search, ClipboardList } from 'lucide-react';
import { Assessment, GradeLevel, GRADE_POINTS, GRADE_LABELS, Term } from '@/types';
import { formatDate } from '@/lib/storage';
import { toast } from 'sonner';

export default function Assessments() {
  const { students, teachers, assessments, addAssessment } = useSchool();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [gradeFilter, setGradeFilter] = useState<string>('all');

  const [formData, setFormData] = useState({
    studentId: '',
    subject: '',
    term: 1 as Term,
    year: new Date().getFullYear(),
    examType: 'endTerm' as 'cat1' | 'cat2' | 'endTerm',
    grade: 'ME1' as GradeLevel,
    remarks: '',
    teacherId: '',
  });

  const filteredAssessments = assessments.filter(assessment => {
    const student = students.find(s => s.id === assessment.studentId);
    if (!student) return false;
    
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGrade = gradeFilter === 'all' || assessment.grade.startsWith(gradeFilter);
    
    return matchesSearch && matchesGrade;
  });

  const handleAddAssessment = () => {
    const newAssessment: Omit<Assessment, 'id'> = {
      ...formData,
      points: GRADE_POINTS[formData.grade],
      dateRecorded: new Date().toISOString().split('T')[0],
    };
    addAssessment(newAssessment);
    setIsAddDialogOpen(false);
    setFormData({
      studentId: '', subject: '', term: 1, year: new Date().getFullYear(),
      examType: 'endTerm', grade: 'ME1', remarks: '', teacherId: ''
    });
    toast.success('Assessment recorded successfully!');
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
                <p className="text-sm text-muted-foreground">EE1: 8 points | EE2: 7 points</p>
              </div>
              <div className="p-3 rounded-lg bg-info/10 border border-info/30">
                <p className="font-semibold text-info">Meeting Expectation (ME)</p>
                <p className="text-sm text-muted-foreground">ME1: 6 points | ME2: 5 points</p>
              </div>
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/30">
                <p className="font-semibold text-warning">Approaching Expectation (AE)</p>
                <p className="text-sm text-muted-foreground">AE1: 4 points | AE2: 3 points</p>
              </div>
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                <p className="font-semibold text-destructive">Below Expectation (BE)</p>
                <p className="text-sm text-muted-foreground">BE1: 2 points | BE2: 1 point</p>
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

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by student or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                <SelectItem value="EE">EE Only</SelectItem>
                <SelectItem value="ME">ME Only</SelectItem>
                <SelectItem value="AE">AE Only</SelectItem>
                <SelectItem value="BE">BE Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Assessment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Assessment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Select Student</Label>
                  <Select value={formData.studentId} onValueChange={(v) => setFormData({...formData, studentId: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map(student => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.firstName} {student.lastName} - Grade {student.grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="e.g., Mathematics, English, Biology"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                    <Label>Grade</Label>
                    <Select 
                      value={formData.grade} 
                      onValueChange={(v) => setFormData({...formData, grade: v as GradeLevel})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(GRADE_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {key} - {GRADE_POINTS[key as GradeLevel]} pts
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Assessed By (Teacher)</Label>
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
                <div className="space-y-2">
                  <Label>Remarks (Optional)</Label>
                  <Textarea 
                    value={formData.remarks}
                    onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                    placeholder="Additional comments on performance..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddAssessment}>
                  Record Assessment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Assessments Table */}
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Date</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Teacher</TableHead>
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
                  <TableCell>
                    <GradeBadge grade={assessment.grade} />
                  </TableCell>
                  <TableCell className="font-semibold">{assessment.points}</TableCell>
                  <TableCell>{getTeacherName(assessment.teacherId)}</TableCell>
                </TableRow>
              ))}
              {filteredAssessments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No assessments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
}
