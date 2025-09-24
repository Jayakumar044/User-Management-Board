import React, { useState, useEffect } from 'react';
import { validateUser } from '../utils/validators';

export default function UserForm({ initialUser, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialUser);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(initialUser);
  }, [initialUser]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validation = validateUser(form);
    setErrors(validation);
    if (Object.keys(validation).length === 0) onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit}>
      {['firstName', 'lastName', 'email', 'department'].map((field) => (
        <div className="form-group" key={field}>
          <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
          <input
            name={field}
            type="text"
            className={`form-control ${errors[field] ? 'is-invalid' : ''}`}
            value={form[field] || ''}
            onChange={handleChange}
          />
          {errors[field] && <div className="invalid-feedback">{errors[field]}</div>}
        </div>
      ))}
      <div className="mt-3 mb-3">
        <button className="btn btn-success me-2" type="submit">Save</button>
        <button className="btn btn-secondary" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
