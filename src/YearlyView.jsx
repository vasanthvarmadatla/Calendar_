import React from 'react';
import dayjs from 'dayjs';
import './MonthGrid.css';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function getMonthMatrix(year, month) {
  const startOfMonth = dayjs(`${year}-${month + 1}-01`);
  const startDay = startOfMonth.day();
  const daysInMonth = startOfMonth.daysInMonth();
  const matrix = [];
  let day = 1 - startDay;
  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let d = 0; d < 7; d++, day++) {
      if (day < 1) {
        week.push(null);
      } else if (day > daysInMonth) {
        week.push(null);
      } else {
        week.push(day);
      }
    }
    matrix.push(week);
  }
  return matrix;
}

export default function YearlyView({ year, events, onEventClick, onMonthClick, onDateClick, onYearChange }) {
  const today = dayjs();
  return (
    <div className="yearly-view-outer">
      <div className="yearly-view-toolbar">
        <button className="calendar-nav-btn" onClick={() => onYearChange && onYearChange(year - 1)}>&lt;</button>
        <span className="yearly-view-year-label">{year}</span>
        <button className="calendar-nav-btn" onClick={() => onYearChange && onYearChange(year + 1)}>&gt;</button>
        {year === today.year() && (
          <>
            <button className="calendar-today-btn" style={{marginLeft: 16}} onClick={() => onDateClick(today.year(), today.month(), today.date())}>Go to Today</button>
            <button className="calendar-today-btn" style={{marginLeft: 8}} onClick={() => onMonthClick && onMonthClick(today.month())}>Current Month</button>
            <button className="calendar-today-btn" style={{marginLeft: 8}} onClick={() => onDateClick(today.year(), today.month(), today.date() - today.day())}>Current Week</button>
          </>
        )}
      </div>
      <div className="yearly-view-grid">
        {MONTHS.map((m, idx) => (
          <div className="mini-month" key={m}>
            <div className="mini-month-title" onClick={() => onMonthClick && onMonthClick(idx)} style={{cursor:'pointer'}}>{m} {year}</div>
            <div className="mini-month-header">
              {["S","M","T","W","T","F","S"].map(d => (
                <div key={d} className="mini-month-header-cell">{d}</div>
              ))}
            </div>
            <div className="mini-month-body">
              {getMonthMatrix(year, idx).map((week, i) => (
                <div className="mini-month-row" key={i}>
                  {week.map((day, j) => {
                    const isToday = day && year === today.year() && idx === today.month() && day === today.date();
                    return (
                      <div
                        className={`mini-month-cell${day ? '' : ' empty'}${isToday ? ' today' : ''}`}
                        key={j}
                        onClick={() => day && onDateClick && onDateClick(year, idx, day)}
                        style={day ? {cursor:'pointer'} : {}}
                      >
                        {day || ''}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
