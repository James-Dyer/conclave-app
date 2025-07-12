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
  const displayStatus = status === 'Outstanding' ? 'Not Paid' : status;
  return (
    <tr className="charge-item">
      <td>{description || '-'}</td>
      <td>{amount}</td>
      <td>{new Date(dueDate).toLocaleDateString()}</td>
      <td>{displayStatus}</td>
      <td>{status === 'Partially Paid' ? partialAmountPaid : ''}</td>
      <td className="flex space-x-2">
        <button
          type="button"
          onClick={() => onViewDetails({ id, status, amount, dueDate })}
          className="px-3 py-1 bg-gray-200 text-gray-800 rounded"
        >
          Details
        </button>
      </td>
    </tr>
  );
}
