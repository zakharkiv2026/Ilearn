"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

const activityData = [
  { day: "Пн", users: 40 },
  { day: "Вт", users: 65 },
  { day: "Ср", users: 55 },
  { day: "Чт", users: 80 },
  { day: "Пт", users: 72 },
  { day: "Сб", users: 30 },
  { day: "Нд", users: 20 },
];

const chartConfig = {
  users: {
    label: "Активні користувачі",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const stats = [
  { title: "Користувачів", value: "1,284" },
  { title: "Активних курсів", value: "42" },
  { title: "Уроків завершено", value: "8,530" },
  { title: "Нових сьогодні", value: "23" },
];

export default function AdminDashboard() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Адмін панель</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Активність за тиждень</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <AreaChart data={activityData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="users"
                stroke="var(--chart-1)"
                fill="var(--chart-1)"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
