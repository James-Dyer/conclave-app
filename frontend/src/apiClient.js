import { useCallback, useMemo } from 'react';
import { authFetch } from './supabaseClient';

// Use the deployed API directly without relying on an environment variable
const API_BASE = 'https://conclave-app.onrender.com/api';

export function useApi() {

  const request = useCallback(
    async (path, options = {}, includeAuth = true) => {
      const fetcher = includeAuth ? authFetch : fetch;
      const res = await fetcher(`${API_BASE}${path}`, options);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'API request failed');
      }
      try {
        return await res.json();
      } catch {
        return null;
      }
    },
    []
  );

  return useMemo(
    () => ({
      login: (email, password) =>
        request(
          '/login',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          },
          false
        ),
      fetchMember: () => request('/member'),
      fetchCharges: () => request('/my-charges'),
      fetchPayments: (status = '') =>
        request(`/payments${status ? `?status=${encodeURIComponent(status)}` : ''}`),
      submitPayment: (payment) =>
        request('/payments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payment)
        }),

      // Admin
      fetchMembers: (search = '') =>
        request(`/members?search=${encodeURIComponent(search)}`),
      createMember: (member) =>
        request('/admin/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(member)
        }),
      updateMember: (id, member) =>
        request(`/admin/members/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(member)
        }),
      deleteMember: (id) =>
        request(`/admin/members/${id}`, { method: 'DELETE' }),

      fetchAllCharges: (search = '') =>
        request(`/charges?search=${encodeURIComponent(search)}`),
      createCharge: (charge) =>
        request('/admin/charges', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(charge)
        }),
      updateCharge: (id, charge) =>
        request(`/admin/charges/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(charge)
        }),
      deleteCharge: (id) =>
        request(`/admin/charges/${id}`, { method: 'DELETE' }),

      fetchPendingPayments: () => request('/payments?status=Under%20Review'),
      approvePayment: (id) =>
        request(`/admin/payments/${id}/approve`, { method: 'POST' }),
      denyPayment: (id, note) =>
        request(`/admin/payments/${id}/deny`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ note })
        })
    }),
    [request]
  );
}

export default useApi;
