// qr-generator.js - Generates Scannable Payment QR Codes
import QRCode from 'qrcode';

export async function generatePaymentQRCode(config, amount, currencyCode, invoiceNumber) {
  if (!config || !config.enabled) return null;

  let paymentString = '';

  if (config.type === 'upi') {
    const upiId = (config.upiId || '').trim();
    const upiName = encodeURIComponent((config.upiName || 'Merchant').trim());
    const note = encodeURIComponent(`Invoice ${invoiceNumber}`);
    const amt = amount > 0 ? `&am=${amount.toFixed(2)}` : '';
    // Standard UPI URI format: upi://pay?pa=user@bank&pn=Name&am=100.00&cu=INR&tn=Invoice
    paymentString = `upi://pay?pa=${upiId}&pn=${upiName}${amt}&cu=${currencyCode || 'INR'}&tn=${note}`;
  } else if (config.type === 'paypal') {
    let url = (config.paypalUrl || '').trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    if (amount > 0 && !url.includes('/')) {
      url += `/${amount}`;
    }
    paymentString = url;
  } else if (config.type === 'sepa') {
    // EPC QR Code standard for SEPA credit transfers
    paymentString = `BCD\n002\n1\nSCT\n${config.bic || ''}\n${config.recipient || ''}\n${config.iban || ''}\nEUR${amount.toFixed(2)}\n\n${invoiceNumber}\n`;
  } else {
    // Custom URL
    paymentString = (config.customUrl || '').trim();
  }

  if (!paymentString) return null;

  try {
    const dataUrl = await QRCode.toDataURL(paymentString, {
      width: 256,
      margin: 1,
      color: {
        dark: '#171717',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    });
    return { dataUrl, paymentString };
  } catch (err) {
    console.error('QR Code generation failed:', err);
    return null;
  }
}
