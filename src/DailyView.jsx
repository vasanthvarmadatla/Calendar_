import React, { useState } from 'react';
import dayjs from 'dayjs';
import './MonthGrid.css';

function formatHour12(hour) {
  const h = hour % 12 === 0 ? 12 : hour % 12;
  const ampm = hour < 12 ? 'AM' : 'PM';
  return `${h} ${ampm}`;
}

export default function DailyView({ year, month, day, events, onEventClick, onDateChange }) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const date = dayjs(`${year}-${month + 1}-${day}`);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const dayEvents = events.filter(e => dayjs(e.date).isSame(date, 'day'));

  const handleDateChange = (e) => {
    setShowDatePicker(false);
    if (onDateChange) {
      const d = dayjs(e.target.value);
      onDateChange(d.year(), d.month(), d.date());
    }
  };

  return (
    <div className="daily-view-grid">
      <div className="daily-view-header">
        <button className="daily-view-date-btn" onClick={() => setShowDatePicker(true)} title="Change date">
          <span role="img" aria-label="calendar">📅</span>
        </button>
        <span style={{marginLeft: 12}}>{date.format('dddd, MMMM D, YYYY')}</span>
        {(!date.isSame(dayjs(), 'day')) && (
          <button className="calendar-today-btn" style={{marginLeft: 16}} onClick={() => onDateChange(dayjs().year(), dayjs().month(), dayjs().date())}>Today</button>
        )}
        {showDatePicker && (
          <div className="daily-view-date-modal" onClick={() => setShowDatePicker(false)}>
            <div className="daily-view-date-modal-content" onClick={e => e.stopPropagation()}>
              <input
                type="date"
                defaultValue={date.format('YYYY-MM-DD')}
                onChange={handleDateChange}
                className="daily-view-date-input"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
      <div className="daily-view-body">
        {hours.map(h => (
          <div className="daily-view-row" key={h}>
            <div className="daily-view-hour">{formatHour12(h)}</div>
            <div className="daily-view-events">
              {dayEvents.filter(ev => parseInt(ev.time?.split(':')[0], 10) === h).map(ev => (
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
          </div>
        ))}
      </div>
    </div>
  );
}
