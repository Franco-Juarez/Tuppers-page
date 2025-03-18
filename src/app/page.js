'use client'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CalendarDays } from "lucide-react"
import Link from "next/link"
import calculateProgress from "@/hooks/calculateProgress"
import CustomCalendar from "./components/customCalendar"
import { PriceChart } from "./components/priceChart"
import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/custom/header"

export default function Dashboard () {
  const [materias, setMaterias] = useState([])
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [actualDate, setActualDate] = useState(new Date())
  const actualDay = actualDate.getDate()
  const actualMonth = actualDate.toLocaleDateString('es-AR', { month: 'long' })
  const actualYear = actualDate.getFullYear()
  const fechaFormateada = `${actualDay} de ${actualMonth} de ${actualYear}`


  useEffect(() => {
    async function fetchMaterias () {
      try {
        const response = await fetch('./api/materias')
        const result = await response.json()
        console.log(result)
        setMaterias(result)
      } catch (error) {
        console.error("Error al obtener las materias:", error)
      } finally {
        setLoading(false)
      }
    }
    async function fetchExams () {
      try {
        const response = await fetch('./api/exams')
        const result = await response.json()
        console.log(result)
        setExams(result)
      } catch (error) {
        console.error("Error al obtener los exámenes:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchExams()
    fetchMaterias()
  }, [])

  return (
    <div className="min-h-screen bg-muted/40">

      <main className="py-8 px-4 lg:px-10">

        <DashboardHeader
          fechaFormateada={fechaFormateada}
          loading={loading}
          exams={exams}
          materias={materias}
        />

        <section className="my-8">
          <h2 className="text-xl font-semibold mb-6">Materias del Cuatrimestre</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {materias.map((materia) => {
              const progress = calculateProgress(materia.fechaInicio, materia.fechaFinal)
              return (
                <Link key={materia.id_materia} href={`/materias/${materia.id_materia}`}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base">{materia.nombre}</CardTitle>
                      <p className="text-sm text-muted-foreground">{materia.profesor}</p>
                    </CardHeader>
                    <CardContent>
                      <Progress value={progress} className="h-2 mb-2" />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progreso</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 items-start gap-4">
          <Card className="flex flex-col justify-center lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" /> Calendario Académico
              </CardTitle>
            </CardHeader>
            <CardContent className="flex p-2 flex-wrap flex-col xl:flex-row items-center justify-start w-full">
              <CustomCalendar exams={exams} />
            </CardContent>
          </Card>
          <Card>
            <PriceChart />
          </Card>
        </div>
      </main >
    </div >
  );
}