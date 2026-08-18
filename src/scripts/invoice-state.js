// invoice-state.js - Reactive Invoice State & Local Persistence Engine

export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR)', position: 'prefix' },
  { code: 'USD', symbol: '$', name: 'US Dollar (USD)', position: 'prefix' },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)', position: 'prefix' },
  { code: 'GBP', symbol: '£', name: 'British Pound (GBP)', position: 'prefix' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar (CAD)', position: 'prefix' },
  { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar (AUD)', position: 'prefix' },
  { code: 'SGD', symbol: 'SG$', name: 'Singapore Dollar (SGD)', position: 'prefix' },
  { code: 'AED', symbol: 'AED ', name: 'UAE Dirham (AED)', position: 'prefix' },
  { code: 'SAR', symbol: 'SAR ', name: 'Saudi Riyal (SAR)', position: 'prefix' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (JPY)', position: 'prefix' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan (CNY)', position: 'prefix' },
  { code: 'CHF', symbol: 'CHF ', name: 'Swiss Franc (CHF)', position: 'prefix' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar (NZD)', position: 'prefix' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real (BRL)', position: 'prefix' },
  { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso (MXN)', position: 'prefix' },
  { code: 'ZAR', symbol: 'R ', name: 'South African Rand (ZAR)', position: 'prefix' }
];

export const DOCUMENT_TYPES = [
  { id: 'tax_invoice', label: 'Tax Invoice (GST)', title: 'TAX INVOICE' },
  { id: 'invoice', label: 'Standard Invoice', title: 'INVOICE' },
  { id: 'proforma', label: 'Proforma Invoice', title: 'PROFORMA INVOICE' },
  { id: 'quotation', label: 'Quotation / Estimate', title: 'QUOTATION' },
  { id: 'receipt', label: 'Payment Receipt', title: 'RECEIPT' },
  { id: 'purchase_order', label: 'Purchase Order', title: 'PURCHASE ORDER' },
  { id: 'credit_note', label: 'Credit Note', title: 'CREDIT NOTE' },
  { id: 'delivery_challan', label: 'Delivery Challan', title: 'DELIVERY CHALLAN' }
];

export const THEME_PRESETS = [
  { id: 'gst_tally', name: 'Corporate Pro', font: 'Inter', previewColor: '#171717' },
  { id: 'minimal', name: 'Minimal Light', font: 'Geist', previewColor: '#171717' },
  { id: 'executive', name: 'Executive Split', font: 'Inter', previewColor: '#171717' }
];

export const ACCENT_COLORS = [
  '#171717', // Ink Black
  '#0070f3', // Link Blue
  '#7928ca', // Violet
  '#059669', // Emerald
  '#d97706', // Amber
  '#dc2626', // Crimson Red
  '#4f46e5', // Indigo
  '#0891b2', // Cyan Teal
  '#e11d48'  // Rose
];

export const INDIAN_STATES = [
  { code: '29', name: 'Karnataka' },
  { code: '27', name: 'Maharashtra' },
  { code: '07', name: 'Delhi' },
  { code: '33', name: 'Tamil Nadu' },
  { code: '36', name: 'Telangana' },
  { code: '06', name: 'Haryana' },
  { code: '09', name: 'Uttar Pradesh' },
  { code: '19', name: 'West Bengal' },
  { code: '24', name: 'Gujarat' },
  { code: '32', name: 'Kerala' },
  { code: '08', name: 'Rajasthan' },
  { code: '23', name: 'Madhya Pradesh' },
  { code: '03', name: 'Punjab' },
  { code: '10', name: 'Bihar' },
  { code: '21', name: 'Odisha' },
  { code: '30', name: 'Goa' },
  { code: '01', name: 'Jammu & Kashmir' }
];

export function getDefaultInvoice() {
  const today = new Date();
  const issueDate = today.toISOString().split('T')[0];
  
  const due = new Date();
  due.setDate(due.getDate() + 14);
  const dueDate = due.toISOString().split('T')[0];

  return {
    id: 'inv_' + Date.now(),
    docType: 'Tax Invoice (GST)',
    docTitle: 'TAX INVOICE',
    invoiceNumber: 'SHB/456/20',
    referenceNumber: 'PO-2026-98',
    issueDate,
    dueDate,
    theme: 'gst_tally', // Default to GST / Tally format matching reference
    accentColor: '#171717', // Ink black — brand primary per DESIGN.md
    currency: CURRENCIES[0], // INR default for GST/Universal
    status: 'Draft',

    // e-Invoice & Transport Details (for GST template)
    eInvoice: {
      enabled: true,
      irn: 'fef1df90406b928db26a62f816debc9bb5256d9375e60dc4226653cc23a8c595',
      ackNo: '112010036563310',
      ackDate: '21-Dec-20',
      deliveryNote: '',
      modeOfPayment: 'Bank Transfer / IMPS',
      buyersOrderNo: 'ORD-98214',
      buyersOrderDate: issueDate,
      dispatchDocNo: '',
      dispatchDate: '',
      dispatchedThrough: 'Road Logistics',
      destination: 'Bangalore',
      termsOfDelivery: 'Door Delivery'
    },

    sender: {
      logo: '',
      name: 'Surabhi Hardwares, Bangalore',
      email: 'billing@surabhihardwares.com',
      phone: '+91 98765 43210',
      address: 'HSR Layout, 5th Main Road\nBangalore, Karnataka - 560102',
      taxId: '29AACCT3705E000',
      stateName: 'Karnataka',
      stateCode: '29',
      customFields: []
    },

    client: {
      name: 'Kiran Enterprises',
      email: 'accounts@kiranenterprises.com',
      phone: '+91 98450 12345',
      address: '12th Cross, Indiranagar\nBangalore, Karnataka - 560038',
      taxId: '29AAFFC8126N1ZZ',
      stateName: 'Karnataka',
      stateCode: '29',
      shippingSameAsBilling: true,
      consigneeName: 'Kiran Enterprises',
      consigneeAddress: '12th Cross, Indiranagar, Bangalore',
      consigneeTaxId: '29AAFFC8126N1ZZ',
      consigneeStateName: 'Karnataka',
      consigneeStateCode: '29'
    },

    columns: {
      hsn: true,
      unit: true,
      discount: true,
      tax: false
    },

    items: [
      {
        id: '1',
        description: '12MM Stainless Steel Fasteners & Brass Connectors',
        hsn: '1005',
        unit: 'No',
        quantity: 7,
        rate: 500,
        discount: 0,
        discountType: 'percent',
        taxRate: 18
      }
    ],

    taxMode: 'gst', // 'gst', 'single', 'vat', 'none'
    taxRate: 18,
    cgstRate: 9,
    sgstRate: 9,
    igstRate: 18,
    isInterstateGST: false,

    discountType: 'percent',
    discountValue: 0,

    shipping: 0,
    roundOff: true,

    declaration: 'We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.',
    notes: 'This is a Computer Generated Invoice.',
    terms: '1. Goods once sold will not be taken back.\n2. Interest @ 18% p.a. will be charged if payment is not made within due date.',

    paymentDetails: {
      bankName: 'HDFC Bank Ltd',
      accountName: 'Surabhi Hardwares',
      accountNumber: '50200012345678',
      routingNumber: '560240012',
      swift: 'HDFCINBB',
      iban: '',
      upiId: 'surabhihardwares@okhdfcbank',
      paypalEmail: '',
      customMemo: 'RTGS / NEFT / UPI Payment accepted'
    },

    qrCode: {
      enabled: true,
      type: 'upi',
      upiId: 'surabhihardwares@okhdfcbank',
      upiName: 'Surabhi Hardwares',
      paypalUrl: '',
      customUrl: '',
      qrDataUrl: ''
    },

    signature: {
      enabled: true,
      type: 'type',
      dataUrl: '',
      typedName: 'Authorised Signatory',
      fontFamily: 'Caveat',
      title: 'for Surabhi Hardwares, Bangalore',
      date: issueDate
    }
  };
}

// Calculate comprehensive totals including HSN/SAC breakdown table
export function calculateTotals(invoice) {
  let subtotal = 0;
  let totalLineDiscount = 0;
  const hsnMap = {};

  (invoice.items || []).forEach(item => {
    const qty = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    let lineAmount = qty * rate;

    if (invoice.columns?.discount && Number(item.discount)) {
      const disc = Number(item.discount);
      const discAmount = item.discountType === 'fixed' ? disc : (lineAmount * disc) / 100;
      totalLineDiscount += discAmount;
      lineAmount = Math.max(0, lineAmount - discAmount);
    }

    subtotal += lineAmount;

    // HSN aggregation
    const hsnCode = item.hsn || 'General';
    if (!hsnMap[hsnCode]) {
      hsnMap[hsnCode] = { hsn: hsnCode, taxableValue: 0, cgstRate: invoice.cgstRate || 9, sgstRate: invoice.sgstRate || 9, igstRate: invoice.igstRate || 18 };
    }
    hsnMap[hsnCode].taxableValue += lineAmount;
  });

  // Invoice-level discount
  let invoiceDiscount = 0;
  if (invoice.discountValue > 0) {
    if (invoice.discountType === 'fixed') {
      invoiceDiscount = Number(invoice.discountValue);
    } else {
      invoiceDiscount = (subtotal * Number(invoice.discountValue)) / 100;
    }
  }
  const taxableAmount = Math.max(0, subtotal - invoiceDiscount);

  // Tax calculations
  let taxAmount = 0;
  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;

  if (invoice.taxMode === 'single' || invoice.taxMode === 'vat') {
    taxAmount = (taxableAmount * (Number(invoice.taxRate) || 0)) / 100;
  } else if (invoice.taxMode === 'gst') {
    if (invoice.isInterstateGST) {
      igstAmount = (taxableAmount * (Number(invoice.igstRate) || 0)) / 100;
      taxAmount = igstAmount;
    } else {
      cgstAmount = (taxableAmount * (Number(invoice.cgstRate) || 0)) / 100;
      sgstAmount = (taxableAmount * (Number(invoice.sgstRate) || 0)) / 100;
      taxAmount = cgstAmount + sgstAmount;
    }
  }

  // Calculate HSN Breakdown Array
  const hsnBreakdown = Object.values(hsnMap).map(h => {
    const cgstAmt = (h.taxableValue * h.cgstRate) / 100;
    const sgstAmt = (h.taxableValue * h.sgstRate) / 100;
    const igstAmt = (h.taxableValue * h.igstRate) / 100;
    return {
      hsn: h.hsn,
      taxableValue: Number(h.taxableValue.toFixed(2)),
      cgstRate: h.cgstRate,
      cgstAmount: Number(cgstAmt.toFixed(2)),
      sgstRate: h.sgstRate,
      sgstAmount: Number(sgstAmt.toFixed(2)),
      igstRate: h.igstRate,
      igstAmount: Number(igstAmt.toFixed(2)),
      totalTax: Number((invoice.isInterstateGST ? igstAmt : (cgstAmt + sgstAmt)).toFixed(2))
    };
  });

  const shipping = Number(invoice.shipping) || 0;
  const rawTotal = taxableAmount + taxAmount + shipping;
  const grandTotal = invoice.roundOff ? Math.round(rawTotal * 100) / 100 : rawTotal;
  const roundOffAdjustment = invoice.roundOff ? Number((grandTotal - rawTotal).toFixed(2)) : 0;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    totalLineDiscount: Number(totalLineDiscount.toFixed(2)),
    invoiceDiscount: Number(invoiceDiscount.toFixed(2)),
    taxableAmount: Number(taxableAmount.toFixed(2)),
    taxAmount: Number(taxAmount.toFixed(2)),
    cgstAmount: Number(cgstAmount.toFixed(2)),
    sgstAmount: Number(sgstAmount.toFixed(2)),
    igstAmount: Number(igstAmount.toFixed(2)),
    hsnBreakdown,
    shipping: Number(shipping.toFixed(2)),
    roundOffAdjustment,
    grandTotal: Number(grandTotal.toFixed(2)),
    amountInWords: numberToWords(grandTotal, invoice.currency?.code || 'INR'),
    taxAmountInWords: numberToWords(taxAmount, invoice.currency?.code || 'INR')
  };
}

// Convert Number to English Words
export function numberToWords(amount, currencyCode = 'INR') {
  if (isNaN(amount) || amount === 0) return 'Zero';

  const singleDigits = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const scales = ['', 'Thousand', 'Lakh', 'Crore', 'Billion'];

  function convertChunk(num) {
    let chunkStr = '';
    if (num >= 100) {
      chunkStr += singleDigits[Math.floor(num / 100)] + ' Hundred ';
      num %= 100;
    }
    if (num >= 10 && num <= 19) {
      chunkStr += teens[num - 10] + ' ';
    } else if (num >= 20) {
      chunkStr += tens[Math.floor(num / 10)] + ' ';
      if (num % 10 > 0) {
        chunkStr += singleDigits[num % 10] + ' ';
      }
    } else if (num > 0) {
      chunkStr += singleDigits[num] + ' ';
    }
    return chunkStr.trim();
  }

  const integerPart = Math.floor(Math.abs(amount));
  const decimalPart = Math.round((Math.abs(amount) - integerPart) * 100);

  if (integerPart === 0 && decimalPart === 0) return 'Zero';

  let words = '';
  if (currencyCode === 'INR') {
    // Indian Numbering System (Crore, Lakh, Thousand)
    let num = integerPart;
    const cr = Math.floor(num / 10000000);
    num %= 10000000;
    const lakh = Math.floor(num / 100000);
    num %= 100000;
    const th = Math.floor(num / 1000);
    num %= 1000;
    const rem = num;

    let parts = [];
    if (cr > 0) parts.push(convertChunk(cr) + ' Crore');
    if (lakh > 0) parts.push(convertChunk(lakh) + ' Lakh');
    if (th > 0) parts.push(convertChunk(th) + ' Thousand');
    if (rem > 0) parts.push(convertChunk(rem));
    words = parts.join(' ').trim();
  } else {
    // Western Million/Billion
    let chunks = [];
    let tempInt = integerPart;
    while (tempInt > 0) {
      chunks.push(tempInt % 1000);
      tempInt = Math.floor(tempInt / 1000);
    }
    const westernScales = ['', 'Thousand', 'Million', 'Billion'];
    let parts = [];
    for (let i = chunks.length - 1; i >= 0; i--) {
      if (chunks[i] > 0) {
        const chunkText = convertChunk(chunks[i]);
        const scaleText = westernScales[i];
        parts.push(scaleText ? `${chunkText} ${scaleText}` : chunkText);
      }
    }
    words = parts.join(' ').trim();
  }

  const currencyPrefixes = {
    INR: 'Indian Rupee',
    USD: 'US Dollars',
    EUR: 'Euro',
    GBP: 'British Pounds'
  };

  const prefix = currencyPrefixes[currencyCode] || currencyCode;
  let result = `${prefix} ${words}`;

  if (decimalPart > 0) {
    const decimalWords = convertChunk(decimalPart);
    result += ` and ${decimalWords} Paise`;
  }

  return result.trim() + ' Only';
}

// Increment invoice number helper (e.g. INV-2026-001 -> INV-2026-002, SHB/456/20 -> SHB/456/21) (Requirement 4)
export function incrementInvoiceNumber(invNum) {
  if (!invNum || !invNum.trim()) return 'INV-001';
  const trimmed = invNum.trim();
  
  // Match trailing number sequence, e.g. "INV-2026-001" -> prefix="INV-2026-", digits="001"
  const match = trimmed.match(/^(.*?)(\d+)$/);
  if (match) {
    const prefix = match[1];
    const digits = match[2];
    const nextVal = (parseInt(digits, 10) + 1).toString().padStart(digits.length, '0');
    return `${prefix}${nextVal}`;
  }
  return `${trimmed}-2`;
}

// Local Storage Vault operations
const STORAGE_CURRENT_KEY = 'ifm_current_invoice_v1';
const STORAGE_HISTORY_KEY = 'ifm_invoice_history_v1';
const STORAGE_CLIENTS_KEY = 'ifm_clients_vault_v1';
const STORAGE_COMPANIES_KEY = 'ifm_companies_vault_v1';
const STORAGE_ITEMS_KEY = 'ifm_items_catalog_v1';

export function saveCurrentInvoiceToStorage(invoice) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_CURRENT_KEY, JSON.stringify(invoice));
  } catch (e) {
    console.error('Failed to save current invoice to storage', e);
  }
}

