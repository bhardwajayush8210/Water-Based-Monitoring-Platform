import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import {
  ShieldCheck,
  Lightbulb,
  DropletFill,
  ArrowDownShort,
  ArrowUpShort,
} from "react-bootstrap-icons";
import api from "../api/api";

const WATER_TIPS = [
  "Fix leaky faucets: A tap dripping at 1 drop/sec wastes over 10,000 L of water per year.",
  "Install aerators on sink taps to cut flow rates by up to 30-50% without losing pressure.",
  "Run washing machines and dishwashers only on full loads to maximize efficiency.",
  "Turn off running water while brushing teeth or soaping dishes to save up to 12 L/minute.",
];

export default function ConsumptionComparison({ userUsage = 1450 }) {
  const [communityAvg, setCommunityAvg] = useState(1850);
  const [similarAvg, setSimilarAvg] = useState(1600);

  useEffect(() => {
    // Optional API fetch for live benchmark averages
    api
      .get("/usage/community-averages")
      .then((res) => {
        if (res.data) {
          setCommunityAvg(res.data.communityAverage || 1850);
          setSimilarAvg(res.data.similarHouseholdAverage || 1600);
        }
      })
      .catch(() => {});
  }, []);

  const benchmarkData = [
    { category: "Your Flat", usage: userUsage, color: "#0D9488" },
    { category: "Similar Flats (2BHK)", usage: similarAvg, color: "#6366F1" },
    { category: "Community Average", usage: communityAvg, color: "#94A3B8" },
  ];

  const diffFromSimilar = similarAvg - userUsage;
  const isSaving = diffFromSimilar >= 0;
  const percentDiff = Math.abs(
    Math.round((diffFromSimilar / similarAvg) * 100),
  );

  return (
    <div className="wm-benchmark-container">
      {/* Peer Benchmarking Callout */}
      <div
        className={`wm-benchmark-alert ${isSaving ? "wm-alert-pass" : "wm-alert-warn"}`}
      >
        <div className="wm-benchmark-icon">
          <ShieldCheck size={26} />
        </div>
        <div>
          <h5 className="mb-1 fw-bold">
            {isSaving ? (
              <>
                <ArrowDownShort size={20} /> You're using {percentDiff}% less
                water than similar households!
              </>
            ) : (
              <>
                <ArrowUpShort size={20} /> You're using {percentDiff}% more
                water than similar households.
              </>
            )}
          </h5>
          <p className="mb-0 text-muted" style={{ fontSize: "13px" }}>
            {isSaving
              ? `Great job! Your household saved roughly ${diffFromSimilar.toLocaleString()} Litres this cycle compared to peer average.`
              : `Consider checking for valve leaks or adopting conservation practices to bring usage below ${similarAvg.toLocaleString()} L.`}
          </p>
        </div>
      </div>

      <div className="row g-3 mt-1">
        {/* Horizontal Bar Chart */}
        <div className="col-lg-7">
          <div className="wm-card h-100">
            <h6 className="wm-card-title">Household Usage Comparison</h6>
            <p className="wm-card-subtitle">
              Current cycle consumption vs. apartment benchmarks (Litres)
            </p>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <BarChart
                  data={benchmarkData}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis type="number" stroke="#64748B" />
                  <YAxis
                    dataKey="category"
                    type="category"
                    width={140}
                    stroke="#0F172A"
                    style={{ fontSize: "12px", fontWeight: 500 }}
                  />
                  <Tooltip
                    formatter={(val) => [`${val.toLocaleString()} L`, "Usage"]}
                  />
                  <Bar dataKey="usage" radius={[0, 8, 8, 0]} barSize={28}>
                    {benchmarkData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Water Saving Tips Feed */}
        <div className="col-lg-5">
          <div className="wm-card h-100">
            <div className="d-flex align-items-center gap-2 mb-2">
              <Lightbulb size={18} color="#D97706" />
              <h6 className="wm-card-title mb-0">Conservation Tips</h6>
            </div>
            <p className="wm-card-subtitle">
              Actionable steps to reduce your bill
            </p>
            <div className="wm-tips-feed">
              {WATER_TIPS.map((tip, idx) => (
                <div key={idx} className="wm-tip-item">
                  <DropletFill
                    size={12}
                    className="mt-1 text-teal flex-shrink-0"
                  />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .wm-benchmark-container { font-family: var(--wm-font-body, 'Inter', sans-serif); }
        .wm-benchmark-alert {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          border-radius: 14px;
          border: 1px solid transparent;
        }
        .wm-alert-pass { background: #ECFDF5; border-color: #A7F3D0; color: #065F46; }
        .wm-alert-warn { background: #FFFBEB; border-color: #FDE68A; color: #92400E; }
        .wm-benchmark-icon {
          width: 48px; height: 48px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.7); flex-shrink: 0;
        }
        .wm-tips-feed { display: flex; flex-direction: column; gap: 12px; }
        .wm-tip-item {
          display: flex; gap: 10px; font-size: 12.5px;
          color: var(--wm-ink, #0F172A); line-height: 1.5;
          padding: 10px 12px; background: #F8FAFC;
          border: 1px solid #E2E8F0; border-radius: 10px;
        }
        .text-teal { color: #0D9488; }
      `}</style>
    </div>
  );
}
