import React from 'react';
import '../styles/AdminDashboard.css';

export default function DataTable({ columns = [], data = [], renderActions }) {
  return (
    <table className="admin-table">
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.accessor}>{c.header}</th>
          ))}
          {renderActions && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id || JSON.stringify(row)}>
            {columns.map((c) => (
              <td key={c.accessor}>{row[c.accessor]}</td>
            ))}
            {renderActions && <td>{renderActions(row)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
