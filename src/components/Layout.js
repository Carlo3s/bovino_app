import React from 'react';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = ({ children, pages }) => {
  return (
    <div className="layout">
      <Sidebar pages={pages} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout; 