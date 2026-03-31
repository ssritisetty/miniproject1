import React, { useState, useEffect } from 'react';
import { PlusCircle, Send, Users, CheckCircle, MapPin, DollarSign, Clock, Star } from 'lucide-react';
import api from '../services/api';

const BiddingSystem = ({ userId, categories }) => {
    const [myRequests, setMyRequests] = useState([]);
    const [showPostForm, setShowPostForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedRequestBids, setSelectedRequestBids] = useState(null);
    
    // Form state
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [budget, setBudget] = useState('');
    const [categoryId, setCategoryId] = useState('');

    useEffect(() => {
        fetchMyRequests();
    }, []);

    const fetchMyRequests = async () => {
        try {
            const res = await api.get(`/bidding/requests/customer/${userId}`);
            setMyRequests(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePostJob = async (e) => {
        e.preventDefault();
        try {
            await api.post('/bidding/request', {
                customerId: userId,
                categoryId,
                description,
                address,
                budget
            });
            setShowPostForm(false);
            fetchMyRequests();
            alert("Job posted successfully! Wait for providers to bid.");
        } catch (err) {
            alert("Failed to post job.");
        }
    };

    const handleViewBids = async (requestId) => {
        try {
            const res = await api.get(`/bidding/requests/${requestId}/bids`);
            setSelectedRequestBids({ requestId, bids: res.data });
        } catch (err) {
            console.error(err);
        }
    };

    const handleAcceptBid = async (bidId) => {
        try {
            await api.post(`/bidding/bid/${bidId}/accept`);
            alert("Bid accepted! A formal booking has been created.");
            setSelectedRequestBids(null);
            fetchMyRequests();
        } catch (err) {
            alert("Failed to accept bid.");
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading your job posts...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Users className="text-primary-600" size={24} /> My Job Posts (Bidding Mode)
                </h2>
                <button 
                    onClick={() => setShowPostForm(!showPostForm)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-primary-700 transition-all flex items-center gap-1.5"
                >
                    <PlusCircle size={18} /> {showPostForm ? 'Cancel' : 'Post New Job'}
                </button>
            </div>

            {showPostForm && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-primary-100 animate-slideIn">
                    <form onSubmit={handlePostJob} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Service Category</label>
                                <select 
                                    required
                                    value={categoryId} 
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Estimated Budget (₹)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input 
                                        required
                                        type="number"
                                        placeholder="E.g. 50"
                                        value={budget}
                                        onChange={(e) => setBudget(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Job Description</label>
                            <textarea 
                                required
                                placeholder="Describe exactly what needs to be done..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 h-24"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Service Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    required
                                    type="text"
                                    placeholder="Enter address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-primary-700 transition-all flex items-center justify-center gap-2 mt-2">
                            <Send size={18} /> Post Job Request
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {myRequests.map((r) => (
                    <div key={r.id} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-primary-100 text-primary-700 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-widest">
                                    {r.category?.name}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${r.completed ? 'bg-green-50 text-green-700 border-green-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                                    {r.completed ? 'COMPLETED' : 'OPEN FOR BIDS'}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Post #{r.id}</h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-1">{r.description}</p>
                            <div className="flex gap-4 text-xs font-medium text-gray-500">
                                <span className="flex items-center gap-1"><MapPin size={14} /> {r.address}</span>
                                <span className="flex items-center gap-1"><Clock size={14} /> {new Date(r.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                            <div className="text-2xl font-black text-gray-900 mb-2">₹{r.budget} <span className="text-[10px] font-medium text-gray-400">Budget</span></div>
                            {!r.completed && (
                                <button 
                                    onClick={() => handleViewBids(r.id)}
                                    className="w-full md:w-auto bg-gray-100 hover:bg-primary-50 hover:text-primary-700 text-gray-600 px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                                >
                                    <Users size={16} /> View Bids
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {myRequests.length === 0 && !showPostForm && (
                     <div className="py-16 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300">
                        <p className="text-lg font-medium text-gray-900">No job posts yet</p>
                        <p className="mt-1">Post a job to receive competitive bids from providers.</p>
                     </div>
                )}
            </div>

            {selectedRequestBids && (
                <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedRequestBids(null)}>
                    <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden animate-zoomIn shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-xl font-bold text-gray-900">Bids for Job #{selectedRequestBids.requestId}</h3>
                            <button onClick={() => setSelectedRequestBids(null)} className="text-gray-400 hover:text-gray-600">
                                <PlusCircle size={24} className="rotate-45" />
                            </button>
                        </div>
                        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
                            {selectedRequestBids.bids.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">No bids received yet.</div>
                            ) : (
                                selectedRequestBids.bids.map(bid => (
                                    <div key={bid.id} className="bg-gray-50 p-5 rounded-2xl border border-gray-100 group relative">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold">
                                                    {bid.provider?.user?.username?.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900">{bid.provider?.user?.username}</h4>
                                                    <div className="flex items-center gap-1 text-xs text-yellow-500">
                                                        <Star size={12} className="fill-yellow-500" /> {bid.provider?.rating} Rating
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-2xl font-black text-primary-600">₹{bid.amount}</div>
                                        </div>
                                        <p className="text-sm text-gray-600 italic bg-white p-3 rounded-xl border border-gray-50 shadow-sm mb-4">
                                            "{bid.offerMessage}"
                                        </p>
                                        <button 
                                            onClick={() => handleAcceptBid(bid.id)}
                                            className="w-full bg-primary-600 text-white py-2.5 rounded-xl font-bold shadow-md hover:bg-primary-700 transition-all flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle size={18} /> Accept This Bid
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BiddingSystem;
