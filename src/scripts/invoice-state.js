// invoice-state.js - Reactive Invoice State & Local Persistence Engine

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar (USD)', position: 'prefix' },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)', position: 'prefix' },
  { code: 'GBP', symbol: '£', name: 'British Pound (GBP)', position: 'prefix' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR)', position: 'prefix' },
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
  { code: 'ZAR', symbol: 'R ', name: 'South African Rand (ZAR)', position: 'prefix' },
  { code: 'SEK', symbol: 'kr ', name: 'Swedish Krona (SEK)', position: 'suffix' },
  { code: 'NOK', symbol: 'kr ', name: 'Norwegian Krone (NOK)', position: 'suffix' },
  { code: 'DKK', symbol: 'kr ', name: 'Danish Krone (DKK)', position: 'suffix' },
  { code: 'PLN', symbol: 'zł ', name: 'Polish Zloty (PLN)', position: 'suffix' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso (PHP)', position: 'prefix' },
  { code: 'MYR', symbol: 'RM ', name: 'Malaysian Ringgit (MYR)', position: 'prefix' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht (THB)', position: 'prefix' },
  { code: 'IDR', symbol: 'Rp ', name: 'Indonesian Rupiah (IDR)', position: 'prefix' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong (VND)', position: 'suffix' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira (NGN)', position: 'prefix' },
  { code: 'KES', symbol: 'KSh ', name: 'Kenyan Shilling (KES)', position: 'prefix' },
  { code: 'EGP', symbol: 'E£ ', name: 'Egyptian Pound (EGP)', position: 'prefix' },
  { code: 'PKR', symbol: 'Rs ', name: 'Pakistani Rupee (PKR)', position: 'prefix' },
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka (BDT)', position: 'prefix' }
];

export const DOCUMENT_TYPES = [
  { id: 'tax_invoice', label: 'Tax Invoice', title: 'TAX INVOICE' },
  { id: 'invoice', label: 'Standard Invoice', title: 'INVOICE' },
  { id: 'proforma', label: 'Proforma Invoice', title: 'PROFORMA INVOICE' },
  { id: 'quotation', label: 'Quotation / Estimate', title: 'QUOTATION' },
  { id: 'receipt', label: 'Payment Receipt', title: 'RECEIPT' },
  { id: 'purchase_order', label: 'Purchase Order', title: 'PURCHASE ORDER' },
  { id: 'credit_note', label: 'Credit Note', title: 'CREDIT NOTE' },
  { id: 'delivery_challan', label: 'Delivery Challan', title: 'DELIVERY CHALLAN' }
];

export const THEME_PRESETS = [
  { id: 'minimal', name: 'Minimal Mono', font: 'Geist', previewColor: '#171717' },
  { id: 'executive', name: 'Executive Slate', font: 'Inter', previewColor: '#0f172a' },
  { id: 'modern', name: 'Modern Tech', font: 'Geist Mono', previewColor: '#0070f3' },
  { id: 'contrast', name: 'High Contrast', font: 'Geist', previewColor: '#7928ca' },
  { id: 'compact', name: 'Clean Receipt', font: 'Inter', previewColor: '#2563eb' }
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

export function getDefaultInvoice() {
  const today = new Date();
  const issueDate = today.toISOString().split('T')[0];
  
  const due = new Date();
  due.setDate(due.getDate() + 14);
  const dueDate = due.toISOString().split('T')[0];

  return {
    id: 'inv_' + Date.now(),
    docType: 'Tax Invoice',
    docTitle: 'TAX INVOICE',
    invoiceNumber: 'INV-2026-001',
    referenceNumber: 'PO-2026-98',
    issueDate,
    dueDate,
    theme: 'minimal',
    accentColor: '#171717',
    currency: CURRENCIES[0], // USD default
    status: 'Draft',

    sender: {
      logo: '',
      name: 'Acme Design & Technology Inc.',
      email: 'billing@acmedesign.io',
      phone: '+1 (555) 234-5678',
      address: '100 Innovation Way, Suite 400\nSan Francisco, CA 94107',
      taxId: 'US-TAX-892341',
      customFields: []
    },

    client: {
      name: 'Globex Software Enterprises',
      email: 'accounts@globexcorp.com',
      phone: '+1 (555) 987-6543',
      address: '742 Evergreen Terrace, Floor 3\nSpringfield, OR 97477',
      taxId: 'TAX-552190',
      shippingAddress: '',
      customFields: []
    },

    columns: {
      hsn: false,
      unit: false,
      discount: false,
      tax: false
    },

    items: [
      {
        id: '1',
        description: 'Brand Identity & Design System Architecture\nComplete visual guidelines, UI token library, and typography system.',
        hsn: '998314',
        unit: 'Project',
        quantity: 1,
        rate: 2800,
        discount: 0,
        discountType: 'percent',
        taxRate: 0
      },
      {
        id: '2',
        description: 'Fullstack Web Application Development\nHigh performance Astro frontend with modern backend integration.',
        hsn: '998313',
        unit: 'Hours',
        quantity: 35,
        rate: 75,
        discount: 0,
        discountType: 'percent',
        taxRate: 0
      },
      {
        id: '3',
        description: 'Performance Optimization & SEO Audit\nCore Web Vitals tuning, structured schema implementation & accessibility pass.',
        hsn: '998315',
        unit: 'Audit',
        quantity: 1,
        rate: 650,
        discount: 0,
        discountType: 'percent',
        taxRate: 0
      }
    ],

    taxMode: 'single', // 'none', 'single', 'gst', 'vat'
    taxRate: 10,
    cgstRate: 9,
    sgstRate: 9,
    igstRate: 18,
    isInterstateGST: false,

    discountType: 'percent', // 'percent' or 'fixed'
    discountValue: 5,

    shipping: 0,
    roundOff: true,

    notes: 'Thank you for your business! We appreciate the opportunity to collaborate with your team.',
    terms: '1. Payment is due within 14 days of invoice date.\n2. Please mention the invoice number in your wire/transfer memo.\n3. Late payments are subject to a 1.5% compounding monthly fee.',

    paymentDetails: {
      bankName: 'Silicon Valley Bank',
      accountName: 'Acme Design & Technology Inc.',
      accountNumber: '987654321098',
      routingNumber: '121000358',
      swift: 'SVBUS6S',
      iban: '',
      upiId: '',
      paypalEmail: 'payments@acmedesign.io',
      customMemo: 'ACH / Wire / Electronic Transfer accepted'
    },

    qrCode: {
      enabled: true,
      type: 'upi',
      upiId: 'acmedesign@okaxis',
      upiName: 'Acme Design Inc',
      paypalUrl: 'https://paypal.me/acmedesign',
      customUrl: 'https://invoicefreemaker.com/pay',
      qrDataUrl: ''
    },

    signature: {
      enabled: true,
      type: 'type',
      dataUrl: '',
      typedName: 'Alex Morgan',
      fontFamily: 'Caveat',
      title: 'Managing Director & Founder',
      date: issueDate
    }
  };
}

// Calculate comprehensive totals
export function calculateTotals(invoice) {
  let subtotal = 0;
  let totalLineDiscount = 0;

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
    shipping: Number(shipping.toFixed(2)),
    roundOffAdjustment,
    grandTotal: Number(grandTotal.toFixed(2)),
    amountInWords: numberToWords(grandTotal, invoice.currency?.code || 'USD')
  };
}

// Convert Number to English Words
export function numberToWords(amount, currencyCode = 'USD') {
  if (isNaN(amount) || amount === 0) return 'Zero';

  const singleDigits = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const scales = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];

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

  let chunks = [];
  let tempInt = integerPart;
  while (tempInt > 0) {
    chunks.push(tempInt % 1000);
    tempInt = Math.floor(tempInt / 1000);
  }

  let words = [];
  for (let i = chunks.length - 1; i >= 0; i--) {
    if (chunks[i] > 0) {
      const chunkText = convertChunk(chunks[i]);
      const scaleText = scales[i];
      words.push(scaleText ? `${chunkText} ${scaleText}` : chunkText);
    }
  }

  let result = words.join(' ').trim();
  
  const currencyNames = {
    USD: { unit: 'Dollars', sub: 'Cents' },
    EUR: { unit: 'Euros', sub: 'Cents' },
    GBP: { unit: 'Pounds', sub: 'Pence' },
    INR: { unit: 'Rupees', sub: 'Paise' },
    CAD: { unit: 'Dollars', sub: 'Cents' },
    AUD: { unit: 'Dollars', sub: 'Cents' },
    AED: { unit: 'Dirhams', sub: 'Fils' }
  };

  const curr = currencyNames[currencyCode] || { unit: currencyCode, sub: 'Cents' };
  
  if (result) {
    result += ` ${curr.unit}`;
  }

  if (decimalPart > 0) {
    const decimalWords = convertChunk(decimalPart);
    result += ` and ${decimalWords} ${curr.sub}`;
  }

  return result + ' Only';
}

