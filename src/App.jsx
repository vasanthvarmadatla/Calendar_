import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import CalendarOverlay from './Calendar';
import MonthGrid from './MonthGrid';
import EventModal from './EventModal';
import YearlyView from './YearlyView';
import WeeklyView from './WeeklyView';
import DailyView from './DailyView';
import EventFormModal from './EventFormModal';
import './App.css';
import './YearScrollPicker.css';

const VIEWS = {
  month: 'Monthly View',
  year: 'Yearly View',
  week: 'Weekly View',
  day: 'Daily View',
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function App() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [day, setDay] = useState(today.getDate());
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDateEvents, setSelectedDateEvents] = useState(null);
  const [view, setView] = useState('month');
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [historyStack, setHistoryStack] = useState([]);
  const isPopping = useRef(false);
  const yearScrollRef = useRef(null);

  useEffect(() => {
    fetch('/data/events.json')
      .then(res => res.json())
      .then(setEvents);
  }, []);

  // Push state to browser history and our stack
  const pushHistory = (newState) => {
    if (!isPopping.current) {
      window.history.pushState(newState, '', '');
      setHistoryStack((stack) => [...stack, newState]);
    }
  };

  // Listen for browser back/forward
  useEffect(() => {
    const onPopState = (e) => {
      isPopping.current = true;
      const state = e.state;
      if (state) {
        setView(state.view);
        setYear(state.year);
        setMonth(state.month);
        setDay(state.day);
      }
      setTimeout(() => { isPopping.current = false; }, 0);
    };
    window.addEventListener('popstate', onPopState);
    // Initial state
    window.history.replaceState({ view, year, month, day }, '', '');
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Wrap all navigation changes to push to history
  const navigate = (newView, newYear = year, newMonth = month, newDay = day) => {
    pushHistory({ view: newView, year: newYear, month: newMonth, day: newDay });
    setView(newView);
    setYear(newYear);
    setMonth(newMonth);
    setDay(newDay);
  };

  const handlePrevMonth = () => {
    if (month === 0) {
      setYear(y => y - 1);
      setMonth(11);
    } else {
      setMonth(m => m - 1);
    }
  };
  const handleNextMonth = () => {
    if (month === 11) {
      setYear(y => y + 1);
      setMonth(0);
    } else {
      setMonth(m => m + 1);
    }
  };

  // Show all events for a clicked date
  const handleDateClick = (date, dayEvents) => {
    if (dayEvents.length > 0) {
      setSelectedEvent(null); // Close any open event modal
      setSelectedDateEvents({ date, events: dayEvents });
    }
  };

  // Sidebar menu click handler
  const handleMenuClick = (label) => {
    if (label === VIEWS.month) navigate('month');
    else if (label === VIEWS.year) navigate('year');
    else if (label === VIEWS.week) navigate('week', year, month, today.getDate());
    else if (label === VIEWS.day) navigate('day', year, month, today.getDate());
  };

  // Month picker logic
  const handleMonthTitleClick = () => setShowMonthPicker(true);
  const handleYearTitleClick = () => setShowYearPicker(true);
  const handleMonthSelect = (m) => {
    setMonth(m);
    setShowMonthPicker(false);
  };
  const handleYearSelect = (y) => {
    setYear(y);
    setShowYearPicker(false);
  };

  // Go to today handler
  const handleGoToToday = () => {
    navigate('month', today.getFullYear(), today.getMonth(), today.getDate());
  };

  // Add handler for yearly view year navigation
  const handleYearChange = (newYear) => {
    navigate('year', newYear);
  };

  const handleYearlyMonthClick = (m) => navigate('month', year, m);
  const handleYearlyDateClick = (y, m, d) => navigate('day', y, m, d);

  // Custom Year Scroll Picker
  const renderYearScrollPicker = () => {
    const years = Array.from({length: 25}, (_, i) => year - 12 + i);
    // Center selected year
    setTimeout(() => {
      if (yearScrollRef.current) {
        const selected = yearScrollRef.current.querySelector('.year-scroll-item.selected');
        if (selected) {
          yearScrollRef.current.scrollTop = selected.offsetTop - yearScrollRef.current.offsetHeight / 2 + selected.offsetHeight / 2;
        }
      }
    }, 10);
    return (
      <div className="year-scroll-modal" onClick={() => setShowYearPicker(false)}>
        <div className="year-scroll-content" onClick={e => e.stopPropagation()}>
          <button className="event-modal-close" onClick={() => setShowYearPicker(false)}>&times;</button>
          <h2 className="event-modal-title">Select Year</h2>
          <div className="year-scroll-list" ref={yearScrollRef}>
            {years.map(y => (
              <div
                key={y}
                className={`year-scroll-item${y === year ? ' selected' : ''}`}
                onClick={() => { setYear(y); setShowYearPicker(false); }}
              >
                {y}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Format today's date for display
  const todayString = `Today: ${MONTHS[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;

  // Add event handler
  const handleAddEvent = (event) => {
    setEvents((prev) => [...prev, event]);
  };

  return (
    <div className="app-root">
      <Sidebar onMenuClick={handleMenuClick} />
      <main className="main-content">
        <button className="add-event-btn" onClick={() => setShowAddEvent(true)}>+ Add Event</button>
        <CalendarOverlay>
          {view === 'month' && (
            <>
              <div className="calendar-header">
                <button className="calendar-nav-btn" onClick={handlePrevMonth}>&lt;</button>
                <span className="calendar-title" style={{cursor:'pointer'}}>
                  <span onClick={handleMonthTitleClick}>{MONTHS[month]}</span>
                  {' '}
                  <span onClick={handleYearTitleClick}>{year}</span>
                </span>
                <button className="calendar-nav-btn" onClick={handleNextMonth}>&gt;</button>
                <button className="calendar-today-btn" onClick={handleGoToToday}>{todayString}</button>
              </div>
              <MonthGrid
                year={year}
                month={month}
                events={events}
                onEventClick={setSelectedEvent}
                onDateClick={handleDateClick}
              />
              {showMonthPicker && (
                <div className="month-picker-modal" onClick={() => setShowMonthPicker(false)}>
                  <div className="month-picker-content" onClick={e => e.stopPropagation()}>
                    <button className="event-modal-close" onClick={() => setShowMonthPicker(false)}>&times;</button>
                    <h2 className="event-modal-title">Select Month</h2>
                    <div className="month-picker-grid">
                      {MONTHS.map((m, idx) => (
                        <button
                          key={m}
                          className={`month-picker-btn${idx === month ? ' selected' : ''}`}
                          onClick={() => handleMonthSelect(idx)}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {showYearPicker && (
                <div className="month-picker-modal" onClick={() => setShowYearPicker(false)}>
                  <div className="month-picker-content" onClick={e => e.stopPropagation()}>
                    <button className="event-modal-close" onClick={() => setShowYearPicker(false)}>&times;</button>
                    <h2 className="event-modal-title">Select Year</h2>
                    <div className="month-picker-grid" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
                      {Array.from({length: 24}, (_, i) => year - 10 + i).map(y => (
                        <button
                          key={y}
                          className={`month-picker-btn${y === year ? ' selected' : ''}`}
                          onClick={() => handleYearSelect(y)}
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          {view === 'year' && (
            <YearlyView
              year={year}
              events={events}
              onEventClick={setSelectedEvent}
              onMonthClick={handleYearlyMonthClick}
              onDateClick={handleYearlyDateClick}
              onYearChange={handleYearChange}
            />
          )}
          {view === 'week' && <WeeklyView year={year} month={month} day={day} events={events} onEventClick={setSelectedEvent} onWeekChange={(y, m, d) => { setYear(y); setMonth(m); setDay(d); }} />}
          {view === 'day' && <DailyView year={year} month={month} day={day} events={events} onEventClick={setSelectedEvent} onDateChange={(y, m, d) => { setYear(y); setMonth(m); setDay(d); }} />}
        </CalendarOverlay>
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        <EventFormModal open={showAddEvent} onClose={() => setShowAddEvent(false)} onAdd={handleAddEvent} />
        {selectedDateEvents && (
          <div className="date-tasks-modal" onClick={() => setSelectedDateEvents(null)}>
            <div className="date-tasks-modal-content" onClick={e => e.stopPropagation()}>
              <button className="event-modal-close" onClick={() => setSelectedDateEvents(null)}>&times;</button>
              <h2 className="event-modal-title">Tasks for {selectedDateEvents.date.format('YYYY-MM-DD')}</h2>
              {selectedDateEvents.events.map(ev => (
                <div
                  key={ev.id}
                  className="event-chip"
                  style={{ background: `var(--event-color-${ev.id % 5})` }}
                  onClick={() => {
                    setSelectedDateEvents(null); // Close date modal
                    setSelectedEvent(ev); // Open event modal
                  }}
                  title={ev.title}
                >
                  <strong>{ev.title}</strong> <span style={{fontWeight:400}}>- {ev.time} ({ev.duration})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
