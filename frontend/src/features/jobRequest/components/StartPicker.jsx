import { useState } from 'react';

export default function StarPicker({ value, onChange, readOnly = false }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(n)}
          onMouseEnter={() => !readOnly && setHovered(n)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          className={`text-2xl leading-none transition-colors ${readOnly ? 'cursor-default' : 'cursor-pointer'} ${
            n <= display ? 'text-amber-400' : 'text-gray-200'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}