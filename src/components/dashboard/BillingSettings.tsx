import React, { useState } from 'react';
import { CreditCard, Download, Package } from 'lucide-react';

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  current: boolean;
}

export const BillingSettings: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState({
    type: 'card',
    last4: '4242',
    expiry: '12/25',
    brand: 'Visa',
  });
  
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'INV-001',
      date: '2023-10-01',
      amount: 29.99,
      status: 'paid',
    },
    {
      id: 'INV-002',
      date: '2023-11-01',
      amount: 29.99,
      status: 'paid',
    },
    {
      id: 'INV-003',
      date: '2023-12-01',
      amount: 29.99,
      status: 'pending',
    },
  ]);
  
  const [plans, setPlans] = useState<SubscriptionPlan[]>([
    {
      id: 'basic',
      name: 'Basic',
      price: 0,
      features: ['Browse inventory', 'Save favorites', 'Basic support'],
      current: false,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 29.99,
      features: ['All Basic features', 'Priority support', 'Custom car requests', 'Stock alerts'],
      current: true,
    },
    {
      id: 'business',
      name: 'Business',
      price: 99.99,
      features: ['All Premium features', 'Dedicated account manager', 'API access', 'Bulk imports'],
      current: false,
    },
  ]);
  
  const [showUpdateCard, setShowUpdateCard] = useState(false);
  const [newCard, setNewCard] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });

  const handleUpdateCard = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call a payment processor API
    setPaymentMethod({
      type: 'card',
      last4: newCard.number.slice(-4),
      expiry: newCard.expiry,
      brand: 'Visa', // This would be determined by the payment processor
    });
    setShowUpdateCard(false);
    setNewCard({ number: '', expiry: '', cvc: '', name: '' });
    alert('Payment method updated successfully!');
  };

  const handleChangePlan = (planId: string) => {
    // In a real app, this would call an API to update the subscription
    setPlans(
      plans.map(plan => ({
        ...plan,
        current: plan.id === planId,
      }))
    );
    alert(`Subscription updated to ${plans.find(p => p.id === planId)?.name} plan!`);
  };

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Current Subscription */}
      <div className="bg-white shadow-sm p-6">
        <h3 className="text-xl font-zen mb-6">Current Subscription</h3>
        
        <div className="p-4 border border-gray-200 mb-6">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-zen text-lg">
              {plans.find(p => p.current)?.name} Plan
            </h4>
            <span className="text-xl font-zen text-racing-red">
              €{plans.find(p => p.current)?.price.toFixed(2)}/month
            </span>
          </div>
          
          <ul className="list-disc pl-5 mb-4 text-gray-600">
            {plans.find(p => p.current)?.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          
          <div className="flex justify-end">
            <button
              onClick={() => alert('Subscription canceled. Changes will take effect at the end of your billing period.')}
              className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
            >
              Cancel Subscription
            </button>
          </div>
        </div>
        
        <h4 className="font-zen text-lg mb-4">Available Plans</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`p-4 border ${
                plan.current
                  ? 'border-racing-red bg-gray-50'
                  : 'border-gray-200'
              }`}
            >
              <h5 className="font-zen text-lg mb-2">{plan.name}</h5>
              <p className="text-xl font-zen text-racing-red mb-4">
                €{plan.price.toFixed(2)}/month
              </p>
              
              <ul className="list-disc pl-5 mb-4 text-sm text-gray-600 min-h-[100px]">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              
              {plan.current ? (
                <button
                  disabled
                  className="w-full px-4 py-2 bg-gray-200 text-gray-500 cursor-not-allowed"
                >
                  Current Plan
                </button>
              ) : (
                <button
                  onClick={() => handleChangePlan(plan.id)}
                  className="w-full px-4 py-2 bg-racing-red text-white hover:bg-red-700 transition"
                >
                  Switch to {plan.name}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Payment Methods */}
      <div className="bg-white shadow-sm p-6">
        <h3 className="text-xl font-zen mb-6">Payment Methods</h3>
        
        {!showUpdateCard ? (
          <div>
            <div className="p-4 border border-gray-200 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="w-6 h-6 text-racing-red mr-3" />
                  <div>
                    <h4 className="font-zen">
                      {paymentMethod.brand} •••• {paymentMethod.last4}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Expires {paymentMethod.expiry}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUpdateCard(true)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                >
                  Update
                </button>
              </div>
            </div>
            
            <button
              onClick={() => setShowUpdateCard(true)}
              className="px-4 py-2 bg-midnight text-white hover:bg-gray-800 transition"
            >
              Add Payment Method
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdateCard} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                value={newCard.number}
                onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                placeholder="1234 5678 9012 3456"
                className="w-full p-2 border border-gray-300 rounded-none focus:border-racing-red focus:ring-racing-red"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={newCard.expiry}
                  onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                  placeholder="MM/YY"
                  className="w-full p-2 border border-gray-300 rounded-none focus:border-racing-red focus:ring-racing-red"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVC
                </label>
                <input
                  type="text"
                  value={newCard.cvc}
                  onChange={(e) => setNewCard({ ...newCard, cvc: e.target.value })}
                  placeholder="123"
                  className="w-full p-2 border border-gray-300 rounded-none focus:border-racing-red focus:ring-racing-red"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cardholder Name
              </label>
              <input
                type="text"
                value={newCard.name}
                onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                placeholder="John Doe"
                className="w-full p-2 border border-gray-300 rounded-none focus:border-racing-red focus:ring-racing-red"
                required
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowUpdateCard(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-racing-red text-white hover:bg-red-700 transition"
              >
                Save Card
              </button>
            </div>
          </form>
        )}
      </div>
      
      {/* Billing History */}
      <div className="bg-white shadow-sm p-6">
        <h3 className="text-xl font-zen mb-6">Billing History</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {invoice.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    €{invoice.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => alert(`Downloading invoice ${invoice.id}`)}
                      className="text-racing-red hover:text-red-700"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};