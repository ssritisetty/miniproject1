import React, { useState, useEffect } from 'react';
import { Briefcase, DollarSign, MapPin, Send } from 'lucide-react';
import api from '../services/api';

const JobBoard = ({ providerId }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bidAmount, setBidAmount] = useState({});
    const [bidMessage, setBidMessage] = useState({});

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await api.get('/bidding/requests');
            setRequests(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleBid = async (requestId) => {
        if (!bidAmount[requestId]) return alert("Please enter a bid amount");
        try {
            await api.post('/bidding/bid', {
                requestId,
                providerId,
                amount: bidAmount[requestId],
                message: bidMessage[requestId] || "I can do this job perfectly."
            });
            alert("Bid submitted successfully!");
            fetchRequests();
        } catch (err) {
            alert("Failed to submit bid.");
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading open jobs...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Briefcase className="text-primary-600" size={20} /> Open Job Marketplace
            </h2>
            
            {requests.length === 0 ? (
                <div className="bg-white border border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500">
                    No open job requests currently. Check back soon!
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {requests.map((r) => (
                        <div key={r.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                                <span className="bg-primary-50 text-primary-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                                    {r.category?.name || 'Service'}
                                </span>
                                <span className="text-lg font-bold text-green-600">₹{r.budget}</span>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">Request #{r.id}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-4">{r.description}</p>
                            
                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 font-medium">
                                <div className="flex items-center gap-1"><MapPin size={14} /> {r.address}</div>
                            </div>
                            
                            <div className="space-y-2 pt-4 border-t border-gray-50">
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                        <input 
                                            type="number" 
                                            placeholder="Your Bid"
                                            value={bidAmount[r.id] || ''}
                                            onChange={(e) => setBidAmount({...bidAmount, [r.id]: e.target.value})}
                                            className="w-full pl-7 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                    <button 
                                        onClick={() => handleBid(r.id)}
                                        className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-primary-700 transition-colors flex items-center gap-1.5"
                                    >
                                        <Send size={14} /> Bid
                                    </button>
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Add a message (optional)"
                                    value={bidMessage[r.id] || ''}
                                    onChange={(e) => setBidMessage({...bidMessage, [r.id]: e.target.value})}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobBoard;
