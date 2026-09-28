import { useState } from "react";
import {
  DropletFill,
  LightbulbFill,
  ArrowClockwise,
  HeartFill,
} from "react-bootstrap-icons";

const allTips = [
  {
    category: "Bathroom",
    tip: "A running tap while brushing your teeth wastes about 6 litres a minute. Turn it off until you need to rinse.",
    savings: "~12 L per day",
  },
  {
    category: "Bathroom",
    tip: "Switch to a bucket and mug instead of a shower for a day and compare — showers typically use 3–4x more water.",
    savings: "~80 L per shower",
  },
  {
    category: "Bathroom",
    tip: "A leaking toilet flush valve can silently waste over 200 litres a day. Check for a faint hiss or trickle sound.",
    savings: "Up to 200 L per day",
  },
  {
    category: "Kitchen",
    tip: "Rinse vegetables in a filled basin instead of under a running tap, then reuse that water for plants.",
    savings: "~15 L per wash",
  },
  {
    category: "Kitchen",
    tip: "Run your dishwasher or washing machine only with a full load — half-loads use nearly the same water per cycle.",
    savings: "~30 L per extra cycle avoided",
  },
  {
    category: "Laundry",
    tip: "Pre-soak heavily soiled clothes instead of running a second wash cycle.",
    savings: "~40 L per cycle avoided",
  },
  {
    category: "Outdoor",
    tip: "Water your plants early morning or late evening — midday watering loses more to evaporation.",
    savings: "~20% less water used",
  },
  {
    category: "Outdoor",
    tip: "Use a broom instead of a hose to clean your balcony, driveway, or car.",
    savings: "~100 L per clean",
  },
  {
    category: "Leaks",
    tip: "A dripping tap wastes roughly 15 litres a day. If you notice one, raise a ticket with your Community Admin.",
    savings: "~15 L per day",
  },
  {
    category: "Habits",
    tip: "Keep a jug of drinking water in the fridge instead of running the tap until it turns cold.",
    savings: "~10 L per day",
  },
  {
    category: "Habits",
    tip: "Track your daily usage in the Usage tab — small day-to-day spikes are easier to catch early than after the bill arrives.",
    savings: "Avoids Tier 2 overage charges",
  },
  {
    category: "Habits",
    tip: "Reusing water — like using rinse water for plants or floor cleaning — is one of the simplest ways to cut daily consumption.",
    savings: "~10–20 L per day",
  },
];

