import React from "react";
import { Tooltip, type TooltipProps } from "recharts";
import type { ChartDataPoint } from "../../types/flight.types";

export const ChartTooltip: React.FC = () => {
  return (
    <Tooltip
      content={<CustomTooltip />}
      cursor={{ stroke: "#3b82f6", strokeWidth: 1, strokeDasharray: "5 5" }}
    />
  );
};

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
}: TooltipProps<number, string> & { payload?: Array<{ payload: ChartDataPoint }> }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0].payload as ChartDataPoint;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[160px]">
      <p className="font-semibold text-gray-900 mb-2">{data.stops}</p>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Average:</span>
          <span className="text-sm font-bold text-blue-600">
            ${data.avgPrice}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Min:</span>
          <span className="text-sm font-medium text-gray-700">
            ${data.minPrice}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Max:</span>
          <span className="text-sm font-medium text-gray-700">
            ${data.maxPrice}
          </span>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          {data.count} flight{data.count !== 1 ? "s" : ""} found
        </p>
      </div>
    </div>
  );
};
