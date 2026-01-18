import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { useSchool } from '@/contexts/SchoolContext';
import { SchoolInfo } from '@/types';

interface PrintButtonProps {
  tableId: string;
  title: string;
  schoolInfo?: SchoolInfo;
  showFooterTotals?: boolean;
}

export function PrintButton({ tableId, title, schoolInfo: propSchoolInfo, showFooterTotals = false }: PrintButtonProps) {
  const { schoolInfo: contextSchoolInfo } = useSchool();
  const schoolInfo = propSchoolInfo || contextSchoolInfo;
  
  const handlePrint = () => {
    const table = document.getElementById(tableId);
    if (!table) return;

    const logoSection = schoolInfo.logo 
      ? `<img src="${schoolInfo.logo}" alt="School Logo" class="school-logo" />`
      : `<div class="logo-placeholder">🏫</div>`;

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            padding: 20px;
            font-size: 12px;
          }
          .header {
            text-align: center;
            border-bottom: 3px double #333;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }
          .school-logo {
            width: 80px;
            height: 80px;
            object-fit: contain;
            margin-bottom: 10px;
          }
          .logo-placeholder {
            font-size: 48px;
            margin-bottom: 10px;
          }
          .school-name {
            font-size: 24px;
            font-weight: bold;
            color: #1a1a1a;
            margin-bottom: 5px;
          }
          .school-motto {
            font-style: italic;
            color: #666;
            margin-bottom: 8px;
          }
          .school-contact {
            font-size: 11px;
            color: #444;
            line-height: 1.4;
          }
          .document-title {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            margin: 15px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
            background: #f0f0f0;
            padding: 8px;
            border-radius: 4px;
          }
          .print-date {
            text-align: right;
            font-size: 10px;
            color: #666;
            margin-bottom: 10px;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 10px;
          }
          th, td { 
            border: 1px solid #333; 
            padding: 8px 10px; 
            text-align: left; 
          }
          th { 
            background-color: #f0f0f0; 
            font-weight: bold;
            text-transform: uppercase;
            font-size: 10px;
            letter-spacing: 0.5px;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          tfoot td {
            font-weight: bold;
            background-color: #e8e8e8;
          }
          .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #ccc;
            display: flex;
            justify-content: space-between;
            font-size: 10px;
          }
          .signature-line {
            width: 200px;
            border-top: 1px solid #333;
            margin-top: 40px;
            padding-top: 5px;
            text-align: center;
          }
          .page-footer {
            position: fixed;
            bottom: 20px;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 9px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 10px;
          }
          @media print {
            body { padding: 10px; }
            .no-print { display: none; }
            .page-footer { position: fixed; bottom: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          ${logoSection}
          <div class="school-name">${schoolInfo.name}</div>
          ${schoolInfo.motto ? `<div class="school-motto">"${schoolInfo.motto}"</div>` : ''}
          <div class="school-contact">
            ${schoolInfo.address}<br>
            Tel: ${schoolInfo.phone} | Email: ${schoolInfo.email}
          </div>
        </div>
        <div class="document-title">${title}</div>
        <div class="print-date">Printed on: ${new Date().toLocaleString('en-KE')}</div>
        ${table.outerHTML}
        <div class="footer">
          <div>
            <div class="signature-line">Administrator's Signature</div>
          </div>
          <div>
            <div class="signature-line">Date & Stamp</div>
          </div>
        </div>
        <div class="page-footer">
          ${schoolInfo.name} | ${schoolInfo.address} | ${schoolInfo.phone}
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  return (
    <Button variant="outline" onClick={handlePrint}>
      <Printer className="h-4 w-4 mr-2" />
      Print
    </Button>
  );
}

// Enhanced receipt printer with school branding
export function printReceipt(
  receiptData: {
    receiptNumber: string;
    studentName: string;
    admissionNumber: string;
    grade: string;
    amount: number;
    paymentMethod: string;
    term: number;
    year: number;
    description: string;
    receivedBy: string;
    paymentDate: string;
  },
  schoolInfo: SchoolInfo
) {
  const logoSection = schoolInfo.logo 
    ? `<img src="${schoolInfo.logo}" alt="School Logo" class="school-logo" />`
    : `<div class="logo-placeholder">🏫</div>`;

  const receiptContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Fee Receipt - ${receiptData.receiptNumber}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          padding: 20px;
          font-size: 12px;
          max-width: 400px;
          margin: 0 auto;
        }
        .receipt {
          border: 2px solid #333;
          padding: 20px;
        }
        .header {
          text-align: center;
          border-bottom: 2px dashed #333;
          padding-bottom: 15px;
          margin-bottom: 15px;
        }
        .school-logo {
          width: 60px;
          height: 60px;
          object-fit: contain;
          margin-bottom: 8px;
        }
        .logo-placeholder {
          font-size: 36px;
          margin-bottom: 8px;
        }
        .school-name {
          font-size: 18px;
          font-weight: bold;
        }
        .school-motto {
          font-style: italic;
          font-size: 10px;
          color: #666;
        }
        .school-contact {
          font-size: 10px;
          margin-top: 5px;
        }
        .receipt-title {
          text-align: center;
          font-size: 16px;
          font-weight: bold;
          margin: 10px 0;
          background: #f0f0f0;
          padding: 8px;
        }
        .details {
          margin: 15px 0;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
          border-bottom: 1px dotted #ccc;
        }
        .detail-label {
          color: #666;
        }
        .detail-value {
          font-weight: 500;
        }
        .amount-section {
          background: #f8f8f8;
          padding: 15px;
          margin: 15px 0;
          text-align: center;
          border: 1px solid #ddd;
        }
        .amount-label {
          font-size: 12px;
          color: #666;
        }
        .amount-value {
          font-size: 24px;
          font-weight: bold;
          color: #2563eb;
        }
        .footer {
          text-align: center;
          border-top: 2px dashed #333;
          padding-top: 15px;
          font-size: 10px;
          color: #666;
        }
        .signature-area {
          margin-top: 30px;
          display: flex;
          justify-content: space-between;
        }
        .signature-line {
          width: 120px;
          border-top: 1px solid #333;
          padding-top: 5px;
          text-align: center;
          font-size: 9px;
        }
        @media print {
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="header">
          ${logoSection}
          <div class="school-name">${schoolInfo.name}</div>
          ${schoolInfo.motto ? `<div class="school-motto">"${schoolInfo.motto}"</div>` : ''}
          <div class="school-contact">
            ${schoolInfo.address}<br>
            Tel: ${schoolInfo.phone} | Email: ${schoolInfo.email}
          </div>
        </div>
        
        <div class="receipt-title">FEE PAYMENT RECEIPT</div>
        
        <div class="details">
          <div class="detail-row">
            <span class="detail-label">Receipt No:</span>
            <span class="detail-value">${receiptData.receiptNumber}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Date:</span>
            <span class="detail-value">${receiptData.paymentDate}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Student:</span>
            <span class="detail-value">${receiptData.studentName}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Adm No:</span>
            <span class="detail-value">${receiptData.admissionNumber}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Grade:</span>
            <span class="detail-value">${receiptData.grade}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Term:</span>
            <span class="detail-value">Term ${receiptData.term}, ${receiptData.year}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Payment Method:</span>
            <span class="detail-value">${receiptData.paymentMethod.toUpperCase()}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Description:</span>
            <span class="detail-value">${receiptData.description}</span>
          </div>
        </div>
        
        <div class="amount-section">
          <div class="amount-label">AMOUNT PAID</div>
          <div class="amount-value">KES ${receiptData.amount.toLocaleString()}</div>
        </div>
        
        <div class="signature-area">
          <div class="signature-line">Received By</div>
          <div class="signature-line">Parent/Guardian</div>
        </div>
        
        <div class="footer">
          <p>Thank you for your payment!</p>
          <p style="margin-top: 5px;">${schoolInfo.name} | ${schoolInfo.phone}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(receiptContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
}

// Fee Reminder printer
export function printFeeReminder(
  reminderData: {
    studentName: string;
    admissionNumber: string;
    grade: string;
    guardianName: string;
    totalFees: number;
    amountPaid: number;
    balance: number;
    term: number;
    year: number;
    dueDate?: string;
    feeBreakdown?: { item: string; amount: number }[];
  },
  schoolInfo: SchoolInfo
) {
  const logoSection = schoolInfo.logo 
    ? `<img src="${schoolInfo.logo}" alt="School Logo" class="school-logo" />`
    : `<div class="logo-placeholder">🏫</div>`;

  const breakdownRows = reminderData.feeBreakdown?.map(item => `
    <tr>
      <td>${item.item}</td>
      <td style="text-align: right;">KES ${item.amount.toLocaleString()}</td>
    </tr>
  `).join('') || '';

  const reminderContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Fee Reminder - ${reminderData.studentName}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          padding: 30px;
          font-size: 12px;
          max-width: 800px;
          margin: 0 auto;
        }
        .header {
          text-align: center;
          border-bottom: 3px double #333;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
        .school-logo {
          width: 80px;
          height: 80px;
          object-fit: contain;
          margin-bottom: 10px;
        }
        .logo-placeholder {
          font-size: 48px;
          margin-bottom: 10px;
        }
        .school-name {
          font-size: 24px;
          font-weight: bold;
        }
        .school-motto {
          font-style: italic;
          color: #666;
          margin-top: 5px;
        }
        .school-contact {
          font-size: 11px;
          margin-top: 10px;
        }
        .document-title {
          background: #dc2626;
          color: white;
          padding: 10px;
          text-align: center;
          font-size: 18px;
          font-weight: bold;
          margin: 20px 0;
        }
        .date-section {
          text-align: right;
          margin-bottom: 20px;
        }
        .recipient {
          margin-bottom: 20px;
        }
        .content {
          line-height: 1.8;
          margin-bottom: 20px;
        }
        .student-info {
          background: #f8f8f8;
          padding: 15px;
          margin: 20px 0;
          border-left: 4px solid #2563eb;
        }
        .info-row {
          display: flex;
          margin-bottom: 5px;
        }
        .info-label {
          width: 150px;
          font-weight: 500;
        }
        .fee-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .fee-table th, .fee-table td {
          border: 1px solid #333;
          padding: 10px;
        }
        .fee-table th {
          background: #f0f0f0;
          text-align: left;
        }
        .summary {
          background: #fee2e2;
          padding: 20px;
          margin: 20px 0;
          border: 2px solid #dc2626;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
        }
        .balance-row {
          font-size: 20px;
          font-weight: bold;
          color: #dc2626;
          border-top: 2px solid #dc2626;
          padding-top: 10px;
          margin-top: 10px;
        }
        .footer-note {
          margin-top: 30px;
          padding: 15px;
          background: #f8f8f8;
          font-size: 11px;
        }
        .signature-section {
          margin-top: 40px;
          display: flex;
          justify-content: space-between;
        }
        .signature-line {
          width: 200px;
          border-top: 1px solid #333;
          padding-top: 5px;
          text-align: center;
        }
        .page-footer {
          margin-top: 40px;
          text-align: center;
          font-size: 10px;
          color: #666;
          border-top: 1px solid #ddd;
          padding-top: 15px;
        }
        @media print {
          body { padding: 20px; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        ${logoSection}
        <div class="school-name">${schoolInfo.name}</div>
        ${schoolInfo.motto ? `<div class="school-motto">"${schoolInfo.motto}"</div>` : ''}
        <div class="school-contact">
          ${schoolInfo.address}<br>
          Tel: ${schoolInfo.phone} | Email: ${schoolInfo.email}
        </div>
      </div>
      
      <div class="document-title">⚠️ FEE PAYMENT REMINDER</div>
      
      <div class="date-section">
        <strong>Date:</strong> ${new Date().toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
      
      <div class="recipient">
        <p><strong>Dear ${reminderData.guardianName},</strong></p>
      </div>
      
      <div class="content">
        <p>We hope this letter finds you well. This is a friendly reminder regarding outstanding fee balance for your child/ward enrolled at our institution.</p>
      </div>
      
      <div class="student-info">
        <div class="info-row">
          <span class="info-label">Student Name:</span>
          <span>${reminderData.studentName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Admission Number:</span>
          <span>${reminderData.admissionNumber}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Grade/Class:</span>
          <span>${reminderData.grade}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Term:</span>
          <span>Term ${reminderData.term}, ${reminderData.year}</span>
        </div>
      </div>
      
      ${breakdownRows ? `
        <table class="fee-table">
          <thead>
            <tr>
              <th>Fee Item</th>
              <th style="text-align: right;">Amount (KES)</th>
            </tr>
          </thead>
          <tbody>
            ${breakdownRows}
          </tbody>
        </table>
      ` : ''}
      
      <div class="summary">
        <div class="summary-row">
          <span>Total Fees for Term:</span>
          <span>KES ${reminderData.totalFees.toLocaleString()}</span>
        </div>
        <div class="summary-row">
          <span>Amount Paid:</span>
          <span>KES ${reminderData.amountPaid.toLocaleString()}</span>
        </div>
        <div class="summary-row balance-row">
          <span>OUTSTANDING BALANCE:</span>
          <span>KES ${reminderData.balance.toLocaleString()}</span>
        </div>
      </div>
      
      <div class="content">
        <p>We kindly request that you settle the outstanding balance at your earliest convenience${reminderData.dueDate ? ` by <strong>${reminderData.dueDate}</strong>` : ''}. Prompt payment ensures uninterrupted learning for your child.</p>
        <p style="margin-top: 10px;">Payment can be made via M-Pesa, Bank Transfer, or Cash at the school accounts office.</p>
      </div>
      
      <div class="footer-note">
        <strong>Note:</strong> If you have recently made a payment, please disregard this notice and accept our appreciation. For any queries or to discuss payment arrangements, please contact the accounts office.
      </div>
      
      <div class="signature-section">
        <div class="signature-line">Finance Officer</div>
        <div class="signature-line">School Stamp</div>
      </div>
      
      <div class="page-footer">
        ${schoolInfo.name} | ${schoolInfo.address} | ${schoolInfo.phone} | ${schoolInfo.email}
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(reminderContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
}

export { type SchoolInfo };
