import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminBoard from '../../components/AdminBoard';
import { TruckIcon, Package, BarChart3, Users } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const stats = [
    {
      name: 'Total Sales',
      value: '156',
      icon: BarChart3,
      color: 'bg-blue-500',
    },
    {
      name: 'Active Loads',
      value: '23',
      icon: TruckIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Boxes Sent',
      value: '1,234',
      icon: Package,
      color: 'bg-purple-500',
    },
    {
      name: 'Active Parties',
      value: '45',
      icon: Users,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminBoard />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to Fishow ERP System</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/sales-entry')}
              className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
            >
              <h3 className="font-medium text-gray-900">New Sales Entry</h3>
              <p className="text-sm text-gray-600 mt-1">
                Create a new sales entry form
              </p>
            </button>
            <button
              onClick={() => navigate('/load-wise-list')}
              className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
            >
              <h3 className="font-medium text-gray-900">View Load List</h3>
              <p className="text-sm text-gray-600 mt-1">
                Check load wise sales data
              </p>
            </button>
            <button
              onClick={() => navigate('/fish-box-sent')}
              className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
            >
              <h3 className="font-medium text-gray-900">Send Fish Boxes</h3>
              <p className="text-sm text-gray-600 mt-1">
                Record fish box shipments
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
