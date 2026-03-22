"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5084";

const chartConfig = {
  users: {
    label: "Активні користувачі",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface Stats {
  totalUsers: number;
  activeCourses: number;
  completedLessons: number;
  newToday: number;
  weeklyActivity: { day: string; users: number }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/admin/stats`)
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const statCards = stats
    ? [
        { title: "Користувачів", value: stats.totalUsers.toLocaleString() },
        { title: "Активних курсів", value: stats.activeCourses },
        { title: "Уроків завершено", value: stats.completedLessons.toLocaleString() },
        { title: "Нових сьогодні", value: stats.newToday },
      ]
    : [];

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Адмін панель</h1>

      {loading ? (
        <p className="text-muted-foreground">Завантаження...</p>
      ) : !stats ? (
        <p className="text-destructive">Не вдалося завантажити дані з API</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {statCards.map((stat) => (
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
                <AreaChart data={stats.weeklyActivity}>
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
        </>
      )}
    </div>
  );
}
