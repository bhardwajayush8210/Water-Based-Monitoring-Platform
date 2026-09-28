import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Tooltip,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Tooltip,
);

function hexToRgba(hex, alpha) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const tooltipBase = {
  backgroundColor: "#0F172A",
  titleFont: { family: "Inter", size: 11, weight: "500" },
  titleColor: "rgba(255,255,255,0.6)",
  bodyFont: {
    family: "'JetBrains Mono', monospace",
    size: 13.5,
    weight: "600",
  },
  bodyColor: "#fff",
  padding: 12,
  cornerRadius: 10,
  displayColors: false,
  caretSize: 6,
  boxPadding: 4,
};

const axisTickStyle = {
  font: { family: "Inter", size: 10.5 },
  color: "#94A3B8",
};

// Draws a soft dashed vertical crosshair line at the hovered point,
// a common "premium dashboard" touch (Stripe/Vercel-style charts).
const crosshairPlugin = {
  id: "crosshair",
  afterDatasetsDraw(chart) {
    const active = chart.tooltip?.getActiveElements?.() || [];
    if (!active.length) return;
    const { ctx, chartArea } = chart;
    const x = active[0].element.x;

    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.moveTo(x, chartArea.top);
    ctx.lineTo(x, chartArea.bottom);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(15,23,42,0.15)";
    ctx.stroke();
    ctx.restore();
  },
};

const baseAnimation = {
  duration: 900,
  easing: "easeOutQuart",
};

/**
 * Smooth area/line chart, powered by Chart.js. Premium styling: thin
 * hover-only points, soft gradient fill, crosshair guide, dark tooltip.
 * data: [{ label: string, value: number }, ...]
 */
export function AreaChartMini({
  data,
  color = "#0d6efd",
  height = 200,
  unit = "L",
}) {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.value),
        borderColor: color,
        backgroundColor: (context) => {
          const { chart } = context;
          const { ctx, chartArea } = chart;
          if (!chartArea) return hexToRgba(color, 0.15);
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom,
          );
          gradient.addColorStop(0, hexToRgba(color, 0.38));
          gradient.addColorStop(0.65, hexToRgba(color, 0.08));
          gradient.addColorStop(1, hexToRgba(color, 0));
          return gradient;
        },
        fill: true,
        tension: 0.45,
        cubicInterpolationMode: "monotone",
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: color,
        pointHoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: baseAnimation,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        ...tooltipBase,
        callbacks: {
          title: (items) => items[0]?.label,
          label: (ctx) => `${ctx.parsed.y} ${unit}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: axisTickStyle,
        border: { display: false },
      },
      y: {
        beginAtZero: true,
        grid: { color: "#F1F4F8" },
        ticks: { ...axisTickStyle },
        border: { display: false },
      },
    },
  };

  return (
    <div style={{ height, width: "100%" }}>
      <Line data={chartData} options={options} plugins={[crosshairPlugin]} />
    </div>
  );
}

/**
 * Vertical bar chart, powered by Chart.js. Premium styling: gradient
 * bars, staggered entrance animation, rounded tops only.
 * data: [{ label: string, value: number, highlight?: boolean }, ...]
 */
export function BarChartMini({
  data,
  color = "#0dcaf0",
  highlightColor = "#d64545",
  height = 200,
  unit = "L",
}) {
  const barGradient = (ctx, chart, baseColor) => {
    const { chartArea } = chart;
    if (!chartArea) return baseColor;
    const gradient = ctx.createLinearGradient(
      0,
      chartArea.top,
      0,
      chartArea.bottom,
    );
    gradient.addColorStop(0, hexToRgba(baseColor, 0.95));
    gradient.addColorStop(1, hexToRgba(baseColor, 0.55));
    return gradient;
  };

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: (context) => {
          const { chart, dataIndex } = context;
          const baseColor = data[dataIndex]?.highlight ? highlightColor : color;
          return barGradient(chart.ctx, chart, baseColor);
        },
        hoverBackgroundColor: (context) => {
          const { dataIndex } = context;
          return data[dataIndex]?.highlight ? highlightColor : color;
        },
        borderRadius: {
          topLeft: 8,
          topRight: 8,
          bottomLeft: 0,
          bottomRight: 0,
        },
        borderSkipped: false,
        maxBarThickness: 36,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      ...baseAnimation,
      delay: (context) =>
        context.type === "data" && context.mode === "default"
          ? context.dataIndex * 60
          : 0,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        ...tooltipBase,
        callbacks: {
          title: (items) => items[0]?.label,
          label: (ctx) => `${ctx.parsed.y} ${unit}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: axisTickStyle,
        border: { display: false },
      },
      y: {
        beginAtZero: true,
        grid: { color: "#F1F4F8" },
        ticks: axisTickStyle,
        border: { display: false },
      },
    },
  };

  return (
    <div style={{ height, width: "100%" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

/**
 * Horizontal bar chart - good for "you vs average" comparisons.
 * data: [{ label: string, value: number, highlight?: boolean }, ...]
 */
export function HorizontalBarChartMini({
  data,
  color = "#c7d6e5",
  highlightColor = "#0d6efd",
  height = 180,
  unit = "L",
}) {
  const colors = data.map((d) => (d.highlight ? highlightColor : color));

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: colors,
        hoverBackgroundColor: colors,
        borderRadius: 7,
        maxBarThickness: 26,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    animation: baseAnimation,
    plugins: {
      legend: { display: false },
      tooltip: {
        ...tooltipBase,
        callbacks: {
          label: (ctx) => `${ctx.parsed.x} ${unit}`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { color: "#F1F4F8" },
        ticks: axisTickStyle,
        border: { display: false },
      },
      y: {
        grid: { display: false },
        ticks: {
          ...axisTickStyle,
          font: { family: "Inter", size: 12, weight: "500" },
          color: "#5c6b84",
        },
        border: { display: false },
      },
    },
  };

  return (
    <div style={{ height, width: "100%" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
