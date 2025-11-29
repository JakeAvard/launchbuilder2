import { useMemo } from 'react';
import { formatCurrency } from '../lib/roundup';

interface DataPoint {
  label: string;
  amount: number;
}

interface TrendChartProps {
  data: DataPoint[];
  period: 'week' | 'month' | 'year';
}

export default function TrendChart({ data, period }: TrendChartProps) {
  const maxValue = useMemo(() => Math.max(...data.map(d => d.amount), 1), [data]);

  const getBarHeight = (amount: number) => {
    return (amount / maxValue) * 100;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Giving Trend - {period.charAt(0).toUpperCase() + period.slice(1)}
      </h3>
      <div className="h-64 flex items-end justify-between gap-2">
        {data.map((point, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex flex-col items-center justify-end h-full">
              <div className="text-xs font-medium text-gray-600 mb-1">
                {formatCurrency(point.amount)}
              </div>
              <div
                className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-500 min-h-[20px]"
                style={{ height: `${getBarHeight(point.amount)}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 font-medium text-center">
              {point.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
