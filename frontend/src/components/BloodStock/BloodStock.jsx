import React, { useEffect, useState } from "react";
import "./BloodStock.css";
import { getBloodStock } from "../../services/BloodStockService";
import { MAX_CAPACITY } from "../../constants/bloodCapacities";

function toFillPercent(label, totalFree) {
  let max = MAX_CAPACITY[label];

  if (max === undefined || max === null) {
    max = 100;
  }
  max = Number(max);

  let free = Number(totalFree);
  if (!Number.isFinite(free)) {
    free = 0;
  }

  if (!Number.isFinite(max) || max <= 0) {
    return 0;
  }

  let percent = Math.round((free / max) * 100);

  if (percent < 0) {
    percent = 0;
  }
  if (percent > 100) {
    percent = 100;
  }

  return percent;
}

function DropIcon({ id, fillPercent }) {
  const gradId = "grad-" + id;

  return (
    <svg
      viewBox="0 0 64 64"
      preserveAspectRatio="xMidYMid meet"
      overflow="visible"
      className="drop-svg"
    >
      <defs>
        <linearGradient
          id={gradId}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="52"
          x2="0"
          y2="2"
        >
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset={fillPercent + "%"} stopColor="#dc2626" />
          <stop offset={fillPercent + "%"} stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>
      <path
        d="M32 2C32 2 60 34 60 52
           A28 28 0 1 1 4  52
           C4  34 32 2  32 2Z"
        fill={"url(#" + gradId + ")"}
        stroke="#dc2626"
        strokeWidth="2"
      />
    </svg>
  );
}

export default function BloodStock() {
  const [stock, setStock] = useState([]);

  useEffect(function () {
    getBloodStock()
      .then(function (data) {
        if (Array.isArray(data)) {
          setStock(data);
        } else {
          setStock([]);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }, []);

  if (stock.length === 0) {
    return null;
  }

  const today = new Date().toLocaleDateString("pl-PL");

  return (
    <>
      <p className="stock-date">Stan na dzień: {today}</p>
      <div className="stock-container">
        {stock.map(function (row) {
          let label = row.bloodGroupLabel;
          if (!label) {
            label = row.bloodGroup;
          }

          let totalFree = Number(row.totalFree);
          if (!Number.isFinite(totalFree)) {
            totalFree = 0;
          }

          let key;
          if (row.bloodTypeId !== undefined && row.bloodTypeId !== null) {
            key = row.bloodTypeId;
          } else {
            key = label;
          }

          let id;
          if (row.bloodTypeId !== undefined && row.bloodTypeId !== null) {
            id = "bt-" + row.bloodTypeId;
          } else {
            const safeLabel = String(label)
              .replace(/\s+/g, "-")
              .replace(/\+/g, "plus")
              .replace(/-/g, "minus");
            id = safeLabel;
          }

          const fillPercent = toFillPercent(label, totalFree);

          let max = MAX_CAPACITY[label];
          if (max === undefined || max === null) {
            max = 100;
          }

          return (
            <div
              key={key}
              className="stock-item"
              title={"Wolne: " + totalFree + " / Max: " + max}
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
