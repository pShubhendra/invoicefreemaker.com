// pdf-generator.js - High-Definition PDF, PNG & Instant Share Engine
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportInvoiceToPDF(elementId = 'invoice-paper', filename = 'invoice.pdf') {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Invoice element not found');
  }

  // Visual preparation
  const originalShadow = element.style.boxShadow;
  const originalBorder = element.style.border;
  element.style.boxShadow = 'none';
  element.style.border = 'none';

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    element.style.boxShadow = originalShadow;
    element.style.border = originalBorder;

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    pdf.save(filename);
    return true;
  } catch (error) {
    element.style.boxShadow = originalShadow;
    element.style.border = originalBorder;
    console.error('PDF Generation Error:', error);
    
    // Fallback: prompt print
    if (confirm('PDF direct generation encountered a browser canvas limitation. Would you like to use your browser\'s Print to PDF instead?')) {
      window.print();
    }
    throw error;
  }
}

export async function exportInvoiceToPNG(elementId = 'invoice-paper', filename = 'invoice.png') {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (err) {
    console.error('PNG Export Error:', err);
    alert('Failed to export PNG. You can use the Print option to save as PDF/Image.');
  }
}

export function generateWhatsAppShareLink(invoice, totals) {
  const clientName = invoice.client?.name || 'Valued Client';
  const invNumber = invoice.invoiceNumber || 'INV-001';
  const currencySymbol = invoice.currency?.symbol || '$';
  const amount = totals.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 });
  const dueDate = invoice.dueDate || 'Upon Receipt';
  
  const text = `Hi ${clientName},\n\nPlease find the details for invoice *#${invNumber}*:\n\n*Amount Due:* ${currencySymbol}${amount}\n*Due Date:* ${dueDate}\n*Issued By:* ${invoice.sender?.name || 'Us'}\n\nThank you for your business!`;
  
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}

export function generateEmailShareLink(invoice, totals) {
  const clientEmail = invoice.client?.email || '';
  const invNumber = invoice.invoiceNumber || 'INV-001';
  const senderName = invoice.sender?.name || 'Us';
  const currencySymbol = invoice.currency?.symbol || '$';
  const amount = totals.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 });
  const dueDate = invoice.dueDate || 'Upon Receipt';

  const subject = `Invoice ${invNumber} from ${senderName}`;
  const body = `Dear ${invoice.client?.name || 'Customer'},\n\nWe have issued invoice #${invNumber} for ${currencySymbol}${amount}.\n\nDue Date: ${dueDate}\n\nPlease review the invoice or contact us if you have any questions.\n\nBest regards,\n${senderName}`;

  return `mailto:${clientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
