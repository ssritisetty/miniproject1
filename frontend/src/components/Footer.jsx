import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6 md:order-2">
            <Link to="/about" className="text-gray-400 hover:text-gray-500">
              About
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-gray-500">
              Terms
            </Link>
            <Link to="/privacy" className="text-gray-400 hover:text-gray-500">
              Privacy
            </Link>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-sm text-gray-500 flex items-center justify-center gap-1 md:justify-start">
              &copy; {new Date().getFullYear()} ServiceConnect. Made with <Heart size={14} className="text-red-500 fill-red-500" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
