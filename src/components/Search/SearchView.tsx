import React, { useState } from 'react';
import { Search, Filter, Download, Eye } from 'lucide-react';
import { useCustomers } from '../../hooks/useCustomers';
import { Database } from '../../lib/supabase';

type Customer = Database['public']['Tables']['customers']['Row'];

export function SearchView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const { searchCustomers } = useCustomers();

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setHasSearched(true);
    
    try {
      const { data } = await searchCustomers(searchTerm);
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Search & Retrieve</h1>
        <p className="text-gray-600 mt-2 text-lg">Find customer information quickly</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
        <div className="flex gap-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Search by customer name, unique ID, or tracking number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-12 pr-6 py-5 text-xl rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-teal-100 focus:border-teal-400 transition-all placeholder-gray-400"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!searchTerm.trim() || loading}
            className="bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 text-white px-10 py-5 rounded-2xl font-bold hover:from-teal-600 hover:via-emerald-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Searching...
              </div>
            ) : (
              'Search'
            )}
          </button>
        </div>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100">
          <div className="p-8 border-b-2 border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Search Results ({searchResults.length})
              </h2>
              {searchResults.length > 0 && (
                <button className="flex items-center space-x-3 px-6 py-3 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 transition-all font-semibold">
                  <Download className="w-5 h-5" />
                  <span>Export Results</span>
                </button>
              )}
            </div>
          </div>

          {searchResults.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No results found</h3>
              <p className="text-gray-600 text-lg">
                No customers match your search criteria. Try different keywords.
              </p>
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
                  {searchResults.map((customer) => (
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
                        <button className="text-teal-600 hover:text-teal-900 flex items-center space-x-2 font-semibold">
                          <Eye className="w-5 h-5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}