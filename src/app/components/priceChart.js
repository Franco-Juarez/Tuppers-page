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

export function PriceChart () {
  const [chartData, setChartData] = useState([]);
  const [trend, setTrend] = useState(0);
  const bitcoinPriceData = useBitcoinPrice();

  useEffect(() => {
    if (!bitcoinPriceData || !bitcoinPriceData.BitcoinPrices) return;

    // Mapear los datos reales del JSON
    const formattedData = bitcoinPriceData.BitcoinPrices.map((entry) => ({
      month: entry.month,
      Cuota: 77900,
      Bitcoin: entry.value || 0,
    }));

    setChartData(formattedData);

    // Calcular la variación de la cuota en el año
    if (formattedData.length > 1) {
      const cuotaChange =
        ((formattedData[formattedData.length - 1].Cuota - formattedData[0].Cuota) /
          formattedData[0].Cuota) *
        100;
      setTrend(cuotaChange.toFixed(1)); // Redondear a 1 decimal
    }
  }, [bitcoinPriceData]); // Se ejecuta cuando cambia bitcoinPriceData

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
              El valor de la cuota varió {trend}% durante el año <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Enero - Diciembre 2025 (Datos actualizados)
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
