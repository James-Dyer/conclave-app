import React from 'react';
import DataTable from './DataTable';
import '../styles/PaymentList.css';
import logo from '../assets/images/UC-Merced-SigmaChi-ExpectMore.svg';

export default function PaymentList({ payments = [], loading = false }) {
  if (!loading && payments.length === 0) {
    return (
      <div className="table-empty">
        <img src={logo} alt="" className="empty-illustration" />
        <p>No payments recorded yet.</p>
      </div>
    );
  }

  const columns = [
    { header: 'Amount Paid', accessor: 'amount' },
    { header: 'Paid Date', accessor: 'paidDate' },
    { header: 'Memo', accessor: 'memo' },
    { header: 'Status', accessor: 'status' },
    { header: 'Admin Note', accessor: 'adminNote' }
  ];

  const rows = payments.map((p) => ({
    ...p,
    paidDate: new Date(p.date).toLocaleDateString(),
    memo: p.memo || '-',
    adminNote: p.adminNote || '-'
  }));

  return <DataTable columns={columns} data={rows} loading={loading} />;
}
