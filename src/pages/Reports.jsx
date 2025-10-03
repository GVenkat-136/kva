import React, { useMemo, useState, useEffect } from 'react';
import useFetch from '../hooks/useFetch.js';
import { useAuth } from '../hooks/useAuth.js';
import { listGodowns } from '../api/godownApi.js';
import { fetchReports } from '../api/reportApi.js';
import Table from '../components/Table.jsx';
import { 
  ChartBarIcon, 
  CalendarIcon,
  HomeModernIcon,
  BuildingStorefrontIcon,
  CurrencyRupeeIcon,
  FunnelIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  PrinterIcon,
} from '@heroicons/react/24/outline';

export default function Reports() {
  const { user } = useAuth();
  const isManager = user?.role === 'manager';
  const { data: godowns = [] } = useFetch(listGodowns, []);
  const safeGodowns = Array.isArray(godowns) ? godowns : [];
  const [filters, setFilters] = useState({ godownId: '', from: '', to: '' });
  
  // Auto-set godown filter for managers
  useEffect(() => {
    if (isManager && user?.assignedGodownId) {
      setFilters(prev => ({ ...prev, godownId: user.assignedGodownId }));
    }
  }, [isManager, user?.assignedGodownId]);
  
  const { data: rows = [], setData } = useFetch(() => fetchReports(filters), [filters.godownId, filters.from, filters.to]);

  const safeRows = Array.isArray(rows) ? rows : [];

  const handlePrintInvoice = (row) => {
    // In a real application, this would generate and print a PDF invoice
    console.log('Printing invoice for:', row);
    alert(`Printing invoice for ${row.storeId}\nDate: ${row.date}\nAmount: ₹${row.sales.toLocaleString('en-IN')}`);
  };

  const handleMarkAsPaid = (row) => {
    // Update the status to paid
    const updatedRows = safeRows.map(r => 
      r.id === row.id ? { ...r, status: 'paid' } : r
    );
    setData(updatedRows);
  };

  const columns = useMemo(() => [
    { 
      key: 'storeId', 
      label: 'Store',
      render: (value) => (
        <div className="flex items-center gap-2">
          <BuildingStorefrontIcon className="w-5 h-5 text-gray-400" />
          <span className="font-semibold text-gray-900">{value}</span>
        </div>
      )
    },
    { 
      key: 'date', 
      label: 'Date',
      render: (value) => (
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">
            {new Date(value).toLocaleDateString('en-GB', { 
              day: '2-digit', 
              month: 'short', 
              year: 'numeric' 
            })}
          </span>
        </div>
      )
    },
    { 
      key: 'sales', 
      label: 'Sales Amount',
      render: (value) => (
        <div className="flex items-center gap-1 text-green-700 font-bold">
          <CurrencyRupeeIcon className="w-4 h-4" />
          {value ? value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Payment Status',
      render: (value) => {
        const isPaid = value === 'paid';
        return (
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold text-xs ${
            isPaid 
              ? 'bg-green-50 text-green-700' 
              : 'bg-red-50 text-red-700'
          }`}>
            {isPaid ? (
              <CheckCircleIcon className="w-4 h-4" />
            ) : (
              <XCircleIcon className="w-4 h-4" />
            )}
            {isPaid ? 'Paid' : 'Not Paid'}
          </div>
        );
      }
    },
  ], []);

  const handleReset = () => {
    if (isManager) {
      // Managers can only reset date filters, godown stays the same
      setFilters({ godownId: user?.assignedGodownId || '', from: '', to: '' });
    } else {
      // Admins can reset all filters
      setFilters({ godownId: '', from: '', to: '' });
    }
    setData([]);
  };

  return (
    <div className="h-full overflow-hidden flex flex-col p-6">
      <div className="max-w-7xl mx-auto w-full space-y-6 flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-green-600" />
              </div>
              Sales Reports
            </h1>
            <p className="text-gray-600 mt-1 ml-13">Store sales analytics and payment tracking</p>
          </div>
        </div>
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Filters</h3>
          </div>
          
          <div className={`grid grid-cols-1 ${isManager ? 'md:grid-cols-3' : 'md:grid-cols-4'} gap-3`}>
            {/* Show godown selection only for admins */}
            {!isManager && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Godown</label>
                <div className="relative">
                  <HomeModernIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select 
                    value={filters.godownId} 
                    onChange={(e) => setFilters({ ...filters, godownId: e.target.value })} 
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                  >
                    <option value="">All Godowns</option>
                    {safeGodowns.map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Show godown name for managers */}
            {isManager && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Godown</label>
                <div className="flex items-center gap-2 px-3 py-2.5 bg-teal/5 border border-teal/20 rounded-xl">
                  <HomeModernIcon className="w-4 h-4 text-teal" />
                  <span className="font-semibold text-gray-900">
                    {safeGodowns.find(g => g.id === user?.assignedGodownId)?.name || 'N/A'}
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">From Date</label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="date" 
                  value={filters.from} 
                  onChange={(e) => setFilters({ ...filters, from: e.target.value })} 
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">To Date</label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="date" 
                  value={filters.to} 
                  onChange={(e) => setFilters({ ...filters, to: e.target.value })} 
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">&nbsp;</label>
              <button 
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
              >
                <ArrowPathIcon className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Sales Table */}
        <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <Table 
            columns={columns} 
            data={safeRows}
            renderActions={(row) => (
              <div className="flex gap-2">
                {row.status !== 'paid' && (
                  <button 
                    onClick={() => handleMarkAsPaid(row)}
                    className="p-2 rounded-lg bg-green-50 hover:bg-green-100 transition-colors group"
                    title="Mark as Paid"
                  >
                    <CheckCircleIcon className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
                  </button>
                )}
                <button 
                  onClick={() => handlePrintInvoice(row)}
                  className="p-2 rounded-lg bg-teal/10 hover:bg-teal/20 transition-colors group"
                  title="Print Invoice"
                >
                  <PrinterIcon className="w-5 h-5 text-teal group-hover:scale-110 transition-transform" />
                </button>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}


