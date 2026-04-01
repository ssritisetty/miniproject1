import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Search, MapPin, Star, Calendar, Clock, CheckCircle, Clock3, AlertTriangle, Sparkles, RefreshCw, MessageCircle, Settings } from 'lucide-react';
import authService from '../services/auth.service';
import dataService from '../services/data.service';
import ReviewModal from '../components/ReviewModal';
import WeatherWidget from '../components/WeatherWidget';
import ChatWidget from '../components/ChatWidget';
import GpsTracker from '../components/GpsTracker';
import BiddingSystem from '../components/BiddingSystem';
import BookingModal from '../components/BookingModal';
import PaymentModal from '../components/PaymentModal';

const CustomerDashboard = () => {
  const currentUser = authService.getCurrentUser();
  const [activeTab, setActiveTab] = useState('browse');
  
  // States for Browse tab
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);

  const filteredProviders = providers.filter(p => 
    (p.user?.username || '').toLowerCase().includes(searchInput.toLowerCase()) ||
    (p.category?.name || '').toLowerCase().includes(searchInput.toLowerCase()) ||
    (p.bio || '').toLowerCase().includes(searchInput.toLowerCase())
  );
  
  // States for Bookings tab
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [reviewBookingId, setReviewBookingId] = useState(null);
  const [activeChatBooking, setActiveChatBooking] = useState(null);
  const [bookingProvider, setBookingProvider] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [payBookingData, setPayBookingData] = useState(null);

  useEffect(() => {
    if (currentUser) {
      if (activeTab === 'browse') {
        fetchProvidersAndCategories();
      } else if (activeTab === 'bookings') {
        fetchCustomerBookings();
      }
    }
  }, [activeTab]);

  const getCategoryImage = (categoryName) => {
    const images = {
      'Plumbing': 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=400&h=250',
      'Electrical': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400&h=250',
      'Carpentry': 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=400&h=250',
      'Cleaning': 'https://images.unsplash.com/photo-1584820927498-cafe6c151368?auto=format&fit=crop&q=80&w=400&h=250',
      'Default': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=400&h=250'
    };
    return images[categoryName] || images['Default'];
  };

  const fetchProvidersAndCategories = async () => {
    setLoadingProviders(true);
    try {
      const catRes = await dataService.getCategories();
      setCategories(catRes.data);
      const provRes = await dataService.getProviders();
      setProviders(provRes.data);
    } catch (err) {
      console.error("Backend unreachable. Using Mock Data for AI demonstration.");
      setProviders([
        { id: 1, user: { username: "Ramesh Electrician" }, category: { name: "Electrical" }, rating: 4.8, hourlyRate: 40, bio: "Expert in home electrical wiring, circuits, and emergency repairs.", experience: "5+ yrs" },
        { id: 2, user: { username: "Ajay Electrician" }, category: { name: "Electrical" }, rating: 4.6, hourlyRate: 35, bio: "Quick and reliable. Always on time.", experience: "3+ yrs" },
        { id: 3, user: { username: "Suresh Plumber" }, category: { name: "Plumbing" }, rating: 4.9, hourlyRate: 45, bio: "Emergency plumbing, pipe fixing, leak detection.", experience: "8+ yrs" },
        { id: 4, user: { username: "Ravi Carpenter" }, category: { name: "Carpentry" }, rating: 4.4, hourlyRate: 30, bio: "Furniture assembly and repairs.", experience: "4+ yrs" },
      ]);
      setCategories([{ id: 1, name: "Electrical" }, { id: 2, name: "Plumbing" }, { id: 3, name: "Carpentry" }]);
    } finally {
      setLoadingProviders(false);
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchInput(val);
    
    // Emergency Service Detection Logic
    const emergencyKeywords = ['urgent', 'emergency', 'leaking', 'broken pipe', 'sparking', 'short circuit'];
    const isUrgent = emergencyKeywords.some(kw => val.toLowerCase().includes(kw));
    setIsEmergency(isUrgent);
  };

  const fetchCustomerBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await dataService.getCustomerBookings(currentUser.id);
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleBook = (providerId, provider) => {
    setBookingProvider(provider);
  };

  const finalizeBooking = async (bookingData) => {
    try {
      const scheduledDateTime = new Date(`${bookingData.date}T${bookingData.timeSlot.split(' ')[0]}:00`).toISOString();

      const res = await dataService.createBooking({
        customerId: currentUser.id,
        providerId: bookingProvider.id,
        scheduledTime: scheduledDateTime,
        address: bookingData.address,
        description: bookingData.description,
        totalAmount: (bookingProvider.hourlyRate ? bookingProvider.hourlyRate * 2 : 100.0),
        usePoints: bookingData.usePoints,
        paymentMethod: bookingData.paymentMethod,
        emergencyReason: bookingData.emergencyReason
      });

      // Update local storage if points were used
      if (bookingData.usePoints) {
        const availablePoints = currentUser.rewardPoints || 0;
        const updatedUser = { ...currentUser, rewardPoints: Math.max(0, availablePoints - (Math.floor(availablePoints / 50) * 50)) };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      alert('Booking created successfully! Your professional is notified.');
      setBookingProvider(null);
      fetchCustomerBookings();
    } catch (err) {
      alert('Failed to create booking: ' + (err.response?.data?.message || err.message));
    }
  };

  const handlePay = async (paymentData) => {
    try {
      await dataService.payBooking(payBookingData.id, paymentData);
      
      // Update local storage for points (UI should reflect this)
      let updatedUser = { ...currentUser };
      const currentPts = updatedUser.rewardPoints || 0;
      
      // Award 50 points, minus 50 if used
      let nextPts = currentPts + 50;
      if (paymentData.usePoints) {
        nextPts -= 50;
      }
      
      updatedUser.rewardPoints = Math.max(0, nextPts);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      alert(`Payment of ₹${payBookingData.totalAmount - (paymentData.usePoints ? Math.floor((updatedUser.rewardPoints + (paymentData.usePoints ? 50 : 0)) / 50) * 5 : 0)} successful! You earned 50 points.`);
      
      setPayBookingData(null);
      fetchCustomerBookings(); 
      window.location.reload(); // Refresh to sync points across all components easily
    } catch (err) {
      alert('Payment failed: ' + (err.response?.data?.message || err.message));
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
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {currentUser.username}!</h1>
        <p className="text-gray-500 mt-1">Manage your service requests and discover local professionals.</p>
      </div>

      {/* Climate/Weather Feature */}
      <div className="mb-8 shadow-sm">
        <WeatherWidget />
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 border-b border-gray-200 mb-8 overflow-x-auto">
        <button
          className={`py-4 px-8 text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'browse' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          onClick={() => setActiveTab('browse')}
        >
          <Search size={18} /> Browse Services
        </button>
        <button
          className={`py-4 px-8 text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'bookings' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          onClick={() => setActiveTab('bookings')}
        >
          <Calendar size={18} /> My Bookings
        </button>
        <button
          className={`py-4 px-8 text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'bidding' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          onClick={() => setActiveTab('bidding')}
        >
          <Sparkles size={18} /> Job Bidding
        </button>
        <button
          className={`py-4 px-8 text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'settings' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={18} /> Settings
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 relative z-10 transition-all">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                value={searchInput}
                onChange={handleSearchChange}
                placeholder="Describe your issue (e.g. 'water leaking heavily' or 'Plumber')" 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-gray-900" 
              />
            </div>
            <button className="bg-primary-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-sm flex-shrink-0">Search</button>
          </div>

          {isEmergency && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3 animate-fadeIn transform origin-top shadow-sm -mt-2">
               <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={24} />
               <div>
                  <h4 className="text-red-800 font-bold text-lg leading-tight">Emergency Service Detected! 🚨</h4>
                  <p className="text-red-700 text-sm mt-1 max-w-2xl">We noticed an urgent issue in your search. We are currently highlighting professionals offering immediate 1-hour deployment below.</p>
               </div>
            </div>
          )}

          {loadingProviders ? (
            <div className="py-12 text-center text-gray-500">Loading professionals...</div>
          ) : providers.length > 0 ? (
            <div className="space-y-8">
              
              {/* AI Smart Recommendations Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="text-primary-600" size={20} />
                  <h2 className="text-xl font-bold text-gray-900">AI Recommended Providers for You</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...filteredProviders].sort((a, b) => b.rating - a.rating).slice(0, 3).map((p) => (
                    <div key={`rec-${p.id}`} className="bg-gradient-to-br from-primary-50 to-indigo-50 rounded-2xl shadow-sm border border-primary-100 overflow-hidden hover:shadow-md transition-shadow relative group">
                      <div className="absolute top-0 right-0 z-10 bg-primary-600 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-bl-lg tracking-wider">Top Match</div>
                      <div className="h-36 w-full overflow-hidden relative">
                        <img src={getCategoryImage(p.category?.name)} alt={p.category?.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/40 to-transparent"></div>
                      </div>
                      <div className="p-6 pt-5">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">{p.category?.name || 'Service Pro'}</h3>
                            <p className="text-primary-700 font-medium text-xs">@{p.user?.username || 'pro'}</p>
                          </div>
                          <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full text-xs font-bold border border-yellow-200">
                            <Star size={12} className="fill-yellow-500 text-yellow-500" />
                            {p.rating.toFixed(1)}
                          </div>
                        </div>
                        
                        <p className="text-gray-700 text-sm mb-6 line-clamp-2">
                          {p.bio || 'Highly rated and recommended by our system based on your needs.'}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 font-medium">
                          <div className="flex items-center gap-1"><MapPin size={16} /> &lt; 2km</div>
                          <div className="flex items-center gap-1"><Clock size={16} /> {p.experience || '2+ yrs'}</div>
                          <div className="font-semibold text-gray-900 ml-auto">₹{p.hourlyRate}/hr</div>
                        </div>

                        <button 
                          onClick={() => handleBook(p.id, p)}
                          className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Other Providers */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Other Available Providers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...filteredProviders].sort((a, b) => b.rating - a.rating).slice(3).map((p) => (
                    <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                      <div className="h-32 w-full overflow-hidden relative">
                        <img src={getCategoryImage(p.category?.name)} alt={p.category?.name} className="w-full h-full object-cover grayscale-[30%] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent"></div>
                      </div>
                      <div className="p-6 pt-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">{p.category?.name || 'Service Pro'}</h3>
                            <p className="text-primary-600 font-medium text-xs">@{p.user?.username || 'pro'}</p>
                          </div>
                          <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-full text-xs font-bold border border-yellow-200">
                            <Star size={12} className="fill-yellow-500 text-yellow-500" />
                            {p.rating.toFixed(1)}
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                          {p.bio || 'Experienced professional offering services tailored to your needs.'}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 font-medium">
                          <div className="flex items-center gap-1"><MapPin size={16} /> Local</div>
                          <div className="flex items-center gap-1"><Clock size={16} /> {p.experience || '2+ yrs'}</div>
                          <div className="font-semibold text-gray-900 ml-auto">₹{p.hourlyRate}/hr</div>
                        </div>

                        <button 
                          onClick={() => handleBook(p.id, p)}
                          className="w-full py-2.5 bg-gray-50 hover:bg-primary-600 text-gray-700 hover:text-white font-medium rounded-lg transition-colors border border-gray-200 hover:border-primary-600 group-hover:bg-primary-50"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
             <div className="py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
               No service providers available right now.
             </div>
          )}
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="space-y-4">
          
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-gray-900">Your Bookings</h2>
            <button 
              onClick={fetchCustomerBookings}
              className="flex items-center gap-2 text-sm font-semibold text-primary-600 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors border border-primary-200"
            >
              <RefreshCw size={16} /> Refresh Status
            </button>
          </div>

          {/* Rewards Banner */}
          <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-2xl shadow-md p-6 flex flex-col sm:flex-row items-center gap-4 text-white mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-2xl">⭐</span></div>
            <div className="text-center sm:text-left">
              <p className="text-sm font-medium text-white/80">Available Reward Points</p>
              <p className="text-3xl font-bold">{currentUser.rewardPoints || 0}</p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-auto text-center sm:text-right bg-white/10 px-4 py-2 rounded-xl">
              <p className="text-sm font-medium text-white">Earn 50 Points</p>
              <p className="text-xs text-white/70">per completed booking!</p>
            </div>
          </div>

          {loadingBookings ? (
            <div className="py-12 text-center text-gray-500">Loading your bookings...</div>
          ) : bookings.length > 0 ? (
            bookings.map((b) => (
              <div key={b.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-gray-900 text-lg">Booking #{b.id}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      b.status === 'COMPLETED' ? 'bg-green-100 text-green-700 border border-green-200' :
                      b.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                      b.status === 'CANCELLED' ? 'bg-red-100 text-red-700 border border-red-200' :
                      'bg-orange-100 text-orange-700 border border-orange-200'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                  <p className="text-gray-600 font-medium">{b.provider?.user?.username || 'Provider'} - {b.provider?.category?.name}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5"><Calendar size={15}/> {new Date(b.scheduledTime).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={15}/> {b.address}</span>
                  </div>
                </div>
                <div className="flex flex-col justify-end gap-2 text-right">
                  <p className="text-2xl font-bold text-gray-900">₹{b.totalAmount}</p>
                  
                  {b.status !== 'CANCELLED' && (
                    <button 
                      onClick={() => setActiveChatBooking(b)}
                      className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors rounded-xl py-2 px-4 shadow-sm font-semibold text-sm flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={16} /> Live Chat
                    </button>
                  )}

                  {b.status === 'COMPLETED' && !b.isPaid && (
                    <button 
                      onClick={() => setPayBookingData(b)}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 rounded-xl py-2.5 px-4 font-bold text-sm flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={18} /> Confirm & Pay
                    </button>
                  )}

                  {b.status === 'COMPLETED' && b.isPaid && (
                    <button 
                      onClick={() => setReviewBookingId(b.id)}
                      className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 rounded-xl py-2.5 px-4 font-bold text-sm flex items-center justify-center gap-2"
                    >
                      <Star size={18} className="fill-white" /> Leave a Review
                    </button>
                  )}
                </div>
              </div>
              
              {/* Show Live Tracking if booking is accepted/on the way */}
              {b.status === 'ACCEPTED' && b.provider && (
                <div className="mt-2 animate-fadeIn">
                  <p className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                    <MapPin size={12} /> Live Provider Location
                  </p>
                  <GpsTracker providerId={b.provider.id} providerName={b.provider.user?.username} />
                </div>
              )}
            </div>
            ))
          ) : (
            <div className="py-16 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
               <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                 <Calendar className="text-gray-400" size={24} />
               </div>
               <p className="text-lg font-medium text-gray-900">No bookings yet</p>
               <p className="mt-1">When you book a service, it will appear here.</p>
             </div>
          )}
        </div>
      )}

       {activeTab === 'settings' && (
        <div className="max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
          
          <div className="space-y-8">
            <div className="pb-8 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Profile Information</h3>
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
                Once you delete your account, there is no going back. Please be certain.
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

      {activeTab === 'bidding' && (
        <BiddingSystem userId={currentUser.id} categories={categories} />
      )}

      {reviewBookingId && (
        <ReviewModal
          booking={bookings.find(b => b.id === reviewBookingId)}
          onClose={() => setReviewBookingId(null)}
          onSuccess={() => {
            setReviewBookingId(null);
            fetchCustomerBookings(); // refresh the list, optional
            alert('Review submitted successfully!');
          }}
        />
      )}

      {activeChatBooking && (
        <ChatWidget 
          bookingId={activeChatBooking.id} 
          currentUser={currentUser} 
          recipientName={activeChatBooking.provider?.user?.username} 
          onClose={() => setActiveChatBooking(null)} 
        />
      )}

      {bookingProvider && (
        <BookingModal 
          provider={bookingProvider} 
          currentUser={currentUser}
          onClose={() => setBookingProvider(null)}
          onConfirm={finalizeBooking}
        />
      )}

      {payBookingData && (
        <PaymentModal
          booking={payBookingData}
          currentUser={currentUser}
          onClose={() => setPayBookingData(null)}
          onPaymentComplete={handlePay}
        />
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scaleIn border border-white">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-600" size={32} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 text-center mb-2">Delete Account?</h2>
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

export default CustomerDashboard;
