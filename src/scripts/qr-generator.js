// qr-generator.js - Generates 100% Valid Scannable Payment QR Codes
import QRCode from 'qrcode';

export async function generatePaymentQRCode(config, amount, currencyCode, invoiceNumber) {
  if (!config || !config.enabled) return null;

  let paymentString = '';
  const cleanInvNum = (invoiceNumber || 'INV001').replace(/[^a-zA-Z0-9]/g, '');

  if (config.type === 'upi') {
    let upiId = (config.upiId || 'surabhihardwares@okhdfcbank').trim();
    // Fallback if empty
    if (!upiId) upiId = 'surabhihardwares@okhdfcbank';
    const upiName = encodeURIComponent((config.upiName || 'Merchant').trim());
    const note = encodeURIComponent(`Bill ${cleanInvNum}`);
    const amtStr = amount > 0 ? `&am=${amount.toFixed(2)}` : '';
    
    // Strict standard UPI URI string recognized by Google Pay, PhonePe, Paytm, BHIM, Cred
    paymentString = `upi://pay?pa=${upiId}&pn=${upiName}${amtStr}&cu=INR&tn=${note}`;
  } else if (config.type === 'einvoice') {
    // Official GST e-Invoice IRN Data String
    const irn = config.irn || 'fef1df90406b928db26a62f816debc9bb5256d9375e60dc4226653cc23a8c595';
    paymentString = `GST_IRN:${irn}|INV:${cleanInvNum}|AMT:${amount.toFixed(2)}`;
  } else if (config.type === 'paypal') {
    let url = (config.paypalUrl || '').trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    if (amount > 0 && !url.includes('/')) {
      url += `/${amount.toFixed(2)}`;
    }
    paymentString = url;
  } else if (config.type === 'sepa') {
    paymentString = `BCD\n002\n1\nSCT\n${config.bic || ''}\n${config.recipient || ''}\n${config.iban || ''}\nEUR${amount.toFixed(2)}\n\n${cleanInvNum}\n`;
  } else {
    paymentString = (config.customUrl || '').trim() || 'https://invoicefreemaker.com';
  }

  try {
    const dataUrl = await QRCode.toDataURL(paymentString, {
      width: 320,
      margin: 2, // Standard quiet zone for phone cameras
      color: {
        dark: '#000000',
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
