import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddMember from './components/AddMember';
import { AuthProvider } from './AuthContext';

function setupLocalStorage() {
  localStorage.setItem('authToken', 'token');
  localStorage.setItem('authUser', JSON.stringify({ id: 1 }));
}

afterEach(() => {
  jest.resetAllMocks();
  localStorage.clear();
});

test('requires fields before submitting', async () => {
  setupLocalStorage();
  render(
    <AuthProvider>
      <AddMember />
    </AuthProvider>
  );
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));
  expect(
    await screen.findByText(/email, password and name are required/i)
  ).toBeInTheDocument();
});

test('successful submit calls API', async () => {
  setupLocalStorage();
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: async () => ({ id: 1 }) })
  );
  render(
    <AuthProvider>
      <AddMember />
    </AuthProvider>
  );
  await userEvent.type(screen.getByLabelText(/email/i), 'user@test.com');
  await userEvent.type(screen.getByLabelText(/^password/i), 'pass');
  await userEvent.type(screen.getByLabelText(/display name/i), 'User');
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));
  await screen.findByText(/member created/i);
  expect(global.fetch).toHaveBeenCalled();
});
