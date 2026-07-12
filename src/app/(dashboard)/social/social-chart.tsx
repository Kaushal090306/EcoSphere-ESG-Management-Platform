"use client";

import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function SocialChart({ data }: { data: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Department CSR Participation Rate</CardTitle>
        <CardDescription>Percentage of active employees participating in CSR events</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2D38" vertical={false} />
            <XAxis dataKey="department" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip
              contentStyle={{ backgroundColor: "#181922", border: "1px solid #2A2D38", borderRadius: "12px", color: "#ffffff" }}
            />
            <Bar dataKey="participation" radius={[4, 4, 0, 0]} barSize={35}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#14b8a6" : "#7C3AED"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