export function loadCurrentInvoiceFromStorage() {
  if (typeof window === 'undefined') return getDefaultInvoice();
  try {
    const data = localStorage.getItem(STORAGE_CURRENT_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return { ...getDefaultInvoice(), ...parsed };
    }
  } catch (e) {
    console.error('Failed to load invoice from storage', e);
  }
  return getDefaultInvoice();
}

export function getInvoiceHistory() {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveInvoiceToHistory(invoice) {
  if (typeof window === 'undefined') return;
  try {
    const history = getInvoiceHistory();
    const existingIndex = history.findIndex(item => item.id === invoice.id || (item.invoiceNumber === invoice.invoiceNumber && invoice.invoiceNumber !== ''));
    
    const summary = {
      id: invoice.id || 'inv_' + Date.now(),
      invoiceNumber: invoice.invoiceNumber || 'INV-001',
      clientName: invoice.client?.name || 'Unnamed Client',
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      status: invoice.status || 'Draft',
      grandTotal: calculateTotals(invoice).grandTotal,
      currencySymbol: invoice.currency?.symbol || '₹',
      currencyCode: invoice.currency?.code || 'INR',
      updatedAt: new Date().toISOString(),
      fullData: JSON.parse(JSON.stringify(invoice))
    };

    if (existingIndex >= 0) {
      history[existingIndex] = summary;
    } else {
      history.unshift(summary);
    }

    localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(history));
    return history;
  } catch (e) {
    console.error('Failed to save invoice to history', e);
  }
}

