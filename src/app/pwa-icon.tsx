import React from 'react';

type PwaIconProps = {
  size: number;
};

export function PwaIcon({ size }: PwaIconProps) {
  const stroke = Math.max(10, Math.round(size * 0.07));
  const dot = Math.round(size * 0.09);
  const radius = Math.round(size * 0.26);
  const startX = Math.round(size * 0.3);
  const startY = Math.round(size * 0.6);
  const middleX = Math.round(size * 0.45);
  const middleY = Math.round(size * 0.45);
  const endX = Math.round(size * 0.68);
  const endY = Math.round(size * 0.28);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'linear-gradient(145deg, rgba(7,17,31,1) 0%, rgba(10,20,36,1) 45%, rgba(5,10,20,1) 100%)',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="panel-icon-gradient" x1="0" y1="0" x2={size} y2={size}>
            <stop offset="0%" stopColor="#67E8F9" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
        </defs>

        <rect
          x={Math.round(size * 0.12)}
          y={Math.round(size * 0.12)}
          width={Math.round(size * 0.76)}
          height={Math.round(size * 0.76)}
          rx={radius}
          fill="rgba(103,232,249,0.12)"
          stroke="rgba(103,232,249,0.32)"
          strokeWidth={Math.max(2, Math.round(size * 0.015))}
        />

        <path
          d={`M ${startX} ${startY} L ${middleX} ${middleY} L ${Math.round(
            size * 0.53
          )} ${Math.round(size * 0.53)} L ${endX} ${endY}`}
          stroke="url(#panel-icon-gradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle
          cx={endX}
          cy={endY}
          r={dot}
          fill="#67E8F9"
        />
      </svg>
    </div>
  );
}
