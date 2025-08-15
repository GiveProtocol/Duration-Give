import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { DOCS_CONFIG } from '@/config/docs';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1">
          <Link to="/" className="flex items-center mb-4">
            <Logo className="h-6 w-6 mr-2" />
            <span className="text-xl font-bold text-gray-900">Give Protocol</span>
          </Link>
          <p className="text-sm text-gray-600">
            Empowering charitable giving through transparent and efficient blockchain technology.
          </p>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
            Resources
          </h3>
          <div className="mt-4 space-y-4">
            <a 
              href={DOCS_CONFIG.url}
              className="block text-gray-600 hover:text-gray-900"
            >
              Documentation & FAQ
            </a>
            <Link to="/governance" className="block text-gray-600 hover:text-gray-900">
              Governance
            </Link>
            <Link to="/about" className="block text-gray-600 hover:text-gray-900">
              About Us
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
            Legal
          </h3>
          <div className="mt-4 space-y-4">
            <Link to="/legal" className="block text-gray-600 hover:text-gray-900">
              Terms of Service
            </Link>
            <Link to="/privacy" className="block text-gray-600 hover:text-gray-900">
              Privacy Policy
            </Link>
            <Link to="/legal#compliance" className="block text-gray-600 hover:text-gray-900">
              Compliance
            </Link>
          </div>
        </div>
        
        <div className="col-span-1 md:col-span-4 mt-8 border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Give Protocol. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};