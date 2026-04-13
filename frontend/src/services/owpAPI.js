const BASE = "https://owp-portal-redesign-php.onrender.com/api"; //<-- frontend talks to backend using this base

// ==========================
// GET ENDPOINTS
// ==========================

// activeEnrollment
export async function getActiveEnrollment(pid) {
  const request = await fetch(`${BASE}/activeEnrollment/${pid}`);
  //throw new Error('Manual error for testing purposes'); // <-- temporary error to test sessionStorage fallback
  if (!request.ok) throw new Error(await request.text());
  const data = await request.json();
  storeToSession('getActiveEnrollment', data);
  return data;
}

// enrollmentRecord
export async function getEnrollmentRecord(enrollId) {
  const request = await fetch(`${BASE}/enrollmentRecord/${enrollId}`);
  if (!request.ok) throw new Error(await request.text());
  const data = await request.json();
  storeToSession('getEnrollmentRecord-'+enrollId, data);
  return data;
}

// courseExams
export async function getCourseExams(enrollId) {
  const request = await fetch(`${BASE}/courseExams/${enrollId}`);
  if (!request.ok) throw new Error(await request.text());
  const data = await request.json();
  storeToSession('getCourseExams', data);
  return data;
}

// getCourseGrades
export async function getCourseGrades(enrollId) {
  const request = await fetch(`${BASE}/getCourseGrades/${enrollId}`);
  if (!request.ok) throw new Error(await request.text());
  const data = await request.json();
  storeToSession('getCourseGrades-'+enrollId, data);
  return data;
}

// getOperatorList
export async function getOperatorList(pid) {
  const request = await fetch(`${BASE}/getOperatorList/${pid}`);
  if (!request.ok) throw new Error(await request.text());
  const data = await request.json();
  storeToSession('getOperatorList', data);
  return data;
}

// deleteOperator
export async function deleteOperator(ip, id, pid) {
  const request = await fetch(`${BASE}/deleteOperator/${ip}/${id}/${pid}`);
  if (!request.ok) throw new Error(await request.text());
  return request.json();
}

// accountDetails
export async function getAccountDetails(pid) {
  const request = await fetch(`${BASE}/accountDetails/${pid}`);
  if (!request.ok) throw new Error(await request.text());
  const data = await request.json();
  storeToSession('getAccountDetails', data);
  return data;
}

// getInvoices
export async function getInvoices(pid) {
  const request = await fetch(`${BASE}/getInvoices/${pid}`);
  if (!request.ok) throw new Error(await request.text());
  const data = await request.json();
  storeToSession('getInvoices', data);
  return data;
}

// getInvoiceData
export async function getInvoiceData(invoiceNumber) {
  const request = await fetch(`${BASE}/getInvoiceData/${invoiceNumber}`);
  if (!request.ok) throw new Error(await request.text());
  const data = await request.json();
  storeToSession('getInvoiceData-'+invoiceNumber, data);
  return data;
}

// chk_active_section
export async function getActiveSection(sectionId) {
  const request = await fetch(`${BASE}/chk_active_section/${sectionId}`);
  if (!request.ok) throw new Error(await request.text());
  const data = await request.json();
  storeToSession('getActiveSection', data);
  return data;
}

// receipt download
export async function downloadReceipt(invoiceNum) {
  const request = await fetch(`${BASE}/receipt/download/${invoiceNum}`);
  if (!request.ok) throw new Error(await request.text());
  const data = await request.json();
  storeToSession('downloadReceipt', data);
  return data;
}

// enrollment download
export async function downloadEnrollment(enrollmentId) {
  const request = await fetch(`${BASE}/enrollment/download/${enrollmentId}`);
  if (!request.ok) throw new Error(await request.text());
  const data = await request.json();
  storeToSession('downloadEnrollment', data);
  return data;
}

// ==========================
// POST ENDPOINTS
// ==========================

// updateOperatorNumber
export async function updateOperatorNumber(payload) {
  const request = await fetch(`${BASE}/updateOperatorNumber`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(payload).toString(),
  });
  if (!request.ok) throw new Error(await request.text());
  return request.json();
}

// addOperator
export async function addOperator(payload) {
  const request = await fetch(`${BASE}/addOperator`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(payload).toString(),
  });
  if (!request.ok) throw new Error(await request.text());
  return request.json();
}

// updateContactInfo

// ==========================
// shared helpers
// ==========================
function toApiValue(value) {
  if (value === undefined || value === null) return "null";

  const str = String(value).trim();
  return str === "" ? "null" : str;
}

function digitsOnly(value) {
  return String(value ?? "").replace(/\D/g, "");
}

/**
 * Expected backend field names:
 * pid
 * street_1, street_2, street_3
 * city, state, postal_code, country
 * phone_area_code, phone_local, phone_extension
 * fax_area_code, fax_local
 * ipAddr
 */
export function buildUpdateContactInfoPayload(pid, form) {
  // Because the confirmed request shows:
  // country=1
  // phone_area_code=1
  // phone_local=415
  // phone_extension=8669023
  //
  // we should preserve that exact field contract rather than inventing
  // phone_country_code / fax_country_code keys.

  const phoneCountryCode = digitsOnly(form.phone_country_code ?? form.phone_area_code ?? "").slice(0, 3);
  const phoneAreaCode = digitsOnly(form.phone_local ?? "").slice(0, 3);
  const phoneNumber = digitsOnly(form.phone_extension ?? "").slice(0, 7);

  const faxCountryCode = digitsOnly(form.fax_country_code ?? form.fax_area_code ?? "").slice(0, 3);
  const faxNumber = digitsOnly(form.fax_local ?? "").slice(0, 10);

  return {
    pid: toApiValue(pid),

    street_1: toApiValue(form.street_1),
    street_2: toApiValue(form.street_2),
    street_3: toApiValue(form.street_3),
    city: toApiValue(form.city),
    state: toApiValue(form.state),
    postal_code: toApiValue(form.postal_code),
    country: toApiValue(form.country ?? "1"),

    // IMPORTANT:
    // These names match the working Postman request exactly.
    phone_area_code: toApiValue(phoneCountryCode),
    phone_local: toApiValue(phoneAreaCode),
    phone_extension: toApiValue(phoneNumber),

    fax_area_code: toApiValue(faxCountryCode),
    fax_local: toApiValue(faxNumber),

    ipAddr: toApiValue(form.ipAddr),
  };
}

export async function updateContactInfo(pid, form) {
  const payload = buildUpdateContactInfoPayload(pid, form);

  const request = await fetch(`${BASE}/updateContactInfo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json",
    },
    body: new URLSearchParams(payload).toString(),
  });

  const text = await request.text();

  if (!request.ok) {
    throw new Error(text || "updateContactInfo request failed");
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function storeToSession(key, data) {
  const payload = {
    data: data
  }
  sessionStorage.setItem(key, JSON.stringify(payload));
}

export function getFromSession(key) {
  const item = sessionStorage.getItem(key);
  if (!item) return null;
  try {
    const payload = JSON.parse(item);
    return payload.data;
  } catch {
    return null;
  }
}

export function loadFromSession(key, array) {
  try {
    console.log('Checking sessionStorage for cached details...')
      console.log('Attempting to load from sessionStorage...')
      const data = getFromSession(key)
      if (data.response) { 
        return data.response;
      }
      else { 
        console.log('No cached details found in sessionStorage.')
        return null;
      }
    }
  catch {
    return null;
  }
}