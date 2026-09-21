import React from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isIde = location.pathname === '/ide';

  return (
    <div className="sidebar-layout">
      <Navbar />
      <div className="sidebar-page">
        <main className={`flex-1 ${isIde ? 'h-screen' : ''}`}>
          {children}
        </main>
        {!isIde && <Footer />}
      </div>
    </div>
  );
};
