import React, { useState, useEffect } from "react";
import { Pie, PieChart, Cell } from "recharts";
import api from "../../lib/api";

const COLOR_MAP = {
  Electricity: "#2563eb", // Blue
  Transport: "#ef4444", // Red
  Waste: "#f59e0b", // Yellow
  Water: "#8b5cf6", // Purple
  "Purchased Goods": "#10b981", // Green
  Others: "#374151", // Gray
};

const initialChartData = [
  { name: "Electricity", value: 450, color: "#2563eb" }, // Blue
  { name: "Transport", value: 450, color: "#ef4444" }, // Red
  { name: "Waste", value: 450, color: "#f59e0b" }, // Yellow
  { name: "Water", value: 450, color: "#8b5cf6" }, // Purple
  { name: "Purchased Goods", value: 450, color: "#10b981" }, // Green
  { name: "Others", value: 450, color: "#374151" }, // Gray
];

export default function EmissionsChart() {
  const [chartData, setChartData] = useState(initialChartData);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.emissionWithSource.get();
        const data = Array.isArray(response) && response.length > 0 ? response : initialChartData;
        //if the emissionWithSource gives nothing it will be same as initialChartData, but I have no ideas whether its ok not...
        const dataWithColors = data.map((item) => ({
          ...item,
          color: COLOR_MAP[item.name] || "#374151",
        }));
        setChartData(dataWithColors);
      } catch (error) {
        console.error("Error fetching emissions data:", error);
      }
    }
    fetchData();
  }, []);

  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex flex-col justify-start items-start px-4">
      <div className="flex justify-between w-full">
        <span className="text-base font-medium text-base-muted-foreground">
          Where Your Emissions Come From
        </span>
        <span className="text-sm font-medium text-lime-400">+25.66%</span>
      </div>

      <div className="flex w-full items-center gap-8">
        <PieChart width={200} height={200}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>
        </PieChart>

        <div className="flex-1 flex flex-col gap-0.5">
          {chartData.map((item) => (
            <div
              key={item.name}
              className="grid grid-cols-[auto_minmax(120px,auto)_70px] gap-2 items-center text-sm text-white font-medium"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span>{item.name}</span>
              </div>
              <span className="text-right">{item.value} kg CO₂e</span> 
              <span className="text-right text-gray-400">
                {((item.value / totalValue) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LineChart({ emissionsData, chartWidth = 1440, chartHeight = 192 }) {
  // Chart dimensions and padding
  const CHART_HEIGHT = chartHeight;
  const CHART_WIDTH = chartWidth;
  const PADDING_TOP = 20;
  const PADDING_RIGHT = 20;
  const PADDING_BOTTOM = 40;
  const PADDING_LEFT = 40;

  const innerChartWidth = CHART_WIDTH - PADDING_LEFT - PADDING_RIGHT;
  const innerChartHeight = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;

  const allValues = emissionsData.map(d => d.value);
  const maxValue = Math.max(...allValues);
  const minValue = 0;

  const yScale = (value) => {
    return PADDING_TOP + innerChartHeight - ((value - minValue) / (maxValue - minValue)) * innerChartHeight;
  };

  const xScale = (index) => {
    return PADDING_LEFT + (index / (emissionsData.length - 1)) * innerChartWidth;
  };

  const linePath = emissionsData.map((data, index) => {
    const x = xScale(index);
    const y = yScale(data.value);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const numYAxisLines = 5;
  const yAxisLabels = [];
  const yAxisGridLines = [];
  const yAxisValueStep = Math.ceil(maxValue / (numYAxisLines - 1) / 100) * 100;

  for (let i = 0; i < numYAxisLines; i++) {
    const labelValue = i * yAxisValueStep;
    const y = yScale(labelValue);

    yAxisGridLines.push(
      <line
        key={`grid-y-${i}`}
        x1={PADDING_LEFT}
        y1={y}
        x2={CHART_WIDTH - PADDING_RIGHT}
        y2={y}
        stroke="#4B5563"
        strokeWidth="0.5"
        strokeOpacity="0.8"
      />
    );

    yAxisLabels.push(
      <text
        key={`label-y-${i}`}
        x={PADDING_LEFT - 10}
        y={y + 4}
        textAnchor="end"
        fill="#9CA3AF"
        fontSize="10"
      >
        {labelValue}
      </text>
    );
  }

  return (
    <div className="self-stretch py-6 flex flex-col justify-start items-start gap-2.5">
      <div
        data-show-grid="true"
        data-show-legend="false"
        data-type="Linear"
        className="self-stretch h-48 flex flex-col justify-end items-center gap-9"
      >
        <div className="self-stretch flex-1 relative">
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            preserveAspectRatio="none"
            className="absolute left-0 top-0"
          >
            {yAxisGridLines}

            <path
              d={linePath}
              fill="none"
              stroke="#84CC16"
              strokeWidth="2"
            />

            {emissionsData.map((data, index) => {
              const x = xScale(index);
              const y = yScale(data.value);
              const isLastPoint = index === emissionsData.length - 1;
              return (
                <g key={`point-${data.month}`}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isLastPoint ? 4 : 2}
                    fill={isLastPoint ? "#84CC16" : "#84CC16"}
                  />
                  {isLastPoint && (
                    <text
                      x={x}
                      y={y - 10}
                      textAnchor="middle"
                      fill="#F9FAFB"
                      fontSize="12"
                    >
                      {Intl.NumberFormat('en-US').format(data.value)}
                    </text>
                  )}
                </g>
              );
            })}

            {emissionsData.map((data, index) => (
              <text
                key={`month-label-${data.month}`}
                x={xScale(index)}
                y={CHART_HEIGHT - 20}
                textAnchor="middle"
                fill="#9CA3AF"
                fontSize="10"
              >
                {data.month}
              </text>
            ))}

            {yAxisLabels}
          </svg>
        </div>
      </div>
    </div>
  );
}