const categoryColors = {
  Bathroom: { bg: "#E0F2FE", color: "#0369A1" },
  Kitchen: { bg: "#FEF3C7", color: "#B45309" },
  Laundry: { bg: "#F3E8FF", color: "#7E22CE" },
  Outdoor: { bg: "#DCFCE7", color: "#15803D" },
  Leaks: { bg: "#FEE2E2", color: "#991B1B" },
  Habits: { bg: "#E3FBF6", color: "#0D9488" },
};

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function WaterTips() {
  const [tips, setTips] = useState(() => shuffle(allTips));
  const [savedIds, setSavedIds] = useState([]);

  const reshuffle = () => setTips(shuffle(allTips));

  const toggleSave = (tip) => {
    setSavedIds((prev) =>
      prev.includes(tip.tip)
        ? prev.filter((t) => t !== tip.tip)
        : [...prev, tip.tip],
    );
  };

  const featured = tips[0];
  const rest = tips.slice(1);

  return (
    <div className="wm-card">
      <div className="d-flex align-items-center justify-content-between mb-1">
        <div className="d-flex align-items-center gap-2">
          <LightbulbFill size={16} color="var(--wm-accent-dark)" />
          <h6 className="wm-card-title mb-0">Water-Saving Tips</h6>
        </div>
        <button className="wm-tips-refresh" onClick={reshuffle}>
          <ArrowClockwise size={13} className="me-1" />
          Shuffle
        </button>
      </div>
      <p className="wm-card-subtitle mb-3">
        Small daily habits that add up over a billing cycle
      </p>

      {/* Featured tip */}
      <div className="wm-tip-featured">
        <div className="wm-tip-featured-icon">
          <DropletFill size={20} />
        </div>
        <div className="flex-grow-1">
          <span
            className="wm-tip-category"
            style={{
              background: categoryColors[featured.category]?.bg,
              color: categoryColors[featured.category]?.color,
            }}
          >
            {featured.category}
          </span>
          <p className="wm-tip-text">{featured.tip}</p>
          <span className="wm-tip-savings">💧 Saves {featured.savings}</span>
        </div>
        <button
          className={`wm-tip-save ${savedIds.includes(featured.tip) ? "wm-tip-saved" : ""}`}
          onClick={() => toggleSave(featured)}
          title="Save this tip"
        >
          <HeartFill size={14} />
        </button>
      </div>

      {/* Rest of the feed */}
      <div className="wm-tip-grid">
        {rest.map((t, i) => (
          <div className="wm-tip-card" key={i}>
            <div className="d-flex align-items-start justify-content-between">
              <span
                className="wm-tip-category"
                style={{
                  background: categoryColors[t.category]?.bg,
                  color: categoryColors[t.category]?.color,
                }}
              >
                {t.category}
              </span>
              <button
                className={`wm-tip-save-sm ${savedIds.includes(t.tip) ? "wm-tip-saved" : ""}`}
                onClick={() => toggleSave(t)}
                title="Save this tip"
              >
                <HeartFill size={11} />
              </button>
            </div>
            <p className="wm-tip-card-text">{t.tip}</p>
            <span className="wm-tip-savings-sm">Saves {t.savings}</span>
          </div>
        ))}
      </div>

      <style>{`
        .wm-tips-refresh {
          display: inline-flex;
          align-items: center;
          background: var(--wm-accent-soft);
          color: var(--wm-accent-dark);
          border: none;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }
        .wm-tips-refresh:hover { opacity: 0.85; }

        .wm-tip-featured {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          background: linear-gradient(135deg, #0B1C2C 0%, #14283b 100%);
          border-radius: 14px;
          padding: 18px 20px;
          margin-bottom: 18px;
          color: #fff;
        }
        .wm-tip-featured-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(94,234,212,0.15);
          color: #5EEAD4;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .wm-tip-text {
          font-size: 14px;
          line-height: 1.55;
          margin: 8px 0 6px;
          color: rgba(255,255,255,0.92);
        }
        .wm-tip-savings {
          font-size: 12px;
          color: #5EEAD4;
          font-weight: 600;
        }
        .wm-tip-save, .wm-tip-save-sm {
          background: rgba(255,255,255,0.08);
          border: none;
          color: rgba(255,255,255,0.5);
          border-radius: 8px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: color 0.15s ease;
        }
        .wm-tip-save-sm {
          background: transparent;
          color: #CBD5E1;
          width: 24px;
          height: 24px;
        }
        .wm-tip-save:hover, .wm-tip-save-sm:hover { color: #F87171; }
        .wm-tip-saved { color: #F87171 !important; }

        .wm-tip-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .wm-tip-card {
          background: #F8FAFC;
          border: 1px solid var(--wm-border, #E7EBF1);
          border-radius: 12px;
          padding: 14px;
        }
        .wm-tip-category {
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          padding: 3px 9px;
          border-radius: 999px;
          display: inline-block;
        }
        .wm-tip-card-text {
          font-size: 12.5px;
          line-height: 1.5;
          color: var(--wm-ink, #0F172A);
          margin: 8px 0 6px;
        }
        .wm-tip-savings-sm {
          font-size: 11px;
          color: var(--wm-accent-dark, #0D9488);
          font-weight: 600;
        }

        @media (max-width: 900px) {
          .wm-tip-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .wm-tip-grid { grid-template-columns: 1fr; }
          .wm-tip-featured { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