export function deleteInvoiceFromHistory(id) {
  if (typeof window === 'undefined') return [];
  try {
    let history = getInvoiceHistory();
    history = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(history));
    return history;
  } catch (e) {
    return [];
  }
}

// Import an array of history entries (or a single entry / raw invoice) from a JSON backup.
// Returns the number of entries successfully merged into the vault.
export function importInvoiceHistory(data) {
  if (typeof window === 'undefined') return 0;
  try {
    let entries = Array.isArray(data) ? data : [data];
    let imported = 0;

    entries.forEach(raw => {
      if (!raw || typeof raw !== 'object') return;
      // Accept both history-summary shape ({ fullData }) and raw invoice shape
      const invoiceData = raw.fullData || raw;
      if (!invoiceData || typeof invoiceData !== 'object') return;
      if (!invoiceData.invoiceNumber && !invoiceData.items) return;

      const invoice = { ...getDefaultInvoice(), ...invoiceData };
      if (!invoice.id) invoice.id = 'inv_' + Date.now();
      if (!invoice.invoiceNumber) invoice.invoiceNumber = 'INV-001';

      saveInvoiceToHistory(invoice);
      imported++;
    });

    return imported;
  } catch (e) {
    console.error('Failed to import invoice history', e);
    return 0;
  }
}

