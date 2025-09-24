import React from 'react';

export default function Pagination({ total, page, pageSize, setPage, setPageSize }) {
  const pageCount = Math.ceil(total / pageSize);
  return (
    <div className="d-flex justify-content-between align-items-center my-2">
      <div>
        Show
        <select value={pageSize} className="mx-2" onChange={e => setPageSize(Number(e.target.value))}>
          {[10, 25, 50, 100].map(size => <option key={size} value={size}>{size}</option>)}
        </select>
        users per page
      </div>
      <nav>
        <ul className="pagination mb-0">
          {Array.from({ length: pageCount }).map((_, idx) => (
            <li key={idx} className={`page-item ${page === idx + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setPage(idx + 1)}>{idx + 1}</button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
