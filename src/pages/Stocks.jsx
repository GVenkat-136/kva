import React, { useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import useFetch from '../hooks/useFetch.js';
import { listGodowns } from '../api/godownApi.js';
import { addStock, listStocksByGodown, sendStock } from '../api/stockApi.js';
import { addSaleReport } from '../api/reportApi.js';
import Table from '../components/Table.jsx';
import Modal from '../components/Modal.jsx';
import { 
  CubeIcon, 
  PlusIcon, 
  PaperAirplaneIcon,
  HomeModernIcon,
  BuildingStorefrontIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  TagIcon
} from '@heroicons/react/24/outline';

export default function Stocks() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const { data: godowns = [] } = useFetch(listGodowns, []);
  
  // Manager uses their assigned godown, Admin can select
  const defaultGodownId = isAdmin ? godowns?.[0]?.id : user?.assignedGodownId;
  const [godownId, setGodownId] = useState(defaultGodownId || 'g_1');

  const { data: levels = [], setData: setLevels } = useFetch(() => listStocksByGodown(godownId), [godownId]);

  // Multi-item add form
  const [addItems, setAddItems] = useState([]);
  
  // Multi-item send form
  const [sendItems, setSendItems] = useState([]);
  const [sendStore, setSendStore] = useState('');
  
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Ensure levels is always an array
  const safeLevels = Array.isArray(levels) ? levels : [];

  const filteredLevels = useMemo(() => {
    if (!searchTerm) return safeLevels;
    return safeLevels.filter(item => 
      item.item?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [safeLevels, searchTerm]);

  const levelCols = useMemo(() => [
    { 
      key: 'item', 
      label: 'Item Name',
      render: (value) => (
        <div className="flex items-center gap-2">
          <CubeIcon className="w-5 h-5 text-gray-400" />
          <span className="font-semibold text-gray-900">{value}</span>
        </div>
      )
    },
    { 
      key: 'category', 
      label: 'Category',
      render: (value) => {
        if (!value) return <span className="text-gray-400">-</span>;
        
        // Different colors for different categories
        const categoryColors = {
          'Antibiotics': 'bg-red-50 text-red-700 border-red-200',
          'Painkillers': 'bg-purple-50 text-purple-700 border-purple-200',
          'Vitamins': 'bg-green-50 text-green-700 border-green-200',
          'Antacids': 'bg-blue-50 text-blue-700 border-blue-200',
          'Antihistamines': 'bg-pink-50 text-pink-700 border-pink-200',
          'Diabetes': 'bg-orange-50 text-orange-700 border-orange-200',
          'Cardiovascular': 'bg-red-50 text-red-700 border-red-200',
          'Insulin': 'bg-indigo-50 text-indigo-700 border-indigo-200',
          'Other': 'bg-gray-50 text-gray-700 border-gray-200'
        };
        
        const colorClass = categoryColors[value] || 'bg-gray-50 text-gray-700 border-gray-200';
        
        return (
          <div className="flex items-center gap-2">
            <TagIcon className="w-4 h-4 text-gray-400" />
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClass}`}>
              {value}
            </span>
          </div>
        );
      }
    },
    { 
      key: 'quantity', 
      label: 'Quantity',
      render: (value) => (
        <div className={`inline-flex items-center px-3 py-1 rounded-full font-semibold text-sm ${
          value > 50 ? 'bg-green-50 text-green-700' : 
          value > 20 ? 'bg-yellow-50 text-yellow-700' : 
          'bg-red-50 text-red-700'
        }`}>
          {value} units
        </div>
      )
    },
    { 
      key: 'manufactureDate', 
      label: 'Manufacture Date',
      render: (value, row) => value ? (
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
      ) : <span className="text-gray-400">-</span>
    },
    { 
      key: 'expiryDate', 
      label: 'Expiry Date',
      render: (value, row) => {
        if (!value) return <span className="text-gray-400">-</span>;
        const expiryDate = new Date(value);
        const today = new Date();
        const daysUntilExpiry = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));
        
        let colorClass = 'text-gray-600';
        if (daysUntilExpiry < 0) colorClass = 'text-red-600 font-semibold';
        else if (daysUntilExpiry < 30) colorClass = 'text-orange-600 font-semibold';
        else if (daysUntilExpiry < 90) colorClass = 'text-yellow-600';
        
        return (
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-gray-400" />
            <span className={colorClass}>
              {expiryDate.toLocaleDateString('en-GB', { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric' 
              })}
            </span>
          </div>
        );
      }
    },
    { 
      key: 'unitPrice', 
      label: 'Unit Price',
      render: (value, row) => (
        <div className="flex items-center gap-1 text-gray-900 font-semibold">
          <CurrencyRupeeIcon className="w-4 h-4 text-gray-600" />
          {value ? value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
        </div>
      )
    },
  ], []);

  const openAddModal = () => {
    setAddItems([]);
    setAddModalOpen(true);
  };

  const addNewItem = () => {
    setAddItems([...addItems, { 
      item: '', 
      category: '',
      quantity: 0, 
      manufactureDate: '', 
      expiryDate: '', 
      unitPrice: 0 
    }]);
  };

  const removeAddItem = (index) => {
    setAddItems(addItems.filter((_, i) => i !== index));
  };

  const updateAddItem = (index, field, value) => {
    const updated = [...addItems];
    updated[index][field] = value;
    setAddItems(updated);
  };

  const onAddStock = async (e) => {
    e.preventDefault();
    if (addItems.length === 0) return;
    
    // Validate all items
    const isValid = addItems.every(item => 
      item.item.trim() && item.category && item.quantity > 0 && 
      item.manufactureDate && item.expiryDate && item.unitPrice >= 0
    );
    
    if (!isValid) {
      alert('Please fill all fields for each item');
      return;
    }

    // Add all items
    for (const item of addItems) {
      const existingItem = safeLevels.find(stock => stock.item === item.item);
      
      if (existingItem) {
        // Update existing item quantity
        const updatedLevels = safeLevels.map(stock => 
          stock.item === item.item 
            ? { ...stock, quantity: stock.quantity + Number(item.quantity) }
            : stock
        );
        setLevels(updatedLevels);
      } else {
        // Add new item
        await addStock({ 
          godownId, 
          item: item.item,
          category: item.category,
          quantity: Number(item.quantity),
          manufactureDate: item.manufactureDate,
          expiryDate: item.expiryDate,
          unitPrice: Number(item.unitPrice)
        });
      }
    }
    
    // Refresh stock levels
    const newLevels = await listStocksByGodown(godownId);
    setLevels(newLevels);
    
    setAddItems([]);
    setAddModalOpen(false);
  };

  const openSendModal = () => {
    setSendItems([]);
    setSendStore('');
    setSendModalOpen(true);
  };

  const addSendItem = () => {
    setSendItems([...sendItems, { item: '', quantity: 0, availableQty: 0 }]);
  };

  const removeSendItem = (index) => {
    setSendItems(sendItems.filter((_, i) => i !== index));
  };

  const updateSendItem = (index, field, value) => {
    const updated = [...sendItems];
    updated[index][field] = value;
    
    // Update available quantity when item is selected
    if (field === 'item') {
      const stockItem = safeLevels.find(l => l.item === value);
      updated[index].availableQty = stockItem?.quantity || 0;
    }
    
    setSendItems(updated);
  };

  const onSendStock = async (e) => {
    e.preventDefault();
    if (!sendStore || sendItems.length === 0) return;
    
    // Validate all items have valid quantities
    const isValid = sendItems.every(item => 
      item.item && item.quantity > 0 && item.quantity <= item.availableQty
    );
    
    if (!isValid) {
      alert('Please check all items have valid quantities');
      return;
    }

    // Prepare items with prices for sale report
    const itemsWithPrices = sendItems.map(item => {
      const stockItem = safeLevels.find(s => s.item === item.item);
      return {
        item: item.item,
        quantity: Number(item.quantity),
        unitPrice: stockItem?.unitPrice || 0
      };
    });

    // Send all items and reduce stock quantities
    for (const item of itemsWithPrices) {
      await sendStock({ 
        godownId, 
        storeId: sendStore, 
        item: item.item, 
        quantity: item.quantity,
        unitPrice: item.unitPrice
      });
    }
    
    // Create a sale report
    await addSaleReport({
      godownId,
      storeId: sendStore,
      items: itemsWithPrices
    });
    
    // Refresh stock levels to show reduced quantities
    const refreshedLevels = await listStocksByGodown(godownId);
    setLevels(refreshedLevels);
    
    setSendItems([]);
    setSendStore('');
    setSendModalOpen(false);
  };

  const safeGodowns = Array.isArray(godowns) ? godowns : [];
  const selectedGodown = safeGodowns.find(g => g.id === godownId);

  return (
    <div className="h-full overflow-hidden flex flex-col p-6">
      <div className="max-w-7xl mx-auto w-full space-y-6 flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <CubeIcon className="w-6 h-6 text-purple-600" />
              </div>
              Medical Stock Management
            </h1>
            <p className="text-gray-600 mt-1 ml-13">Monitor and manage medical inventory across godowns</p>
          </div>
        </div>

        {/* Godown Display (Admin only) and Search */}
        <div className="flex items-center gap-3">
          {isAdmin && (
            <div className="flex items-center gap-3 bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-3">
              <HomeModernIcon className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">Godown:</span>
              <select 
                value={godownId} 
                onChange={(e) => setGodownId(e.target.value)} 
                className="px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent font-semibold text-gray-900"
              >
                {safeGodowns.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
          )}

          {isManager && selectedGodown && (
            <div className="flex items-center gap-3 bg-teal/10 rounded-xl border border-teal/20 px-4 py-3">
              <HomeModernIcon className="w-5 h-5 text-teal" />
              <div>
                <span className="text-xs font-semibold text-gray-600 block">Your Godown</span>
                <span className="text-sm font-bold text-gray-900">{selectedGodown.name}</span>
              </div>
            </div>
          )}

          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search medical items or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            />
          </div>
        </div>

        {/* Action Buttons */}
        {!isAdmin && (
          <div className="flex gap-3">
            <button 
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal text-white rounded-xl hover:bg-teal/90 transition-colors shadow-md hover:shadow-lg font-semibold"
            >
              <PlusIcon className="w-5 h-5" />
              Add Medical Stock
            </button>
            <button 
              onClick={openSendModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal text-white rounded-xl hover:bg-teal/90 transition-colors shadow-md hover:shadow-lg font-semibold"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
              Send Medical Stock
            </button>
          </div>
        )}

        {/* Stock Levels Table */}
        <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <Table columns={levelCols} data={filteredLevels} />
        </div>
      </div>

      {/* Add Stock Modal - Split Screen */}
      <Modal 
        open={addModalOpen} 
        title="Add Medical Stock" 
        onCancel={() => setAddModalOpen(false)}
        size="xl"
      >
        <form onSubmit={onAddStock} className="flex gap-4 h-[480px]">
          {/* Left Side - Add Items Form */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-gray-600 uppercase">Items</h3>
              <button
                type="button"
                onClick={addNewItem}
                className="flex items-center gap-1 px-2 py-1 bg-teal text-white rounded-md hover:bg-teal/90 transition-colors text-xs font-semibold"
              >
                <PlusIcon className="w-3 h-3" />
                Add
              </button>
            </div>

            {addItems.length === 0 ? (
              <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <div className="text-center">
                  <CubeIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">No items added</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {addItems.map((item, index) => (
                  <div key={index} className="p-2 bg-white rounded-md border border-gray-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-teal">#{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeAddItem(index)}
                        className="p-0.5 text-red-500 hover:bg-red-50 rounded"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <div>
                        <label className="block text-xs font-semibold text-teal mb-1">Item Name</label>
                        <input
                          type="text"
                          value={item.item}
                          onChange={(e) => updateAddItem(index, 'item', e.target.value)}
                          placeholder="e.g., Paracetamol 500mg"
                          required
                          className="w-full px-2 py-1 border border-teal/30 rounded text-xs focus:outline-none focus:ring-1 focus:ring-teal focus:border-teal bg-white"
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-1.5">
                        <div>
                          <label className="block text-xs font-semibold text-teal mb-1">Category</label>
                          <select
                            value={item.category}
                            onChange={(e) => updateAddItem(index, 'category', e.target.value)}
                            required
                            className="w-full px-1.5 py-1 border border-teal/30 rounded text-xs focus:outline-none focus:ring-1 focus:ring-teal focus:border-teal bg-white"
                          >
                            <option value="">Select</option>
                            <option value="Antibiotics">Antibiotics</option>
                            <option value="Painkillers">Painkillers</option>
                            <option value="Vitamins">Vitamins</option>
                            <option value="Antacids">Antacids</option>
                            <option value="Antihistamines">Antihistamines</option>
                            <option value="Diabetes">Diabetes</option>
                            <option value="Cardiovascular">Cardiovascular</option>
                            <option value="Insulin">Insulin</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-teal mb-1">Quantity</label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateAddItem(index, 'quantity', e.target.value)}
                            placeholder="0"
                            required
                            className="w-full px-1.5 py-1 border border-teal/30 rounded text-xs focus:outline-none focus:ring-1 focus:ring-teal focus:border-teal bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-teal mb-1">Price (₹)</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => updateAddItem(index, 'unitPrice', e.target.value)}
                            placeholder="0.00"
                            required
                            className="w-full px-1.5 py-1 border border-teal/30 rounded text-xs focus:outline-none focus:ring-1 focus:ring-teal focus:border-teal bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5">
                        <div>
                          <label className="block text-xs font-semibold text-teal mb-1">Mfg. Date</label>
                          <input
                            type="date"
                            value={item.manufactureDate}
                            onChange={(e) => updateAddItem(index, 'manufactureDate', e.target.value)}
                            required
                            className="w-full px-1.5 py-1 border border-teal/30 rounded text-xs focus:outline-none focus:ring-1 focus:ring-teal focus:border-teal bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-teal mb-1">Exp. Date</label>
                          <input
                            type="date"
                            value={item.expiryDate}
                            onChange={(e) => updateAddItem(index, 'expiryDate', e.target.value)}
                            required
                            min={item.manufactureDate}
                            className="w-full px-1.5 py-1 border border-teal/30 rounded text-xs focus:outline-none focus:ring-1 focus:ring-teal focus:border-teal bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Bill/Summary */}
          <div className="w-64 flex flex-col bg-gradient-to-br from-teal/5 to-teal/10 rounded-lg border border-teal/20 p-3">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-teal/20">
              <CubeIcon className="w-4 h-4 text-teal" />
              <h3 className="text-xs font-bold text-gray-800">Summary</h3>
            </div>

            {addItems.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-center">
                <div>
                  <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CubeIcon className="w-6 h-6 text-teal/40" />
                  </div>
                  <p className="text-xs text-gray-500">Add items to see bill</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto space-y-1.5 mb-3">
                  {addItems.map((item, index) => (
                    <div key={index} className="bg-white rounded-md p-2 shadow-sm border border-gray-200">
                      <div className="flex items-start justify-between mb-0.5">
                        <span className="text-xs font-semibold text-gray-800 flex-1 line-clamp-1">{item.item || `Item #${index + 1}`}</span>
                        <span className="text-xs font-bold text-teal ml-1">₹{((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{item.quantity || 0} × ₹{(Number(item.unitPrice) || 0).toFixed(2)}</span>
                        {item.category && (
                          <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">{item.category}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-teal/20 pt-2 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Items:</span>
                    <span className="font-bold text-gray-800">{addItems.length}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-bold text-gray-800">{addItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)} units</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold bg-teal text-white rounded-md p-2 mt-1">
                    <span>Total:</span>
                    <span>₹{addItems.reduce((sum, item) => sum + ((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)), 0).toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-2 mt-3 pt-3 border-t border-teal/20">
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="flex-1 px-2 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addItems.length === 0}
                className="flex-1 px-2 py-1.5 bg-teal text-white rounded-md hover:bg-teal/90 transition-colors text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Stock
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Send Stock Modal - Split Screen */}
      <Modal 
        open={sendModalOpen} 
        title="Send Stock to Store" 
        onCancel={() => setSendModalOpen(false)}
        size="xl"
      >
        <form onSubmit={onSendStock} className="flex gap-4 h-[480px]">
          {/* Left Side - Store Selection & Add Items */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Store Selection */}
            <div className="bg-teal/10 border border-teal/30 rounded-lg p-2 mb-3">
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <BuildingStorefrontIcon className="w-3 h-3 text-teal" />
                Store <span className="text-red-500">*</span>
              </label>
              <select
                value={sendStore}
                onChange={(e) => setSendStore(e.target.value)}
                required
                className="w-full px-2 py-1 border border-teal/30 rounded-md focus:outline-none focus:ring-1 focus:ring-teal bg-white font-semibold text-xs"
              >
                <option value="">Choose store</option>
                <option value="s_1">Store Alpha</option>
                <option value="s_2">Store Beta</option>
                <option value="s_3">Store Gamma</option>
                <option value="s_4">Store Delta</option>
                <option value="s_5">Store Epsilon</option>
              </select>
            </div>

            {/* Add Items Section */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-gray-600 uppercase">Items</h3>
              <button
                type="button"
                onClick={addSendItem}
                className="flex items-center gap-1 px-2 py-1 bg-teal text-white rounded-md hover:bg-teal/90 transition-colors text-xs font-semibold"
              >
                <PlusIcon className="w-3 h-3" />
                Add
              </button>
            </div>

            {sendItems.length === 0 ? (
              <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <div className="text-center">
                  <PaperAirplaneIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">No items selected</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {sendItems.map((item, index) => (
                  <div key={index} className="p-2 bg-white rounded-md border border-gray-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-teal">#{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeSendItem(index)}
                        className="p-0.5 text-red-500 hover:bg-red-50 rounded"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <div>
                        <label className="block text-xs font-semibold text-teal mb-1">Select Item</label>
                        <select
                          value={item.item}
                          onChange={(e) => updateSendItem(index, 'item', e.target.value)}
                          required
                          className="w-full px-2 py-1 border border-teal/30 rounded text-xs focus:outline-none focus:ring-1 focus:ring-teal focus:border-teal bg-white"
                        >
                          <option value="">Choose item</option>
                          {safeLevels.map((stock) => (
                            <option key={stock.id} value={stock.item}>
                              {stock.item} (Available: {stock.quantity})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-teal mb-1">Quantity to Send</label>
                        <input
                          type="number"
                          min="1"
                          max={item.availableQty}
                          value={item.quantity}
                          onChange={(e) => updateSendItem(index, 'quantity', e.target.value)}
                          placeholder="0"
                          required
                          className="w-full px-2 py-1 border border-teal/30 rounded text-xs focus:outline-none focus:ring-1 focus:ring-teal focus:border-teal bg-white font-semibold"
                        />
                        {item.availableQty > 0 && (
                          <div className="mt-1 flex items-center gap-1">
                            <div className="h-1 flex-1 bg-teal/20 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-teal transition-all"
                                style={{ width: `${Math.min((item.quantity / item.availableQty) * 100, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-teal font-semibold">/ {item.availableQty}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Transfer Bill */}
          <div className="w-64 flex flex-col bg-gradient-to-br from-teal/5 to-teal/10 rounded-lg border border-teal/20 p-3">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-teal/20">
              <PaperAirplaneIcon className="w-4 h-4 text-teal" />
              <h3 className="text-xs font-bold text-gray-800">Transfer Bill</h3>
            </div>

            {/* Store Info */}
            {sendStore && (
              <div className="bg-white rounded-md p-2 mb-3 border border-teal/30 shadow-sm">
                <div className="flex items-center gap-2">
                  <BuildingStorefrontIcon className="w-4 h-4 text-teal" />
                  <div>
                    <p className="text-xs text-gray-500">Sending to</p>
                    <p className="text-xs font-bold text-gray-800">
                      {sendStore === 's_1' && 'Store Alpha'}
                      {sendStore === 's_2' && 'Store Beta'}
                      {sendStore === 's_3' && 'Store Gamma'}
                      {sendStore === 's_4' && 'Store Delta'}
                      {sendStore === 's_5' && 'Store Epsilon'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {sendItems.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-center">
                <div>
                  <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CubeIcon className="w-6 h-6 text-teal/40" />
                  </div>
                  <p className="text-xs text-gray-500">Add items to see bill</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto space-y-1.5 mb-3">
                  {sendItems.map((item, index) => {
                    const stockItem = safeLevels.find(s => s.item === item.item);
                    const unitPrice = stockItem?.unitPrice || 0;
                    const totalPrice = (item.quantity || 0) * unitPrice;
                    
                    return (
                      <div key={index} className="bg-white rounded-md p-2 shadow-sm border border-gray-200">
                        <div className="flex items-start justify-between mb-0.5">
                          <span className="text-xs font-semibold text-gray-800 flex-1 line-clamp-1">{item.item || `Item #${index + 1}`}</span>
                          <span className="text-xs font-bold text-teal ml-1">₹{totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{item.quantity || 0} × ₹{(Number(unitPrice) || 0).toFixed(2)}</span>
                          <span className="text-xs text-orange-600 font-semibold">{item.availableQty} avail</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-teal/20 pt-2 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Items:</span>
                    <span className="font-bold text-gray-800">{sendItems.length}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-bold text-gray-800">{sendItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)} units</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold bg-teal text-white rounded-md p-2 mt-1">
                    <span>Total:</span>
                    <span>₹{sendItems.reduce((sum, item) => {
                      const stockItem = safeLevels.find(s => s.item === item.item);
                      return sum + ((Number(item.quantity) || 0) * (Number(stockItem?.unitPrice) || 0));
                    }, 0).toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-2 mt-3 pt-3 border-t border-teal/20">
              <button
                type="button"
                onClick={() => setSendModalOpen(false)}
                className="flex-1 px-2 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sendItems.length === 0 || !sendStore}
                className="flex-1 px-2 py-1.5 bg-teal text-white rounded-md hover:bg-teal/90 transition-colors text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Stock
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}


