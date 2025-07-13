import { render, screen, waitFor } from '@testing-library/react';
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
    await screen.findByText(/name and email are required/i)
  ).toBeInTheDocument();
});

test('admin checkbox requires confirmation', async () => {
  setupLocalStorage();
  render(
    <AuthProvider>
      <AddMember />
    </AuthProvider>
  );
  const box = screen.getByRole('checkbox', { name: /admin/i });
  await userEvent.click(box);
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
  expect(box).not.toBeChecked();
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
  await userEvent.type(screen.getByLabelText(/full name/i), 'User');
  await userEvent.type(screen.getByLabelText(/email/i), 'user@test.com');
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));
  await waitFor(() => expect(global.fetch).toHaveBeenCalled());
});
