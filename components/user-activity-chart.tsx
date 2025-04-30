"use client"

import { useTheme } from "next-themes"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    total: 120,
  },
  {
    name: "Feb",
    total: 180,
  },
  {
    name: "Mar",
    total: 240,
  },
  {
    name: "Apr",
    total: 280,
  },
  {
    name: "May",
    total: 350,
  },
  {
    name: "Jun",
    total: 390,
  },
  {
    name: "Jul",
    total: 420,
  },
  {
    name: "Aug",
    total: 490,
  },
  {
    name: "Sep",
    total: 540,
  },
  {
    name: "Oct",
    total: 580,
  },
  {
    name: "Nov",
    total: 650,
  },
  {
    name: "Dec",
    total: 720,
  },
]

export function UserActivityChart() {
  const { theme } = useTheme()

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border border-gray-800 bg-gray-950 p-2 shadow-md">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-400">Month</span>
                      <span className="text-sm font-bold text-white">{payload[0].payload.name}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-400">Users</span>
                      <span className="text-sm font-bold text-white">{payload[0].value}</span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#4f46e5"
          strokeWidth={2}
          activeDot={{
            r: 6,
            style: { fill: "#4f46e5", opacity: 0.8 },
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
