const BASE = "/api"; //<-- very Important its the "BASE" path the frontend talks to the backend with

//GET "helper" funtionality for accountDetails endpoint
export async function getAccountDetails(pid) {
  const request = await fetch(`${BASE}/accountDetails/${pid}`);
  if (!request.ok) throw new Error(await request.text());
  return request.json();
}
//GET "helper" funtionality for activeEnrollment endpoint
export async function getActiveEnrollment(pid) {
  const request = await fetch(`${BASE}/activeEnrollment/${pid}`);
  if (!request.ok) throw new Error(await request.text());
  return request.json();
}
//GET "helper" funtionality for getCourseGrades endpoint
export async function getCourseGrades(enrollId) {
  const request = await fetch(`${BASE}/getCourseGrades/${enrollId}`);
  if (!request.ok) throw new Error(await request.text());
  return request.json();
}

// POST from doc is application/x-www-form-urlencoded :contentReference[oaicite:1]{index=1}
// As well as: POST "helper" funtionality for updateContactInfo endpoint
export async function updateContactInfo(payload) {
  const request = await fetch(`${BASE}/updateContactInfo`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(payload).toString(),
  } );
  if (!request.ok) throw new Error(await request.text());
  return request.json();
}

//GET "helper" funtionality for getOperatorList endpoint
export async function getOperatorList(pid) {
  const request = await fetch(`${BASE}/getOperatorList/${pid}`);
  if (!request.ok) throw new Error(await request.text());
  return request.json();
}