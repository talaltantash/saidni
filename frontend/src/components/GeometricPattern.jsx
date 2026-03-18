import React from 'react';

export default function GeometricPattern() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        opacity: 0.15
      }}
    >
      <defs>
        <pattern id="geometric" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="1" fill="white" />
          <path d="M10,5 L15,10 L10,15 L5,10 Z" fill="none" stroke="white" strokeWidth="0.5" />
          <path d="M10,5 L13,8 L13,13 L10,15 L7,13 L7,8 Z" fill="none" stroke="white" strokeWidth="0.3" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#geometric)" />
    </svg>
  );
}
