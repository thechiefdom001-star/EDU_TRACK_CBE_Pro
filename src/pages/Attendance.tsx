import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useSchool } from '@/contexts/SchoolContext';
import { Button } from '@/components/ui/button';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Check, X, Clock, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/storage';
import { toast } from 'sonner';

export default function Attendance() {
  const { students, attendance, addAttendance } = useSchool();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedGrade, setSelectedGrade] = useState<string>('all');

  const filteredStudents = students.filter(student => {
    if (selectedGrade === 'all') return true;
    return student.grade.toString() === selectedGrade;
  });

  const getAttendanceStatus = (studentId: string, date: string) => {
    return attendance.find(a => a.studentId === studentId && a.date === date);
  };

  const markAttendance = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    const existing = getAttendanceStatus(studentId, selectedDate);
    if (existing) {
      toast.info('Attendance already marked for this date');
      return;
    }
    addAttendance({
      studentId,
      date: selectedDate,
      status,
    });
    toast.success('Attendance marked!');
  };

  // Stats for selected date
  const dateAttendance = attendance.filter(a => a.date === selectedDate);
  const presentCount = dateAttendance.filter(a => a.status === 'present').length;
  const absentCount = dateAttendance.filter(a => a.status === 'absent').length;
  const lateCount = dateAttendance.filter(a => a.status === 'late').length;

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-success/20 text-success border-success/30"><Check className="h-3 w-3 mr-1" /> Present</Badge>;
      case 'absent':
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30"><X className="h-3 w-3 mr-1" /> Absent</Badge>;
      case 'late':
        return <Badge className="bg-warning/20 text-warning border-warning/30"><Clock className="h-3 w-3 mr-1" /> Late</Badge>;
      case 'excused':
        return <Badge className="bg-info/20 text-info border-info/30"><AlertCircle className="h-3 w-3 mr-1" /> Excused</Badge>;
      default:
        return <Badge variant="outline">Not Marked</Badge>;
    }
  };

  return (
    <MainLayout title="Attendance" subtitle="Track daily student attendance">
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border rounded-lg bg-background"
              />
            </div>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(g => (
                  <SelectItem key={g} value={g.toString()}>Grade {g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-muted-foreground">
            Showing attendance for: <span className="font-medium">{formatDate(selectedDate)}</span>
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
                  <Check className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-success">{presentCount}</p>
                  <p className="text-sm text-muted-foreground">Present</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-destructive/20 flex items-center justify-center">
                  <X className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-destructive">{absentCount}</p>
                  <p className="text-sm text-muted-foreground">Absent</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-warning/20 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-warning">{lateCount}</p>
                  <p className="text-sm text-muted-foreground">Late</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{filteredStudents.length - presentCount - absentCount - lateCount}</p>
                  <p className="text-sm text-muted-foreground">Not Marked</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Mark Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Adm. No.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => {
                  const status = getAttendanceStatus(student.id, selectedDate);
                  return (
                    <TableRow key={student.id} className="hover:bg-muted/30">
                      <TableCell className="font-mono text-sm">{student.admissionNumber}</TableCell>
                      <TableCell className="font-medium">
                        {student.firstName} {student.lastName}
                      </TableCell>
                      <TableCell>Grade {student.grade}{student.stream}</TableCell>
                      <TableCell>
                        <StatusBadge status={status?.status || ''} />
                      </TableCell>
                      <TableCell className="text-right">
                        {!status && (
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="bg-success/10 hover:bg-success/20 border-success/30 text-success"
                              onClick={() => markAttendance(student.id, 'present')}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="bg-destructive/10 hover:bg-destructive/20 border-destructive/30 text-destructive"
                              onClick={() => markAttendance(student.id, 'absent')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="bg-warning/10 hover:bg-warning/20 border-warning/30 text-warning"
                              onClick={() => markAttendance(student.id, 'late')}
                            >
                              <Clock className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredStudents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No students found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