// Duplicate an existing invoice from history with incremented invoice number (Requirement 4)
export function duplicateInvoiceInHistory(id) {
  if (typeof window === 'undefined') return null;
  try {
    const history = getInvoiceHistory();
    const target = history.find(item => item.id === id);
    if (!target || !target.fullData) return null;

    const today = new Date();
    const issueDate = today.toISOString().split('T')[0];
    const due = new Date();
    due.setDate(due.getDate() + 14);
    const dueDate = due.toISOString().split('T')[0];

    const newInvoice = JSON.parse(JSON.stringify(target.fullData));
    newInvoice.id = 'inv_' + Date.now();
    newInvoice.invoiceNumber = incrementInvoiceNumber(target.fullData.invoiceNumber || target.invoiceNumber);
    newInvoice.issueDate = issueDate;
    newInvoice.dueDate = dueDate;
    newInvoice.status = 'Draft';

    saveInvoiceToHistory(newInvoice);
    return newInvoice;
  } catch (e) {
    console.error('Failed to duplicate invoice', e);
    return null;
  }
}

export function getClientsVault() {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_CLIENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveClientToVault(client) {
  if (typeof window === 'undefined' || !client?.name?.trim()) return [];
  try {
    const clients = getClientsVault();
    const clientNameTrimmed = client.name.trim().toLowerCase();
    const existingIndex = clients.findIndex(c => c.name?.trim().toLowerCase() === clientNameTrimmed);
    
    const cleanClient = {
      id: client.id || 'cli_' + Date.now(),
      name: client.name.trim(),
      email: client.email?.trim() || '',
      phone: client.phone?.trim() || '',
      address: client.address?.trim() || '',
      taxId: client.taxId?.trim() || '',
      stateName: client.stateName?.trim() || '',
      stateCode: client.stateCode?.trim() || '',
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      clients[existingIndex] = { ...clients[existingIndex], ...cleanClient };
    } else {
      clients.unshift(cleanClient);
    }
    localStorage.setItem(STORAGE_CLIENTS_KEY, JSON.stringify(clients));
    return clients;
  } catch (e) {
    console.error('Failed to save client', e);
    return [];
  }
}

export function deleteClientFromVault(id) {
  if (typeof window === 'undefined') return [];
  try {
    let clients = getClientsVault();
    clients = clients.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_CLIENTS_KEY, JSON.stringify(clients));
    return clients;
  } catch (e) {
    return [];
  }
}

