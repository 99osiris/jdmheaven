import React, { useState } from 'react';
import { HelpCircle, FileText, AlertOctagon, Send, Paperclip } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface SystemStatus {
  service: string;
  status: 'operational' | 'degraded' | 'outage';
  message?: string;
}

export const HelpSupportSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'faq' | 'support' | 'status'>('faq');
  const [supportForm, setSupportForm] = useState({
    subject: '',
    message: '',
    files: [] as File[],
  });
  
  const faqs: FAQItem[] = [
    {
      question: 'How do I import a car from Japan?',
      answer: 'Our import process is simple. Browse our inventory, select a car, and contact us to start the import process. We handle all paperwork, shipping, and compliance requirements.',
    },
    {
      question: 'What fees are involved in importing a car?',
      answer: 'Import fees typically include purchase price, shipping costs, customs duties, taxes, compliance modifications, and our service fee. We provide a transparent breakdown of all costs before you commit.',
    },
    {
      question: 'How long does the import process take?',
      answer: 'The typical timeframe is 8-12 weeks from purchase to delivery. This includes auction bidding, shipping (4-6 weeks), customs clearance (1-2 weeks), and compliance work (1-3 weeks).',
    },
    {
      question: 'Do you offer financing options?',
      answer: 'Yes, we partner with several financial institutions that specialize in JDM imports. Contact us for more information about available financing options.',
    },
    {
      question: 'Can you source a specific car that\'s not in your inventory?',
      answer: 'Absolutely! Use our Custom Request feature to tell us exactly what you\'re looking for, and our team will search Japanese auctions and dealer networks to find your dream car.',
    },
  ];
  
  const systemStatus: SystemStatus[] = [
    {
      service: 'Website',
      status: 'operational',
    },
    {
      service: 'Inventory System',
      status: 'operational',
    },
    {
      service: 'User Accounts',
      status: 'operational',
    },
    {
      service: 'Payment Processing',
      status: 'degraded',
      message: 'Some payment methods may experience delays',
    },
    {
      service: 'Auction Bidding',
      status: 'operational',
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSupportForm({
        ...supportForm,
        files: [...supportForm.files, ...newFiles],
      });
    }
  };

  const removeFile = (index: number) => {
    setSupportForm({
      ...supportForm,
      files: supportForm.files.filter((_, i) => i !== index),
    });
  };

  const handleSubmitSupport = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    alert('Support ticket submitted successfully!');
    setSupportForm({
      subject: '',
      message: '',
      files: [],
    });
  };

  const getStatusColor = (status: SystemStatus['status']) => {
    switch (status) {
      case 'operational':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'outage':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white shadow-sm">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('faq')}
            className={`py-4 px-6 font-medium text-sm border-b-2 ${
              activeTab === 'faq'
                ? 'border-racing-red text-racing-red'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <HelpCircle className="w-4 h-4 inline mr-2" />
            FAQs
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`py-4 px-6 font-medium text-sm border-b-2 ${
              activeTab === 'support'
                ? 'border-racing-red text-racing-red'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Support
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`py-4 px-6 font-medium text-sm border-b-2 ${
              activeTab === 'status'
                ? 'border-racing-red text-racing-red'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <AlertOctagon className="w-4 h-4 inline mr-2" />
            System Status
          </button>
        </nav>
      </div>
      
      <div className="p-6">
        {activeTab === 'faq' && (
          <div className="space-y-6">
            <h3 className="text-xl font-zen mb-6">Frequently Asked Questions</h3>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 p-4">
                  <h4 className="font-zen text-lg mb-2">{faq.question}</h4>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
            
            <p className="text-sm text-gray-500">
              Can't find what you're looking for? Submit a support ticket for personalized assistance.
            </p>
          </div>
        )}
        
        {activeTab === 'support' && (
          <div className="space-y-6">
            <h3 className="text-xl font-zen mb-6">Submit a Support Ticket</h3>
            
            <form onSubmit={handleSubmitSupport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={supportForm.subject}
                  onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-none focus:border-racing-red focus:ring-racing-red"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={supportForm.message}
                  onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                  rows={6}
                  className="w-full p-2 border border-gray-300 rounded-none focus:border-racing-red focus:ring-racing-red"
                  required
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attachments
                </label>
                <div className="flex items-center">
                  <label className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 transition">
                    <Paperclip className="w-4 h-4 inline mr-2" />
                    Attach Files
                    <input
                      type="file"
                      onChange={handleFileChange}
                      multiple
                      className="hidden"
                    />
                  </label>
                </div>
                
                {supportForm.files.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {supportForm.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200">
                        <span className="text-sm truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-racing-red text-white hover:bg-red-700 transition"
                >
                  <Send className="w-4 h-4 inline mr-2" />
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        )}
        
        {activeTab === 'status' && (
          <div className="space-y-6">
            <h3 className="text-xl font-zen mb-6">System Status</h3>
            
            <div className="space-y-4">
              {systemStatus.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200">
                  <div>
                    <h4 className="font-zen">{service.service}</h4>
                    {service.message && (
                      <p className="text-sm text-gray-500 mt-1">{service.message}</p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)} mr-2`}></div>
                    <span className="text-sm capitalize">{service.status}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-gray-50 border border-gray-200">
              <h4 className="font-zen mb-2">Upcoming Maintenance</h4>
              <p className="text-sm text-gray-600">
                Scheduled maintenance: December 15, 2023, 02:00 - 04:00 UTC
              </p>
              <p className="text-sm text-gray-500 mt-1">
                During this time, the website and services may be intermittently unavailable.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};