// pdf-generator.js - High-Definition PDF, PNG & Instant Share Engine
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportInvoiceToPDF(elementId = 'invoice-paper', filename = 'invoice.pdf') {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Invoice element not found');
  }

  const originalShadow = element.style.boxShadow;
  element.style.boxShadow = 'none';

  // Hide the logo box when no company logo is uploaded
  const logoWraps = element.querySelectorAll('#logo-display-wrap');
  const hiddenLogos = [];
  logoWraps.forEach(wrap => {
    const img = wrap.querySelector('#sender-logo-img');
    const hasLogo = img && img.getAttribute('src') && !img.classList.contains('hidden');
    if (!hasLogo) {
      hiddenLogos.push(wrap);
      wrap.style.display = 'none';
    }
  });

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: -window.scrollY
    });

    element.style.boxShadow = originalShadow;

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
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
    console.error('PDF Generation Error, falling back to print:', error);
    // Fallback directly to print without annoying alerts
    window.print();
    return false;
  } finally {
    hiddenLogos.forEach(wrap => { wrap.style.display = ''; });
  }
}

export async function exportInvoiceToPNG(elementId = 'invoice-paper', filename = 'invoice.png') {
  const element = document.getElementById(elementId);
  if (!element) return;

  const originalShadow = element.style.boxShadow;
  element.style.boxShadow = 'none';

  // Hide the logo box when no company logo is uploaded
  const logoWraps = element.querySelectorAll('#logo-display-wrap');
  const hiddenLogos = [];
  logoWraps.forEach(wrap => {
    const img = wrap.querySelector('#sender-logo-img');
    const hasLogo = img && img.getAttribute('src') && !img.classList.contains('hidden');
    if (!hasLogo) {
      hiddenLogos.push(wrap);
      wrap.style.display = 'none';
    }
  });

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: -window.scrollY
    });

    element.style.boxShadow = originalShadow;

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (err) {
    element.style.boxShadow = originalShadow;
    console.error('PNG Export Error:', err);
    window.print();
  } finally {
    hiddenLogos.forEach(wrap => { wrap.style.display = ''; });
  }
}

export function generateWhatsAppShareLink(invoice, totals) {
  const clientName = invoice.client?.name || 'Valued Client';
  const invNumber = invoice.invoiceNumber || 'INV-001';
  const currencySymbol = invoice.currency?.symbol || '₹';
  const amount = totals.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 });
  const dueDate = invoice.dueDate || 'Upon Receipt';
  
  const text = `Hi ${clientName},\n\nPlease find the details for invoice *#${invNumber}*:\n\n*Amount Due:* ${currencySymbol}${amount}\n*Due Date:* ${dueDate}\n*Issued By:* ${invoice.sender?.name || 'Us'}\n\nThank you for your business!`;
  
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}

export function generateEmailShareLink(invoice, totals) {
  const clientEmail = invoice.client?.email || '';
  const invNumber = invoice.invoiceNumber || 'INV-001';
  const senderName = invoice.sender?.name || 'Us';
  const currencySymbol = invoice.currency?.symbol || '₹';
  const amount = totals.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 });
  const dueDate = invoice.dueDate || 'Upon Receipt';

  const subject = `Invoice ${invNumber} from ${senderName}`;
  const body = `Dear ${invoice.client?.name || 'Customer'},\n\nWe have issued invoice #${invNumber} for ${currencySymbol}${amount}.\n\nDue Date: ${dueDate}\n\nPlease review the invoice or contact us if you have any questions.\n\nBest regards,\n${senderName}`;

  return `mailto:${clientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
