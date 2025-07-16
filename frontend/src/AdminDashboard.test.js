import { render, screen, waitFor } from '@testing-library/react';
import AdminDashboard from './components/AdminDashboard';
import { AuthProvider } from './AuthContext';

afterEach(() => {
  localStorage.clear();
  jest.resetAllMocks();
});

test('uses cached data when available', async () => {
  const ts = Date.now();
  localStorage.setItem(
    'cachedPendingPayments',
    JSON.stringify({ ts, data: [{ id: 1, memberId: '1', amount: 10, date: '2024-05-01' }] })
  );
  localStorage.setItem(
    'cachedAdminMembers',
    JSON.stringify({ ts, data: [{ id: '1', name: 'Alice' }] })
  );
  global.fetch = jest.fn(() => new Promise(() => {}));
  localStorage.setItem('authToken', 'token');
  localStorage.setItem('authUser', JSON.stringify({ id: 1, isAdmin: true }));
  render(
    <AuthProvider>
      <AdminDashboard />
    </AuthProvider>
  );
  expect(await screen.findByText('Alice')).toBeInTheDocument();
});

test('api results refresh the cache', async () => {
  const ts = Date.now();
  localStorage.setItem(
    'cachedPendingPayments',
    JSON.stringify({ ts, data: [{ id: 1, memberId: '1', amount: 10, date: '2024-05-01' }] })
  );
  localStorage.setItem(
    'cachedAdminMembers',
    JSON.stringify({ ts, data: [{ id: '1', name: 'Alice' }] })
  );
  global.fetch = jest.fn((url) =>
    new Promise((resolve) => {
      setTimeout(() => {
        if (url.includes('/payments?status=Under%20Review')) {
          resolve({ ok: true, json: async () => [{ id: 1, memberId: '1', amount: 20, date: '2024-05-02' }] });
        } else if (url.includes('/admin/members')) {
          resolve({ ok: true, json: async () => [{ id: '1', name: 'Alice' }] });
        } else {
          resolve({ ok: true, json: async () => [] });
        }
      }, 0);
    })
  );
  localStorage.setItem('authToken', 'token');
  localStorage.setItem('authUser', JSON.stringify({ id: 1, isAdmin: true }));
  render(
    <AuthProvider>
      <AdminDashboard />
    </AuthProvider>
  );
  expect(await screen.findByText('$10')).toBeInTheDocument();
  await waitFor(() => expect(screen.getByText('$20')).toBeInTheDocument());
  expect(JSON.parse(localStorage.getItem('cachedPendingPayments')).data[0].amount).toBe(20);
});

