import React, { useEffect, useState } from 'react';
import './BloodStock.css';
import { getBloodStock } from '../../services/BloodStockService';
import { MAX_CAPACITY } from '../../constants/bloodCapacities';

function toFillPercent(label, totalFree) {
  const max = Number(MAX_CAPACITY[label] ?? 100);
  const free = Number(totalFree ?? 0);
  if (!Number.isFinite(max) || max <= 0) return 0;
  const raw = Math.round((free / max) * 100);
  return Math.max(0, Math.min(100, raw));
}

export function DropIcon({ fillPercent, id }) {
  const gradId = `grad-${id}`;
  return (
    <svg viewBox="0 0 64 64" preserveAspectRatio="xMidYMid meet" overflow="visible" className="drop-svg">
      <defs>
        <linearGradient id={gradId} gradientUnits="userSpaceOnUse" x1="0" y1="52" x2="0" y2="2">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset={`${fillPercent}%`} stopColor="#dc2626" />
          <stop offset={`${fillPercent}%`} stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>
      <path
        d="M32 2C32 2 60 34 60 52
           A28 28 0 1 1 4  52
           C4  34 32 2  32 2Z"
        fill={`url(#${gradId})`}
        stroke="#dc2626"
        strokeWidth="2"
      />
    </svg>
  );
}

export default function BloodStock() {
  const [stock, setStock] = useState([]);

  useEffect(() => {
    getBloodStock()
      .then(data => setStock(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  if (!stock.length) return null;

  const today = new Date().toLocaleDateString('pl-PL');

  return (
    <>
      <p className="stock-date">Stan na dzień: {today}</p>
      <div className="stock-container">
        {stock.map((row) => {
          const label = row.bloodGroupLabel ?? row.bloodGroup;
          const totalFree = Number(row.totalFree ?? 0);

          const key = row.bloodTypeId ?? label;
          const id =
            row.bloodTypeId != null
              ? `bt-${row.bloodTypeId}`
              : String(label).replace(/\s+/g, '-').replace(/\+/g, 'plus').replace(/-/g, 'minus');

          const fillPercent = toFillPercent(label, totalFree);

          return (
            <div
              key={key}
              className="stock-item"
              title={`Wolne: ${totalFree} / Max: ${MAX_CAPACITY[label] ?? 100}`}
            >
              <DropIcon id={id} fillPercent={fillPercent} />
              <div className="stock-label">
                <span className="group">{label}</span>
                <span className="percent">{fillPercent}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
