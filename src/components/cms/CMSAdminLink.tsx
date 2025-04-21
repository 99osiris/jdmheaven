import React from 'react';
import { ExternalLink, Edit } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface CMSAdminLinkProps {
  documentId?: string;
  documentType?: string;
  className?: string;
}

export const CMSAdminLink: React.FC<CMSAdminLinkProps> = ({
  documentId,
  documentType = 'document',
  className = '',
}) => {
  const { user } = useAuth();
  const isAdmin = user?.user_metadata?.role === 'admin';
  
  if (!isAdmin) return null;
  
  const sanityProjectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'hwqanehwtpxf';
  const sanityDataset = import.meta.env.VITE_SANITY_DATASET || 'production';
  
  const baseUrl = `https://hwqanehwtpxf.sanity.studio/desk`;
  
  // If we have a specific document ID, link directly to it
  const url = documentId
    ? `${baseUrl}/${documentId}`
    : `${baseUrl}/structure/${documentType}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center px-3 py-1 bg-black text-white text-xs hover:bg-gray-800 transition ${className}`}
      title="Edit in Sanity Studio"
    >
      <Edit className="w-3 h-3 mr-1" />
      Edit in CMS
      <ExternalLink className="w-3 h-3 ml-1" />
    </a>
  );
};