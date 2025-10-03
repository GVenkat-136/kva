import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { 
  UserCircleIcon, 
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon,
  KeyIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

export default function Account() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSave = () => {
    // In a real application, this would make an API call to update user profile
    console.log('Saving profile:', formData);
    alert('Profile updated successfully!');
    setEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
    });
    setEditing(false);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    // In a real application, this would make an API call to change password
    console.log('Changing password');
    alert('Password changed successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setChangingPassword(false);
  };

  return (
    <div className="h-full overflow-hidden flex flex-col p-6">
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col min-h-0 space-y-4">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-teal/10 flex items-center justify-center">
              <Cog6ToothIcon className="w-6 h-6 text-teal" />
            </div>
            Account Settings
          </h1>
          <p className="text-gray-600 mt-1 ml-13">Manage your profile and account settings</p>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-4">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-teal to-teal/80 p-5">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center shadow-lg">
                  <UserCircleIcon className="w-14 h-14 text-teal" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">
                      <BriefcaseIcon className="w-3 h-3 mr-1" />
                      {user?.role === 'admin' ? 'Administrator' : 'Manager'}
                    </span>
                  </div>
                </div>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-teal rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Edit
                  </button>
                )}
              </div>
            </div>

            {/* Profile Information */}
            <div className="p-5">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Full Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent text-sm"
                    />
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                      <UserCircleIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{formData.name || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Email Address
                  </label>
                  {editing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent text-sm"
                    />
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                      <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{formData.email || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Phone Number
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent text-sm"
                    />
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                      <PhoneIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{formData.phone || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Address
                  </label>
                  {editing ? (
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent text-sm"
                    />
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                      <MapPinIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{formData.address || 'Not provided'}</span>
                    </div>
                  )}
                </div>
              </div>

              {editing && (
                <div className="flex gap-3 mt-5 pt-5 border-t border-gray-200">
                  <button
                    onClick={handleCancel}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm"
                  >
                    <XMarkIcon className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-teal text-white rounded-lg hover:bg-teal/90 transition-colors font-semibold shadow-md text-sm"
                  >
                    <CheckIcon className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Security Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                  <KeyIcon className="w-4 h-4 text-gray-400" />
                  Security
                </h3>
                <p className="text-xs text-gray-600 mt-1">Manage your password</p>
              </div>
              {!changingPassword && (
                <button
                  onClick={() => setChangingPassword(true)}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold text-sm"
                >
                  Change Password
                </button>
              )}
            </div>

            {changingPassword && (
              <form onSubmit={handleChangePassword} className="space-y-3 mt-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent text-sm"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      setChangingPassword(false);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-teal text-white rounded-lg hover:bg-teal/90 transition-colors font-semibold shadow-md text-sm"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Account Info */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-4">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">Account Information</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white rounded-lg p-2.5">
                <span className="text-gray-500 block mb-0.5">User ID</span>
                <span className="font-semibold text-gray-900">{user?.id || 'N/A'}</span>
              </div>
              <div className="bg-white rounded-lg p-2.5">
                <span className="text-gray-500 block mb-0.5">Role</span>
                <span className="font-semibold text-gray-900 capitalize">{user?.role || 'N/A'}</span>
              </div>
              <div className="bg-white rounded-lg p-2.5">
                <span className="text-gray-500 block mb-0.5">Status</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                  Active
                </span>
              </div>
              <div className="bg-white rounded-lg p-2.5">
                <span className="text-gray-500 block mb-0.5">Member Since</span>
                <span className="font-semibold text-gray-900">Jan 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

