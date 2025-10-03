import base from '../mock/godowns.json';
import { delay, generateId } from '../utils/helpers.js';

let godowns = [...base];

export async function listGodowns() {
  await delay(400);
  return [...godowns];
}

export async function createGodown(input) {
  await delay(500);
  const newG = { id: generateId('g'), ...input };
  godowns.push(newG);
  return newG;
}

export async function updateGodown(id, updates) {
  await delay(500);
  godowns = godowns.map((g) => (g.id === id ? { ...g, ...updates } : g));
  return godowns.find((g) => g.id === id);
}

export async function deleteGodown(id) {
  await delay(500);
  godowns = godowns.filter((g) => g.id !== id);
  return true;
}


