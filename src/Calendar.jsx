import React from 'react';
import './Calendar.css';

export default function CalendarOverlay({ children }) {
  return (
    <div className="calendar-overlay">
      {children}
    </div>
  );
}
