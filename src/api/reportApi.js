import base from '../mock/reports.json';
import storesData from '../mock/stores.json';
import { delay, generateId } from '../utils/helpers.js';

let reports = [...base];
let stores = [...storesData];

export async function fetchReports({ godownId, from, to }) {
  await delay(500);
  return reports.filter((r) => {
    if (godownId && r.godownId !== godownId) return false;
    if (from && r.date < from) return false;
    if (to && r.date > to) return false;
    return true;
  });
}

export async function addSaleReport({ godownId, storeId, items }) {
  await delay(300);
  
  // Calculate total sales from all items
  const totalSales = items.reduce((sum, item) => {
    return sum + (item.quantity * item.unitPrice);
  }, 0);
  
  // Get store name from store ID
  const store = stores.find(s => s.id === storeId);
  const storeName = store ? store.name : storeId;
  
  // Create a new sale report
  const report = {
    id: generateId('r'),
    storeId: storeName, // Use store name instead of ID for display
    godownId,
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    sales: totalSales,
    status: 'not paid'
  };
  
  reports.push(report);
  return report;
}


