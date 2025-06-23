import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('renders login heading and header buttons', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /login/i });
  expect(heading).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /dashboard/i })).toBeInTheDocument();
  const loginButtons = screen.getAllByRole('button', { name: /^login$/i });
  expect(loginButtons.length).toBeGreaterThan(0);
  const logout = screen.getByRole('link', { name: /logout/i });
  expect(logout).toBeInTheDocument();
});

test('header dashboard button shows dashboard', async () => {
  render(<App />);
  const btn = screen.getByRole('button', { name: /dashboard/i });
  await userEvent.click(btn);
  const heading = screen.getByRole('heading', { name: /dashboard/i });
  expect(heading).toBeInTheDocument();
});

test('header login button shows login page', async () => {
  render(<App />);
  await userEvent.click(screen.getByRole('button', { name: /dashboard/i }));
  await userEvent.click(screen.getByRole('button', { name: /^login$/i }));
  const heading = screen.getByRole('heading', { name: /login/i });
  expect(heading).toBeInTheDocument();
});
