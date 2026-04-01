import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, Clock, CreditCard, CheckCircle2, ChevronRight, ChevronLeft, AlertTriangle, Sparkles, Wallet, Banknote, MapPin } from 'lucide-react';
import RewardScratchCard from './RewardScratchCard';

const PaymentModal = ({ booking, currentUser, onClose, onPaymentComplete }) => {
  const [step, setStep] = useState(1);
  const [paymentData, setPaymentData] = useState({
    paymentMethod: 'UPI',
    usePoints: false
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
  const totalAmount = booking.totalAmount || 0;
  const finalAmount = paymentData.usePoints ? Math.max(0, totalAmount - rewardAmount) : totalAmount;

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);

  const steps = [
    { title: 'Reward', icon: Sparkles },
    { title: 'Payment', icon: Wallet },
    { title: 'Confirm', icon: CheckCircle2 }
  ];

  const handleConfirmPayment = () => {
    onPaymentComplete({
      paymentMethod: paymentData.paymentMethod,
      usePoints: paymentData.usePoints
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[60] p-4 animate-fadeIn">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-xl overflow-hidden relative flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white shrink-0">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Complete Payment</h2>
              <p className="text-white/80 text-xs mt-0.5">Booking #{booking.id} - {booking.provider?.category?.name}</p>
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
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step > idx + 1 ? 'bg-green-400 text-white' :
                  step === idx + 1 ? 'bg-white text-emerald-700 scale-110 shadow-lg' :
                    'bg-emerald-800 text-white/50 border border-white/20'
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
              <div className="bg-gradient-to-br from-indigo-50 to-emerald-50 p-6 rounded-[2rem] border border-emerald-100 relative overflow-hidden group">
                {!paymentData.usePoints ? (
                  <div className="text-center">
                    <Sparkles className="mx-auto text-emerald-600 mb-2" size={32} />
                    <h3 className="font-black text-gray-900 text-lg uppercase tracking-tight">Unlock Your Reward?</h3>
                    <p className="text-sm text-gray-600 mb-4 font-medium">You have {availablePoints} points available!</p>
                    {availablePoints >= 50 ? (
                      <button
                        onClick={() => setStep(1.5)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
                      >
                        Use 50 Points
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

              <div className="text-center">
                <button onClick={() => setStep(2)} className="text-gray-400 text-sm font-medium hover:text-gray-600 transition-colors">
                  {paymentData.usePoints ? 'Continue to Payment' : 'Skip & Pay Full Amount'}
                </button>
              </div>
            </div>
          )}

          {step === 1.5 && (
            <div className="animate-scaleIn flex flex-col items-center justify-center py-4">
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <Sparkles className="text-yellow-500" /> Scratch Your Reward
              </h3>
              <RewardScratchCard
                amount={rewardAmount}
                onRedeem={() => {
                  setPaymentData({ ...paymentData, usePoints: true });
                  setStep(1);
                }}
                onSkip={() => setStep(1)}
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-slideIn">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Choose Payment Method</h3>

              <div className="grid gap-4">
                {[
                  { id: 'UPI', label: 'UPI / Google Pay', icon: Wallet, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                  { id: 'Net Banking', label: 'Net Banking', icon: CreditCard, color: 'text-primary-600', bg: 'bg-primary-50' },
                  { id: 'Cash', label: 'Cash Payment', icon: Banknote, color: 'text-green-600', bg: 'bg-green-50' }
                ].map(method => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentData({ ...paymentData, paymentMethod: method.id })}
                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all group ${paymentData.paymentMethod === method.id
                      ? 'border-emerald-600 bg-emerald-50'
                      : 'border-gray-100 hover:border-emerald-200'
                      }`}
                  >
                    <div className={`p-3 rounded-xl transition-colors ${paymentData.paymentMethod === method.id ? 'bg-emerald-600 text-white' : method.bg + ' ' + method.color
                      }`}>
                      <method.icon size={24} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900">{method.label}</p>
                      <p className="text-xs text-gray-500">Secure & fast checkout</p>
                    </div>
                    {paymentData.paymentMethod === method.id && (
                      <div className="ml-auto text-emerald-600"><CheckCircle2 /></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-slideIn">
              <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2 uppercase tracking-widest text-xs">Final Invoice</h3>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium italic">Service Total:</span>
                    <span className="text-gray-900 font-bold">₹{totalAmount.toFixed(2)}</span>
                  </div>

                  {paymentData.usePoints && (
                    <div className="flex justify-between text-sm text-green-600 font-bold">
                      <span className="flex items-center gap-1 italic"><Sparkles size={14} /> Points Discount:</span>
                      <span>-₹{rewardAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between pt-4 border-t border-dashed border-gray-300">
                    <span className="text-xl font-black text-gray-900 uppercase">Amount Due:</span>
                    <span className="text-2xl font-black text-emerald-600">₹{finalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50/50 p-4 rounded-2xl text-xs flex justify-between items-center">
                <div>
                  <p className="text-emerald-400 font-bold uppercase tracking-tight">Payment Method</p>
                  <p className="text-emerald-900 font-black">{paymentData.paymentMethod}</p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-bold uppercase tracking-tight">Reward Points Earning</p>
                  <p className="text-emerald-900 font-black text-lg">+50 pts</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        {step !== 1.5 && (
          <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex gap-3 shrink-0">
            {step > 1 && (
              <button
                onClick={handlePrev}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-200 transition-all border border-gray-200"
              >
                <ChevronLeft size={20} /> Back
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 uppercase tracking-widest text-sm"
              >
                Next Step <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleConfirmPayment}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-emerald-200 uppercase tracking-widest text-sm"
              >
                Confirm & Pay ₹{finalAmount.toFixed(2)} <CheckCircle2 size={20} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
