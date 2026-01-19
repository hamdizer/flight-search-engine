import React, { useMemo } from "react";
import { TrendingDown, TrendingUp, Activity, Info } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from "recharts";
import { ChartTooltip } from "./ChartTooltip";
import { CHART_COLORS } from "../../utils/contants";
import { formatPrice } from "../../utils/formatters";
import { cn } from "../../utils/helpers";
import type { ChartDataPoint } from "../../types/flight.types";

export interface PriceTrendChartProps {
  data: ChartDataPoint[];
  flightCount: number;
  className?: string;
  variant?: "area" | "line" | "bar";
  showStats?: boolean;
  showLegend?: boolean;
  height?: number;
  highlightBest?: boolean;
}

export const PriceTrendChart: React.FC<PriceTrendChartProps> = ({
  data,
  flightCount,
  className,
  variant = "area",
  showStats = true,
  showLegend = true,
  height = 250,
  highlightBest = true,
}) => {
  const insights = useMemo(() => {
    if (data.length === 0) return null;

    const avgPrices = data.map((d) => d.avgPrice);
    const minAvg = Math.min(...avgPrices);
    const maxAvg = Math.max(...avgPrices);
    const totalAvg = avgPrices.reduce((a, b) => a + b, 0) / avgPrices.length;

    const bestOption = data.find((d) => d.avgPrice === minAvg);
    const priceRange = maxAvg - minAvg;
    const savings = maxAvg - minAvg;

    return {
      bestOption,
      minAvg,
      maxAvg,
      totalAvg,
      priceRange,
      savings,
    };
  }, [data]);

  if (data.length === 0) {
    return (
      <div
        className={cn(
          "bg-white rounded-2xl shadow-lg border border-gray-200 p-6",
          className,
        )}
      >
        <div className="flex items-center justify-center h-64 text-gray-400">
          <div className="text-center">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No price data available</p>
          </div>
        </div>
      </div>
    );
  }

  const renderChart = () => {
    const chartProps = {
      data,
      margin: { top: 10, right: 30, left: 0, bottom: 0 },
    };

    switch (variant) {
      case "line":
        return (
          <LineChart {...chartProps}>
            <defs>
              <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={CHART_COLORS.primary}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={CHART_COLORS.primary}
                  stopOpacity={0.2}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={CHART_COLORS.grid}
              vertical={false}
            />
            <XAxis
              dataKey="stops"
              stroke="#666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <ChartTooltip />
            {showLegend && <Legend />}
            {highlightBest && insights && (
              <ReferenceLine
                y={insights.minAvg}
                stroke={CHART_COLORS.success}
                strokeDasharray="3 3"
                label={{
                  value: "Best Price",
                  position: "right",
                  fill: CHART_COLORS.success,
                }}
              />
            )}
            <Line
              type="monotone"
              dataKey="avgPrice"
              stroke={CHART_COLORS.primary}
              strokeWidth={3}
              dot={{ fill: CHART_COLORS.primary, r: 5 }}
              activeDot={{ r: 7 }}
              animationDuration={800}
            />
          </LineChart>
        );

      case "bar":
        return (
          <BarChart {...chartProps}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={CHART_COLORS.grid}
              vertical={false}
            />
            <XAxis
              dataKey="stops"
              stroke="#666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <ChartTooltip />
            {showLegend && <Legend />}
            <Bar
              dataKey="avgPrice"
              fill={CHART_COLORS.primary}
              radius={[8, 8, 0, 0]}
              animationDuration={800}
            />
          </BarChart>
        );

      default:
        return (
          <AreaChart {...chartProps}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={CHART_COLORS.primary}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={CHART_COLORS.primary}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={CHART_COLORS.grid}
              vertical={false}
            />
            <XAxis
              dataKey="stops"
              stroke="#666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <ChartTooltip />
            {showLegend && <Legend />}
            {highlightBest && insights && (
              <ReferenceLine
                y={insights.minAvg}
                stroke={CHART_COLORS.success}
                strokeDasharray="3 3"
                label={{
                  value: "Best Price",
                  position: "right",
                  fill: CHART_COLORS.success,
                  fontSize: 11,
                }}
              />
            )}
            <Area
              type="monotone"
              dataKey="avgPrice"
              stroke={CHART_COLORS.primary}
              strokeWidth={2}
              fill="url(#colorPrice)"
              animationDuration={800}
            />
          </AreaChart>
        );
    }
  };

  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-lg border border-gray-200",
        className,
      )}
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Price Trends</h3>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {flightCount} flight{flightCount !== 1 ? "s" : ""}
            </span>
            {insights && (
              <div className="flex items-center gap-2 text-sm">
                <TrendingDown className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-600">
                  Save up to {formatPrice(insights.savings)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {showStats && insights && (
        <div className="px-6 pb-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-700 mb-2">
                <TrendingDown className="w-4 h-4" />
                <span className="text-xs font-medium">Best Option</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(insights.minAvg)}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {insights.bestOption?.stops}
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-medium">Average</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(insights.totalAvg)}
              </p>
              <p className="text-xs text-gray-600 mt-1">Across all options</p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-orange-700 mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-medium">Price Range</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(insights.priceRange)}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {formatPrice(insights.minAvg)} - {formatPrice(insights.maxAvg)}
              </p>
            </div>
          </div>

          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900">
              <strong>Tip:</strong> {insights.bestOption?.stops} offers the best
              value at {formatPrice(insights.minAvg)}. You could save{" "}
              {formatPrice(insights.savings)} compared to the most expensive
              option.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export const CompactPriceTrendChart: React.FC<
  Omit<PriceTrendChartProps, "showStats" | "showLegend">
> = (props) => {
  return (
    <PriceTrendChart
      {...props}
      showStats={false}
      showLegend={false}
      height={150}
    />
  );
};
