export default function ChargeItem({
  id,
  status,
  amount,
  dueDate,
  onRequestReview = () => {},
  onViewDetails = () => {},
}) {
  return (
    <tr className="charge-item">
      <td>{status}</td>
      <td>{amount}</td>
      <td>{new Date(dueDate).toLocaleDateString()}</td>
      <td className="flex space-x-2">  {/* Tailwind flex + gap */}
        <button
          type="button"
          onClick={() => onRequestReview({ id, amount })}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Request Review
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
