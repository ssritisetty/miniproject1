import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, FolderOpen, AlertCircle } from 'lucide-react';
import authService from '../services/auth.service';
import dataService from '../services/data.service';
import api from '../services/api';
import WeatherWidget from '../components/WeatherWidget';

const AdminDashboard = () => {
  const currentUser = authService.getCurrentUser();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', description: '' });

  useEffect(() => {
    if (currentUser?.roles.includes('ROLE_ADMIN')) {
      fetchCategories();
    }
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await dataService.getCategories();
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setFormData({ id: category.id, name: category.name, description: category.description });
    } else {
      setFormData({ id: null, name: '', description: '' });
    }
    setShowModal(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await api.put(`/categories/${formData.id}`, { name: formData.name, description: formData.description });
      } else {
        await api.post('/categories', { name: formData.name, description: formData.description });
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      alert('Error saving category: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await api.delete(`/categories/${id}`);
        fetchCategories();
      } catch (err) {
        alert('Error deleting category. It might be in use by service providers.');
      }
    }
  };

  // Only allow admins
  if (!currentUser || !currentUser.roles.includes('ROLE_ADMIN')) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            Administrator Portal
            <span className="bg-red-100 text-red-700 text-xs font-black px-2 py-0.5 rounded uppercase tracking-widest mt-1">Admin</span>
          </h1>
          <p className="text-gray-500 mt-1">Manage global system settings and service configurations.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-gray-900 hover:bg-gray-800 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      {/* Climate/Weather Feature */}
      <div className="mb-8 shadow-sm">
        <WeatherWidget />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/80">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FolderOpen className="text-gray-400" size={20} /> Service Categories
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4">Name</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/2">Description</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center text-gray-500">Loading categories...</td>
                </tr>
              ) : categories.length > 0 ? (
                categories.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-900">{c.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 line-clamp-1">{c.description || <span className="text-gray-400 italic">No description</span>}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => handleOpenModal(c)} className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-md transition-colors tooltip" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDeleteCategory(c.id)} className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-md transition-colors tooltip" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center">
                    <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                      <FolderOpen className="text-gray-400" size={24} />
                    </div>
                    <p className="text-gray-500">No categories found. Create the first one!</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay & Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-900 mb-5">{formData.id ? 'Edit Category' : 'New Service Category'}</h3>
            <form onSubmit={handleSaveCategory}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                    placeholder="e.g. Plumbing"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors resize-none"
                    placeholder="Brief description of the service category..."
                  ></textarea>
                </div>
              </div>
              
              <div className="mt-8 flex gap-3 justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 text-sm font-medium text-white bg-gray-900 border border-transparent rounded-lg hover:bg-black transition-colors"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
