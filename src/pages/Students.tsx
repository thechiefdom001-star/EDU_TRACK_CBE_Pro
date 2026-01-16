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
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { Student, SchoolLevel, SeniorPathway } from '@/types';
import { generateAdmissionNumber } from '@/lib/storage';
import { toast } from 'sonner';

export default function Students() {
  const { students, addStudent, deleteStudent } = useSchool();
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

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
    return matchesSearch && matchesLevel;
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
    setFormData({
      firstName: '', lastName: '', gender: 'male', dateOfBirth: '',
      schoolLevel: 'primary', grade: 1, stream: 'A', pathway: '',
      guardianName: '', guardianPhone: '', guardianEmail: '', address: ''
    });
    toast.success('Student added successfully!');
  };

  const handleDeleteStudent = (id: string) => {
    deleteStudent(id);
    toast.success('Student removed successfully');
  };

  const getGradeOptions = (level: SchoolLevel) => {
    switch (level) {
      case 'primary': return [1, 2, 3, 4, 5, 6];
      case 'junior': return [7, 8, 9];
      case 'senior': return [10, 11, 12];
      default: return [1];
    }
  };

  return (
    <MainLayout title="Students" subtitle="Manage student records and enrollment">
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or admission number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="junior">Junior</SelectItem>
                <SelectItem value="senior">Senior</SelectItem>
              </SelectContent>
            </Select>
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
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
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
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
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
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setSelectedStudent(student)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteStudent(student.id)}
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
        <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
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
      </div>
    </MainLayout>
  );
}