export function getCompaniesVault() {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_COMPANIES_KEY);
    if (data) return JSON.parse(data);
    
    const initial = [
      {
        id: 'comp_default',
        name: 'Surabhi Hardwares, Bangalore',
        email: 'billing@surabhihardwares.com',
        phone: '+91 98765 43210',
        address: 'HSR Layout, 5th Main Road\nBangalore, Karnataka - 560102',
        taxId: '29AACCT3705E000',
        stateName: 'Karnataka',
        stateCode: '29',
        logo: '',
        bankName: 'HDFC Bank Ltd',
        accountName: 'Surabhi Hardwares',
        accountNumber: '50200012345678',
        ifsc: 'HDFCINBB',
        isDefault: true,
        updatedAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(STORAGE_COMPANIES_KEY, JSON.stringify(initial));
    return initial;
  } catch (e) {
    return [];
  }
}

export function saveCompanyToVault(company) {
  if (typeof window === 'undefined' || !company?.name?.trim()) return [];
  try {
    const companies = getCompaniesVault();
    const compNameTrimmed = company.name.trim().toLowerCase();
    const existingIndex = companies.findIndex(c => c.id === company.id || c.name?.trim().toLowerCase() === compNameTrimmed);
    
    const cleanCompany = {
      id: company.id || 'comp_' + Date.now(),
      name: company.name.trim(),
      email: company.email?.trim() || '',
      phone: company.phone?.trim() || '',
      address: company.address?.trim() || '',
      taxId: company.taxId?.trim() || '',
      stateName: company.stateName?.trim() || '',
      stateCode: company.stateCode?.trim() || '',
      logo: company.logo || '',
      bankName: company.bankName?.trim() || '',
      accountName: company.accountName?.trim() || '',
      accountNumber: company.accountNumber?.trim() || '',
      ifsc: company.ifsc?.trim() || '',
      isDefault: !!company.isDefault,
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      companies[existingIndex] = { ...companies[existingIndex], ...cleanCompany };
    } else {
      companies.unshift(cleanCompany);
    }
    localStorage.setItem(STORAGE_COMPANIES_KEY, JSON.stringify(companies));
    return companies;
  } catch (e) {
    console.error('Failed to save company', e);
    return [];
  }
}

