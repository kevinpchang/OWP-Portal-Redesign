const BASE = "/api"; //<-- frontend talks to backend using this base

// ==========================
// GET ENDPOINTS
// ==========================

// activeEnrollment
export async function getActiveEnrollment(pid) {
  const request = await fetch(`${BASE}/activeEnrollment/${pid}`);
  if (!request.ok) throw new Error(await request.text());
  return request.json();
}

// enrollmentRecord
export async function getEnrollmentRecord(enrollId) {
  const request = await fetch(`${BASE}/enrollmentRecord/${enrollId}`);
  if (!request.ok) throw new Error(await request.text());
  return request.json();
}

// courseExams
export async function getCourseExams(enrollId) {
  const request = await fetch(`${BASE}/courseExams/${enrollId}`);
  if (!request.ok) throw new Error(await request.text());
  return request.json();
}

// getCourseGrades
export async function getCourseGrades(enrollId) {
  const request = await fetch(`${BASE}/getCourseGrades/${enrollId}`);
  if (!request.ok) throw new Error(await request.text());
  return request.json();
}

// getOperatorList
export async function getOperatorList(pid) {
  const request = await fetch(`${BASE}/getOperatorList/${pid}`);
  if (!request.ok) throw new Error(await request.text());
  return request.json();
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
  return request.json();
}

// getInvoices
export async function getInvoices(pid) {
  const request = await fetch(`${BASE}/getInvoices/${pid}`);
  if (!request.ok) throw new Error(await request.text());
  return request.json();
}

// getInvoiceData
export async function getInvoiceData(invoiceNumber) {
  const request = await fetch(`${BASE}/getInvoiceData/${invoiceNumber}`);
  if (!request.ok) throw new Error(await request.text());
  return request.json();
}

// chk_active_section
export async function getActiveSection(sectionId) {
  const request = await fetch(`${BASE}/chk_active_section/${sectionId}`);
  if (!request.ok) throw new Error(await request.text());
  return request.json();
}

// receipt download
export async function downloadReceipt(invoiceNum) {
  const request = await fetch(`${BASE}/receipt/download/${invoiceNum}`);
  if (!request.ok) throw new Error(await request.text());
  return request.json();
}

// enrollment download
export async function downloadEnrollment(enrollmentId) {
  const request = await fetch(`${BASE}/enrollment/download/${enrollmentId}`);
  if (!request.ok) throw new Error(await request.text());
  return request.json();
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
export async function updateContactInfo(payload) {
  const request = await fetch(`${BASE}/updateContactInfo`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(payload).toString(),
  });
  if (!request.ok) throw new Error(await request.text());
  return request.json();
}