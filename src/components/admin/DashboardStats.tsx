import React from 'react';
import { StatsCard } from './StatsCard';
import { DollarSign, TrendingUp, BarChart, Users, Car, ShoppingBag } from 'lucide-react';

interface DashboardStatsProps {
  stats: {
    totalCars: number;
    totalUsers: number;
    totalRequests: number;
    totalContacts: number;
    revenueStats: {
      total: number;
      thisMonth: number;
      lastMonth: number;
    };
    inventoryStats: {
      available: number;
      pending: number;
      sold: number;
    };
    requestStats: {
      pending: number;
      inProgress: number;
      completed: number;
    };
  };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="space-y-8">
      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Revenue"
          value={`€${stats.revenueStats.total.toLocaleString()}`}
          icon={DollarSign}
          color="border-racing-red"
        />
        <StatsCard
          title="This Month"
          value={`€${stats.revenueStats.thisMonth.toLocaleString()}`}
          change={{ value: 15, type: 'increase' }}
          icon={TrendingUp}
          color="border-green-500"
        />
        <StatsCard
          title="Last Month"
          value={`€${stats.revenueStats.lastMonth.toLocaleString()}`}
          icon={BarChart}
          color="border-blue-500"
        />
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="border-purple-500"
        />
        <StatsCard
          title="Available Cars"
          value={stats.inventoryStats.available}
          icon={Car}
          color="border-racing-red"
        />
        <StatsCard
          title="Pending Requests"
          value={stats.requestStats.pending}
          icon={ShoppingBag}
          color="border-yellow-500"
        />
      </div>
    </div>
  );
};