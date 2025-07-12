import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmDialog from './components/ConfirmDialog';

const noop = () => {};

test('renders children when open', () => {
  render(
    <ConfirmDialog open onConfirm={noop} onCancel={noop}>
      <p>Are you sure?</p>
    </ConfirmDialog>
  );
  expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
});

test('confirm and cancel buttons trigger callbacks', async () => {
  const onConfirm = jest.fn();
  const onCancel = jest.fn();
  render(
    <ConfirmDialog open onConfirm={onConfirm} onCancel={onCancel} />
  );
  await userEvent.click(screen.getByRole('button', { name: /confirm/i }));
  expect(onConfirm).toHaveBeenCalled();
  await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
  expect(onCancel).toHaveBeenCalled();
});

test('close button triggers onCancel', async () => {
  const onCancel = jest.fn();
  render(
    <ConfirmDialog open onConfirm={noop} onCancel={onCancel} />
  );
  await userEvent.click(screen.getByRole('button', { name: /close/i }));
  expect(onCancel).toHaveBeenCalled();
});
