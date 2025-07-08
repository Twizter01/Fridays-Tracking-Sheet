import React from 'react';
import { 
  Users, 
  Search, 
  Settings, 
  LogOut,
  Plus,
  Activity
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const { signOut } = useAuth();

  const menuItems = [
    { id: 'customers', label: 'Customer Tracking', icon: Users },
    { id: 'search', label: 'Search & Retrieve', icon: Search },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="w-72 bg-white border-r border-gray-100 h-screen flex flex-col shadow-sm">
      <div className="p-8">
        <div className="flex items-center space-x-4 mb-10">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 via-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">TrackFlow</h1>
            <p className="text-sm text-gray-500 font-medium">Customer Management</p>
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 text-white py-4 px-6 rounded-2xl font-bold hover:from-teal-600 hover:via-emerald-600 hover:to-cyan-600 transition-all flex items-center justify-center space-x-3 mb-8 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
          <Plus className="w-5 h-5" />
          <span>Add Customer</span>
        </button>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search customers..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-300 transition-all placeholder-gray-400"
          />
        </div>
      </div>

      <nav className="flex-1 px-6">
        <ul className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-left transition-all font-semibold ${
                    activeView === item.id
                      ? 'bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-6">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center space-x-4 px-6 py-4 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all font-semibold"
        >
          <LogOut className="w-6 h-6" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}