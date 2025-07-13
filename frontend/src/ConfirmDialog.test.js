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

test('input field renders and triggers onInputChange', async () => {
  const onChange = jest.fn();
  render(
    <ConfirmDialog
      open
      onConfirm={noop}
      onCancel={noop}
      inputLabel="Reason"
      inputValue=""
      onInputChange={onChange}
    />
  );
  const input = screen.getByLabelText(/reason/i);
  expect(input).toBeInTheDocument();
  await userEvent.type(input, 'abc');
  expect(onChange).toHaveBeenCalled();
});

test('displays error text when provided', () => {
  render(
    <ConfirmDialog open onConfirm={noop} onCancel={noop} errorText="Required" />
  );
  expect(screen.getByText(/required/i)).toBeInTheDocument();
});
