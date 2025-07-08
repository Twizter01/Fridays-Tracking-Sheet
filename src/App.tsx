import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { AuthForm } from './components/Auth/AuthForm';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { CustomerTable } from './components/Customers/CustomerTable';
import { SearchView } from './components/Search/SearchView';

function App() {
  const { user, loading } = useAuth();
  const [activeView, setActiveView] = useState('customers');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const getViewTitle = () => {
    switch (activeView) {
      case 'customers':
        return 'Customer Tracking';
      case 'search':
        return 'Search & Retrieve';
      case 'settings':
        return 'Settings';
      default:
        return 'Customer Tracking';
    }
  };

  const getViewSubtitle = () => {
    switch (activeView) {
      case 'customers':
        return 'Manage and track customer information';
      case 'search':
        return 'Find customer information quickly';
      case 'settings':
        return 'Configure your application settings';
      default:
        return 'Manage and track customer information';
    }
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'customers':
        return <CustomerTable />;
      case 'search':
        return <SearchView />;
      case 'settings':
        return <div className="text-center py-12">Settings view coming soon...</div>;
      default:
        return <CustomerTable />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50">
      <div className="flex">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <div className="flex-1">
          <Header title={getViewTitle()} subtitle={getViewSubtitle()} />
          <main className="p-8">
            {renderActiveView()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;