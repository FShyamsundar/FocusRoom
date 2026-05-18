import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Card from "../common/Card";

const WeeklyFocusChart = ({ data }) => (
  <Card className="p-6">
    <p className="text-sm uppercase tracking-[0.22em] text-muted">Weekly Analytics</p>
    <h3 className="mt-2 font-display text-2xl text-ink">Hours invested this week</h3>
    <div className="mt-6 h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid stroke="#d6cdbc" vertical={false} />
          <XAxis dataKey="label" stroke="#6b7280" tickLine={false} axisLine={false} />
          <YAxis stroke="#6b7280" tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: "#fffaf2",
              border: "1px solid #d6cdbc",
              borderRadius: "16px",
              color: "#1f2937",
            }}
          />
          <Area
            type="monotone"
            dataKey="hours"
            stroke="#2563eb"
            strokeWidth={3}
            fill="#dbe8ff"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </Card>
);

export default WeeklyFocusChart;
