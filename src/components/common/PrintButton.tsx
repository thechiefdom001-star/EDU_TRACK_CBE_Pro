import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface SchoolInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  motto?: string;
}

const DEFAULT_SCHOOL_INFO: SchoolInfo = {
  name: 'EduKenya CBC School',
  address: 'P.O. Box 12345-00100, Nairobi, Kenya',
  phone: '+254 700 123 456',
  email: 'info@edukenyaschool.ac.ke',
  motto: 'Excellence in CBC Education',
};

interface PrintButtonProps {
  tableId: string;
  title: string;
  schoolInfo?: SchoolInfo;
}

export function PrintButton({ tableId, title, schoolInfo = DEFAULT_SCHOOL_INFO }: PrintButtonProps) {
  const handlePrint = () => {
    const table = document.getElementById(tableId);
    if (!table) return;

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
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
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

export { DEFAULT_SCHOOL_INFO };
export type { SchoolInfo };
