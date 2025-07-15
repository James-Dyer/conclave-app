import SecondaryButton from './SecondaryButton';

export default function ChargeItem({
  id,
  status,
  description,
  amount,
  dueDate,
  partialAmountPaid,
  onRequestReview = () => {},
  onViewDetails = () => {},
  pending = false,
}) {
  const effectiveStatus = pending ? 'Under Review' : status;
  const displayStatus = effectiveStatus;
  return (
    <tr className="charge-item">
      <td>{description || '-'}</td>
      <td>{amount}</td>
      <td>{new Date(dueDate).toLocaleDateString()}</td>
      <td>{displayStatus}</td>
      <td>{partialAmountPaid > 0 ? partialAmountPaid : ''}</td>
      <td className="flex space-x-2">
        <SecondaryButton
          type="button"
          onClick={() => onViewDetails({ id, status, amount, dueDate })}
          className="px-3 py-1"
        >
          Details
        </SecondaryButton>
      </td>
    </tr>
  );
}
