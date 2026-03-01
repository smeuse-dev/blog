'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type ChartType = 'bar' | 'line' | 'pie';
type ChartDatum = Record<string, string | number | null | undefined>;

interface LineSeries {
  dataKey: string;
  name?: string;
  color?: string;
}

interface ChartOptions {
  height?: number;
  xKey?: string;
  yKey?: string;
  dataKey?: string;
  colors?: string[];
  showLegend?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
}

interface ChartProps {
  type?: ChartType;
  data: ChartDatum[];
  options?: ChartOptions;
  caption?: string;
  xKey?: string;
  yKey?: string;
  lines?: LineSeries[];
  title?: string;
}

const DEFAULT_COLORS = ['#FF6B35', '#58A6FF', '#22C55E', '#F59E0B', '#EF4444', '#A855F7'];
const TOOLTIP_STYLE = {
  borderRadius: '0.5rem',
  border: '1px solid #334155',
  backgroundColor: '#0f172a',
  color: '#e2e8f0',
};

/**
 * Recharts wrapper for MDX charts.
 *
 * @example
 * ```tsx
 * <Chart
 *   type="line"
 *   data={[
 *     { name: '2024', value: 24 },
 *     { name: '2025', value: 32 }
 *   ]}
 *   caption="Adoption trend"
 * />
 * ```
 */
export default function Chart({
  type,
  data,
  options,
  caption,
  xKey,
  yKey,
  lines,
  title,
}: ChartProps) {
  const safeData = Array.isArray(data) ? data : [];
  const firstRow = safeData[0] ?? {};
  const keys = Object.keys(firstRow);
  const palette = options?.colors?.length ? options.colors : DEFAULT_COLORS;
  const resolvedType: ChartType = type ?? (lines?.length ? 'line' : 'bar');
  const resolvedCaption = caption ?? title;

  const resolvedXKey =
    xKey ??
    options?.xKey ??
    keys.find(key => typeof firstRow[key] === 'string') ??
    keys[0] ??
    'name';

  const numericKeys = keys.filter(key => typeof firstRow[key] === 'number');
  const resolvedYKey =
    yKey ??
    options?.yKey ??
    numericKeys.find(key => key !== resolvedXKey) ??
    numericKeys[0];

  const resolvedLines =
    lines && lines.length
      ? lines
      : numericKeys
          .filter(key => key !== resolvedXKey)
          .map((key, index) => ({
            dataKey: key,
            name: key,
            color: palette[index % palette.length],
          }));

  const showLegend = options?.showLegend ?? true;
  const showGrid = options?.showGrid ?? true;
  const showTooltip = options?.showTooltip ?? true;
  const chartHeight = options?.height ?? 320;

  if (!safeData.length) {
    return (
      <div className="not-prose my-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
        No chart data.
      </div>
    );
  }

  const tooltip = showTooltip ? <Tooltip contentStyle={TOOLTIP_STYLE} /> : null;
  const grid = showGrid ? <CartesianGrid strokeDasharray="3 3" stroke="#334155" /> : null;
  const axisTick = { fill: '#94a3b8', fontSize: 12 };

  return (
    <figure className="not-prose my-8 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
      <div className="h-[320px] w-full" style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          {resolvedType === 'pie' ? (
            <PieChart>
              {tooltip}
              {showLegend ? <Legend /> : null}
              <Pie
                data={safeData}
                dataKey={options?.dataKey || resolvedYKey || numericKeys[0]}
                nameKey={resolvedXKey}
                outerRadius="75%"
                label
              >
                {safeData.map((entry, index) => (
                  <Cell
                    key={`${String(entry[resolvedXKey])}-${index}`}
                    fill={palette[index % palette.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          ) : resolvedType === 'line' ? (
            <LineChart data={safeData}>
              {grid}
              <XAxis dataKey={resolvedXKey} tick={axisTick} />
              <YAxis tick={axisTick} />
              {tooltip}
              {showLegend ? <Legend /> : null}
              {(resolvedLines.length ? resolvedLines : [{ dataKey: resolvedYKey || 'value' }]).map(
                (series, index) => (
                  <Line
                    key={series.dataKey}
                    type="monotone"
                    dataKey={series.dataKey}
                    name={series.name || series.dataKey}
                    stroke={series.color || palette[index % palette.length]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                ),
              )}
            </LineChart>
          ) : (
            <BarChart data={safeData}>
              {grid}
              <XAxis dataKey={resolvedXKey} tick={axisTick} />
              <YAxis tick={axisTick} />
              {tooltip}
              {showLegend ? <Legend /> : null}
              {(resolvedLines.length
                ? resolvedLines
                : resolvedYKey
                  ? [{ dataKey: resolvedYKey }]
                  : [{ dataKey: numericKeys[0] || 'value' }]
              ).map((series, index) => (
                <Bar
                  key={series.dataKey}
                  dataKey={series.dataKey}
                  name={series.name || series.dataKey}
                  fill={series.color || palette[index % palette.length]}
                  radius={[6, 6, 0, 0]}
                />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      {resolvedCaption ? (
        <figcaption className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
          {resolvedCaption}
        </figcaption>
      ) : null}
    </figure>
  );
}
