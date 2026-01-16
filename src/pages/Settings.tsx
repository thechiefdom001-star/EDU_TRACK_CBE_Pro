import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useSchool } from '@/contexts/SchoolContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { FeeStructure, SchoolLevel, Term } from '@/types';
import { formatCurrency, calculateTotalFees, generateId } from '@/lib/storage';
import { toast } from 'sonner';
import { Save, School, Wallet, Bell, Shield } from 'lucide-react';

export default function Settings() {
  const { feeStructures, addFeeStructure, updateFeeStructure } = useSchool();
  const [selectedTerm, setSelectedTerm] = useState<Term>(1);
  const [selectedLevel, setSelectedLevel] = useState<SchoolLevel>('primary');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const currentStructure = feeStructures.find(
    f => f.term === selectedTerm && f.schoolLevel === selectedLevel && f.year === selectedYear
  );

  const [feeData, setFeeData] = useState<Partial<FeeStructure>>(currentStructure || {
    tuitionFees: 0,
    admissionFees: 0,
    assessmentFees: 0,
    schoolIdFees: 0,
    remedialFees: 0,
    bookFund: 0,
    uniformFees: 0,
    boardingFees: 0,
    lunchFees: 0,
    breakfastFees: 0,
    tripFees: 0,
    diaryFees: 0,
    projectFees: 0,
    ptaFees: 0,
    developmentFees: 0,
  });

  const handleLoadStructure = () => {
    const structure = feeStructures.find(
      f => f.term === selectedTerm && f.schoolLevel === selectedLevel && f.year === selectedYear
    );
    if (structure) {
      setFeeData(structure);
    } else {
      setFeeData({
        tuitionFees: 0, admissionFees: 0, assessmentFees: 0, schoolIdFees: 0,
        remedialFees: 0, bookFund: 0, uniformFees: 0, boardingFees: 0,
        lunchFees: 0, breakfastFees: 0, tripFees: 0, diaryFees: 0,
        projectFees: 0, ptaFees: 0, developmentFees: 0,
      });
    }
  };

  const handleSaveFeeStructure = () => {
    const existingIndex = feeStructures.findIndex(
      f => f.term === selectedTerm && f.schoolLevel === selectedLevel && f.year === selectedYear
    );

    if (existingIndex >= 0) {
      updateFeeStructure(feeStructures[existingIndex].id, feeData);
    } else {
      addFeeStructure({
        ...feeData as FeeStructure,
        term: selectedTerm,
        year: selectedYear,
        schoolLevel: selectedLevel,
      });
    }
    toast.success('Fee structure saved successfully!');
  };

  const feeFields = [
    { key: 'tuitionFees', label: 'Tuition Fees' },
    { key: 'admissionFees', label: 'Admission Fees' },
    { key: 'assessmentFees', label: 'Assessment Fees' },
    { key: 'schoolIdFees', label: 'School ID Fees' },
    { key: 'remedialFees', label: 'Remedial Fees' },
    { key: 'bookFund', label: 'Book Fund' },
    { key: 'uniformFees', label: 'Uniform Fees' },
    { key: 'boardingFees', label: 'Boarding Fees' },
    { key: 'lunchFees', label: 'Lunch Fees' },
    { key: 'breakfastFees', label: 'Breakfast Fees' },
    { key: 'tripFees', label: 'Trip Fees' },
    { key: 'diaryFees', label: 'Diary Fees' },
    { key: 'projectFees', label: 'Project Fees' },
    { key: 'ptaFees', label: 'PTA Fees' },
    { key: 'developmentFees', label: 'Development Fees' },
  ];

  const totalFees = Object.entries(feeData)
    .filter(([key]) => key.includes('Fees') || key.includes('Fund'))
    .reduce((sum, [_, value]) => sum + (Number(value) || 0), 0);

  return (
    <MainLayout title="Settings" subtitle="Configure school settings and fee structures">
      <Tabs defaultValue="fees" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="fees" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Fee Structure
          </TabsTrigger>
          <TabsTrigger value="school" className="flex items-center gap-2">
            <School className="h-4 w-4" />
            School Info
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fees" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fee Structure Configuration</CardTitle>
              <CardDescription>
                Set up fee structures for each term and school level
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Select 
                    value={selectedYear.toString()} 
                    onValueChange={(v) => setSelectedYear(parseInt(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Term</Label>
                  <Select 
                    value={selectedTerm.toString()} 
                    onValueChange={(v) => setSelectedTerm(parseInt(v) as Term)}
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
                  <Label>School Level</Label>
                  <Select 
                    value={selectedLevel} 
                    onValueChange={(v) => setSelectedLevel(v as SchoolLevel)}
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
                <div className="flex items-end">
                  <Button variant="outline" onClick={handleLoadStructure} className="w-full">
                    Load Structure
                  </Button>
                </div>
              </div>

              {/* Fee Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {feeFields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label className="text-sm">{field.label}</Label>
                    <Input 
                      type="number"
                      value={feeData[field.key as keyof FeeStructure] || 0}
                      onChange={(e) => setFeeData({
                        ...feeData, 
                        [field.key]: parseInt(e.target.value) || 0
                      })}
                      className="text-right"
                    />
                  </div>
                ))}
              </div>

              {/* Total & Save */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Total Fees</p>
                  <p className="text-3xl font-bold text-primary">{formatCurrency(totalFees)}</p>
                </div>
                <Button onClick={handleSaveFeeStructure} size="lg">
                  <Save className="h-4 w-4 mr-2" />
                  Save Fee Structure
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Existing Structures */}
          <Card>
            <CardHeader>
              <CardTitle>Saved Fee Structures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {feeStructures.map((structure) => (
                  <div 
                    key={structure.id} 
                    className="p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedTerm(structure.term);
                      setSelectedLevel(structure.schoolLevel);
                      setSelectedYear(structure.year);
                      setFeeData(structure);
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium capitalize">{structure.schoolLevel}</span>
                      <span className="text-sm text-muted-foreground">
                        Term {structure.term}, {structure.year}
                      </span>
                    </div>
                    <p className="text-xl font-bold text-primary">
                      {formatCurrency(
                        Object.entries(structure)
                          .filter(([key]) => key.includes('Fees') || key.includes('Fund'))
                          .reduce((sum, [_, value]) => sum + (Number(value) || 0), 0)
                      )}
                    </p>
                  </div>
                ))}
                {feeStructures.length === 0 && (
                  <p className="text-muted-foreground col-span-3 text-center py-8">
                    No fee structures configured yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="school">
          <Card>
            <CardHeader>
              <CardTitle>School Information</CardTitle>
              <CardDescription>Basic school details and configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>School Name</Label>
                  <Input defaultValue="EduKenya Academy" />
                </div>
                <div className="space-y-2">
                  <Label>School Motto</Label>
                  <Input defaultValue="Excellence Through Competency" />
                </div>
                <div className="space-y-2">
                  <Label>County</Label>
                  <Input defaultValue="Nairobi" />
                </div>
                <div className="space-y-2">
                  <Label>Sub-County</Label>
                  <Input defaultValue="Westlands" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input defaultValue="+254 712 345 678" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue="info@edukenya.ac.ke" />
                </div>
              </div>
              <Button className="mt-4">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure fee reminders and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fee Reminder Days Before Due</Label>
                  <Input type="number" defaultValue={7} />
                </div>
                <div className="space-y-2">
                  <Label>SMS Gateway API URL</Label>
                  <Input placeholder="https://api.sms.gateway.com" />
                </div>
                <div className="space-y-2">
                  <Label>Google Sheet Deploy URL</Label>
                  <Input placeholder="https://script.google.com/..." />
                </div>
              </div>
              <Button className="mt-4">
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage access and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Admin Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <Button className="mt-4">
                <Save className="h-4 w-4 mr-2" />
                Update Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
