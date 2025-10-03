import users from '../mock/users.json';
import { delay } from '../utils/helpers.js';

export async function login(username, password) {
  await delay(500);
  const user = users.find((u) => u.username === username && u.password === password);
  if (!user) throw new Error('Invalid credentials');
  const { password: _p, ...rest } = user;
  return rest;
}

export function logout() {
  // no-op for mock
}