export function deleteCompanyFromVault(id) {
  if (typeof window === 'undefined') return [];
  try {
    let companies = getCompaniesVault();
    companies = companies.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_COMPANIES_KEY, JSON.stringify(companies));
    return companies;
  } catch (e) {
    return [];
  }
}

export function getItemsCatalog() {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_ITEMS_KEY);
    if (data) return JSON.parse(data);

    const initial = [
      {
        id: 'item_1',
        description: '12MM Stainless Steel Fasteners & Brass Connectors',
        hsn: '1005',
        unit: 'No',
        rate: 500,
        taxRate: 18
      },
      {
        id: 'item_2',
        description: 'Fullstack Web Application UI/UX & Frontend Integration',
        hsn: '998313',
        unit: 'Hours',
        rate: 75,
        taxRate: 18
      },
      {
        id: 'item_3',
        description: 'Cloud Infrastructure Setup & Security Hardening',
        hsn: '998315',
        unit: 'Project',
        rate: 1200,
        taxRate: 18
      }
    ];
    localStorage.setItem(STORAGE_ITEMS_KEY, JSON.stringify(initial));
    return initial;
  } catch (e) {
    return [];
  }
}

export function saveItemToCatalog(item) {
  if (typeof window === 'undefined' || !item?.description?.trim()) return [];
  try {
    const catalog = getItemsCatalog();
    const existingIndex = catalog.findIndex(i => i.id === item.id);

    const cleanItem = {
      id: item.id || 'item_' + Date.now(),
      description: item.description.trim(),
      hsn: item.hsn?.trim() || '',
      unit: item.unit?.trim() || 'Qty',
      rate: Number(item.rate) || 0,
      taxRate: Number(item.taxRate) || 0,
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      catalog[existingIndex] = cleanItem;
    } else {
      catalog.unshift(cleanItem);
    }
    localStorage.setItem(STORAGE_ITEMS_KEY, JSON.stringify(catalog));
    return catalog;
  } catch (e) {
    console.error('Failed to save item to catalog', e);
    return [];
  }
}

export function deleteItemFromCatalog(id) {
  if (typeof window === 'undefined') return [];
  try {
    let catalog = getItemsCatalog();
    catalog = catalog.filter(i => i.id !== id);
    localStorage.setItem(STORAGE_ITEMS_KEY, JSON.stringify(catalog));
    return catalog;
  } catch (e) {
    return [];
  }
}
