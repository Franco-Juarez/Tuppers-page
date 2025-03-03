'use client';

import { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export function PriceChart () {
  const [chartData, setChartData] = useState([
    { month: 'Apr', Cuota: 51900 },
    { month: 'May', Cuota: 55900 },
    { month: 'Jun', Cuota: 60900 },
    { month: 'Jul', Cuota: 63500 },
    { month: 'Ago', Cuota: 67900 },
    { month: 'Sep', Cuota: 69900 },
    { month: 'Oct', Cuota: 70000 },
    { month: 'Nov', Cuota: 75900 },
    { month: 'Dic', Cuota: 77900 },
    { month: 'Ene', Cuota: 77900 },
    { month: 'Feb', Cuota: 77900 },
  ]);
  const [trend, setTrend] = useState(0);

  useEffect(() => {
    if (chartData.length > 1) {
      const firstValue = chartData[0].Cuota;
      const lastValue = chartData[chartData.length - 1].Cuota;
      const percentageChange = ((lastValue - firstValue) / firstValue) * 100;
      setTrend(percentageChange.toFixed(2));
    }
  }, [chartData]);

  const chartConfig = {
    desktop: {
      label: 'Cuota',
      color: 'hsl(var(--chart-1))',
    },
  };

  return (
    <Card className="border-none shadow-none">
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="Cuota"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              La cuota varió {trend}% desde Abril <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Abril - Febrero {new Date().getFullYear()} (Datos actualizados)
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
