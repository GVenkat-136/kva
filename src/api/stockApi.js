import base from '../mock/stocks.json';
import { delay, generateId } from '../utils/helpers.js';

let stockEntries = [...base];

export async function listStocksByGodown(godownId) {
  await delay(400);
  // Return only stock items (not send history) for the godown with full details
  return stockEntries.filter((e) => e.godownId === godownId && e.type !== 'send');
}

export async function addStock({ godownId, item, category, quantity, manufactureDate, expiryDate, unitPrice }) {
  await delay(500);
  const entry = { 
    id: generateId('stk'), 
    godownId, 
    item, 
    category,
    quantity, 
    manufactureDate,
    expiryDate,
    unitPrice,
    timestamp: Date.now(), 
    type: 'add' 
  };
  stockEntries.push(entry);
  return entry;
}

let sentStockHistory = []; // Track sent stock for reports

export async function sendStock({ godownId, storeId, item, quantity, unitPrice }) {
  await delay(600);
  
  // Find the existing stock item and reduce its quantity
  // Check for items without type (from mock data) or with type 'add' (newly added items)
  const stockItem = stockEntries.find(
    (e) => e.godownId === godownId && e.item === item && (!e.type || e.type === 'add')
  );
  
  if (stockItem) {
    stockItem.quantity = Math.max(0, stockItem.quantity - quantity);
  }
  
  // Track the sent stock with price for sales reporting
  const entry = { 
    id: generateId('stk'), 
    godownId, 
    storeId, 
    item, 
    quantity, 
    unitPrice: unitPrice || stockItem?.unitPrice || 0,
    timestamp: Date.now(), 
    type: 'send' 
  };
  
  sentStockHistory.push(entry);
  return entry;
}

export async function getSentStockHistory() {
  await delay(400);
  return sentStockHistory.sort((a, b) => b.timestamp - a.timestamp);
}

export async function history(godownId) {
  await delay(400);
  return stockEntries.filter((e) => e.godownId === godownId).sort((a, b) => b.timestamp - a.timestamp);
}


