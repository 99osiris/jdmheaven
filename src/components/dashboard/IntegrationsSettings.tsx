import React, { useState } from 'react';
import { Link2, Key, Check, X } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  connected: boolean;
  icon: React.ReactNode;
}

export const IntegrationsSettings: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'google-drive',
      name: 'Google Drive',
      description: 'Connect to store and access your documents',
      connected: false,
      icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M4.433 22l4.935-8.538H22l-4.935 8.538H4.433zm14.037-9.745l-4.935-8.537h-7.221l4.935 8.537h7.221zm-4.341 2.308H6.907L2 22h7.221l4.908-7.437z" fill="#4285F4"/></svg>,
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      description: 'Connect to store and access your documents',
      connected: true,
      icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2l6 3.75L6 9.5 0 5.75 6 2zm12 0l6 3.75-6 3.75-6-3.75L18 2zM0 13.25L6 9.5l6 3.75L6 17l-6-3.75zm18 0l6-3.75L18 13.25 12 9.5l6 3.75zM6 18.25l6-3.75 6 3.75L12 22l-6-3.75z" fill="#0061FF"/></svg>,
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Connect for payment processing',
      connected: false,
      icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M13.479 9.883c-1.626-.604-2.512-1.067-2.512-1.803 0-.622.511-1.028 1.459-1.028 1.711 0 3.48.642 4.698 1.209l.703-4.295C16.42 3.336 14.952 3 12.869 3 9.034 3 6.452 5.117 6.452 8.171c0 3.701 3.453 5.024 5.714 6.052 2.271 1.023 3.021 1.736 3.021 2.832 0 .84-.661 1.312-1.873 1.312-1.536 0-4.039-.752-5.737-1.716l-.704 4.284c1.459.971 4.039 1.715 6.726 1.715 4.039 0 6.576-2.005 6.576-5.343 0-3.676-2.899-5.008-5.696-6.424z" fill="#6772E5"/></svg>,
    },
  ]);
  
  const [apiKeys, setApiKeys] = useState<{ id: string; key: string; created: string }[]>([
    {
      id: 'api-key-1',
      key: 'sk_test_51NzXYZ...',
      created: '2023-10-15T14:30:00Z',
    },
  ]);

  const [showNewKeyForm, setShowNewKeyForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');

  const toggleConnection = (id: string) => {
    setIntegrations(
      integrations.map(integration =>
        integration.id === id
          ? { ...integration, connected: !integration.connected }
          : integration
      )
    );
  };

  const generateApiKey = () => {
    if (!newKeyName.trim()) {
      alert('Please enter a name for your API key');
      return;
    }
    
    // In a real app, this would call an API to generate a key
    const newKey = {
      id: `api-key-${Date.now()}`,
      key: `sk_test_${Math.random().toString(36).substring(2, 15)}`,
      created: new Date().toISOString(),
    };
    
    setApiKeys([...apiKeys, newKey]);
    setShowNewKeyForm(false);
    setNewKeyName('');
  };

  const revokeApiKey = (id: string) => {
    if (confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      setApiKeys(apiKeys.filter(key => key.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Third-Party Integrations */}
      <div className="bg-white shadow-sm p-6">
        <h3 className="text-xl font-zen mb-6">Third-Party Integrations</h3>
        
        <div className="space-y-6">
          {integrations.map((integration) => (
            <div key={integration.id} className="flex items-center justify-between p-4 border border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 flex items-center justify-center mr-4">
                  {integration.icon}
                </div>
                <div>
                  <h4 className="font-zen">{integration.name}</h4>
                  <p className="text-sm text-gray-500">{integration.description}</p>
                </div>
              </div>
              <button
                onClick={() => toggleConnection(integration.id)}
                className={`px-4 py-2 ${
                  integration.connected
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    : 'bg-racing-red text-white hover:bg-red-700'
                } transition`}
              >
                {integration.connected ? (
                  <span className="flex items-center">
                    <Check size={16} className="mr-1" />
                    Connected
                  </span>
                ) : (
                  'Connect'
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* API Keys */}
      <div className="bg-white shadow-sm p-6">
        <h3 className="text-xl font-zen mb-6">API Keys</h3>
        
        <div className="space-y-6">
          {apiKeys.map((apiKey) => (
            <div key={apiKey.id} className="p-4 border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center">
                    <Key className="w-4 h-4 text-racing-red mr-2" />
                    <h4 className="font-zen">{apiKey.id}</h4>
                  </div>
                  <p className="text-sm font-mono mt-1">{apiKey.key}</p>
                </div>
                <button
                  onClick={() => revokeApiKey(apiKey.id)}
                  className="text-red-600 hover:text-red-800 transition"
                >
                  Revoke
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Created: {new Date(apiKey.created).toLocaleString()}
              </p>
            </div>
          ))}
          
          {showNewKeyForm ? (
            <div className="p-4 border border-gray-200">
              <h4 className="font-zen mb-3">Generate New API Key</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Key Name
                  </label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-none focus:border-racing-red focus:ring-racing-red"
                    placeholder="e.g., Development, Production"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowNewKeyForm(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={generateApiKey}
                    className="px-4 py-2 bg-racing-red text-white hover:bg-red-700 transition"
                  >
                    Generate Key
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowNewKeyForm(true)}
              className="px-4 py-2 bg-midnight text-white hover:bg-gray-800 transition"
            >
              Generate New API Key
            </button>
          )}
          
          <p className="text-sm text-gray-500">
            API keys provide access to our API. Keep your keys secure and never share them publicly.
          </p>
        </div>
      </div>
    </div>
  );
};