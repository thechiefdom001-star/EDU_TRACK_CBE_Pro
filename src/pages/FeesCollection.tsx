import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useSchool } from '@/contexts/SchoolContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Receipt, Search, Printer, Eye, Trash2, FileText } from 'lucide-react';
import { formatCurrency, formatDate, generateReceiptNumber } from '@/lib/storage';
import { FeePayment, Term } from '@/types';
import { toast } from 'sonner';
import { PrintButton, printReceipt, printFeeReminder } from '@/components/common/PrintButton';
import { DeleteConfirmDialog } from '@/components/common/DeleteConfirmDialog';

export default function FeesCollection() {
  const { students, feePayments, addFeePayment, deleteFeePayment, feeStructures, schoolInfo } = useSchool();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<FeePayment | null>(null);
  const [deletePayment, setDeletePayment] = useState<FeePayment | null>(null);

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

  const totalCollected = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
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

  const getStudent = (studentId: string) => students.find(s => s.id === studentId);

  const handlePrintReceipt = (payment: FeePayment) => {
    const student = getStudent(payment.studentId);
    if (!student) return;
    
    printReceipt({
      receiptNumber: payment.receiptNumber,
      studentName: `${student.firstName} ${student.lastName}`,
      admissionNumber: student.admissionNumber,
      grade: `Grade ${student.grade}${student.stream || ''}`,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      term: payment.term,
      year: payment.year,
      description: payment.description,
      receivedBy: payment.receivedBy,
      paymentDate: formatDate(payment.paymentDate),
    }, schoolInfo);
  };

  const handlePrintReminder = (studentId: string) => {
    const student = getStudent(studentId);
    if (!student) return;

    const studentPayments = feePayments.filter(p => p.studentId === studentId);
    const totalPaid = studentPayments.reduce((sum, p) => sum + p.amount, 0);
    
    // Get fee structure for student's level
    const structure = feeStructures.find(f => f.schoolLevel === student.schoolLevel);
    const totalFees = structure ? Object.entries(structure)
      .filter(([key]) => key.includes('Fees') || key.includes('Fund'))
      .reduce((sum, [_, value]) => sum + (Number(value) || 0), 0) : 50000;

    printFeeReminder({
      studentName: `${student.firstName} ${student.lastName}`,
      admissionNumber: student.admissionNumber,
      grade: `Grade ${student.grade}${student.stream || ''}`,
      guardianName: student.guardianName,
      totalFees,
      amountPaid: totalPaid,
      balance: totalFees - totalPaid,
      term: 1,
      year: new Date().getFullYear(),
    }, schoolInfo);
  };

  const handlePrintAllReminders = () => {
    const studentsWithBalance = students.filter(student => {
      const paid = feePayments.filter(p => p.studentId === student.id).reduce((sum, p) => sum + p.amount, 0);
      const structure = feeStructures.find(f => f.schoolLevel === student.schoolLevel);
      const total = structure ? Object.entries(structure)
        .filter(([key]) => key.includes('Fees') || key.includes('Fund'))
        .reduce((sum, [_, value]) => sum + (Number(value) || 0), 0) : 50000;
      return total - paid > 0;
    });

    studentsWithBalance.forEach((student, index) => {
      setTimeout(() => handlePrintReminder(student.id), index * 500);
    });
    
    toast.success(`Printing ${studentsWithBalance.length} fee reminders...`);
  };

  return (
    <MainLayout title="Fees Collection" subtitle="Record and manage fee payments">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Collected (Filtered)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{formatCurrency(totalCollected)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today's Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-success">{formatCurrency(todayCollected)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
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
          
          <div className="flex gap-2">
            <PrintButton tableId="fees-table" title="Fee Collection Register" />
            <Button variant="outline" onClick={handlePrintAllReminders}>
              <FileText className="h-4 w-4 mr-2" />
              Print All Reminders
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />Record Payment</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Record Fee Payment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Select Student</Label>
                    <Select value={formData.studentId} onValueChange={(v) => setFormData({...formData, studentId: v})}>
                      <SelectTrigger><SelectValue placeholder="Choose a student" /></SelectTrigger>
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
                    <Input type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: parseInt(e.target.value) || 0})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <Select value={formData.paymentMethod} onValueChange={(v) => setFormData({...formData, paymentMethod: v as FeePayment['paymentMethod']})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
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
                      <Select value={formData.term.toString()} onValueChange={(v) => setFormData({...formData, term: parseInt(v) as Term})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
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
                    <Input value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="e.g., Tuition fees" />
                  </div>
                  <div className="space-y-2">
                    <Label>Received By</Label>
                    <Input value={formData.receivedBy} onChange={(e) => setFormData({...formData, receivedBy: e.target.value})} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddPayment}>Record Payment</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <Table id="fees-table">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Receipt No.</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Adm. No.</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Term</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => {
                const student = getStudent(payment.studentId);
                return (
                  <TableRow key={payment.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-sm">{payment.receiptNumber}</TableCell>
                    <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                    <TableCell className="font-medium">{student ? `${student.firstName} ${student.lastName}` : 'Unknown'}</TableCell>
                    <TableCell className="font-mono text-sm">{student?.admissionNumber || 'N/A'}</TableCell>
                    <TableCell className="text-right font-semibold text-primary">{formatCurrency(payment.amount)}</TableCell>
                    <TableCell className="capitalize">{payment.paymentMethod.replace('_', ' ')}</TableCell>
                    <TableCell>Term {payment.term}, {payment.year}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedReceipt(payment)} title="View Receipt">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handlePrintReceipt(payment)} title="Print Receipt">
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => student && handlePrintReminder(student.id)} title="Fee Reminder">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeletePayment(payment)} title="Delete">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredPayments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No payments found</TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4} className="font-bold">TOTAL</TableCell>
                <TableCell className="text-right font-bold text-primary">{formatCurrency(totalCollected)}</TableCell>
                <TableCell colSpan={3}></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        {/* View Receipt Dialog */}
        <Dialog open={!!selectedReceipt} onOpenChange={() => setSelectedReceipt(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Payment Receipt</DialogTitle>
            </DialogHeader>
            {selectedReceipt && (() => {
              const student = getStudent(selectedReceipt.studentId);
              return (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                  <div className="text-center border-b pb-4">
                    <h3 className="text-xl font-bold">{schoolInfo.name}</h3>
                    <p className="text-sm text-muted-foreground">Fee Payment Receipt</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><p className="text-muted-foreground">Receipt No:</p><p className="font-medium">{selectedReceipt.receiptNumber}</p></div>
                    <div><p className="text-muted-foreground">Date:</p><p className="font-medium">{formatDate(selectedReceipt.paymentDate)}</p></div>
                    <div><p className="text-muted-foreground">Student:</p><p className="font-medium">{student ? `${student.firstName} ${student.lastName}` : 'Unknown'}</p></div>
                    <div><p className="text-muted-foreground">Adm No:</p><p className="font-medium">{student?.admissionNumber}</p></div>
                    <div className="col-span-2 border-t pt-4">
                      <p className="text-muted-foreground">Amount Paid:</p>
                      <p className="text-2xl font-bold text-primary">{formatCurrency(selectedReceipt.amount)}</p>
                    </div>
                  </div>
                </div>
              );
            })()}
            <DialogFooter>
              <Button onClick={() => selectedReceipt && handlePrintReceipt(selectedReceipt)}>
                <Printer className="h-4 w-4 mr-2" />Print Receipt
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <DeleteConfirmDialog
          open={!!deletePayment}
          onOpenChange={() => setDeletePayment(null)}
          onConfirm={() => {
            if (deletePayment) {
              deleteFeePayment(deletePayment.id);
              toast.success('Payment record deleted');
              setDeletePayment(null);
            }
          }}
          title="Delete Payment Record"
          description="Are you sure you want to delete this payment record? This action cannot be undone."
        />
      </div>
    </MainLayout>
  );
}
