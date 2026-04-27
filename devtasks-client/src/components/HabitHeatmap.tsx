import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { format, subDays } from "date-fns";

import type { Habit } from "../types";

const HabitHeatmap = ({ logs }: { logs: Habit["logs"] }) => {
  const values = Object.values(
    logs.reduce((acc: Record<string, { date: string; count: number }>, log) => {
      const date = format(new Date(log.date), "yyyy-MM-dd");

      if (!acc[date]) {
        acc[date] = { date, count: 0 };
      }

      acc[date].count += 1;
      return acc;
    }, {}),
  );

  return (
    <div className="mt-4">
      <CalendarHeatmap
        startDate={subDays(new Date(), 90)}
        endDate={new Date()}
        values={values}
        classForValue={(value) => {
          const v = value as { count: number } | undefined;
          if (!v) return "color-empty";
          if (v.count === 1) return "color-scale-1";
          if (v.count === 2) return "color-scale-2";
          return "color-scale-3";
        }}
      />
    </div>
  );
};

export default HabitHeatmap;
