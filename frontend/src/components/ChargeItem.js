export default function ChargeItem({
  id,
  status,
  description,
  amount,
  dueDate,
  onRequestReview = () => {},
  onViewDetails = () => {},
  pending = false,
}) {
  return (
    <tr className="charge-item">
      <td>{status}</td>
      <td>{description || '-'}</td>
      <td>{amount}</td>
      <td>{new Date(dueDate).toLocaleDateString()}</td>
      <td className="flex space-x-2">  {/* Tailwind flex + gap */}
        <button
          type="button"
          onClick={() => onRequestReview({ id, amount, description })}
          className={`px-3 py-1 rounded ${pending ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
          disabled={pending}
          title={pending ? 'Your payment is being reviewed by the Quaestor.' : undefined}
        >
          {pending ? 'Pending Review' : 'Mark as Paid'}
        </button>
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
