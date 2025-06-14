import React, { useState } from 'react';
import './EventModal.css';

export default function EventFormModal({ open, onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('');

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !date || !time) return;
    onAdd({
      id: Date.now(),
      title,
      date,
      time,
      duration: duration || '1h',
    });
    setTitle('');
    setDate('');
    setTime('');
    setDuration('');
    onClose();
  };

  return (
    <div className="event-modal-backdrop" onClick={onClose}>
      <div className="event-modal" onClick={e => e.stopPropagation()}>
        <button className="event-modal-close" onClick={onClose}>&times;</button>
        <h2 className="event-modal-title">Add New Event</h2>
        <form className="event-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input value={title} onChange={e => setTitle(e.target.value)} required />
          </label>
          <label>
            Date
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
          </label>
          <label>
            Time
            <input type="time" value={time} onChange={e => setTime(e.target.value)} required />
          </label>
          <label>
            Duration
            <input value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g. 1h, 30m" />
          </label>
          <button type="submit" className="event-modal-add-btn">Add Event</button>
        </form>
      </div>
    </div>
  );
}
