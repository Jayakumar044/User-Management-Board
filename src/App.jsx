import React, { useEffect, useState, useMemo } from 'react';
import { getUsers, addUser, deleteUser } from './services/userService';
import UserTable from './components/UserTable';
import UserForm from './components/UserForm';
import FilterPopup from './components/FilterPopup';
import Pagination from './components/Pagination';
import SearchBar from './components/SearchBar';
import 'bootstrap/dist/css/bootstrap.min.css';

const initialForm = { firstName: '', lastName: '', email: '', department: '' };

function sortData(data, key, direction) {
  return [...data].sort((a, b) => {
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

function filterData(data, filters, search) {
  let result = [...data];
  Object.keys(filters).forEach(key => {
    if (filters[key]) {
      result = result.filter(user =>
        (user[key] || '').toLowerCase().includes(filters[key].toLowerCase())
      );
    }
  });
  if (search) {
    const s = search.toLowerCase();
    result = result.filter(user =>
      ['firstName', 'lastName', 'email', 'department'].some(k =>
        (user[k] || '').toLowerCase().includes(s)
      )
    );
  }
  return result;
}

export default function App() {
  const [users, setUsers] = useState([]);
  const [editUserObj, setEditUserObj] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const localUsersRaw = localStorage.getItem('users');
    let localUsers = null;
    if (localUsersRaw) {
      try {
        localUsers = JSON.parse(localUsersRaw);
      } catch {
        localUsers = null;
      }
    }
    if (!localUsers || !Array.isArray(localUsers) || localUsers.length === 0) {
      getUsers()
        .then(res => {
          const fetchedUsers = res.data.map(user => ({
            ...user,
            firstName: user.name?.split(' ')[0] || '',
            lastName: user.name?.split(' ').slice(1).join(' ') || '',
            department: user.company?.name || 'Engineering',
          }));
          setUsers(fetchedUsers);
          localStorage.setItem('users', JSON.stringify(fetchedUsers));
        })
        .catch(() => setError('Failed to fetch users.'));
    } else {
      setUsers(localUsers);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  function handleAdd() {
    setEditUserObj(initialForm);
    setShowForm(true);
  }

  function handleEdit(user) {
    setEditUserObj(user);
    setShowForm(true);
  }

  function handleDelete(id) {
    if (!window.confirm('Delete this user?')) return;
    deleteUser(id)
      .then(() => setUsers(users => users.filter(u => u.id !== id)))
      .catch(() => setError('Delete failed.'));
  }

  function handleFormSubmit(user) {
    if (user.id) {
      // Update without API call to prevent failed edit error
      setUsers(users =>
        users.map(u => (u.id === user.id ? user : u))
      );
      setSuccessMsg('User updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      setShowForm(false);
    } else {
      addUser(user)
        .then(() => {
          setUsers(users => {
            const maxId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0;
            return [...users, { ...user, id: maxId + 1 }];
          });
          setSuccessMsg('User added successfully!');
          setTimeout(() => setSuccessMsg(''), 3000);
        })
        .catch(() => setError('Add failed.'));
      setShowForm(false);
    }
  }

  function handleSort(key) {
    setSortConfig(current =>
      current.key === key
        ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    );
  }

  const filteredUsers = useMemo(() => filterData(users, filters, search), [users, filters, search]);
  const sortedUsers = useMemo(() => sortData(filteredUsers, sortConfig.key, sortConfig.direction), [filteredUsers, sortConfig]);
  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedUsers.slice(start, start + pageSize);
  }, [sortedUsers, page, pageSize]);

  useEffect(() => setPage(1), [filters, search, pageSize]);

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, #fceabb 0%, #f8b500 30%, #abecd6 55%, #f8b500 70%, #fceabb 100%)`,
        backgroundAttachment: 'fixed',
        overflowY: 'auto',
        padding: '1rem',
        boxSizing: 'border-box',
      }}
    >
      <div
        className="dashboard-card"
        style={{
          width: '100%',
          maxWidth: '900px',
          padding: '2.5rem 2rem',
          borderRadius: '25px',
          background: 'rgba(255,255,255,0.75)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          backdropFilter: 'blur(12px)',
          border: '2px solid rgba(255,255,255,0.18)',
          transition: 'box-shadow 0.2s, transform 0.2s',
          position: 'relative',
          overflowX: 'auto',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = "0 16px 32px 0 rgba(31, 38, 135, 0.22)";
          e.currentTarget.style.transform = "scale(1.025)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = "0 8px 32px 0 rgba(31, 38, 135, 0.15)";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <h2 className="text-center" style={{ paddingTop: '0.5em', marginBottom: '1.5em' }}>
          User Management Dashboard
        </h2>
        {successMsg && <div className="alert alert-success">{successMsg}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="d-flex justify-content-between mb-2 flex-wrap">
          <SearchBar search={search} setSearch={setSearch} />
          <div>
            <button className="btn btn-success" onClick={handleAdd} style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>Add User</button>
          </div>
        </div>

        <FilterPopup filters={filters} setFilters={setFilters} />

        <UserTable
          users={paginatedUsers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSort={handleSort}
          sortConfig={sortConfig}
        />
        <Pagination
          total={sortedUsers.length}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
        />

        {showForm && (
          <div className="modal show d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog">
              <div className="modal-content p-3">
                <UserForm
                  initialUser={editUserObj}
                  onSubmit={handleFormSubmit}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
