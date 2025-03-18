"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, ExternalLink } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from "recharts"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
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
    { month: "Mar", Cuota: 80300 },
  ])
  const [inflationData, setInflationData] = useState([])
  const [combinedData, setCombinedData] = useState([])
  const [trend, setTrend] = useState(0)
  const [isTrendPositive, setIsTrendPositive] = useState(true)
  const [inflationTrend, setInflationTrend] = useState(0)

  useEffect(() => {
    // Fetch inflation data
    async function fetchInflationData() {
      try {
        const response = await fetch('./api/inflation')
        const result = await response.json()
        setInflationData(result)
      } catch (error) {
        console.error("Error al obtener datos de inflación:", error)
      }
    }
    
    fetchInflationData()
  }, [])

  useEffect(() => {
    if (chartData.length > 1) {
      const firstValue = chartData[0].Cuota
      const lastValue = chartData[chartData.length - 1].Cuota
      const percentageChange = ((lastValue - firstValue) / firstValue) * 100
      setTrend(percentageChange.toFixed(2))
      setIsTrendPositive(percentageChange >= 0)
    }

    if (inflationData.length > 0) {
      // Get the accumulated inflation from the last item
      const totalInflation = inflationData[inflationData.length - 1].accumulatedInflation
      setInflationTrend(totalInflation)

      // Combine the data
      const combined = chartData.map((item, index) => {
        if (index < inflationData.length) {
          return {
            ...item,
            Inflación: inflationData[index].inflation,
            "Inflación Acumulada": inflationData[index].accumulatedInflation
          }
        }
        return item
      })
      
      setCombinedData(combined)
    }
  }, [chartData, inflationData])

  const chartConfig = {
    Cuota: {
      label: "Cuota",
      color: "hsl(var(--primary))",
    },
    "Inflación Acumulada": {
      label: "Inflación Acumulada",
      color: "hsl(var(--destructive))",
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercentage = (value) => {
    return `${value}%`
  }

  return (
    <Card className="overflow-hidden border shadow-md">
      <CardHeader className="bg-muted/30 pb-2">
        <CardTitle className="text-lg font-medium">Evolución de la Cuota vs Inflación</CardTitle>
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
                data={combinedData.length > 0 ? combinedData : chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="colorCuota" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorInflacion" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.0} />
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
                  yAxisId="left"
                  tickFormatter={(value) => `$${value / 1000}k`}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(value) => `${value}%`}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  stroke="hsl(var(--muted-foreground))"
                  domain={[0, 'dataMax + 10']}
                />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === "Cuota") return formatCurrency(value);
                    if (name === "Inflación Acumulada") return formatPercentage(value);
                    return value;
                  }}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  dataKey="Cuota"
                  type="monotone"
                  fill="url(#colorCuota)"
                  fillOpacity={0.8}
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
                {inflationData.length > 0 && (
                  <Area
                    yAxisId="right"
                    dataKey="Inflación Acumulada"
                    type="monotone"
                    fill="url(#colorInflacion)"
                    fillOpacity={0.8}
                    stroke="hsl(var(--destructive))"
                    strokeWidth={2}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="bg-muted/20 p-4 text-sm">
        <div className="flex w-full flex-col gap-1 text-muted-foreground">
          <div className="flex justify-between">
            <p className="flex items-center gap-1.5">
              <span className="font-medium text-foreground">Variación Cuota:</span>
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
            {inflationData.length > 0 && (
              <p className="flex items-center gap-1.5">
                <span className="font-medium text-foreground">Inflación Acumulada:</span>
                <span className="flex items-center text-destructive">
                  {inflationTrend}% <TrendingUp className="ml-1 h-3.5 w-3.5" />
                </span>
              </p>
            )}
          </div>
          <p>Período: Abril - Febrero {new Date().getFullYear()} (Datos actualizados)</p>
        </div>
      </CardFooter>
    </Card>
  )
}