// Local Storage Vault keys
const STORAGE_CURRENT_KEY = 'ifm_current_invoice_v1';
const STORAGE_HISTORY_KEY = 'ifm_invoice_history_v1';
const STORAGE_CLIENTS_KEY = 'ifm_clients_vault_v1';
const STORAGE_COMPANIES_KEY = 'ifm_companies_vault_v1';
const STORAGE_ITEMS_KEY = 'ifm_items_catalog_v1';

// Current Invoice
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

// Invoices Vault (History)
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
      currencySymbol: invoice.currency?.symbol || '$',
      currencyCode: invoice.currency?.code || 'USD',
      updatedAt: new Date().toISOString(),
      fullData: invoice
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

// Clients Vault
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

// User Companies / Profiles Vault (Requirement 1)
export function getCompaniesVault() {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_COMPANIES_KEY);
    if (data) return JSON.parse(data);
    
    // Default initial profile
    const initial = [
      {
        id: 'comp_default',
        name: 'Acme Design & Technology Inc.',
        email: 'billing@acmedesign.io',
        phone: '+1 (555) 234-5678',
        address: '100 Innovation Way, Suite 400\nSan Francisco, CA 94107',
        taxId: 'US-TAX-892341',
        logo: '',
        bankName: 'Silicon Valley Bank',
        accountName: 'Acme Studio Inc',
        accountNumber: '987654321098',
        ifsc: 'SVBUS6S',
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

// Items / Services Catalog Vault (Requirement 3)
export function getItemsCatalog() {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_ITEMS_KEY);
    if (data) return JSON.parse(data);

    // Initial default catalog
    const initial = [
      {
        id: 'item_1',
        description: 'Brand Identity & Design System Architecture\nComplete visual guidelines, UI token library, and typography system.',
        hsn: '998314',
        unit: 'Project',
        rate: 2800,
        taxRate: 18
      },
      {
        id: 'item_2',
        description: 'Fullstack Web Application Development\nHigh performance Astro frontend with modern backend integration.',
        hsn: '998313',
        unit: 'Hours',
        rate: 75,
        taxRate: 18
      },
      {
        id: 'item_3',
        description: 'Performance Optimization & SEO Audit\nCore Web Vitals tuning, structured schema implementation & accessibility pass.',
        hsn: '998315',
        unit: 'Audit',
        rate: 650,
        taxRate: 18
      },
      {
        id: 'item_4',
        description: 'Monthly Maintenance & Cloud Server Hosting',
        hsn: '998316',
        unit: 'Month',
        rate: 350,
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
