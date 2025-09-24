export function validateUser({ firstName, lastName, email, department }) {
  const errors = {};
  if (!firstName?.trim()) errors.firstName = 'First name required';
  if (!lastName?.trim()) errors.lastName = 'Last name required';
  if (!department?.trim()) errors.department = 'Department required';
  if (!email?.trim()) {
    errors.email = 'Email required';
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = 'Invalid email format';
  }
  return errors;
}
