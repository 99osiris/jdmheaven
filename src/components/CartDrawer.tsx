import React from 'react';
import { X, ShoppingCart, Trash2, FileText, Send } from 'lucide-react';
import { useAccount } from '../contexts/AccountContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from './Toast';
import type { Car } from '../types';

interface CartItem {
  car: Car;
  quantity: number;
  notes?: string;
  inquiryType: 'general' | 'purchase' | 'test_drive' | 'financing';
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateCartItem, clearCart, submitInquiry, refreshing } = useAccount();
  const { user } = useAuth();
  const navigate = useNavigate();

  const inquiryTypeLabels = {
    general: 'General Inquiry',
    purchase: 'Purchase Inquiry',
    test_drive: 'Test Drive Request',
    financing: 'Financing Inquiry',
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please sign in to submit inquiries');
      navigate('/auth');
      return;
    }

    await submitInquiry();
    onClose();
  };

  const totalValue = cart.reduce((sum, item) => sum + item.car.price, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-midnight z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <ShoppingCart className="w-6 h-6 text-racing-red" />
                <h2 className="text-xl font-zen text-midnight dark:text-white">
                  Inquiries ({cart.length})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-none transition"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingCart className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Your inquiry cart is empty</p>
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/inventory');
                    }}
                    className="px-6 py-3 bg-racing-red text-white rounded-none hover:bg-red-700 transition font-zen"
                  >
                    Browse Inventory
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <motion.div
                      key={item.car.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 dark:bg-gray-800 p-4 rounded-none border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Car Image */}
                        <div className="w-24 h-24 flex-shrink-0">
                          <img
                            src={item.car.images?.[0]?.url || '/placeholder-car.jpg'}
                            alt={`${item.car.make} ${item.car.model}`}
                            className="w-full h-full object-cover rounded-none"
                          />
                        </div>

                        {/* Car Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-zen text-midnight dark:text-white mb-1 truncate">
                            {item.car.make} {item.car.model}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {item.car.year} • €{item.car.price.toLocaleString()}
                          </p>

                          {/* Inquiry Type */}
                          <select
                            value={item.inquiryType}
                            onChange={(e) => updateCartItem(item.car.id, {
                              inquiryType: e.target.value as 'general' | 'purchase' | 'test_drive' | 'financing'
                            })}
                            className="w-full text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-none p-2 mb-2 text-midnight dark:text-white font-zen"
                          >
                            {Object.entries(inquiryTypeLabels).map(([value, label]) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </select>

                          {/* Notes */}
                          <textarea
                            value={item.notes || ''}
                            onChange={(e) => updateCartItem(item.car.id, { notes: e.target.value })}
                            placeholder="Add notes (optional)..."
                            className="w-full text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-none p-2 text-midnight dark:text-white resize-none"
                            rows={2}
                          />
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.car.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-none transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 font-zen">Total Value:</span>
                  <span className="text-xl font-zen text-racing-red">
                    €{totalValue.toLocaleString()}
                  </span>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={clearCart}
                    className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-midnight dark:text-white rounded-none hover:bg-gray-300 dark:hover:bg-gray-600 transition font-zen"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={refreshing}
                    className="flex-1 px-4 py-3 bg-racing-red text-white rounded-none hover:bg-red-700 transition font-zen disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>{refreshing ? 'Submitting...' : 'Submit Inquiries'}</span>
                  </button>
                </div>

                {!user && (
                  <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                    <button
                      onClick={() => {
                        onClose();
                        navigate('/auth');
                      }}
                      className="text-racing-red hover:underline"
                    >
                      Sign in
                    </button>
                    {' '}to submit inquiries
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

