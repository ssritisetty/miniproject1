import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Calendar, MapPin, CheckCircle, XCircle, Clock, MessageCircle, AlertTriangle, Settings, Lock } from 'lucide-react';
import authService from '../services/auth.service';
import dataService from '../services/data.service';
import WeatherWidget from '../components/WeatherWidget';
import ChatWidget from '../components/ChatWidget';
import JobBoard from '../components/JobBoard';

const ProviderDashboard = () => {
  const currentUser = authService.getCurrentUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeChatBooking, setActiveChatBooking] = useState(null);
  const [activeTab, setActiveTab] = useState('bookings');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    if (currentUser) {
      const providerId = currentUser.providerId || currentUser.id;
      fetchProviderBookings(providerId);
    }
  }, []);

  const fetchProviderBookings = async (providerId) => {
    setLoading(true);
    try {
      const res = await dataService.getProviderBookings(providerId);
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching provider bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      await dataService.updateBookingStatus(bookingId, status);
      const providerId = currentUser.providerId || currentUser.id;
      fetchProviderBookings(providerId); // refresh
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteError('Password is required.');
      return;
    }
    setDeleting(true);
    setDeleteError('');
    try {
      await dataService.deleteAccount(currentUser.id, deletePassword);
      authService.logout();
      window.location.href = '/login';
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete account. Please check your password.');
    } finally {
      setDeleting(false);
    }
  };

  if (!currentUser) return <Navigate to="/login" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Provider Portal</h1>
        <p className="text-gray-500 mt-1">Manage your service requests and availability.</p>
      </div>

      {/* Climate/Weather Feature */}
      <div className="mb-8 shadow-sm">
        <WeatherWidget />
      </div>

      {/* Provider Tabs */}
      <div className="flex space-x-1 border-b border-gray-200 mb-8">
        <button
          className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${activeTab === 'bookings' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          onClick={() => setActiveTab('bookings')}
        >
          Active Bookings
        </button>
        <button
          className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${activeTab === 'jobboard' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          onClick={() => setActiveTab('jobboard')}
        >
          Job Bidding (Apply)
        </button>
        <button
          className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${activeTab === 'settings' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      {activeTab === 'bookings' && (
        <>
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex-1 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center"><Calendar size={24} /></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex-1 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><CheckCircle size={24} /></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Completed Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{bookings.filter(b => b.status === "COMPLETED").length}</p>
            </div>
          </div>
        </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Recent Service Requests</h2>
          <span className="bg-primary-100 text-primary-700 text-xs font-bold px-3 py-1 rounded-full">{bookings.length} Total</span>
        </div>
        
        <div className="divide-y divide-gray-100">
          {loading ? (
             <div className="p-12 text-center text-gray-500">Loading requests...</div>
          ) : bookings.length > 0 ? (
            bookings.map((b) => (
              <div key={b.id} className="p-6 transition-colors hover:bg-gray-50/50">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-900 text-lg">
                        {b.customer?.username || 'Customer'}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        b.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                        b.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-700' :
                        b.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 bg-white border border-gray-100 p-3 rounded-lg text-sm shadow-sm inline-block">
                      "{b.description}"
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 font-medium">
                      <div className="flex items-center gap-1.5"><Calendar size={16} className="text-gray-400" /> {new Date(b.scheduledTime).toLocaleString()}</div>
                      <div className="flex items-center gap-1.5"><MapPin size={16} className="text-gray-400" /> {b.address}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3 min-w-[140px]">
                    <div className="text-2xl font-black text-gray-900">₹{b.totalAmount}</div>
                    
                    {b.status !== 'CANCELLED' && (
                      <button 
                        onClick={() => setActiveChatBooking(b)}
                        className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <MessageCircle size={15} /> Live Chat
                      </button>
                    )}

                    {b.status === 'REQUESTED' && (
                      <div className="flex gap-2 w-full">
                        <button 
                          onClick={() => handleUpdateStatus(b.id, 'ACCEPTED')}
                          className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg text-sm font-medium transition-colors shadow-sm focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 flex items-center justify-center gap-1"
                        >
                          <CheckCircle size={16} /> Accept
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(b.id, 'CANCELLED')}
                          className="flex-1 bg-white hover:bg-red-50 text-red-600 border border-red-200 py-2 rounded-lg text-sm font-medium transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-1 flex items-center justify-center gap-1"
                        >
                          <XCircle size={16} /> Reject
                        </button>
                      </div>
                    )}

                    {b.status === 'ACCEPTED' && (
                      <button 
                        onClick={() => handleUpdateStatus(b.id, 'COMPLETED')}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition-colors shadow-sm focus:ring-2 focus:ring-green-500 focus:ring-offset-1 flex items-center justify-center gap-1"
                      >
                        <CheckCircle size={16} /> Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
               <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                 <Calendar className="text-gray-400" size={24} />
               </div>
               <p className="text-lg font-medium text-gray-900">No active bookings</p>
               <p className="mt-1">When customers book your services, they will appear here.</p>
             </div>
          )}
        </div>
      </div>
      </>
      )}

      {activeTab === 'jobboard' && (
        <JobBoard providerId={currentUser.providerId || currentUser.id} />
      )}

      {activeTab === 'settings' && (
        <div className="max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
          
          <div className="space-y-8">
            <div className="pb-8 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Provider Profile</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                 <div>
                   <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Username</label>
                   <p className="text-gray-900 font-medium bg-gray-50 p-3 rounded-lg border border-gray-100">{currentUser.username}</p>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
                   <p className="text-gray-900 font-medium bg-gray-50 p-3 rounded-lg border border-gray-100">{currentUser.email}</p>
                 </div>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-lg font-bold text-red-600 mb-2 flex items-center gap-2">
                <AlertTriangle size={20} /> Danger Zone
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Once you delete your account, your profile and bid history will be permanently removed.
              </p>
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 px-6 rounded-xl transition-all border border-red-200 shadow-sm"
              >
                Delete My Account Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {activeChatBooking && (
        <ChatWidget 
          bookingId={activeChatBooking.id} 
          currentUser={currentUser} 
          recipientName={activeChatBooking.customer?.username} 
          onClose={() => setActiveChatBooking(null)} 
        />
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scaleIn border border-white">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-600" size={32} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 text-center mb-2">Delete Provider Account?</h2>
            <p className="text-gray-500 text-center mb-8">
              This action is <span className="font-bold text-red-600 uppercase tracking-tight">irreversible</span>. Enter your password to confirm deletion.
            </p>
            
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-bold text-gray-700 mb-1" htmlFor="confirm-password">Your Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirm-password"
                    type="password"
                    autoFocus
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    placeholder="••••••••"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                  />
                </div>
                {deleteError && <p className="text-red-600 text-xs mt-2 font-medium">{deleteError}</p>}
              </div>

              <div className="flex flex-col gap-3 mt-8">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleDeleteAccount}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? 'Deleting...' : 'Confirm Permanent Deletion'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletePassword('');
                    setDeleteError('');
                  }}
                  className="w-full py-3 text-gray-500 font-bold hover:text-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;
