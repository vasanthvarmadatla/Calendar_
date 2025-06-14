import React from 'react';
import './Sidebar.css';

const menuItems = [
  { icon: '📅', label: 'Monthly View' },
  { icon: '📆', label: 'Yearly View' },
  { icon: '🗓️', label: 'Weekly View' },
  { icon: '🧾', label: 'Daily View' },
];

export default function Sidebar({ onMenuClick }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-gradient" />
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className="sidebar-btn"
            onClick={() => onMenuClick && onMenuClick(item.label)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
