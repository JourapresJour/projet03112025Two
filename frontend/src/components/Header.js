import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">inventoryHub</h1>
        <p className="header-subtitle">Full-Stack Inventory Management System</p>
      </div>
    </header>
  );
};

export default Header;