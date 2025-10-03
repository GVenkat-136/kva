import React, { useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import useFetch from '../hooks/useFetch.js';
import { createGodown, deleteGodown, listGodowns, updateGodown } from '../api/godownApi.js';
import Table from '../components/Table.jsx';
import Modal from '../components/Modal.jsx';
import { 
  PlusIcon, 
  HomeModernIcon, 
  MapPinIcon, 
  PencilIcon, 
  TrashIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export default function Godowns() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const { data: godowns = [], loading, setData } = useFetch(listGodowns, []);

  const [form, setForm] = useState({ name: '', location: '', completeStockValue: '', noOfStores: '', startedDate: '' });
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const columns = useMemo(() => [
    { 
      key: 'name', 
      label: 'Godown Name',
      render: (value) => <span className="font-semibold text-gray-900">{value}</span>
    },
    { 
      key: 'location', 
      label: 'Location',
      render: (value) => (
        <div className="flex items-center gap-2">
          <MapPinIcon className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">{value}</span>
        </div>
      )
    },
    { 
      key: 'startedDate', 
      label: 'Started Date',
      render: (value) => {
        if (!value) return <span className="text-gray-400">-</span>;
        const date = new Date(value);
        return (
          <span className="text-gray-700">
            {date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        );
      }
    },
    { 
      key: 'completeStockValue', 
      label: 'Stock Value',
      render: (value) => (
        <span className="font-semibold text-green-600">
          ₹{value ? Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
        </span>
      )
    },
    { 
      key: 'noOfStores', 
      label: 'Stores',
      render: (value) => (
        <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold inline-block">
          {value || 0}
        </div>
      )
    },
  ], []);

  // Ensure godowns is always an array
  const safeGodowns = Array.isArray(godowns) ? godowns : [];

  const filteredGodowns = useMemo(() => {
    if (!searchTerm) return safeGodowns;
    return safeGodowns.filter(g => 
      g.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [safeGodowns, searchTerm]);

  const openModal = (godown = null) => {
    if (godown) {
      setEditing(godown);
      setForm({ 
        name: godown.name, 
        location: godown.location,
        completeStockValue: godown.completeStockValue || '',
        noOfStores: godown.noOfStores || '',
        startedDate: godown.startedDate || ''
      });
    } else {
      setEditing(null);
      setForm({ name: '', location: '', completeStockValue: '', noOfStores: '', startedDate: '' });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setForm({ name: '', location: '', completeStockValue: '', noOfStores: '', startedDate: '' });
  };

  const onSave = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (editing) {
      const updated = await updateGodown(editing.id, form);
      setData(safeGodowns.map((g) => (g.id === updated.id ? updated : g)));
    } else {
      const created = await createGodown(form);
      setData([...safeGodowns, created]);
    }
    closeModal();
  };

  const onDelete = async () => {
    await deleteGodown(confirm.id);
    setData(safeGodowns.filter((g) => g.id !== confirm.id));
    setConfirm(null);
  };

  return (
    <div className="h-full overflow-hidden flex flex-col p-6">
      <div className="max-w-7xl mx-auto w-full space-y-6 flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <HomeModernIcon className="w-6 h-6 text-purple-600" />
              </div>
              Godowns
            </h1>
            <p className="text-gray-600 mt-1 ml-13">Manage your warehouse locations and storage facilities</p>
          </div>
        </div>

        {/* Search and Add Button */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search godowns by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            />
          </div>
          {isAdmin && (
            <button 
              onClick={() => openModal()}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal text-white rounded-xl hover:bg-teal/90 transition-colors shadow-md hover:shadow-lg font-semibold whitespace-nowrap"
            >
              <PlusIcon className="w-5 h-5" />
              Add Godown
            </button>
          )}
        </div>

        {/* Table */}
        <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <Table
            columns={columns}
            data={loading ? [] : filteredGodowns}
            renderActions={isAdmin ? (row) => (
              <div className="flex gap-2">
                <button 
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors group"
                  onClick={() => openModal(row)}
                  title="Edit"
                >
                  <PencilIcon className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
                </button>
                <button 
                  className="p-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors group"
                  onClick={() => setConfirm(row)}
                  title="Delete"
                >
                  <TrashIcon className="w-4 h-4 text-red-600 group-hover:text-red-700" />
                </button>
              </div>
            ) : undefined}
          />
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal 
        open={modalOpen} 
        title={editing ? 'Edit Godown Details' : 'Add New Godown'} 
        onCancel={closeModal}
        size="md"
      >
        <form onSubmit={onSave} className="space-y-6">
          {/* Basic Information Section */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Godown Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter godown name"
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Enter location"
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Started Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.startedDate}
                  onChange={(e) => setForm({ ...form, startedDate: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Inventory Details Section */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
              Inventory Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Complete Stock Value <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                  <input
                    type="number"
                    value={form.completeStockValue}
                    onChange={(e) => setForm({ ...form, completeStockValue: e.target.value })}
                    placeholder="0.00"
                    required
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  No. of Stores <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={form.noOfStores}
                  onChange={(e) => setForm({ ...form, noOfStores: e.target.value })}
                  placeholder="0"
                  required
                  min="0"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-teal text-white rounded-xl hover:bg-teal/90 transition-colors font-semibold shadow-md"
            >
              {editing ? 'Update Godown' : 'Create Godown'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        open={!!confirm} 
        title="Delete Godown?" 
        onCancel={() => setConfirm(null)} 
        onConfirm={onDelete}
      >
        <p className="text-gray-600">
          Are you sure you want to delete <span className="font-semibold text-gray-900">{confirm?.name}</span>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}


