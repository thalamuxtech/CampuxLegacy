'use client';

import { motion } from 'framer-motion';

export function ClassChart({ data }: { data: { year: number; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const W = 720;
  const H = 220;
  const pad = 24;
  const stepX = (W - pad * 2) / Math.max(data.length - 1, 1);
  const points = data.map((d, i) => {
    const x = pad + i * stepX;
    const y = H - pad - ((d.count / max) * (H - pad * 2));
    return { ...d, x, y };
  });
  const path = points
    .map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`))
    .join(' ');
  const fill = `${path} L${points[points.length - 1].x},${H - pad} L${points[0].x},${H - pad} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[220px]">
        <defs>
          <linearGradient id="cl-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#B8854A" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#B8854A" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={pad}
            x2={W - pad}
            y1={H - pad - t * (H - pad * 2)}
            y2={H - pad - t * (H - pad * 2)}
            stroke="rgba(11,11,15,0.06)"
            strokeDasharray="3 4"
          />
        ))}
        <motion.path
          d={fill}
          fill="url(#cl-fill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />
        <motion.path
          d={path}
          fill="none"
          stroke="#B8854A"
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />
        {points.map((p, i) => (
          <g key={p.year}>
            <motion.circle
              cx={p.x}
              cy={p.y}
              r={5}
              fill="#0B0B0F"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.06, type: 'spring' }}
            />
            <circle cx={p.x} cy={p.y} r={9} fill="#B8854A" fillOpacity="0.18" />
            <text
              x={p.x}
              y={H - 6}
              textAnchor="middle"
              fontSize="11"
              fill="rgba(11,11,15,0.55)"
            >
              {p.year}
            </text>
            <text
              x={p.x}
              y={p.y - 12}
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              fill="#0B0B0F"
            >
              {p.count}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
