import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWidgets, Widget } from '../../contexts/WidgetContext';
import { DashboardWidget } from './DashboardWidget';
import { WishlistWidget } from './WishlistWidget';
import { ComparisonsWidget } from './ComparisonsWidget';
import { RequestsWidget } from './RequestsWidget';
import { ActivityWidget } from './ActivityWidget';
import { AlertsWidget } from './AlertsWidget';
import { QuickActionsWidget } from './QuickActionsWidget';
import { Plus, Settings } from 'lucide-react';

export const DashboardWidgets: React.FC = () => {
  const { widgets, updateWidgetOrder, resetWidgets } = useWidgets();
  const [draggedWidget, setDraggedWidget] = useState<Widget | null>(null);
  const [showWidgetMenu, setShowWidgetMenu] = useState(false);

  // Get visible widgets sorted by order
  const visibleWidgets = widgets
    .filter(widget => widget.visible)
    .sort((a, b) => a.order - b.order);

  // Get hidden widgets
  const hiddenWidgets = widgets.filter(widget => !widget.visible);

  // Handle drag start
  const handleDragStart = (widget: Widget) => {
    setDraggedWidget(widget);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedWidget(null);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (!draggedWidget) return;

    // Update widget order
    updateWidgetOrder(draggedWidget.id, index);
  };

  // Render widget based on type
  const renderWidget = (widget: Widget) => {
    switch (widget.id) {
      case 'wishlist':
        return <WishlistWidget key={widget.id} />;
      case 'comparisons':
        return <ComparisonsWidget key={widget.id} />;
      case 'requests':
        return <RequestsWidget key={widget.id} />;
      case 'activity':
        return <ActivityWidget key={widget.id} />;
      case 'alerts':
        return <AlertsWidget key={widget.id} />;
      case 'quickActions':
        return <QuickActionsWidget key={widget.id} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-zen">Dashboard</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowWidgetMenu(!showWidgetMenu)}
            className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 transition rounded-none"
          >
            <Plus size={16} className="mr-2" />
            Add Widget
          </button>
          <button
            onClick={resetWidgets}
            className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 transition rounded-none"
          >
            <Settings size={16} className="mr-2" />
            Reset Layout
          </button>
        </div>
      </div>

      {/* Widget Menu */}
      {showWidgetMenu && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-white shadow-md p-4 mb-4"
        >
          <h3 className="text-lg font-zen mb-3">Hidden Widgets</h3>
          {hiddenWidgets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {hiddenWidgets.map(widget => (
                <button
                  key={widget.id}
                  onClick={() => {
                    updateWidgetOrder(widget.id, visibleWidgets.length);
                    setShowWidgetMenu(false);
                  }}
                  className="p-3 border border-gray-200 hover:border-racing-red hover:bg-gray-50 transition text-left"
                >
                  <span className="font-zen">{widget.title}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">All widgets are currently visible.</p>
          )}
        </motion.div>
      )}

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleWidgets.map((widget, index) => (
          <div
            key={widget.id}
            draggable
            onDragStart={() => handleDragStart(widget)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            className={`${
              draggedWidget?.id === widget.id ? 'opacity-50' : 'opacity-100'
            } transition-opacity duration-200`}
          >
            <DashboardWidget
              id={widget.id}
              title={widget.title}
              onDragStart={() => handleDragStart(widget)}
              onDragEnd={handleDragEnd}
            >
              {renderWidget(widget)}
            </DashboardWidget>
          </div>
        ))}
      </div>
    </div>
  );
};