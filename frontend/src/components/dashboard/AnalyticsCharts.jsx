import { useState } from 'react';

export function DoughnutChart({ data = [], title }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 8;

  let accumulatedLength = 0;

  return (
    <div className="flex flex-col h-full bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm transition-all duration-300 hover:shadow-md">
      {title && (
        <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">
          {title}
        </h3>
      )}
      <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-6 mt-2">
        <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {total === 0 ? (
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke="#f1f5f9"
                strokeWidth={strokeWidth}
              />
            ) : (
              data.map((item, index) => {
                const strokeLength = (item.value / total) * circumference;
                const strokeOffset = -accumulatedLength;
                accumulatedLength += strokeLength;

                const isHovered = hoveredIndex === index;

                return (
                  <circle
                    key={index}
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth={isHovered ? strokeWidth + 2 : strokeWidth}
                    strokeDasharray={`${strokeLength} ${circumference - strokeLength}`}
                    strokeDashoffset={strokeOffset}
                    className="transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                );
              })
            )}
          </svg>
          <div className="absolute flex flex-col items-center text-center">
            {hoveredIndex !== null ? (
              <>
                <span className="text-2xl font-black text-slate-900 leading-none">
                  {total > 0 ? `${Math.round((data[hoveredIndex].value / total) * 100)}%` : '0%'}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1 max-w-[80px] truncate">
                  {data[hoveredIndex].label}
                </span>
              </>
            ) : (
              <>
                <span className="text-2xl font-black text-slate-900 leading-none">{total}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                  Total
                </span>
              </>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full flex flex-col gap-2">
          {data.map((item, index) => {
            const isHovered = hoveredIndex === index;
            const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
            return (
              <div
                key={index}
                className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer ${
                  isHovered ? 'bg-slate-50 scale-[1.02]' : 'hover:bg-slate-50/50'
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="h-3 w-3 rounded-full shrink-0 transition-transform duration-300"
                    style={{
                      backgroundColor: item.color,
                      transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                    }}
                  />
                  <span className="text-xs font-bold text-slate-650 truncate">{item.label}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-extrabold text-slate-900">{item.value}</span>
                  <span className="text-[10px] font-bold text-slate-400">({percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function BarChart({ data = [], title }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const maxVal = Math.max(...data.map((d) => d.value), 0);

  const getNiceMaxValue = (max) => {
    if (max <= 5) return 5;
    if (max <= 10) return 10;
    if (max <= 50) return Math.ceil(max / 5) * 5;
    if (max <= 100) return Math.ceil(max / 10) * 10;
    return Math.ceil(max / 50) * 50;
  };

  const niceMax = getNiceMaxValue(maxVal);
  const gridLines = [0, niceMax * 0.25, niceMax * 0.5, niceMax * 0.75, niceMax];

  return (
    <div className="flex flex-col h-full bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm transition-all duration-300 hover:shadow-md">
      {title && (
        <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">
          {title}
        </h3>
      )}

      <div className="flex-1 flex flex-col justify-end min-h-[220px] relative mt-4">
        {/* Y-Axis Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pt-2">
          {gridLines.slice().reverse().map((val, idx) => (
            <div key={idx} className="w-full flex items-center border-t border-slate-100 relative h-0">
              <span className="absolute -left-7 text-[9px] font-extrabold text-slate-400 select-none">
                {Math.round(val)}
              </span>
            </div>
          ))}
        </div>

        {/* Bars Container */}
        <div className="relative z-10 w-full h-full flex items-end justify-around pl-4 pb-8 pt-2">
          {data.map((item, index) => {
            const heightPercent = niceMax > 0 ? (item.value / niceMax) * 100 : 0;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={index}
                className="flex flex-col items-center flex-1 max-w-[64px] mx-1 relative cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Custom Tooltip */}
                <div
                  className={`absolute -top-11 bg-slate-900 text-white text-[10px] font-bold py-1.5 px-2.5 rounded-xl shadow-md transition-all duration-200 pointer-events-none flex flex-col items-center z-20 ${
                    isHovered ? 'opacity-100 scale-100 -translate-y-1' : 'opacity-0 scale-95 translate-y-2'
                  }`}
                >
                  <span className="whitespace-nowrap">{item.value}</span>
                  <div className="w-1.5 h-1.5 bg-slate-900 rotate-45 mt-1 -mb-1 shrink-0" />
                </div>

                {/* The Bar */}
                <div className="w-full bg-slate-50/50 hover:bg-slate-50 rounded-2xl h-44 flex items-end overflow-hidden border border-slate-100/50 shadow-inner">
                  <div
                    style={{
                      height: `${heightPercent}%`,
                      backgroundColor: item.color || '#4f46e5',
                    }}
                    className={`w-full rounded-t-xl transition-all duration-500 ease-out origin-bottom ${
                      isHovered ? 'brightness-110 shadow-md scale-x-[1.02]' : ''
                    }`}
                  />
                </div>

                {/* X-Axis Label */}
                <span
                  className={`absolute bottom-[-24px] text-[10px] font-bold uppercase tracking-wider transition-colors w-full text-center truncate px-0.5 ${
                    isHovered ? 'text-slate-800' : 'text-slate-400'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
