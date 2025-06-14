import React from 'react';
import './EventModal.css';

export default function EventModal({ event, onClose }) {
  if (!event) return null;
  return (
    <div className="event-modal-backdrop" onClick={onClose}>
      <div className="event-modal" onClick={e => e.stopPropagation()}>
        <button className="event-modal-close" onClick={onClose}>&times;</button>
        <h2 className="event-modal-title">{event.title}</h2>
        <div className="event-modal-detail">
          <span>Date:</span> {event.date}
        </div>
        <div className="event-modal-detail">
          <span>Time:</span> {event.time}
        </div>
        <div className="event-modal-detail">
          <span>Duration:</span> {event.duration}
        </div>
      </div>
    </div>
  );
}
