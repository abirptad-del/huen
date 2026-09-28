import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  PackageCheck,
  LogOut,
  Edit2,
  Check,
  Loader2,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import {
  CustomerProfile,
  UserOrderHistoryItem,
  fetchCustomerOrders,
  updateCustomerProfile,
  logoutCustomer,
} from '../lib/authService';

interface CustomerAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CustomerProfile;
  onProfileUpdate: (updated: CustomerProfile) => void;
  onLogout: () => void;
}

export const CustomerAccountModal: React.FC<CustomerAccountModalProps> = ({
  isOpen,
  onClose,
  profile,
  onProfileUpdate,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const [orders, setOrders] = useState<UserOrderHistoryItem[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Edit Profile States
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [address, setAddress] = useState(profile.address || '');
  const [city, setCity] = useState(profile.city || 'Dhaka');
  const [area, setArea] = useState(profile.area || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setName(profile.name);
    setAddress(profile.address || '');
    setCity(profile.city || 'Dhaka');
    setArea(profile.area || '');
  }, [profile]);

  useEffect(() => {
    if (isOpen && activeTab === 'orders' && profile.auth_user_id) {
      setLoadingOrders(true);
      fetchCustomerOrders(profile.auth_user_id)
        .then((data) => {
          setOrders(data);
        })
        .finally(() => {
          setLoadingOrders(false);
        });
    }
  }, [isOpen, activeTab, profile.auth_user_id]);

  if (!isOpen) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setSaveSuccess(false);

    const updated = await updateCustomerProfile(profile.auth_user_id, {
      name,
      address,
      city,
      area,
    });

    setSavingProfile(false);
    if (updated) {
      onProfileUpdate(updated);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleLogoutClick = async () => {
    await logoutCustomer();
    onLogout();
    onClose();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Delivered
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200">
            <Truck className="w-3 h-3" /> Shipped
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full border border-purple-200">
            <Clock className="w-3 h-3" /> Processing
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-red-50 text-red-700 px-2.5 py-0.5 rounded-full border border-red-200">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full border border-amber-200">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="bg-[#1299E8] px-6 py-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/15 rounded-full flex items-center justify-center text-white font-bold text-lg border border-white/20">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight">{profile.name}</h3>
              <p className="text-xs text-white/90 font-medium">{profile.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLogoutClick}
              className="px-3 py-1.5 text-xs font-bold bg-white/15 hover:bg-white/25 text-white rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50/50 px-6 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'border-[#1299E8] text-[#1299E8]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>My Account Details</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-[#1299E8] text-[#1299E8]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <PackageCheck className="w-4 h-4" />
            <span>My Order History</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'profile' ? (
            <div className="space-y-6">
              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h4 className="text-sm font-bold text-gray-800">Saved Profile Details</h4>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="text-xs font-bold text-[#1299E8] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-10 px-3.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1299E8] outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Delivery Address
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. House 42, Road 11, Block D"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full h-10 px-3.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1299E8] outline-none font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        City
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full h-10 px-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1299E8] outline-none font-medium"
                      >
                        <option value="Dhaka">Dhaka</option>
                        <option value="Chittagong">Chittagong</option>
                        <option value="Sylhet">Sylhet</option>
                        <option value="Rajshahi">Rajshahi</option>
                        <option value="Khulna">Khulna</option>
                        <option value="Barisal">Barisal</option>
                        <option value="Rangpur">Rangpur</option>
                        <option value="Mymensingh">Mymensingh</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Area / Thana
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Banani"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        className="w-full h-10 px-3.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1299E8] outline-none font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="h-10 px-5 bg-[#1299E8] hover:bg-[#0e8cd6] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {savingProfile ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      <span>Save Changes</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="h-10 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-gray-50/80 rounded-xl border border-gray-100">
                    <p className="text-gray-400 font-medium mb-0.5">Phone Number</p>
                    <p className="font-bold text-gray-800 text-sm flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#1299E8]" />
                      {profile.phone}
                    </p>
                  </div>

                  <div className="p-3.5 bg-gray-50/80 rounded-xl border border-gray-100">
                    <p className="text-gray-400 font-medium mb-0.5">Full Name</p>
                    <p className="font-bold text-gray-800 text-sm flex items-center gap-2">
                      <User className="w-4 h-4 text-[#1299E8]" />
                      {profile.name}
                    </p>
                  </div>

                  <div className="p-3.5 bg-gray-50/80 rounded-xl border border-gray-100 sm:col-span-2">
                    <p className="text-gray-400 font-medium mb-0.5">Default Delivery Address</p>
                    <p className="font-bold text-gray-800 text-xs flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#1299E8] shrink-0 mt-0.5" />
                      {profile.address
                        ? `${profile.address}, ${profile.area ? profile.area + ', ' : ''}${profile.city || 'Dhaka'}`
                        : 'No delivery address saved yet. Click "Edit Profile" to add address.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-800 mb-2">Your Past Orders</h4>

              {loadingOrders ? (
                <div className="py-12 flex flex-col items-center justify-center text-gray-400 space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-[#1299E8]" />
                  <p className="text-xs font-medium">Fetching order records...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="py-10 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <PackageCheck className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-700">No Orders Placed Yet</p>
                  <p className="text-xs text-gray-500 mt-0.5">Your purchased items will appear here after checkout.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 bg-white border border-gray-200 rounded-xl hover:border-[#1299E8]/40 transition-all space-y-3 shadow-2xs"
                    >
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                        <div>
                          <p className="text-xs font-extrabold text-[#1299E8]">{ord.orderNumber}</p>
                          <p className="text-[11px] text-gray-400 font-medium">
                            {ord.createdAt?.slice(0, 10)}
                          </p>
                        </div>
                        {getStatusBadge(ord.orderStatus)}
                      </div>

                      <div className="space-y-1">
                        {ord.items.map((item, iIdx) => (
                          <div key={iIdx} className="flex justify-between text-xs text-gray-700 font-medium">
                            <span>
                              {item.productName} <span className="text-gray-400">×{item.quantity}</span>
                            </span>
                            <span className="font-bold">৳{item.total}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                        <span className="text-gray-500 font-medium">
                          Delivery to {ord.deliveryCity} ({ord.paymentMethod})
                        </span>
                        <span className="text-sm font-extrabold text-gray-900">
                          Total: ৳{ord.total}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
