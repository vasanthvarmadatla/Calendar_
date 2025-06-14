import React, { useState } from 'react';
import dayjs from 'dayjs';
import './MonthGrid.css';

function getWeekDates(year, month, day) {
  const date = dayjs(`${year}-${month + 1}-${day}`);
  const startOfWeek = date.startOf('week');
  return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day'));
}

function formatHour12(hour) {
  const h = hour % 12 === 0 ? 12 : hour % 12;
  const ampm = hour < 12 ? 'AM' : 'PM';
  return `${h} ${ampm}`;
}

export default function WeeklyView({ year, month, day, events, onEventClick, onWeekChange }) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const weekStart = dayjs(`${year}-${month + 1}-${day}`).startOf('week');
  const weekDates = getWeekDates(year, month, day);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const handleDateChange = (e) => {
    setShowDatePicker(false);
    if (onWeekChange) {
      const d = dayjs(e.target.value);
      onWeekChange(d.year(), d.month(), d.date());
    }
  };

  const handlePrevWeek = () => {
    const prev = weekStart.subtract(7, 'day');
    if (onWeekChange) onWeekChange(prev.year(), prev.month(), prev.date());
  };
  const handleNextWeek = () => {
    const next = weekStart.add(7, 'day');
    if (onWeekChange) onWeekChange(next.year(), next.month(), next.date());
  };

  return (
    <div className="weekly-view-grid">
      <div className="weekly-view-header">
        <div style={{height: 40}}></div>
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d, i) => (
          <div key={d} className="weekly-view-header-cell">
            {d} <span className="weekly-view-date">{weekDates[i].date()}</span>
          </div>
        ))}
      </div>
      {showDatePicker && (
        <div className="weekly-view-date-modal" onClick={() => setShowDatePicker(false)}>
          <div className="weekly-view-date-modal-content" onClick={e => e.stopPropagation()}>
            <input
              type="date"
              defaultValue={weekStart.format('YYYY-MM-DD')}
              onChange={handleDateChange}
              className="weekly-view-date-input"
              autoFocus
            />
          </div>
        </div>
      )}
      <div className="weekly-view-hours-body">
        {hours.map(hour => (
          <React.Fragment key={hour}>
            <div className="weekly-view-hour-label">{formatHour12(hour)}</div>
            {weekDates.map((date, i) => {
              const dayEvents = events.filter(e => dayjs(e.date).isSame(date, 'day'));
              const hourEvents = dayEvents.filter(ev => {
                const eventHour = parseInt(ev.time?.split(':')[0], 10);
                return eventHour === hour;
              });
              return (
                <div className="weekly-view-hour-cell" key={i}>
                  {hourEvents.map(ev => (
                    <div
                      key={ev.id}
                      className="event-chip"
                      style={{ background: `var(--event-color-${ev.id % 5})` }}
                      title={ev.title}
                      onClick={() => onEventClick && onEventClick(ev)}
                    >
                      {ev.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div className="weekly-view-bottom-bar">
        <button className="weekly-view-week-btn" onClick={handlePrevWeek} title="Previous week">&#8592;</button>
        <button className="weekly-view-week-btn" onClick={() => setShowDatePicker(true)} title="Change week">
          <span role="img" aria-label="calendar">📅</span>
        </button>
        <button className="weekly-view-week-btn" onClick={handleNextWeek} title="Next week">&#8594;</button>
        {!(weekStart.isSame(dayjs().startOf('week'), 'day')) && (
          <button className="weekly-view-reset-btn" onClick={() => onWeekChange(dayjs().year(), dayjs().month(), dayjs().date())}>This Week</button>
        )}
      </div>
    </div>
  );
}
