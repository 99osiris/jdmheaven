import React from 'react';
import { useWidgets, WidgetType } from '../../contexts/WidgetContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Grip, Eye, EyeOff } from 'lucide-react';

export const WidgetManager: React.FC = () => {
  const { widgets, updateWidgetOrder, toggleWidgetVisibility, resetWidgets } = useWidgets();

  // Handle drag end
  const onDragEnd = (result: any) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }

    const widgetId = result.draggableId as WidgetType;
    const destinationIndex = result.destination.index;

    updateWidgetOrder(widgetId, destinationIndex);
  };

  return (
    <div className="bg-white shadow-sm p-6">
      <h3 className="text-xl font-zen mb-6">Manage Dashboard Widgets</h3>
      
      <div className="mb-4">
        <button
          onClick={resetWidgets}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition text-sm"
        >
          Reset to Default
        </button>
      </div>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="widgets">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {widgets.map((widget, index) => (
                <Draggable key={widget.id} draggableId={widget.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200"
                    >
                      <div className="flex items-center">
                        <div {...provided.dragHandleProps} className="mr-3 text-gray-400">
                          <Grip size={16} />
                        </div>
                        <span className="font-zen">{widget.title}</span>
                      </div>
                      <button
                        onClick={() => toggleWidgetVisibility(widget.id)}
                        className="text-gray-400 hover:text-gray-600 transition"
                      >
                        {widget.visible ? (
                          <Eye size={16} />
                        ) : (
                          <EyeOff size={16} />
                        )}
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      <p className="text-sm text-gray-500 mt-4">
        Drag and drop widgets to reorder them. Click the eye icon to show/hide widgets.
      </p>
    </div>
  );
};