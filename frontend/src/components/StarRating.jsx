import React from 'react';

export default function StarRating({ rating, onChange, interactive = false }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="star-rating" style={{ display: 'flex', gap: '0.25rem' }}>
      {stars.map(star => (
        <span
          key={star}
          style={{
            cursor: interactive ? 'pointer' : 'default',
            fontSize: '1.25rem',
            opacity: star <= rating ? 1 : 0.25,
            transition: 'opacity 0.2s ease'
          }}
          onClick={() => interactive && onChange && onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}
