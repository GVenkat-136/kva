export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateId(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}


