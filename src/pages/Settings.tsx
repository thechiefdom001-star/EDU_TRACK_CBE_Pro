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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { FeeStructure, SchoolLevel, Term, FeeItem } from '@/types';
import { formatCurrency } from '@/lib/storage';
import { toast } from 'sonner';
import { Save, School, Wallet, Bell, Shield, Plus, Upload } from 'lucide-react';
import { FeeItemCard } from '@/components/common/FeeItemCard';

export default function Settings() {
  const { 
    schoolInfo, updateSchoolInfo,
    feeStructures, addFeeStructure, updateFeeStructure,
    feeItems, addFeeItem, updateFeeItem, deleteFeeItem
  } = useSchool();
  
  const [selectedTerm, setSelectedTerm] = useState<Term>(1);
  const [selectedLevel, setSelectedLevel] = useState<SchoolLevel>('primary');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isAddFeeItemOpen, setIsAddFeeItemOpen] = useState(false);
  const [newFeeItem, setNewFeeItem] = useState({ key: '', label: '', description: '' });

  // School info form
  const [schoolForm, setSchoolForm] = useState(schoolInfo);

  const currentStructure = feeStructures.find(
    f => f.term === selectedTerm && f.schoolLevel === selectedLevel && f.year === selectedYear
  );

  const [feeData, setFeeData] = useState<Partial<FeeStructure>>(currentStructure || {
    tuitionFees: 0, admissionFees: 0, assessmentFees: 0, schoolIdFees: 0,
    remedialFees: 0, bookFund: 0, uniformFees: 0, boardingFees: 0,
    lunchFees: 0, breakfastFees: 0, tripFees: 0, diaryFees: 0,
    projectFees: 0, ptaFees: 0, developmentFees: 0,
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

  const handleSaveSchoolInfo = () => {
    updateSchoolInfo(schoolForm);
    toast.success('School information updated!');
  };

  const handleAddFeeItem = () => {
    if (!newFeeItem.label) {
      toast.error('Please enter a fee item name');
      return;
    }
    addFeeItem({
      key: newFeeItem.key || newFeeItem.label.toLowerCase().replace(/\s+/g, '') + 'Fees',
      label: newFeeItem.label,
      description: newFeeItem.description,
      enabled: true,
    });
    setNewFeeItem({ key: '', label: '', description: '' });
    setIsAddFeeItemOpen(false);
    toast.success('Fee item added!');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSchoolForm({ ...schoolForm, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Get enabled fee items for the structure form
  const enabledFeeItems = feeItems.filter(item => item.enabled);

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
          {/* Fee Items Management */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Fee Items</CardTitle>
                <CardDescription>Enable/disable fee items to show in fee structure</CardDescription>
              </div>
              <Button onClick={() => setIsAddFeeItemOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Fee Item
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {feeItems.map((item) => (
                  <FeeItemCard
                    key={item.id}
                    item={item}
                    onToggle={(id, enabled) => updateFeeItem(id, { enabled })}
                    onEdit={(id, data) => updateFeeItem(id, data)}
                    onDelete={deleteFeeItem}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Fee Structure Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Fee Structure Configuration</CardTitle>
              <CardDescription>Set up fee amounts for each term and school level</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Term</Label>
                  <Select value={selectedTerm.toString()} onValueChange={(v) => setSelectedTerm(parseInt(v) as Term)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Term 1</SelectItem>
                      <SelectItem value="2">Term 2</SelectItem>
                      <SelectItem value="3">Term 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>School Level</Label>
                  <Select value={selectedLevel} onValueChange={(v) => setSelectedLevel(v as SchoolLevel)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">Primary</SelectItem>
                      <SelectItem value="junior">Junior (Grade 6-9)</SelectItem>
                      <SelectItem value="senior">Senior (Grade 10-12)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" onClick={handleLoadStructure} className="w-full">Load Structure</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {enabledFeeItems.map((item) => (
                  <div key={item.key} className="space-y-2">
                    <Label className="text-sm">{item.label}</Label>
                    <Input 
                      type="number"
                      value={feeData[item.key as keyof FeeStructure] || 0}
                      onChange={(e) => setFeeData({...feeData, [item.key]: parseInt(e.target.value) || 0})}
                      className="text-right"
                    />
                  </div>
                ))}
              </div>

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
        </TabsContent>

        <TabsContent value="school">
          <Card>
            <CardHeader>
              <CardTitle>School Information</CardTitle>
              <CardDescription>Basic school details used in printouts and receipts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo Upload */}
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden bg-muted">
                  {schoolForm.logo ? (
                    <img src={schoolForm.logo} alt="School Logo" className="h-full w-full object-contain" />
                  ) : (
                    <span className="text-4xl">🏫</span>
                  )}
                </div>
                <div>
                  <Label htmlFor="logo-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors">
                      <Upload className="h-4 w-4" />
                      Upload Logo
                    </div>
                  </Label>
                  <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  <p className="text-xs text-muted-foreground mt-2">PNG, JPG up to 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>School Name</Label>
                  <Input value={schoolForm.name} onChange={(e) => setSchoolForm({...schoolForm, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>School Motto</Label>
                  <Input value={schoolForm.motto || ''} onChange={(e) => setSchoolForm({...schoolForm, motto: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input value={schoolForm.address} onChange={(e) => setSchoolForm({...schoolForm, address: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>County</Label>
                  <Input value={schoolForm.county || ''} onChange={(e) => setSchoolForm({...schoolForm, county: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={schoolForm.phone} onChange={(e) => setSchoolForm({...schoolForm, phone: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={schoolForm.email} onChange={(e) => setSchoolForm({...schoolForm, email: e.target.value})} />
                </div>
              </div>
              <Button onClick={handleSaveSchoolInfo}>
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
              </div>
              <Button><Save className="h-4 w-4 mr-2" />Save Settings</Button>
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
              <Button><Save className="h-4 w-4 mr-2" />Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Fee Item Dialog */}
      <Dialog open={isAddFeeItemOpen} onOpenChange={setIsAddFeeItemOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Fee Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Fee Item Name *</Label>
              <Input 
                value={newFeeItem.label}
                onChange={(e) => setNewFeeItem({...newFeeItem, label: e.target.value})}
                placeholder="e.g., Sports Fee"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input 
                value={newFeeItem.description}
                onChange={(e) => setNewFeeItem({...newFeeItem, description: e.target.value})}
                placeholder="Brief description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddFeeItemOpen(false)}>Cancel</Button>
            <Button onClick={handleAddFeeItem}>Add Fee Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
