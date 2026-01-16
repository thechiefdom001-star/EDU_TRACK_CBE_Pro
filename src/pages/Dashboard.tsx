import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { useSchool } from '@/contexts/SchoolContext';
import { formatCurrency } from '@/lib/storage';
import { 
  Users, GraduationCap, Wallet, TrendingUp, UserCheck, 
  BookOpen, AlertCircle, CheckCircle2 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GRADE_POINTS, GradeLevel } from '@/types';

const COLORS = ['hsl(145, 63%, 42%)', 'hsl(35, 80%, 55%)', 'hsl(200, 80%, 50%)', 'hsl(0, 72%, 51%)', 'hsl(280, 60%, 50%)'];

export default function Dashboard() {
  const { students, teachers, feePayments, assessments, attendance } = useSchool();

  // Calculate stats
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalRevenue = feePayments.reduce((sum, p) => sum + p.amount, 0);
  
  // Students by level
  const studentsByLevel = [
    { name: 'Primary', value: students.filter(s => s.schoolLevel === 'primary').length },
    { name: 'Junior', value: students.filter(s => s.schoolLevel === 'junior').length },
    { name: 'Senior', value: students.filter(s => s.schoolLevel === 'senior').length },
  ];

  // Attendance rate calculation
  const presentCount = attendance.filter(a => a.status === 'present' || a.status === 'late').length;
  const attendanceRate = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 95;

  // Average grade calculation
  const avgPoints = assessments.length > 0
    ? (assessments.reduce((sum, a) => sum + GRADE_POINTS[a.grade as GradeLevel], 0) / assessments.length).toFixed(1)
    : 6.5;

  // Grade distribution
  const gradeDistribution = [
    { name: 'EE', count: assessments.filter(a => a.grade.startsWith('EE')).length || 15 },
    { name: 'ME', count: assessments.filter(a => a.grade.startsWith('ME')).length || 25 },
    { name: 'AE', count: assessments.filter(a => a.grade.startsWith('AE')).length || 8 },
    { name: 'BE', count: assessments.filter(a => a.grade.startsWith('BE')).length || 2 },
  ];

  // Monthly revenue (sample data for visualization)
  const monthlyRevenue = [
    { month: 'Jan', revenue: 450000 },
    { month: 'Feb', revenue: 380000 },
    { month: 'Mar', revenue: 520000 },
    { month: 'Apr', revenue: 290000 },
    { month: 'May', revenue: 410000 },
    { month: 'Jun', revenue: 380000 },
  ];

  // Pathway distribution for senior students
  const pathwayData = [
    { name: 'STEM', value: students.filter(s => s.pathway === 'STEM').length || 12 },
    { name: 'Social Sciences', value: students.filter(s => s.pathway === 'Social Sciences').length || 8 },
    { name: 'Arts & Sports', value: students.filter(s => s.pathway === 'Arts and Sports Science').length || 5 },
  ];

  return (
    <MainLayout title="Dashboard" subtitle="Welcome back! Here's what's happening at your school.">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Students"
          value={totalStudents}
          icon={<Users className="h-6 w-6" />}
          variant="primary"
          change={{ value: 12, type: 'increase' }}
        />
        <StatCard
          title="Total Teachers"
          value={totalTeachers}
          icon={<GraduationCap className="h-6 w-6" />}
          variant="secondary"
        />
        <StatCard
          title="Revenue (Term 1)"
          value={formatCurrency(totalRevenue || 2850000)}
          icon={<Wallet className="h-6 w-6" />}
          variant="success"
          change={{ value: 8, type: 'increase' }}
        />
        <StatCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          icon={<UserCheck className="h-6 w-6" />}
          variant="warning"
          change={{ value: 2, type: 'increase' }}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Revenue Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${v/1000}K`} />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Students by Level */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Students by Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={studentsByLevel}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {studentsByLevel.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Grade Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              CBC Grade Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={gradeDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  <Cell fill="hsl(var(--success))" />
                  <Cell fill="hsl(var(--info))" />
                  <Cell fill="hsl(var(--warning))" />
                  <Cell fill="hsl(var(--destructive))" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-4 mt-4 text-sm">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-success"></span> EE</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-info"></span> ME</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-warning"></span> AE</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-destructive"></span> BE</span>
            </div>
          </CardContent>
        </Card>

        {/* Senior Pathways */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Senior School Pathways
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pathwayData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pathwayData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { icon: CheckCircle2, text: 'Fee payment received from Amina Wanjiku', time: '2 hours ago', color: 'text-success' },
                { icon: Users, text: 'New student enrolled: Brian Ochieng', time: '5 hours ago', color: 'text-primary' },
                { icon: BookOpen, text: 'Term 1 assessments completed for Grade 10', time: '1 day ago', color: 'text-info' },
                { icon: AlertCircle, text: '3 students have pending fee balances', time: '2 days ago', color: 'text-warning' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <activity.icon className={`h-5 w-5 ${activity.color}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.text}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Average Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-6xl font-bold text-primary mb-2">{avgPoints}</div>
              <p className="text-muted-foreground">Average Points (out of 8)</p>
              <div className="mt-6 p-4 bg-success/10 rounded-lg">
                <p className="text-success font-semibold">Meeting Expectations</p>
                <p className="text-sm text-muted-foreground mt-1">
                  School average is above national benchmark
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
