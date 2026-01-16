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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Receipt, Search, Printer } from 'lucide-react';
import { formatCurrency, formatDate, generateReceiptNumber } from '@/lib/storage';
import { FeePayment, Term } from '@/types';
import { toast } from 'sonner';

export default function FeesCollection() {
  const { students, feePayments, addFeePayment } = useSchool();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<FeePayment | null>(null);

  const [formData, setFormData] = useState({
    studentId: '',
    amount: 0,
    paymentMethod: 'mpesa' as FeePayment['paymentMethod'],
    term: 1 as Term,
    year: new Date().getFullYear(),
    description: '',
    receivedBy: 'Admin',
  });

  const filteredPayments = feePayments.filter(payment => {
    const student = students.find(s => s.id === payment.studentId);
    if (!student) return false;
    return (
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalCollected = feePayments.reduce((sum, p) => sum + p.amount, 0);
  const todayCollected = feePayments
    .filter(p => p.paymentDate === new Date().toISOString().split('T')[0])
    .reduce((sum, p) => sum + p.amount, 0);

  const handleAddPayment = () => {
    const newPayment: Omit<FeePayment, 'id'> = {
      receiptNumber: generateReceiptNumber(),
      studentId: formData.studentId,
      amount: formData.amount,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: formData.paymentMethod,
      term: formData.term,
      year: formData.year,
      description: formData.description,
      receivedBy: formData.receivedBy,
    };
    addFeePayment(newPayment);
    setIsAddDialogOpen(false);
    setFormData({
      studentId: '', amount: 0, paymentMethod: 'mpesa',
      term: 1, year: new Date().getFullYear(), description: '', receivedBy: 'Admin'
    });
    toast.success('Payment recorded successfully!');
  };

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown';
  };

  const getStudentAdmNo = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student?.admissionNumber || 'N/A';
  };

  const printReceipt = (payment: FeePayment) => {
    const student = students.find(s => s.id === payment.studentId);
    const receiptContent = `
      ========================================
                  FEE RECEIPT
      ========================================
      Receipt No: ${payment.receiptNumber}
      Date: ${formatDate(payment.paymentDate)}
      
      Student: ${student?.firstName} ${student?.lastName}
      Adm No: ${student?.admissionNumber}
      Grade: ${student?.grade}${student?.stream || ''}
      
      Amount: ${formatCurrency(payment.amount)}
      Payment Method: ${payment.paymentMethod.toUpperCase()}
      Term: ${payment.term}, ${payment.year}
      
      Description: ${payment.description}
      
      Received By: ${payment.receivedBy}
      ========================================
            Thank you for your payment!
      ========================================
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`<pre style="font-family: monospace; font-size: 14px;">${receiptContent}</pre>`);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <MainLayout title="Fees Collection" subtitle="Record and manage fee payments">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Collected (This Term)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{formatCurrency(totalCollected)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Today's Collection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-success">{formatCurrency(todayCollected)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{feePayments.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by student name or receipt number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Record Payment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Fee Payment</DialogTitle>
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
                          {student.admissionNumber} - {student.firstName} {student.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Amount (KES)</Label>
                  <Input 
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <Select 
                      value={formData.paymentMethod} 
                      onValueChange={(v) => setFormData({...formData, paymentMethod: v as FeePayment['paymentMethod']})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mpesa">M-Pesa</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="cheque">Cheque</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="e.g., Tuition fees, Lunch fees"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Received By</Label>
                  <Input 
                    value={formData.receivedBy}
                    onChange={(e) => setFormData({...formData, receivedBy: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPayment}>
                  Record Payment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Payments Table */}
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Receipt No.</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Adm. No.</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Term</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-sm">{payment.receiptNumber}</TableCell>
                  <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                  <TableCell className="font-medium">{getStudentName(payment.studentId)}</TableCell>
                  <TableCell className="font-mono text-sm">{getStudentAdmNo(payment.studentId)}</TableCell>
                  <TableCell className="font-semibold text-primary">
                    {formatCurrency(payment.amount)}
                  </TableCell>
                  <TableCell className="capitalize">{payment.paymentMethod.replace('_', ' ')}</TableCell>
                  <TableCell>Term {payment.term}, {payment.year}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setSelectedReceipt(payment)}
                      >
                        <Receipt className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => printReceipt(payment)}
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPayments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No payments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* View Receipt Dialog */}
        <Dialog open={!!selectedReceipt} onOpenChange={() => setSelectedReceipt(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Payment Receipt</DialogTitle>
            </DialogHeader>
            {selectedReceipt && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                <div className="text-center border-b pb-4">
                  <h3 className="text-xl font-bold">EduKenya School</h3>
                  <p className="text-sm text-muted-foreground">Fee Payment Receipt</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Receipt No:</p>
                    <p className="font-medium">{selectedReceipt.receiptNumber}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date:</p>
                    <p className="font-medium">{formatDate(selectedReceipt.paymentDate)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Student:</p>
                    <p className="font-medium">{getStudentName(selectedReceipt.studentId)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Adm No:</p>
                    <p className="font-medium">{getStudentAdmNo(selectedReceipt.studentId)}</p>
                  </div>
                  <div className="col-span-2 border-t pt-4">
                    <p className="text-muted-foreground">Amount Paid:</p>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(selectedReceipt.amount)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payment Method:</p>
                    <p className="font-medium capitalize">{selectedReceipt.paymentMethod.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Term:</p>
                    <p className="font-medium">Term {selectedReceipt.term}, {selectedReceipt.year}</p>
                  </div>
                </div>
                <div className="text-center border-t pt-4 text-sm text-muted-foreground">
                  Thank you for your payment!
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => selectedReceipt && printReceipt(selectedReceipt)}>
                <Printer className="h-4 w-4 mr-2" />
                Print Receipt
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
