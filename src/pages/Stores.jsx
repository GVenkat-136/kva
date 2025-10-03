import React, { useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import useFetch from '../hooks/useFetch.js';
import { approveStore, listStores, rejectStore, requestStore } from '../api/storeApi.js';
import Table from '../components/Table.jsx';
import Modal from '../components/Modal.jsx';
import { 
  PlusIcon, 
  BuildingStorefrontIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  CalendarIcon,
  HomeModernIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

export default function Stores() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const { data: stores = [], loading, setData } = useFetch(listStores, []);
  const [confirm, setConfirm] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: '',
    location: '',
    godownName: '',
    addedDate: '',
    requestedBy: ''
  });

  // Ensure stores is always an array
  const safeStores = Array.isArray(stores) ? stores : [];

  // Filter stores based on user role
  const roleFilteredStores = useMemo(() => {
    // Admin sees all stores
    if (isAdmin) return safeStores;
    
    // Manager sees only stores from their assigned godown
    if (isManager && user?.assignedGodownId) {
      // Map godownId to godownName for filtering
      const godownIdToName = {
        'g_1': 'Central Godown',
        'g_2': 'North Zone Godown',
        'g_3': 'South Regional Godown'
      };
      const assignedGodownName = godownIdToName[user.assignedGodownId];
      return safeStores.filter(s => s.godownName === assignedGodownName);
    }
    
    return safeStores;
  }, [safeStores, isAdmin, isManager, user?.assignedGodownId]);

  const filteredStores = useMemo(() => {
    if (!searchTerm) return roleFilteredStores;
    return roleFilteredStores.filter(s => 
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [roleFilteredStores, searchTerm]);

  const columns = useMemo(() => [
    { 
      key: 'name', 
      label: 'Store Name',
      render: (value) => (
        <div className="flex items-center gap-2">
          <BuildingStorefrontIcon className="w-5 h-5 text-gray-400" />
          <span className="font-semibold text-gray-900">{value}</span>
        </div>
      )
    },
    { 
      key: 'location', 
      label: 'Location',
      render: (value) => value ? (
        <div className="flex items-center gap-2">
          <MapPinIcon className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">{value}</span>
        </div>
      ) : <span className="text-gray-400">-</span>
    },
    { 
      key: 'godownName', 
      label: 'Godown Name',
      render: (value) => value ? (
        <div className="flex items-center gap-2">
          <HomeModernIcon className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">{value}</span>
        </div>
      ) : <span className="text-gray-400">-</span>
    },
    { 
      key: 'addedDate', 
      label: 'Added Date',
      render: (value) => value ? (
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
      key: 'requestedBy', 
      label: 'Requested By',
      render: (value) => value ? (
        <span className="text-gray-700">{value}</span>
      ) : <span className="text-gray-400">-</span>
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (v) => {
        const statusConfig = {
          approved: { 
            bg: 'bg-green-50', 
            text: 'text-green-700', 
            icon: CheckCircleIcon,
            label: 'Approved' 
          },
          pending: { 
            bg: 'bg-yellow-50', 
            text: 'text-yellow-700', 
            icon: ClockIcon,
            label: 'Pending' 
          },
          rejected: { 
            bg: 'bg-red-50', 
            text: 'text-red-700', 
            icon: XCircleIcon,
            label: 'Rejected' 
          }
        };
        const config = statusConfig[v] || statusConfig.pending;
        const Icon = config.icon;
        return (
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${config.bg} ${config.text} font-semibold text-xs`}>
            <Icon className="w-4 h-4" />
            {config.label}
          </div>
        );
      }
    },
  ], []);

  const openModal = (store = null) => {
    if (store) {
      // Editing existing store
      setEditing(true);
      setForm({
        id: store.id,
        name: store.name || '',
        location: store.location || '',
        godownName: store.godownName || '',
        addedDate: store.addedDate || '',
        requestedBy: store.requestedBy || ''
      });
    } else {
      // Creating new store
      setEditing(false);
      const godownIdToName = {
        'g_1': 'Central Godown',
        'g_2': 'North Zone Godown',
        'g_3': 'South Regional Godown'
      };
      setForm({
        name: '',
        location: '',
        godownName: godownIdToName[user?.assignedGodownId] || '',
        addedDate: new Date().toISOString().split('T')[0],
        requestedBy: user?.name || ''
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(false);
    setForm({
      name: '',
      location: '',
      godownName: '',
      addedDate: '',
      requestedBy: ''
    });
  };

  const onSaveStore = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.location.trim()) return;
    
    if (editing) {
      // Update existing store
      const updated = { ...form };
      setData(safeStores.map((s) => (s.id === form.id ? updated : s)));
    } else {
      // Create new store
      const created = await requestStore(form.name.trim());
      const newStore = {
        ...created,
        location: form.location,
        godownName: form.godownName,
        addedDate: form.addedDate,
        requestedBy: form.requestedBy
      };
      setData([...safeStores, newStore]);
    }
    closeModal();
  };

  const onApprove = async (row) => {
    const updated = await approveStore(row.id);
    setData(safeStores.map((s) => (s.id === row.id ? updated : s)));
  };

  const onReject = async () => {
    await rejectStore(confirm.id);
    setData(safeStores.filter((s) => s.id !== confirm.id));
    setConfirm(null);
  };

  return (
    <div className="h-full overflow-hidden flex flex-col p-6">
      <div className="max-w-7xl mx-auto w-full space-y-6 flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <BuildingStorefrontIcon className="w-6 h-6 text-blue-600" />
              </div>
              Stores
            </h1>
            <p className="text-gray-600 mt-1 ml-13">Manage retail store requests and approvals</p>
          </div>
        </div>

        {/* Search and Request Button */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search stores by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            />
          </div>
          {isManager && (
            <button 
              onClick={() => openModal(null)}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal text-white rounded-xl hover:bg-teal/90 transition-colors shadow-md hover:shadow-lg font-semibold whitespace-nowrap"
            >
              <PlusIcon className="w-5 h-5" />
              Request Store
            </button>
          )}
        </div>

        {/* Table */}
        <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <Table
        columns={columns}
            data={loading ? [] : filteredStores}
            renderActions={(row) => {
              // Admin: Can approve/reject pending stores
              if (isAdmin && row.status === 'pending') {
                return (
            <div className="flex gap-2">
                    <button 
                      className="p-2 rounded-lg bg-green-50 hover:bg-green-100 transition-colors group"
                      onClick={() => onApprove(row)}
                      title="Approve"
                    >
                      <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    </button>
                    <button 
                      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors group"
                      onClick={() => setConfirm(row)}
                      title="Reject"
                    >
                      <XCircleIcon className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                );
              }
              
              // Manager: Can only edit non-approved stores
              if (isManager && row.status !== 'approved') {
                return (
                  <button 
                    className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors group"
                    onClick={() => openModal(row)}
                    title="Edit Store"
                  >
                    <PencilIcon className="w-5 h-5 text-blue-600" />
                  </button>
                );
              }
              
              return null;
            }}
          />
        </div>
      </div>

      {/* Request/Edit Store Modal */}
      <Modal 
        open={modalOpen} 
        title={editing ? "Edit Store Request" : "Request New Store"} 
        onCancel={closeModal}
        size="lg"
      >
        <form onSubmit={onSaveStore} className="space-y-6">
          {/* Store Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide border-b pb-2">Store Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Store Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Store Alpha"
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
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
                  placeholder="e.g., Mumbai, Maharashtra"
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Godown Name
                </label>
                <input
                  type="text"
                  value={form.godownName}
                  disabled
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Assigned to your godown
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Added Date
                </label>
                <input
                  type="date"
                  value={form.addedDate}
                  onChange={(e) => setForm({ ...form, addedDate: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Requested By
              </label>
              <input
                type="text"
                value={form.requestedBy}
                disabled
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
              />
            </div>

            {!editing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> Your request will be sent to administrators for approval
                </p>
              </div>
            )}
          </div>

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
              {editing ? 'Update Store' : 'Submit Request'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Reject Confirmation Modal */}
      <Modal 
        open={!!confirm} 
        title="Reject Store Request?" 
        onCancel={() => setConfirm(null)} 
        onConfirm={onReject}
      >
        <p className="text-gray-600">
          Are you sure you want to reject the request for <span className="font-semibold text-gray-900">{confirm?.name}</span>? This action will remove the request from the system.
        </p>
      </Modal>
    </div>
  );
}


