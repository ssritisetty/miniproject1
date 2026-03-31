import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, Clock, CreditCard, CheckCircle2, ChevronRight, ChevronLeft, AlertTriangle, Sparkles, Wallet, Banknote, MapPin } from 'lucide-react';
import RewardScratchCard from './RewardScratchCard';

const BookingModal = ({ provider, currentUser, onClose, onConfirm }) => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    date: '',
    timeSlot: '',
    address: '',
    description: '',
    paymentMethod: 'Cash on Delivery',
    usePoints: false,
    emergencyReason: ''
  });
  const contentRef = useRef(null);

  // Scroll to top when step changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo(0, 0);
    }
  }, [step]);

  const availablePoints = currentUser.rewardPoints || 0;
  const rewardAmount = Math.floor(availablePoints / 50) * 5;
  const totalAmount = provider.hourlyRate ? provider.hourlyRate * 2 : 100.0;
  const finalAmount = bookingData.usePoints ? Math.max(0, totalAmount - rewardAmount) : totalAmount;

  const timeSlots = ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM', '06:00 PM'];
  const isToday = bookingData.date === new Date().toISOString().split('T')[0];

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);

  const steps = [
    { title: 'Schedule', icon: Calendar },
    { title: 'Details', icon: CreditCard },
    { title: 'Payment', icon: Wallet },
    { title: 'Status', icon: CheckCircle2 }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-xl overflow-hidden relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-indigo-700 p-6 text-white shrink-0">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">{provider.category?.name || 'Service'} Booking</h2>
              <p className="text-white/80 text-xs mt-0.5">with @{provider.user?.username}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Stepper */}
          <div className="flex justify-between relative px-2">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/20 -translate-y-1/2 z-0 hidden sm:block"></div>
            {steps.map((s, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step > idx + 1 ? 'bg-green-400 text-white' : 
                  step === idx + 1 ? 'bg-white text-primary-700 scale-110 shadow-lg' : 
                  'bg-primary-800 text-white/50 border border-white/20'
                }`}>
                  {step > idx + 1 ? <CheckCircle2 size={16} /> : idx + 1}
                </div>
                <span className={`text-[10px] mt-1 font-bold uppercase tracking-wider ${step === idx + 1 ? 'text-white' : 'text-white/40'}`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div ref={contentRef} className="p-8 overflow-y-auto flex-1 custom-scrollbar">
          
          {step === 1 && (
            <div className="space-y-6 animate-slideIn">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} className="text-primary-600" /> Select Date
                </label>
                <input 
                  type="date" 
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingData.date}
                  onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all outline-none font-medium"
                />
              </div>

              {isToday && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-2xl animate-fadeIn">
                  <div className="flex items-center gap-2 text-red-700 font-bold mb-2">
                    <AlertTriangle size={18} /> Emergency Service
                  </div>
                  <p className="text-xs text-red-600 mb-3 font-medium">Please provide a reason for same-day delivery request:</p>
                  <textarea 
                    value={bookingData.emergencyReason}
                    onChange={(e) => setBookingData({...bookingData, emergencyReason: e.target.value})}
                    placeholder="e.g. Water leak in kitchen, No power..."
                    className="w-full p-3 text-sm bg-white border border-red-200 rounded-xl focus:ring-1 focus:ring-red-400 outline-none min-h-[80px]"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                   <Clock size={16} className="text-primary-600" /> Available Time Slots
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {timeSlots.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setBookingData({...bookingData, timeSlot: slot})}
                      className={`py-3 rounded-xl text-sm font-bold transition-all border ${
                        bookingData.timeSlot === slot 
                          ? 'bg-primary-600 border-primary-600 text-white shadow-md' 
                          : 'bg-white border-gray-200 text-gray-600 hover:border-primary-400 hover:text-primary-600'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-slideIn">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin size={16} className="text-primary-600" /> Service Location Address
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Enter your complete address..."
                  value={bookingData.address}
                  onChange={(e) => setBookingData({...bookingData, address: e.target.value})}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all font-medium"
                />
                <p className="mt-1.5 text-[10px] text-gray-400 font-medium">This is where the professional will arrive to serve you.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                   Job Description
                </label>
                <textarea 
                  rows="3"
                  value={bookingData.description}
                  onChange={(e) => setBookingData({...bookingData, description: e.target.value})}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Reward Section */}
              <div className="bg-gradient-to-br from-indigo-50 to-primary-50 p-6 rounded-[2rem] border border-primary-100 relative overflow-hidden group">
                {!bookingData.usePoints ? (
                  <div className="text-center">
                    <Sparkles className="mx-auto text-primary-600 mb-2" size={32} />
                    <h3 className="font-black text-gray-900 text-lg uppercase tracking-tight">Unlock Your Reward?</h3>
                    <p className="text-sm text-gray-600 mb-4 font-medium">You have {availablePoints} reward points available!</p>
                    {availablePoints >= 50 ? (
                      <button 
                        onClick={() => setStep(2.5)}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
                      >
                        Use Reward
                      </button>
                    ) : (
                       <p className="text-xs text-red-500 font-bold">You need 50 points to unlock a scratch card.</p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-4 text-green-700">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 animate-bounce">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-lg">Reward Applied! 🎁</h4>
                      <p className="text-sm font-medium">Extra ₹{rewardAmount} discount added to your bill.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2.5 && (
            <div className="animate-scaleIn flex flex-col items-center justify-center py-4">
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <Sparkles className="text-yellow-500" /> Scratch Your Reward
              </h3>
              <RewardScratchCard 
                amount={rewardAmount} 
                onRedeem={() => {
                  setBookingData({...bookingData, usePoints: true});
                  setStep(2);
                }}
                onSkip={() => setStep(2)}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-slideIn">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Choose Payment Method</h3>
              
              <div className="grid gap-4">
                {[
                  { id: 'UPI', label: 'UPI / Google Pay', icon: Wallet, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                  { id: 'Net Banking', label: 'Net Banking', icon: CreditCard, color: 'text-primary-600', bg: 'bg-primary-50' },
                  { id: 'Cash on Delivery', label: 'Pay After Service (Cash)', icon: Banknote, color: 'text-green-600', bg: 'bg-green-50' }
                ].map(method => (
                  <button
                    key={method.id}
                    onClick={() => setBookingData({...bookingData, paymentMethod: method.id})}
                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all group ${
                      bookingData.paymentMethod === method.id 
                        ? 'border-primary-600 bg-primary-50' 
                        : 'border-gray-100 hover:border-primary-200'
                    }`}
                  >
                    <div className={`p-3 rounded-xl transition-colors ${
                      bookingData.paymentMethod === method.id ? 'bg-primary-600 text-white' : method.bg + ' ' + method.color
                    }`}>
                      <method.icon size={24} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900">{method.label}</p>
                      <p className="text-xs text-gray-500">Secure & fast checkout</p>
                    </div>
                    {bookingData.paymentMethod === method.id && (
                      <div className="ml-auto text-primary-600"><CheckCircle2 /></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-slideIn">
              <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2 uppercase tracking-widest text-xs">Booking Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium italic">Service Rate (2 hrs):</span>
                    <span className="text-gray-900 font-bold">₹{totalAmount.toFixed(2)}</span>
                  </div>
                  
                  {bookingData.usePoints && (
                    <div className="flex justify-between text-sm text-green-600 font-bold">
                       <span className="flex items-center gap-1 italic"><Sparkles size={14} /> Scratch Reward:</span>
                       <span>-₹{rewardAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between pt-4 border-t border-dashed border-gray-300">
                    <span className="text-xl font-black text-gray-900 uppercase">Total Amount:</span>
                    <span className="text-2xl font-black text-primary-600">₹{finalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-indigo-50/50 p-4 rounded-2xl">
                  <p className="text-indigo-400 font-bold uppercase tracking-tight mb-1">Appointment</p>
                  <p className="text-indigo-900 font-black">{bookingData.date || 'TBD'} @ {bookingData.timeSlot || 'Anytime'}</p>
                </div>
                <div className="bg-green-50/50 p-4 rounded-2xl">
                  <p className="text-green-400 font-bold uppercase tracking-tight mb-1">Payment</p>
                  <p className="text-green-900 font-black">{bookingData.paymentMethod}</p>
                </div>
              </div>

              <div className="bg-primary-50/50 p-4 rounded-2xl text-xs">
                  <p className="text-primary-400 font-bold uppercase tracking-tight mb-1">Service Address</p>
                  <p className="text-primary-900 font-black">{bookingData.address || 'No address provided'}</p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        {step !== 2.5 && (
          <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex gap-3 shrink-0">
            {step > 1 && (
              <button 
                onClick={handlePrev}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-200 transition-all border border-gray-200"
              >
                <ChevronLeft size={20} /> Back
              </button>
            )}
            
            {step < 4 ? (
              <button 
                onClick={handleNext}
                disabled={
                  (step === 1 && (!bookingData.date || !bookingData.timeSlot || (isToday && !bookingData.emergencyReason))) || 
                  (step === 2 && !bookingData.address)
                }
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black bg-primary-600 text-white hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 disabled:opacity-30 disabled:shadow-none uppercase tracking-widest text-sm"
              >
                Next Step <ChevronRight size={20} />
              </button>
            ) : (
              <button 
                onClick={() => onConfirm(bookingData)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black bg-gradient-to-r from-primary-600 to-indigo-600 text-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary-200 uppercase tracking-widest text-sm"
              >
                Confirm Request <CheckCircle2 size={20} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
