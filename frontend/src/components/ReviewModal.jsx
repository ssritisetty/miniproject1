import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import dataService from '../services/data.service';

const ReviewModal = ({ booking, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setLoading(true);
    try {
      await dataService.createReview({
        bookingId: booking.id,
        customerId: booking.customer?.id || booking.customerId, // Depending on payload
        providerId: booking.provider?.id || booking.providerId,
        rating,
        comment
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="glass rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative transform transition-all animate-scaleIn">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Rate your experience</h2>
          <p className="text-gray-500 text-sm mb-6">
            How was the service provided by {booking.provider?.user?.username || 'the provider'}?
          </p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none focus:scale-110 transition-transform"
                >
                  <Star 
                    className={`h-10 w-10 ${
                      star <= (hoverRating || rating) 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>

            <div className="mb-6">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Leave a comment (Optional)
              </label>
              <textarea
                id="comment"
                rows="4"
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-primary-500 focus:border-primary-500"
                placeholder="Tell us about the service..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
