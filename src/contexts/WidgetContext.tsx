import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Define widget types
export type WidgetType = 
  | 'wishlist' 
  | 'comparisons' 
  | 'requests' 
  | 'activity' 
  | 'alerts' 
  | 'quickActions';

// Define widget interface
export interface Widget {
  id: WidgetType;
  title: string;
  visible: boolean;
  order: number;
}

// Default widgets configuration
const defaultWidgets: Widget[] = [
  { id: 'wishlist', title: 'Saved Cars', visible: true, order: 0 },
  { id: 'comparisons', title: 'My Comparisons', visible: true, order: 1 },
  { id: 'requests', title: 'Custom Requests', visible: true, order: 2 },
  { id: 'activity', title: 'Recent Activity', visible: true, order: 3 },
  { id: 'alerts', title: 'Stock Alerts', visible: true, order: 4 },
  { id: 'quickActions', title: 'Quick Actions', visible: true, order: 5 },
];

interface WidgetContextType {
  widgets: Widget[];
  updateWidgetOrder: (id: WidgetType, newOrder: number) => void;
  toggleWidgetVisibility: (id: WidgetType) => void;
  resetWidgets: () => void;
}

const WidgetContext = createContext<WidgetContextType>({
  widgets: defaultWidgets,
  updateWidgetOrder: () => {},
  toggleWidgetVisibility: () => {},
  resetWidgets: () => {},
});

export const useWidgets = () => useContext(WidgetContext);

export const WidgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [widgets, setWidgets] = useLocalStorage<Widget[]>('dashboard-widgets', defaultWidgets);

  // Update widget order
  const updateWidgetOrder = (id: WidgetType, newOrder: number) => {
    const updatedWidgets = [...widgets];
    const widgetIndex = updatedWidgets.findIndex(w => w.id === id);
    
    if (widgetIndex === -1) return;
    
    // Get the widget to move
    const widget = updatedWidgets[widgetIndex];
    
    // Remove the widget from its current position
    updatedWidgets.splice(widgetIndex, 1);
    
    // Insert the widget at its new position
    updatedWidgets.splice(newOrder, 0, widget);
    
    // Update the order property for all widgets
    const reorderedWidgets = updatedWidgets.map((w, index) => ({
      ...w,
      order: index,
    }));
    
    setWidgets(reorderedWidgets);
  };

  // Toggle widget visibility
  const toggleWidgetVisibility = (id: WidgetType) => {
    setWidgets(
      widgets.map(widget => 
        widget.id === id 
          ? { ...widget, visible: !widget.visible } 
          : widget
      )
    );
  };

  // Reset widgets to default
  const resetWidgets = () => {
    setWidgets(defaultWidgets);
  };

  return (
    <WidgetContext.Provider value={{ widgets, updateWidgetOrder, toggleWidgetVisibility, resetWidgets }}>
      {children}
    </WidgetContext.Provider>
  );
};