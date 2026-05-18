import { Flame, CheckCircle2, ChartColumn, Timer } from "lucide-react";

import Card from "../common/Card";

const icons = [Timer, CheckCircle2, Flame, ChartColumn];

const StatsGrid = ({ stats }) => {
  const cards = [
    {
      label: "Total Sessions",
      value: stats?.totalSessions || 0,
    },
    {
      label: "Completed Tasks",
      value: stats?.completedTasks || 0,
    },
    {
      label: "Current Streak",
      value: `${stats?.currentStreak || 0} days`,
    },
    {
      label: "Focus Hours",
      value: `${stats?.totalFocusHours || 0} hrs`,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = icons[index];
        return (
          <Card key={card.label} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">{card.label}</p>
                <p className="mt-3 font-display text-3xl text-ink">{card.value}</p>
              </div>
              <div className="rounded-2xl border border-line bg-platePeach p-3 text-ink">
                <Icon size={22} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsGrid;
