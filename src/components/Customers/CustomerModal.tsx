import React, { useState, useEffect } from 'react';
import { X, User, Hash, Package } from 'lucide-react';
import { Database } from '../../lib/supabase';

type Customer = Database['public']['Tables']['customers']['Row'];

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customerData: any) => void;
  customer?: Customer | null;
}

export function CustomerModal({ isOpen, onClose, onSave, customer }: CustomerModalProps) {
  const [formData, setFormData] = useState({
    customer_name: '',
    unique_id: '',
    tracking_number: '',
    status: 'active' as const,
    notes: '',
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        customer_name: customer.customer_name,
        unique_id: customer.unique_id,
        tracking_number: customer.tracking_number,
        status: customer.status,
        notes: customer.notes || '',
      });
    } else {
      setFormData({
        customer_name: '',
        unique_id: '',
        tracking_number: '',
        status: 'active',
        notes: '',
      });
    }
  }, [customer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="flex items-center justify-between p-8 border-b-2 border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900">
            {customer ? 'Edit Customer' : 'Add New Customer'}
          </h2>
          <button
            onClick={onClose}
            className="p-3 hover:bg-gray-100 rounded-2xl transition-all"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div>
            <label htmlFor="customer_name" className="block text-sm font-bold text-gray-700 mb-3">
              <User className="w-5 h-5 inline mr-2" />
              Customer Name
            </label>
            <input
              type="text"
              id="customer_name"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              required
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-teal-100 focus:border-teal-400 transition-all text-lg placeholder-gray-400"
              placeholder="Enter customer name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label htmlFor="unique_id" className="block text-sm font-bold text-gray-700 mb-3">
                <Hash className="w-5 h-5 inline mr-2" />
                Unique ID
              </label>
              <input
                type="text"
                id="unique_id"
                name="unique_id"
                value={formData.unique_id}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-teal-100 focus:border-teal-400 transition-all font-mono text-lg placeholder-gray-400"
                placeholder="Enter unique ID"
              />
            </div>

            <div>
              <label htmlFor="tracking_number" className="block text-sm font-bold text-gray-700 mb-3">
                <Package className="w-5 h-5 inline mr-2" />
                Tracking Number
              </label>
              <input
                type="text"
                id="tracking_number"
                name="tracking_number"
                value={formData.tracking_number}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-teal-100 focus:border-teal-400 transition-all font-mono text-lg placeholder-gray-400"
                placeholder="Enter tracking number"
              />
            </div>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-bold text-gray-700 mb-3">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-teal-100 focus:border-teal-400 transition-all text-lg font-semibold"
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-bold text-gray-700 mb-3">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-teal-100 focus:border-teal-400 transition-all text-lg placeholder-gray-400"
              placeholder="Enter any additional notes"
            />
          </div>

          <div className="flex items-center justify-end space-x-6 pt-8 border-t-2 border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 text-gray-700 hover:text-gray-900 font-bold transition-all text-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 text-white rounded-2xl font-bold hover:from-teal-600 hover:via-emerald-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {customer ? 'Update Customer' : 'Add Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}