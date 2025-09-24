import React, { useState } from 'react';

export default function FilterPopup({ filters, setFilters }) {
  const [isOpen, setIsOpen] = useState(false);

  function handleChange(e) {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function clearFilters() {
    setFilters({});
    setIsOpen(false);
  }

  return (
    <>
      <button className="btn btn-outline-secondary mb-2" onClick={() => setIsOpen(!isOpen)}>
        Filter
      </button>
      {isOpen && (
        <div className="card p-3 mb-2">
          {['firstName', 'lastName', 'email', 'department'].map((field) => (
            <div className="form-group" key={field}>
              <label>{field}</label>
              <input
                name={field}
                value={filters[field] || ''}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          ))}
          <div className="mt-3 mb-3">
            <button className="btn btn-primary me-2" onClick={() => setIsOpen(false)}>Apply</button>
            <button className="btn btn-secondary" onClick={clearFilters}>Clear</button>
          </div>
        </div>
      )}
    </>
  );
}
