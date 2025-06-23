import '../styles/ChargeDetails.css';

const sampleCharge = {
  id: 1,
  status: 'Outstanding',
  amount: '$200',
  dueDate: '2024-05-01',
  description: 'Semester dues'
};

export default function ChargeDetails({ charge = sampleCharge }) {
  return (
    <div className="charge-details-page">
      <h1>Charge Details</h1>
      <table className="charge-details-table">
        <tbody>
          <tr>
            <th>Status</th>
            <td>{charge.status}</td>
          </tr>
          <tr>
            <th>Amount</th>
            <td>{charge.amount}</td>
          </tr>
          <tr>
            <th>Due Date</th>
            <td>{new Date(charge.dueDate).toLocaleDateString()}</td>
          </tr>
          <tr>
            <th>Description</th>
            <td>{charge.description || '-'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
