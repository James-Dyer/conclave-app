const API_BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'API request failed');
  }
  try {
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function login(email, password) {
  return request('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
}

export async function fetchCharges() {
  return request('/charges');
}

export async function fetchPayments() {
  return request('/payments');
}

export async function submitReview(review) {
  return request('/review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review)
  });
}

export default {
  login,
  fetchCharges,
  fetchPayments,
  submitReview
};
