import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './components/App';

test('renders login heading and header buttons', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /login/i });
  expect(heading).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /dashboard/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /payment review/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /charge details/i })).toBeInTheDocument();
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

test('header payment review button shows form', async () => {
  render(<App />);
  const btn = screen.getByRole('button', { name: /payment review/i });
  await userEvent.click(btn);
  const heading = screen.getByRole('heading', { name: /payment review/i });
  expect(heading).toBeInTheDocument();
});

test('header charge details button shows page', async () => {
  render(<App />);
  const btn = screen.getByRole('button', { name: /charge details/i });
  await userEvent.click(btn);
  const heading = screen.getByRole('heading', { name: /charge details/i });
  expect(heading).toBeInTheDocument();
});

test('header login button shows login page', async () => {
  render(<App />);
  await userEvent.click(screen.getByRole('button', { name: /dashboard/i }));
  await userEvent.click(screen.getByRole('button', { name: /^login$/i }));
  const heading = screen.getByRole('heading', { name: /login/i });
  expect(heading).toBeInTheDocument();
});

test('dashboard review button opens form with charge data', async () => {
  render(<App />);
  await userEvent.click(screen.getByRole('button', { name: /dashboard/i }));
  const reviewButtons = screen.getAllByRole('button', { name: /review payment/i });
  await userEvent.click(reviewButtons[0]);
  const heading = screen.getByRole('heading', { name: /payment review/i });
  expect(heading).toBeInTheDocument();
  expect(screen.getByText(/charge id:/i)).toBeInTheDocument();
});

test('dashboard details button opens details page then review form', async () => {
  render(<App />);
  await userEvent.click(screen.getByRole('button', { name: /dashboard/i }));
  const detailButtons = screen.getAllByRole('button', { name: /details/i });
  await userEvent.click(detailButtons[0]);
  const detailHeading = screen.getByRole('heading', { name: /charge details/i });
  expect(detailHeading).toBeInTheDocument();
  const requestBtn = screen.getByRole('button', { name: /request review/i });
  await userEvent.click(requestBtn);
  expect(screen.getByRole('heading', { name: /payment review/i })).toBeInTheDocument();
});
