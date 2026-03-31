import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Shield, Clock, Star, ArrowRight, CheckCircle2 } from 'lucide-react';

import authService from '../services/auth.service';
const Home = () => {
  const currentUser = authService.getCurrentUser();
  const categories = [
    { title: 'Plumbing', icon: '🔧', color: 'bg-blue-100 text-blue-600' },
    { title: 'Electrical', icon: '⚡', color: 'bg-yellow-100 text-yellow-600' },
    { title: 'Cleaning', icon: '🧹', color: 'bg-green-100 text-green-600' },
    { title: 'Carpentry', icon: '🪚', color: 'bg-orange-100 text-orange-600' },
    { title: 'Painting', icon: '🎨', color: 'bg-purple-100 text-purple-600' },
    { title: 'Appliance', icon: '📺', color: 'bg-red-100 text-red-600' },
  ];

  const features = [
    {
      title: 'Verified Professionals',
      description: 'All our service providers go through a rigorous background check and verification process.',
      icon: <Shield className="w-6 h-6" />,
    },
    {
      title: 'Instant Booking',
      description: 'Book your required service in seconds with our streamlined booking process.',
      icon: <Clock className="w-6 h-6" />,
    },
    {
      title: 'Quality Guaranteed',
      description: 'We ensure high-quality service delivery with our 100% satisfaction guarantee.',
      icon: <Star className="w-6 h-6" />,
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-white">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-50 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-secondary-50 rounded-full blur-3xl opacity-40"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
              Your Trusted Partner for <span className="text-primary-600">Local Services</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Find and book reliable professionals for all your home and office needs. 
              Quality service at your doorstep, guaranteed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl shadow-lg hover:bg-primary-700 hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight size={20} />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 shadow-sm hover:border-primary-300 hover:text-primary-600 transition-all"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Only for Logged In Users */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Categories</h2>
            <div className="w-20 h-1.5 bg-primary-600 mx-auto rounded-full"></div>
          </div>

          {currentUser ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 animate-fadeIn">
              {categories.map((cat, idx) => (
                <div 
                  key={idx}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-transparent hover:border-primary-200 hover:shadow-md transition-all cursor-pointer group text-center"
                >
                  <div className={`w-14 h-14 ${cat.color} rounded-xl flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    {cat.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900">{cat.title}</h3>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100 max-w-4xl mx-auto relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-full bg-gray-200/20 backdrop-blur-[2px] z-0"></div>
               <div className="relative z-10">
                  <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Community Access Restricted</h3>
                  <p className="text-gray-600 mb-8 max-w-lg mx-auto font-medium">To maintain the quality and security of our services, professional profiles and categories are only visible to our registered members.</p>
                  <div className="flex justify-center gap-4">
                    <Link to="/register" className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg hover:scale-105 active:scale-95">Sign Up Now</Link>
                    <Link to="/login" className="bg-white text-gray-700 border border-gray-200 px-8 py-3 rounded-xl font-bold hover:border-primary-600 hover:text-primary-600 transition-all">Login</Link>
                  </div>
               </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-600 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-primary-500 rounded-full opacity-50"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-primary-700 rounded-full opacity-50"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Are you a skilled professional?</h2>
              <p className="text-xl text-primary-100 mb-10">
                Join our platform and connect with thousands of customers in your area. 
                Grow your business with ServiceConnect.
              </p>
              <Link
                to="/register?role=provider"
                className="inline-block px-10 py-4 bg-white text-primary-600 font-bold rounded-xl hover:bg-gray-50 transition-all active:scale-95 shadow-lg"
              >
                Join as a Service Provider
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
