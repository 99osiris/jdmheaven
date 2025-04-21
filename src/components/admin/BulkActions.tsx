import React from 'react';
import { Trash2, Archive, Tag, Download, Upload, CheckSquare } from 'lucide-react';

interface BulkActionsProps {
  selectedIds: string[];
  onAction: (action: string, ids: string[]) => void;
  onSelectAll: () => void;
  isAllSelected: boolean;
  totalItems: number;
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedIds,
  onAction,
  onSelectAll,
  isAllSelected,
  totalItems,
}) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onSelectAll}
            className="flex items-center text-sm text-gray-600 hover:text-racing-red transition"
          >
            <CheckSquare className="w-4 h-4 mr-2" />
            {isAllSelected ? 'Deselect All' : 'Select All'} ({selectedIds.length}/{totalItems})
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => onAction('export', selectedIds)}
            disabled={selectedIds.length === 0}
            className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-racing-red transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>

          <button
            onClick={() => onAction('import', selectedIds)}
            className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-racing-red transition"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import
          </button>

          <button
            onClick={() => onAction('tag', selectedIds)}
            disabled={selectedIds.length === 0}
            className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-racing-red transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Tag className="w-4 h-4 mr-2" />
            Tag
          </button>

          <button
            onClick={() => onAction('archive', selectedIds)}
            disabled={selectedIds.length === 0}
            className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-racing-red transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Archive className="w-4 h-4 mr-2" />
            Archive
          </button>

          <button
            onClick={() => onAction('delete', selectedIds)}
            disabled={selectedIds.length === 0}
            className="flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};