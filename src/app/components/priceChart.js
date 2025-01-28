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

import useBitcoinPrice from '@/hooks/calculatePrice';

// Función para generar datos ficticios
function generateFakeData () {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return months.map((month, index) => ({
    month,
    Cuota: 75 + index * 0.27, // Incremento ficticio en la cuota
    Bitcoin: 5 + index * 43, // Incremento ficticio del precio de Bitcoin
  }));
}

export function PriceChart () {
  const [chartData, setChartData] = useState(generateFakeData());
  const [trend, setTrend] = useState(0);
  const bitcoinPrice = useBitcoinPrice() || 20000;

  useEffect(() => {
    // Generar datos dinámicamente para 12 meses usando un valor fijo de Bitcoin
    const data = generateFakeData();
    setChartData(data);

    // Calcular la tendencia (último valor vs. primero)
    const cuotaChange =
      ((data[data.length - 1].Cuota - data[0].Cuota) / data[0].Cuota) * 100;
    setTrend(cuotaChange.toFixed(1)); // Redondear a 1 decimal
  }, []);

  const chartConfig = {
    desktop: {
      label: 'Cuota',
      color: 'hsl(var(--chart-1))',
    },
    mobile: {
      label: 'Bitcoin',
      color: 'hsl(var(--chart-2))',
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
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="Bitcoin"
              type="natural"
              fill="var(--color-mobile)"
              fillOpacity={0.4}
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="Cuota"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by {trend}% this year <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Enero - Diciembre 2025 (Datos ficticios)
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
