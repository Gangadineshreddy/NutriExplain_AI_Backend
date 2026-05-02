import React from 'react';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

const DesktopLayout = ({ children }) => {
  return (
    <div className="desktop-layout">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

export default DesktopLayout;
