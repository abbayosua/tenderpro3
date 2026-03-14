'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  ChartContainer, ChartTooltip, ChartTooltipContent,
  type ChartConfig 
} from '@/components/ui/chart';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';

interface ChartData {
  name: string;
  value: number;
  fill: string;
}

interface BarChartData {
  month: string;
  [key: string]: string | number;
}

interface PieChartCardProps {
  title: string;
  description: string;
  data: ChartData[];
  config: ChartConfig;
}

export function PieChartCard({ title, description, data, config }: PieChartCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-64">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

interface BarChartCardProps {
  title: string;
  description: string;
  data: BarChartData[];
  config: ChartConfig;
  bars: { dataKey: string; fill: string }[];
}

export function BarChartCard({ title, description, data, config, bars }: BarChartCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-64">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            {bars.map((bar, index) => (
              <Bar 
                key={index} 
                dataKey={bar.dataKey} 
                fill={bar.fill} 
                radius={[4, 4, 0, 0]} 
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
