import base from '../mock/stores.json';
import { delay, generateId } from '../utils/helpers.js';

let stores = [...base];

export async function listStores() {
  await delay(400);
  return [...stores];
}

export async function requestStore(name) {
  await delay(600);
  const s = { id: generateId('s'), name, status: 'pending' };
  stores.push(s);
  return s;
}

export async function approveStore(id) {
  await delay(500);
  stores = stores.map((s) => (s.id === id ? { ...s, status: 'approved' } : s));
  return stores.find((s) => s.id === id);
}

export async function rejectStore(id) {
  await delay(500);
  stores = stores.filter((s) => s.id !== id);
  return true;
}


