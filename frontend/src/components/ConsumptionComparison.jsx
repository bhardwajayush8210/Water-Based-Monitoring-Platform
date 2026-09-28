import { useEffect, useState } from "react";
import api from "../api/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  ReferenceLine,
} from "recharts";
import { PeopleFill, TrophyFill } from "react-bootstrap-icons";

export default function ConsumptionComparison() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/usage/comparison/my");
        setData(res.data);
      } catch (err) {
        console.error("Failed to load comparison data:", err);
        setError("Couldn't load comparison data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="wm-card mt-3 text-center py-4">
        <div
          className="spinner-border"
          style={{ color: "var(--wm-accent)" }}
          role="status"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="wm-card mt-3 text-center py-4">
        <p className="wm-empty-note mb-0">{error}</p>
      </div>
    );
  }

  if (!data || !data.breakdown || data.breakdown.length === 0) {
    return (
      <div className="wm-card mt-3 text-center py-4">
        <p className="wm-empty-note mb-0">
          Not enough usage data yet in your apartment to show a comparison.
        </p>
      </div>
    );
  }

  const isBelowAverage = data.percentBelowAverage > 0;

  return (
    <div className="wm-card mt-3">
      <div className="d-flex align-items-center gap-2 mb-1">
        <PeopleFill size={16} color="var(--wm-accent-dark)" />
        <h6 className="wm-card-title mb-0">
          How You Compare — {data.periodLabel}
        </h6>
      </div>
      <p className="wm-card-subtitle">
        Your usage vs other households in{" "}
        {data.totalHouseholds > 1 ? "your apartment" : "your community"}
      </p>

      <div className="wm-compare-stats mb-3">
        <div className="wm-compare-stat">
          <span className="wm-compare-stat-label">Your Usage</span>
          <span className="wm-compare-stat-value">
            {data.myTotalLitres.toFixed(0)} L
          </span>
        </div>
        <div className="wm-compare-stat">
          <span className="wm-compare-stat-label">Apartment Average</span>
          <span className="wm-compare-stat-value">
            {data.apartmentAverageLitres.toFixed(0)} L
          </span>
        </div>
        <div className="wm-compare-stat">
          <span className="wm-compare-stat-label">Your Rank</span>
          <span className="wm-compare-stat-value">
            <TrophyFill
              size={13}
              className="me-1"
              style={{ color: "#F59E0B" }}
            />
            #{data.myRank} of {data.totalHouseholds}
          </span>
        </div>
      </div>

      <div
        className={`wm-compare-banner ${isBelowAverage ? "wm-compare-good" : "wm-compare-warn"}`}
      >
        {isBelowAverage
          ? `🌿 You're using ${Math.abs(data.percentBelowAverage).toFixed(0)}% less water than the apartment average — great job conserving!`
          : `💧 You're using ${Math.abs(data.percentBelowAverage).toFixed(0)}% more water than the apartment average. Small changes can help bring this down.`}
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={data.breakdown}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E7EBF1"
          />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11 }}
            interval={0}
            angle={-15}
            textAnchor="end"
            height={50}
          />
          <YAxis
            tick={{ fontSize: 11 }}
            label={{
              value: "Litres",
              angle: -90,
              position: "insideLeft",
              fontSize: 11,
            }}
          />
          <Tooltip
            formatter={(value) => [`${value.toFixed(0)} L`, "Usage"]}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
          <ReferenceLine
            y={data.apartmentAverageLitres}
            stroke="#94A3B8"
            strokeDasharray="4 4"
            label={{
              value: "Average",
              position: "right",
              fontSize: 10,
              fill: "#64748B",
            }}
          />
          <Bar dataKey="litres" radius={[6, 6, 0, 0]}>
            {data.breakdown.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.isYou ? "#14B8A6" : "#CBD5E1"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <style>{`
        .wm-compare-stats {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .wm-compare-stat {
          flex: 1;
          min-width: 140px;
          background: #F8FAFC;
          border: 1px solid var(--wm-border, #E7EBF1);
          border-radius: 10px;
          padding: 10px 14px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .wm-compare-stat-label {
          font-size: 11px;
          color: var(--wm-muted, #64748B);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .wm-compare-stat-value {
          font-size: 16px;
          font-weight: 700;
          color: var(--wm-ink, #0F172A);
        }
        .wm-compare-banner {
          font-size: 13px;
          font-weight: 500;
          padding: 10px 14px;
          border-radius: 10px;
          margin-bottom: 16px;
        }
        .wm-compare-good {
          background: #F0FDF4;
          color: #166534;
          border: 1px solid #BBF7D0;
        }
        .wm-compare-warn {
          background: #FFFBEB;
          color: #92400E;
          border: 1px solid #FDE68A;
        }
      `}</style>
    </div>
  );
}
