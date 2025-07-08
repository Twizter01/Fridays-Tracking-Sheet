import React from 'react';
import { Bell, User, ChevronDown } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-100 px-8 py-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-600 mt-2 text-lg">{subtitle}</p>}
        </div>
        
        <div className="flex items-center space-x-6">
          <button className="relative p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-teal-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              3
            </span>
          </button>
          
          <div className="flex items-center space-x-4 bg-gray-50 rounded-2xl p-3 hover:bg-gray-100 cursor-pointer transition-all">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 via-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-md">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-bold text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500 font-medium">Administrator</p>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-500" />
          </div>
        </div>
      </div>
    </header>
  );
}