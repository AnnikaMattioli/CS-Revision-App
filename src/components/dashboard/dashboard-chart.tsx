"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { weeklyActivity } from "@/lib/demo-data";

export function ActivityChart() {
  const total = weeklyActivity.reduce((sum, item) => sum + item.questions, 0);
  return (
    <div>
      <div className="h-44" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyActivity} margin={{ top: 12, right: 0, left: 0, bottom: 0 }}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 12, fontWeight: 700 }} />
            <Tooltip cursor={{ fill: "var(--surface-soft)" }} contentStyle={{ borderRadius: 12, background: "var(--surface)", borderColor: "var(--border)", fontWeight: 700 }} />
            <Bar dataKey="questions" fill="var(--violet)" radius={[7, 7, 7, 7]} maxBarSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="sr-only">You answered {total} questions this week. The busiest day was Saturday with 38 questions.</p>
    </div>
  );
}
