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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { Teacher } from '@/types';
import { formatCurrency } from '@/lib/storage';
import { toast } from 'sonner';
import { DeleteConfirmDialog } from '@/components/common/DeleteConfirmDialog';
import { PrintButton } from '@/components/common/PrintButton';

export default function Teachers() {
  const { teachers, addTeacher, updateTeacher, deleteTeacher } = useSchool();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const [formData, setFormData] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    gender: 'male' as 'male' | 'female',
    email: '',
    phone: '',
    subjects: '',
    classes: '',
    qualification: '',
    salary: 70000,
  });

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = 
      teacher.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || teacher.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddTeacher = () => {
    const newTeacher: Omit<Teacher, 'id'> = {
      employeeId: formData.employeeId || `T${Date.now().toString().slice(-4)}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
      gender: formData.gender,
      email: formData.email,
      phone: formData.phone,
      subjects: formData.subjects.split(',').map(s => s.trim()).filter(s => s),
      classes: formData.classes.split(',').map(c => c.trim()).filter(c => c),
      qualification: formData.qualification,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
      salary: formData.salary,
    };
    addTeacher(newTeacher);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success('Teacher added successfully!');
  };

  const handleEditTeacher = () => {
    if (!selectedTeacher) return;
    updateTeacher(selectedTeacher.id, {
      employeeId: formData.employeeId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      gender: formData.gender,
      email: formData.email,
      phone: formData.phone,
      subjects: formData.subjects.split(',').map(s => s.trim()).filter(s => s),
      classes: formData.classes.split(',').map(c => c.trim()).filter(c => c),
      qualification: formData.qualification,
      salary: formData.salary,
    });
    setIsEditDialogOpen(false);
    setSelectedTeacher(null);
    resetForm();
    toast.success('Teacher updated successfully!');
  };

  const handleDeleteTeacher = () => {
    if (!selectedTeacher) return;
    deleteTeacher(selectedTeacher.id);
    setDeleteDialogOpen(false);
    setSelectedTeacher(null);
    toast.success('Teacher removed successfully');
  };

  const openEditDialog = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setFormData({
      employeeId: teacher.employeeId,
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      gender: teacher.gender,
      email: teacher.email,
      phone: teacher.phone,
      subjects: teacher.subjects.join(', '),
      classes: teacher.classes.join(', '),
      qualification: teacher.qualification,
      salary: teacher.salary,
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsViewDialogOpen(true);
  };

  const openDeleteDialog = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      employeeId: '', firstName: '', lastName: '', gender: 'male',
      email: '', phone: '', subjects: '', classes: '', qualification: '', salary: 70000
    });
  };

  const TeacherForm = () => (
    <div className="grid grid-cols-2 gap-4 py-4">
      <div className="space-y-2">
        <Label>Employee ID (Optional)</Label>
        <Input 
          value={formData.employeeId}
          onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
          placeholder="Auto-generated if empty"
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
        <Label>Email</Label>
        <Input 
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label>Phone</Label>
        <Input 
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          placeholder="0712345678"
        />
      </div>
      <div className="space-y-2">
        <Label>Subjects (comma-separated)</Label>
        <Input 
          value={formData.subjects}
          onChange={(e) => setFormData({...formData, subjects: e.target.value})}
          placeholder="English, Literature"
        />
      </div>
      <div className="space-y-2">
        <Label>Classes (comma-separated)</Label>
        <Input 
          value={formData.classes}
          onChange={(e) => setFormData({...formData, classes: e.target.value})}
          placeholder="Grade 10A, Grade 11A"
        />
      </div>
      <div className="space-y-2">
        <Label>Qualification</Label>
        <Input 
          value={formData.qualification}
          onChange={(e) => setFormData({...formData, qualification: e.target.value})}
          placeholder="B.Ed Mathematics"
        />
      </div>
      <div className="space-y-2">
        <Label>Monthly Salary (KES)</Label>
        <Input 
          type="number"
          value={formData.salary}
          onChange={(e) => setFormData({...formData, salary: parseInt(e.target.value) || 0})}
        />
      </div>
    </div>
  );

  return (
    <MainLayout title="Teachers" subtitle="Manage teaching staff and assignments">
      <div className="space-y-6">
        {/* Filters Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="relative col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or employee ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                  <SelectItem value="resigned">Resigned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2">
            <PrintButton tableId="teachers-table" title="Teacher Records" />
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Teacher
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Teacher</DialogTitle>
              </DialogHeader>
              <TeacherForm />
              <DialogFooter>
                <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>
                  Cancel
                </Button>
                <Button onClick={handleAddTeacher}>
                  Add Teacher
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Teachers Table */}
        <div id="teachers-table" className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Emp. ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Classes</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.map((teacher) => (
                <TableRow key={teacher.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-sm">{teacher.employeeId}</TableCell>
                  <TableCell className="font-medium">
                    {teacher.firstName} {teacher.lastName}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects.slice(0, 2).map((subject, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                      {teacher.subjects.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{teacher.subjects.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{teacher.classes.length} classes</TableCell>
                  <TableCell>{teacher.phone}</TableCell>
                  <TableCell>{formatCurrency(teacher.salary)}</TableCell>
                  <TableCell>
                    <Badge variant={teacher.status === 'active' ? 'default' : 'secondary'}>
                      {teacher.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openViewDialog(teacher)}
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openEditDialog(teacher)}
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openDeleteDialog(teacher)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTeachers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No teachers found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* View Teacher Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Teacher Details</DialogTitle>
            </DialogHeader>
            {selectedTeacher && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Employee ID</p>
                    <p className="font-medium">{selectedTeacher.employeeId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{selectedTeacher.firstName} {selectedTeacher.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedTeacher.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedTeacher.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Qualification</p>
                    <p className="font-medium">{selectedTeacher.qualification}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Salary</p>
                    <p className="font-medium">{formatCurrency(selectedTeacher.salary)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground mb-2">Subjects</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTeacher.subjects.map((subject, i) => (
                        <Badge key={i} variant="secondary">{subject}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Teacher Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Teacher</DialogTitle>
            </DialogHeader>
            <TeacherForm />
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); setSelectedTeacher(null); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleEditTeacher}>
                Update Teacher
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteTeacher}
          title="Delete Teacher"
          description={`Are you sure you want to delete ${selectedTeacher?.firstName} ${selectedTeacher?.lastName}? This action cannot be undone.`}
        />
      </div>
    </MainLayout>
  );
}
