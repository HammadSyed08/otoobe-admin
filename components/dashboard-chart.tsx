"use client"

import { useTheme } from "next-themes"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    total: 580,
  },
  {
    name: "Feb",
    total: 690,
  },
  {
    name: "Mar",
    total: 1100,
  },
  {
    name: "Apr",
    total: 1200,
  },
  {
    name: "May",
    total: 1800,
  },
  {
    name: "Jun",
    total: 1400,
  },
  {
    name: "Jul",
    total: 1700,
  },
  {
    name: "Aug",
    total: 1200,
  },
  {
    name: "Sep",
    total: 1800,
  },
  {
    name: "Oct",
    total: 2100,
  },
  {
    name: "Nov",
    total: 1800,
  },
  {
    name: "Dec",
    total: 2200,
  },
]

export function DashboardChart() {
  const { theme } = useTheme()

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Bar dataKey="total" fill="rgba(100, 116, 139, 0.8)" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}
