function StatCard({
  icon: Icon,
  label,
  value,
  percent = null,
  tone = "accent",
}) {
  const toneMap = {
    accent: {
      chip: "var(--wm-accent-soft)",
      ic: "var(--wm-accent-dark)",
      bar: "var(--wm-accent)",
    },
    warn: { chip: "var(--wm-warn-soft)", ic: "#B45309", bar: "var(--wm-warn)" },
    danger: {
      chip: "var(--wm-danger-soft)",
      ic: "#B91C1C",
      bar: "var(--wm-danger)",
    },
    success: {
      chip: "var(--wm-success-soft)",
      ic: "#15803D",
      bar: "var(--wm-success)",
    },
  };
  const t = toneMap[tone] || toneMap.accent;

  return (
    <>
      <div className="wm-stat-card">
        <div className="wm-stat-top">
          <div
            className="wm-stat-icon"
            style={{ background: t.chip, color: t.ic }}
          >
            {Icon && <Icon size={19} />}
          </div>
          <span className="wm-stat-label">{label}</span>
        </div>

        <div className="wm-stat-value">{value}</div>

        {percent !== null && (
          <div className="wm-gauge">
            <div
              className="wm-gauge-fill"
              style={{
                width: `${Math.min(Math.max(percent, 0), 100)}%`,
                background: t.bar,
              }}
            />
          </div>
        )}
      </div>

      <style>{`
        .wm-stat-card {
          background: #fff;
          border: 1px solid var(--wm-border, #E7EBF1);
          border-radius: 16px;
          padding: 18px 20px;
          height: 100%;
        }
        .wm-stat-top {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }
        .wm-stat-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .wm-stat-label {
          font-size: 12.5px;
          color: var(--wm-muted, #64748B);
          font-weight: 500;
        }
        .wm-stat-value {
          font-family: var(--wm-font-mono, 'JetBrains Mono', monospace);
          font-size: 26px;
          font-weight: 600;
          color: var(--wm-ink, #0F172A);
          letter-spacing: -0.5px;
        }
        .wm-gauge {
          margin-top: 12px;
          height: 5px;
          border-radius: 999px;
          background: var(--wm-bg, #F6F8FB);
          overflow: hidden;
        }
        .wm-gauge-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>
    </>
  );
}

export default StatCard;
