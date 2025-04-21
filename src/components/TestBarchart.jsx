import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  LineController,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import the plugin

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  LineController,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels // Register the plugin
);

const TestBarChart = ({ data = [], label = "Default Label" }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const visibleBars = 5; // Number of bars visible at a time

  const handleScroll = (event) => {
    if (data.length <= visibleBars) return;
    const delta = event.deltaY > 0 ? 1 : -1;
    setScrollPosition((prev) =>
      Math.max(0, Math.min(prev + delta, data.length - visibleBars))
    );
  };

  // Generate trendline data
  const trendlineData = data.map((item) => item.totalCount ?? 0);

  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        label: label,
        data: data.map((item) => item.value),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        yAxisID: "y",
        
        barThickness: 60, // Fixed width in pixels
        maxBarThickness: 70,
      },
      {
        label: "Trendline",
        data: trendlineData,
        type: "line",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
        pointRadius: 3, // Show small points for clarity
        pointBackgroundColor: "red",
        fill: false,
        yAxisID: "y1", // Assign to right-side axis
        datalabels: {
          align: "end",
          anchor: "start",
          color: "red",
          font: {
            weight: "bold",
            size: 12,
          },
          formatter: (value) => value,
        },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "category",
        min: scrollPosition,
        max: scrollPosition + visibleBars,
      },
      y: {
        beginAtZero: true,
        position: "left",
        title: {
          display: true,
          text: "Bar Values",
        },
        ticks: {
          callback: (value) => formatNumber(value),
        },
      },
      y1: {
        beginAtZero: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: "Trendline Values",
        },
        ticks: {
          callback: (value) => formatNumber(value),
        },
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        display: true,
        clip: true,
        formatter: (value) => formatNumber(value),
      },
    },
  };

  // Helper function to format numbers
  const formatNumber = (num) => {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + "T"; // 1 Trillion (T)
    if (num >= 1e9) return (num / 1e9).toFixed(1) + "B"; // 1 Billion (B)
    if (num >= 1e6) return (num / 1e6).toFixed(1) + "M"; // 1 Million (M)
    if (num >= 1e3) return (num / 1e3).toFixed(1) + "K"; // 1 Thousand (K)
    return num.toString();
  };

  return (
    <div style={{ width: "100%", height: "400px" }} onWheel={handleScroll}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default TestBarChart;
