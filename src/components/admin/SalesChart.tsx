import React from 'react';
import { BarChart as ChartIcon } from 'lucide-react';

interface SalesChartProps {
  data: {
    labels: string[];
    values: number[];
  };
}

export const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.values);

  return (
    <div className="bg-white shadow-lg rounded-none p-6">
      <h3 className="text-xl font-zen text-gray-900 mb-6 flex items-center">
        <ChartIcon className="w-6 h-6 text-racing-red mr-2" />
        Sales Overview
      </h3>

      <div className="h-64">
        <div className="flex h-full items-end space-x-2">
          {data.values.map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-racing-red transition-all duration-300 hover:bg-red-700"
                style={{ height: `${(value / maxValue) * 100}%` }}
              ></div>
              <div className="text-xs text-gray-600 mt-2">{data.labels[index]}</div>
              <div className="text-sm font-medium mt-1">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};