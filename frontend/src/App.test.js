import { render, screen } from '@testing-library/react';
import App from './components/App';
import { AuthProvider } from './AuthContext';

function mockFetch() {
  global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: async () => [] }));
}

beforeEach(() => {
  mockFetch();
});

afterEach(() => {
  localStorage.clear();
  jest.resetAllMocks();
});

test('shows login form on initial load', () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
});

test('shows logout button when token present', () => {
  localStorage.setItem('authToken', 'token');
  localStorage.setItem('authUser', JSON.stringify({ id: 1 }));
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
});
