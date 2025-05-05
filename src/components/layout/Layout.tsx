import React, { ReactNode } from 'react';
import Sidebar from '../sidebar/Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;