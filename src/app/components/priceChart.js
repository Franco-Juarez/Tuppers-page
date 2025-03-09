"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, ExternalLink } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export function PriceChart () {
  const [chartData, setChartData] = useState([
    { month: "Apr", Cuota: 51900 },
    { month: "May", Cuota: 55900 },
    { month: "Jun", Cuota: 60900 },
    { month: "Jul", Cuota: 63500 },
    { month: "Ago", Cuota: 67900 },
    { month: "Sep", Cuota: 69900 },
    { month: "Oct", Cuota: 70000 },
    { month: "Nov", Cuota: 75900 },
    { month: "Dic", Cuota: 77900 },
    { month: "Ene", Cuota: 77900 },
    { month: "Feb", Cuota: 77900 },
    { month: "Mar", Cuota: 77900 },
  ])
  const [trend, setTrend] = useState(0)
  const [isTrendPositive, setIsTrendPositive] = useState(true)

  useEffect(() => {
    if (chartData.length > 1) {
      const firstValue = chartData[0].Cuota
      const lastValue = chartData[chartData.length - 1].Cuota
      const percentageChange = ((lastValue - firstValue) / firstValue) * 100
      setTrend(percentageChange.toFixed(2))
      setIsTrendPositive(percentageChange >= 0)
    }
  }, [chartData])

  const chartConfig = {
    Cuota: {
      label: "Cuota",
      color: "hsl(var(--primary))",
    },
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <Card className="overflow-hidden border shadow-md">
      <CardHeader className="bg-muted/30 pb-2">
        <CardTitle className="text-lg font-medium">Evolución de la Cuota</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-6">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{formatCurrency(chartData[chartData.length - 1].Cuota)}</span>
            <Badge variant={isTrendPositive ? "default" : "destructive"} className="flex items-center gap-1">
              {isTrendPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              {trend}%
            </Badge>
          </div>
          <Badge variant="outline" className="font-normal">
            <Link
              href="https://www.frbb.utn.edu.ar/frbb/info/secretarias/academica/carreras/pregrado/tup/instructivo-pagos-tup.pdf"
              target="_blank"
              className="flex items-center gap-1 text-xs"
            >
              Ver PDF <ExternalLink className="h-3 w-3" />
            </Link>
          </Badge>
        </div>

        <div className="h-[240px] w-full">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="colorCuota" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.0} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.2)" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  tickFormatter={(value) => `$${value / 1000}k`}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  stroke="hsl(var(--muted-foreground))"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" formatter={(value) => formatCurrency(value)} />}
                />
                <Area
                  dataKey="Cuota"
                  type="monotone"
                  fill="url(#colorCuota)"
                  fillOpacity={0.8}
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="bg-muted/20 p-4 text-sm">
        <div className="flex w-full flex-col gap-1 text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <span className="font-medium text-foreground">Variación:</span>
            {isTrendPositive ? (
              <span className="flex items-center text-primary">
                +{trend}% <TrendingUp className="ml-1 h-3.5 w-3.5" />
              </span>
            ) : (
              <span className="flex items-center text-destructive">
                {trend}% <TrendingDown className="ml-1 h-3.5 w-3.5" />
              </span>
            )}
            desde Abril
          </p>
          <p>Período: Abril - Febrero {new Date().getFullYear()} (Datos actualizados)</p>
        </div>
      </CardFooter>
    </Card>
  )
}

