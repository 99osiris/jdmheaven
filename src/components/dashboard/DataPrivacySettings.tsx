import React, { useState } from 'react';
import { useUserData } from '../../contexts/UserDataContext';
import { Download, Trash2, AlertCircle } from 'lucide-react';

export const DataPrivacySettings: React.FC = () => {
  const { downloadUserData, requestAccountDeletion, isProcessing } = useUserData();
  const [showDeletionConfirm, setShowDeletionConfirm] = useState(false);

  const handleDownload = async () => {
    await downloadUserData();
  };

  const handleDeleteRequest = async () => {
    const confirmed = await requestAccountDeletion();
    if (confirmed) {
      setShowDeletionConfirm(false);
    }
  };

  return (
    <div className="bg-white shadow-sm p-6">
      <h3 className="text-xl font-zen mb-6">Data & Privacy</h3>
      
      <div className="space-y-8">
        {/* Data Download */}
        <div className="p-4 border border-gray-200">
          <div className="flex items-start mb-4">
            <Download className="w-5 h-5 text-racing-red mr-3 mt-1" />
            <div>
              <h4 className="font-zen text-lg">Download Your Data</h4>
              <p className="text-gray-600 mt-1">
                Export all your personal data in JSON format, including your profile information, 
                saved cars, comparisons, and custom requests.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleDownload}
              disabled={isProcessing}
              className="px-4 py-2 bg-midnight text-white hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Download Data'}
            </button>
          </div>
        </div>
        
        {/* Account Deletion */}
        <div className="p-4 border border-red-200 bg-red-50">
          <div className="flex items-start mb-4">
            <Trash2 className="w-5 h-5 text-red-600 mr-3 mt-1" />
            <div>
              <h4 className="font-zen text-lg">Delete Your Account</h4>
              <p className="text-gray-600 mt-1">
                Request permanent deletion of your account and all associated data. 
                This action cannot be undone.
              </p>
            </div>
          </div>
          
          {!showDeletionConfirm ? (
            <div className="flex justify-end">
              <button
                onClick={() => setShowDeletionConfirm(true)}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition"
              >
                Request Account Deletion
              </button>
            </div>
          ) : (
            <div className="border border-red-300 p-4 bg-white">
              <div className="flex items-start mb-4">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
                <div>
                  <h5 className="font-bold">Are you absolutely sure?</h5>
                  <p className="text-sm text-gray-600 mt-1">
                    This will permanently delete your account and all associated data. 
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeletionConfirm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteRequest}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : 'Confirm Deletion'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};