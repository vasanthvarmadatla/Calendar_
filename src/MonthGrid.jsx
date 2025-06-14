import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import './MonthGrid.css';

function getMonthMatrix(year, month) {
  const startOfMonth = dayjs(`${year}-${month + 1}-01`);
  const startDay = startOfMonth.day();
  const daysInMonth = startOfMonth.daysInMonth();
  const prevMonthDays = startOfMonth.subtract(1, 'month').daysInMonth();
  const matrix = [];
  let day = 1 - startDay;
  for (let w = 0; w < 6; w++) { // Always 6 weeks
    const week = [];
    for (let d = 0; d < 7; d++, day++) {
      if (day < 1) {
        week.push({
          date: dayjs(`${year}-${month}-01`).subtract(startDay - d, 'day'),
          current: false
        });
      } else if (day > daysInMonth) {
        week.push({
          date: dayjs(`${year}-${month + 1}-${daysInMonth}`).add(day - daysInMonth, 'day'),
          current: false
        });
      } else {
        week.push({
          date: dayjs(`${year}-${month + 1}-${day}`),
          current: true
        });
      }
    }
    matrix.push(week);
    // Removed early break to always have 6 rows
  }
  return matrix;
}

export default function MonthGrid({ year, month, events, onEventClick, onDateClick }) {
  const today = dayjs();
  const matrix = getMonthMatrix(year, month);

  function getEventsForDate(date) {
    return events.filter(e => dayjs(e.date).isSame(date, 'day'));
  }

  return (
    <div className="month-grid">
      <div className="month-grid-header">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
          <div key={d} className="month-grid-header-cell">{d}</div>
        ))}
      </div>
      <div className="month-grid-body">
        {matrix.map((week, i) => (
          <div className="month-grid-row" key={i}>
            {week.map(({ date, current }, j) => {
              const isToday = date.isSame(today, 'day');
              const dayEvents = getEventsForDate(date.format('YYYY-MM-DD'));
              const visibleEvents = dayEvents.slice(0, 2);
              const extraCount = dayEvents.length - 2;
              // Highlight Sundays
              const isSunday = date.day() === 0;
              return (
                <div
                  key={j}
                  className={`month-grid-cell${current ? '' : ' not-current'}${isToday ? ' today' : ''}`}
                  onClick={() => onDateClick && onDateClick(date, dayEvents)}
                >
                  <div className={`cell-date${isSunday ? ' sunday' : ''}`}>{date.date()}</div>
                  <div className="cell-events">
                    {visibleEvents.map(ev => (
                      <div
                        key={ev.id}
                        className="event-chip"
                        onClick={e => { e.stopPropagation(); onEventClick(ev); }}
                        style={{ background: `var(--event-color-${ev.id % 5})` }}
                        title={ev.title}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {extraCount > 0 && (
                      <div className="event-more">+{extraCount} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
