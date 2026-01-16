import { MainLayout } from '@/components/layout/MainLayout';
import { useSchool } from '@/contexts/SchoolContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, TrendingUp } from 'lucide-react';
import { STEM_SUBJECTS, SOCIAL_SCIENCES_SUBJECTS, ARTS_SPORTS_SUBJECTS, CORE_SUBJECTS } from '@/types';

interface SchoolLevelPageProps {
  level: 'primary' | 'junior' | 'senior';
  title: string;
  subtitle: string;
  gradeRange: number[];
}

export function SchoolLevelPage({ level, title, subtitle, gradeRange }: SchoolLevelPageProps) {
  const { students, assessments } = useSchool();
  
  const levelStudents = students.filter(s => s.schoolLevel === level);
  const maleCount = levelStudents.filter(s => s.gender === 'male').length;
  const femaleCount = levelStudents.filter(s => s.gender === 'female').length;

  const studentsByGrade = gradeRange.map(grade => ({
    grade,
    count: levelStudents.filter(s => s.grade === grade).length,
    streams: ['A', 'B', 'C'].map(stream => ({
      stream,
      count: levelStudents.filter(s => s.grade === grade && s.stream === stream).length
    })).filter(s => s.count > 0)
  }));

  return (
    <MainLayout title={title} subtitle={subtitle}>
      <div className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{levelStudents.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Male Students</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-info">{maleCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Female Students</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-secondary">{femaleCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{studentsByGrade.filter(g => g.count > 0).length * 2}</p>
            </CardContent>
          </Card>
        </div>

        {/* Students by Grade */}
        <Card>
          <CardHeader>
            <CardTitle>Students by Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {studentsByGrade.map(({ grade, count, streams }) => (
                <div key={grade} className="p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">Grade {grade}</p>
                    <p className="text-3xl font-bold mt-2">{count}</p>
                    <p className="text-sm text-muted-foreground">students</p>
                    {streams.length > 0 && (
                      <div className="flex justify-center gap-1 mt-2">
                        {streams.map(s => (
                          <Badge key={s.stream} variant="outline" className="text-xs">
                            {s.stream}: {s.count}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Core Subjects (for all levels) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Core Subjects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {CORE_SUBJECTS.map(subject => (
                <Badge key={subject} className="text-sm py-1 px-3">
                  {subject}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Students */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {levelStudents.slice(0, 5).map(student => (
                <div key={student.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium">{student.firstName} {student.lastName}</p>
                    <p className="text-sm text-muted-foreground">
                      {student.admissionNumber} • Grade {student.grade}{student.stream}
                    </p>
                  </div>
                  <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                    {student.status}
                  </Badge>
                </div>
              ))}
              {levelStudents.length === 0 && (
                <p className="text-center py-8 text-muted-foreground">
                  No students enrolled in this level yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

export function PrimaryPage() {
  return (
    <SchoolLevelPage
      level="primary"
      title="Primary School"
      subtitle="Grade 1-6 • Foundation of Competency Based Curriculum"
      gradeRange={[1, 2, 3, 4, 5, 6]}
    />
  );
}

export function JuniorPage() {
  return (
    <SchoolLevelPage
      level="junior"
      title="Junior School"
      subtitle="Grade 7-9 • Lower Secondary Education"
      gradeRange={[7, 8, 9]}
    />
  );
}

export function SeniorPage() {
  const { students } = useSchool();
  const seniorStudents = students.filter(s => s.schoolLevel === 'senior');
  
  const pathwayStats = {
    STEM: seniorStudents.filter(s => s.pathway === 'STEM').length,
    'Social Sciences': seniorStudents.filter(s => s.pathway === 'Social Sciences').length,
    'Arts and Sports Science': seniorStudents.filter(s => s.pathway === 'Arts and Sports Science').length,
  };

  return (
    <MainLayout title="Senior School" subtitle="Grade 10-12 • Pathway-Based Learning">
      <div className="space-y-6">
        {/* Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{seniorStudents.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">STEM Pathway</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{pathwayStats.STEM}</p>
            </CardContent>
          </Card>
          <Card className="bg-secondary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Social Sciences</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-secondary">{pathwayStats['Social Sciences']}</p>
            </CardContent>
          </Card>
          <Card className="bg-info/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Arts & Sports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-info">{pathwayStats['Arts and Sports Science']}</p>
            </CardContent>
          </Card>
        </div>

        {/* Core Subjects */}
        <Card>
          <CardHeader>
            <CardTitle>Compulsory Core Subjects (All Students)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {CORE_SUBJECTS.map(subject => (
                <Badge key={subject} className="text-sm py-1 px-3">
                  {subject}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Note: Mathematics offers a choice between Core Mathematics (for STEM) and Essential Mathematics (for others)
            </p>
          </CardContent>
        </Card>

        {/* Pathway Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* STEM */}
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">A. STEM Pathway</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(STEM_SUBJECTS).map(([track, subjects]) => (
                <div key={track}>
                  <p className="font-medium text-sm text-muted-foreground mb-2">{track}</p>
                  <div className="flex flex-wrap gap-1">
                    {subjects.map(subject => (
                      <Badge key={subject} variant="outline" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Social Sciences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-secondary">B. Social Sciences Pathway</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(SOCIAL_SCIENCES_SUBJECTS).map(([track, subjects]) => (
                <div key={track}>
                  <p className="font-medium text-sm text-muted-foreground mb-2">{track}</p>
                  <div className="flex flex-wrap gap-1">
                    {subjects.map(subject => (
                      <Badge key={subject} variant="outline" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Arts & Sports */}
          <Card>
            <CardHeader>
              <CardTitle className="text-info">C. Arts & Sports Science Pathway</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(ARTS_SPORTS_SUBJECTS).map(([track, subjects]) => (
                <div key={track}>
                  <p className="font-medium text-sm text-muted-foreground mb-2">{track}</p>
                  <div className="flex flex-wrap gap-1">
                    {subjects.map(subject => (
                      <Badge key={subject} variant="outline" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
