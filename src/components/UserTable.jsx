import React from 'react';

export default function UserTable({
  users, onEdit, onDelete, onSort, sortConfig,
}) {
  return (
    <div className="table-responsive">
      <table className="table table-bordered table-striped mt-3 text-center text-md-start">
        <thead>
          <tr>
            {['id', 'firstName', 'lastName', 'email', 'department'].map((col) => (
              <th key={col} onClick={() => onSort(col)} style={{cursor:'pointer'}}>
                {col.charAt(0).toUpperCase() + col.slice(1)}
                {sortConfig.key === col ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') : ''}
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr><td colSpan={6} className="text-center">No users found.</td></tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.department}</td>
                <td>
                  <button className="btn btn-sm btn-primary me-2 me-sm-3 mb-2 mb-sm-0" onClick={() => onEdit(user)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => onDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
