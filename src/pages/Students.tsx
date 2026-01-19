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
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Eye, Edit, Trash2, FileText } from 'lucide-react';
import { Student, SchoolLevel, SeniorPathway, Term } from '@/types';
import { generateAdmissionNumber } from '@/lib/storage';
import { toast } from 'sonner';
import { DeleteConfirmDialog } from '@/components/common/DeleteConfirmDialog';
import { PrintButton } from '@/components/common/PrintButton';
import { CBCReportCard } from '@/components/common/CBCReportCard';

export default function Students() {
  const { students, addStudent, updateStudent, deleteStudent, assessments } = useSchool();
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [termFilter, setTermFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>(new Date().getFullYear().toString());
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isReportCardOpen, setIsReportCardOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'male' as 'male' | 'female',
    dateOfBirth: '',
    schoolLevel: 'primary' as SchoolLevel,
    grade: 1,
    stream: 'A',
    pathway: '' as SeniorPathway | '',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    address: '',
  });

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === 'all' || student.schoolLevel === levelFilter;
    const matchesGrade = gradeFilter === 'all' || student.grade.toString() === gradeFilter;
    return matchesSearch && matchesLevel && matchesGrade;
  });

  const handleAddStudent = () => {
    const newStudent: Omit<Student, 'id'> = {
      ...formData,
      admissionNumber: generateAdmissionNumber(formData.schoolLevel),
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'active',
      pathway: formData.schoolLevel === 'senior' ? formData.pathway as SeniorPathway : undefined,
    };
    addStudent(newStudent);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success('Student added successfully!');
  };

  const handleEditStudent = () => {
    if (!selectedStudent) return;
    updateStudent(selectedStudent.id, {
      ...formData,
      pathway: formData.schoolLevel === 'senior' ? formData.pathway as SeniorPathway : undefined,
    });
    setIsEditDialogOpen(false);
    setSelectedStudent(null);
    resetForm();
    toast.success('Student updated successfully!');
  };

  const handleDeleteStudent = () => {
    if (!selectedStudent) return;
    deleteStudent(selectedStudent.id);
    setDeleteDialogOpen(false);
    setSelectedStudent(null);
    toast.success('Student removed successfully');
  };

  const openEditDialog = (student: Student) => {
    setSelectedStudent(student);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      gender: student.gender,
      dateOfBirth: student.dateOfBirth,
      schoolLevel: student.schoolLevel,
      grade: student.grade,
      stream: student.stream || 'A',
      pathway: student.pathway || '',
      guardianName: student.guardianName,
      guardianPhone: student.guardianPhone,
      guardianEmail: student.guardianEmail || '',
      address: student.address,
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (student: Student) => {
    setSelectedStudent(student);
    setIsViewDialogOpen(true);
  };

  const openDeleteDialog = (student: Student) => {
    setSelectedStudent(student);
    setDeleteDialogOpen(true);
  };

  const openReportCard = (student: Student) => {
    setSelectedStudent(student);
    setIsReportCardOpen(true);
  };

  const resetForm = () => {
    setFormData({
      firstName: '', lastName: '', gender: 'male', dateOfBirth: '',
      schoolLevel: 'primary', grade: 1, stream: 'A', pathway: '',
      guardianName: '', guardianPhone: '', guardianEmail: '', address: ''
    });
  };

  const getGradeOptions = (level: SchoolLevel) => {
    switch (level) {
      case 'primary': return [1, 2, 3, 4, 5, 6];
      case 'junior': return [7, 8, 9];
      case 'senior': return [10, 11, 12];
      default: return [1];
    }
  };

  const StudentForm = () => (
    <div className="grid grid-cols-2 gap-4 py-4">
      <div className="space-y-2">
        <Label>First Name</Label>
        <Input 
          value={formData.firstName}
          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label>Last Name</Label>
        <Input 
          value={formData.lastName}
          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label>Gender</Label>
        <Select value={formData.gender} onValueChange={(v) => setFormData({...formData, gender: v as 'male' | 'female'})}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Date of Birth</Label>
        <Input 
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label>School Level</Label>
        <Select 
          value={formData.schoolLevel} 
          onValueChange={(v) => setFormData({
            ...formData, 
            schoolLevel: v as SchoolLevel,
            grade: getGradeOptions(v as SchoolLevel)[0]
          })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="primary">Primary</SelectItem>
            <SelectItem value="junior">Junior (Grade 6-9)</SelectItem>
            <SelectItem value="senior">Senior (Grade 10-12)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Grade</Label>
        <Select 
          value={formData.grade.toString()} 
          onValueChange={(v) => setFormData({...formData, grade: parseInt(v)})}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {getGradeOptions(formData.schoolLevel).map(g => (
              <SelectItem key={g} value={g.toString()}>Grade {g}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Stream</Label>
        <Select value={formData.stream} onValueChange={(v) => setFormData({...formData, stream: v})}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A">Stream A</SelectItem>
            <SelectItem value="B">Stream B</SelectItem>
            <SelectItem value="C">Stream C</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {formData.schoolLevel === 'senior' && (
        <div className="space-y-2">
          <Label>Pathway</Label>
          <Select value={formData.pathway} onValueChange={(v) => setFormData({...formData, pathway: v as SeniorPathway})}>
            <SelectTrigger>
              <SelectValue placeholder="Select pathway" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="STEM">STEM</SelectItem>
              <SelectItem value="Social Sciences">Social Sciences</SelectItem>
              <SelectItem value="Arts and Sports Science">Arts and Sports Science</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="col-span-2 border-t pt-4 mt-2">
        <h4 className="font-medium mb-4">Guardian Information</h4>
      </div>
      <div className="space-y-2">
        <Label>Guardian Name</Label>
        <Input 
          value={formData.guardianName}
          onChange={(e) => setFormData({...formData, guardianName: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label>Guardian Phone</Label>
        <Input 
          value={formData.guardianPhone}
          onChange={(e) => setFormData({...formData, guardianPhone: e.target.value})}
          placeholder="0712345678"
        />
      </div>
      <div className="space-y-2">
        <Label>Guardian Email (Optional)</Label>
        <Input 
          type="email"
          value={formData.guardianEmail}
          onChange={(e) => setFormData({...formData, guardianEmail: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label>Address</Label>
        <Input 
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
        />
      </div>
    </div>
  );

  return (
    <MainLayout title="Students" subtitle="Manage student records and enrollment">
      <div className="space-y-6">
        {/* Filters Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="relative col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or admission number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="junior">Junior</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                </SelectContent>
              </Select>
              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(g => (
                    <SelectItem key={g} value={g.toString()}>Grade {g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(y => (
                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2">
            <PrintButton tableId="students-table" title="Student Records" />
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>
              <StudentForm />
              <DialogFooter>
                <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>
                  Cancel
                </Button>
                <Button onClick={handleAddStudent}>
                  Add Student
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Students Table */}
        <div id="students-table" className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Adm. No.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Pathway</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-sm">{student.admissionNumber}</TableCell>
                  <TableCell className="font-medium">
                    {student.firstName} {student.lastName}
                  </TableCell>
                  <TableCell className="capitalize">{student.gender}</TableCell>
                  <TableCell className="capitalize">{student.schoolLevel}</TableCell>
                  <TableCell>Grade {student.grade}</TableCell>
                  <TableCell>
                    {student.pathway ? (
                      <Badge variant="secondary">{student.pathway}</Badge>
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openViewDialog(student)}
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openEditDialog(student)}
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openReportCard(student)}
                        title="Report Card"
                      >
                        <FileText className="h-4 w-4 text-primary" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openDeleteDialog(student)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No students found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* View Student Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Student Details</DialogTitle>
            </DialogHeader>
            {selectedStudent && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Admission Number</p>
                    <p className="font-medium">{selectedStudent.admissionNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{selectedStudent.firstName} {selectedStudent.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">{selectedStudent.dateOfBirth}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Grade</p>
                    <p className="font-medium">Grade {selectedStudent.grade}{selectedStudent.stream}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Guardian</p>
                    <p className="font-medium">{selectedStudent.guardianName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Guardian Phone</p>
                    <p className="font-medium">{selectedStudent.guardianPhone}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Student Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Student</DialogTitle>
            </DialogHeader>
            <StudentForm />
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); setSelectedStudent(null); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleEditStudent}>
                Update Student
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteStudent}
          title="Delete Student"
          description={`Are you sure you want to delete ${selectedStudent?.firstName} ${selectedStudent?.lastName}? This action cannot be undone.`}
        />

        {/* Report Card Dialog */}
        {selectedStudent && (
          <CBCReportCard
            student={selectedStudent}
            assessments={assessments}
            term={parseInt(termFilter) as Term || 1}
            year={parseInt(yearFilter) || currentYear}
            open={isReportCardOpen}
            onOpenChange={setIsReportCardOpen}
          />
        )}
      </div>
    </MainLayout>
  );
}
