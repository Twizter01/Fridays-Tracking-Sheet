import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Download,
  Upload,
  Filter,
  MoreVertical
} from 'lucide-react';
import { useCustomers } from '../../hooks/useCustomers';
import { useAuth } from '../../hooks/useAuth';
import { CustomerModal } from './CustomerModal';
import { Database } from '../../lib/supabase';

type Customer = Database['public']['Tables']['customers']['Row'];

export function CustomerTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showMenu, setShowMenu] = useState<string | null>(null);

  const { customers, loading, createCustomer, updateCustomer, deleteCustomer, searchCustomers } = useCustomers();
  const { user } = useAuth();

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.unique_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.tracking_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateCustomer = () => {
    setSelectedCustomer(null);
    setIsModalOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
    setShowMenu(null);
  };

  const handleDeleteCustomer = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer record?')) {
      await deleteCustomer(id);
    }
    setShowMenu(null);
  };

  const handleSaveCustomer = async (customerData: any) => {
    try {
      if (selectedCustomer) {
        await updateCustomer(selectedCustomer.id, customerData);
      } else {
        await createCustomer({
          ...customerData,
          created_by: user?.id || '',
        });
      }
      setIsModalOpen(false);
      setSelectedCustomer(null);
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'completed':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Customer Tracking</h1>
          <p className="text-gray-600 mt-2 text-lg">Manage and track customer information</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-3 px-6 py-3 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 transition-all font-semibold">
            <Upload className="w-5 h-5" />
            <span>Import</span>
          </button>
          <button className="flex items-center space-x-3 px-6 py-3 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 transition-all font-semibold">
            <Download className="w-5 h-5" />
            <span>Export</span>
          </button>
          <button
            onClick={handleCreateCustomer}
            className="bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 text-white px-8 py-3 rounded-2xl font-bold hover:from-teal-600 hover:via-emerald-600 hover:to-cyan-600 transition-all flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Search by name, ID, or tracking number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-teal-100 focus:border-teal-400 transition-all text-lg placeholder-gray-400"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-6 py-4 rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-teal-100 focus:border-teal-400 transition-all text-lg font-semibold"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full flex items-center justify-center">
              <Plus className="w-16 h-16 text-teal-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No customers found</h3>
            <p className="text-gray-600 mb-8 text-lg">Get started by adding your first customer</p>
            <button
              onClick={handleCreateCustomer}
              className="bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 text-white px-8 py-4 rounded-2xl font-bold hover:from-teal-600 hover:via-emerald-600 hover:to-cyan-600 transition-all shadow-lg"
            >
              Add Customer
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-teal-50 to-emerald-50 border-b-2 border-gray-100">
                <tr>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Customer Name
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Unique ID
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Tracking Number
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y-2 divide-gray-50">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="font-bold text-gray-900 text-lg">{customer.customer_name}</div>
                      {customer.notes && (
                        <div className="text-sm text-gray-500 truncate max-w-xs mt-1">{customer.notes}</div>
                      )}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-sm font-mono font-bold text-gray-900 bg-gray-100 px-3 py-2 rounded-xl">
                        {customer.unique_id}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-sm font-mono font-bold text-teal-700 bg-teal-50 px-3 py-2 rounded-xl">
                        {customer.tracking_number}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className={`inline-flex px-4 py-2 text-sm font-bold rounded-2xl border-2 ${getStatusColor(customer.status)}`}>
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-500 font-medium">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button
                          onClick={() => setShowMenu(showMenu === customer.id ? null : customer.id)}
                          className="p-3 hover:bg-gray-100 rounded-2xl transition-all"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-500" />
                        </button>
                        
                        {showMenu === customer.id && (
                          <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-xl border-2 border-gray-100 py-3 z-10 min-w-[140px]">
                            <button
                              onClick={() => handleEditCustomer(customer)}
                              className="w-full px-6 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 font-semibold"
                            >
                              <Edit className="w-4 h-4" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteCustomer(customer.id)}
                              className="w-full px-6 py-3 text-left hover:bg-gray-50 text-red-600 flex items-center space-x-3 font-semibold"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Modal */}
      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCustomer}
        customer={selectedCustomer}
      />
    </div>
  );
}