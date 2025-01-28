import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  ClipboardList,
  MessageSquare,
  Settings,
  PiggyBank
} from "lucide-react"
import Link from "next/link"
import { materias } from "@/lib/materias"
import { exams } from "@/lib/exams"
import calculateProgress from "@/hooks/calculateProgress"
import getNextExams from "@/hooks/nextExams"
import CustomCalendar from "./components/customCalendar"
import { PriceChart } from "./components/priceChart"

export default function Dashboard () {

  const actualDate = new Date()

  const actualDay = actualDate.getDate()
  const actualMonth = actualDate.toLocaleDateString('es-AR', { month: 'long' })
  const actualYear = actualDate.getFullYear()
  const fechaFormateada = `${actualDay} de ${actualMonth} de ${actualYear}`
  const nextExams = getNextExams(exams)
  const fechaDeExamenFormateada = (fecha) => {
    const fechaFormateada = `${fecha.getDate()} de ${fecha.toLocaleDateString('es-AR', { month: 'long' })} de ${fecha.getFullYear()}`
    return fechaFormateada
  }

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Sidebar */}
      {/* <aside className="fixed inset-y-0 left-0 w-64 bg-background border-r">
        <div className="p-6">
          <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </h2>
        </div>
        <nav className="px-4 space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <BookOpen className="h-4 w-4" />
            Materias del cuatri
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <ClipboardList className="h-4 w-4" />
            Tareas
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <CalendarDays className="h-4 w-4" />
            Calendario
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <MessageSquare className="h-4 w-4" />
            Foros
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Settings className="h-4 w-4" />
            Configuración
          </Button>
        </nav>
      </aside> */}

      {/* Main Content */}
      <main className="py-8 px-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Bienvenidos, Tuppers!</h1>
            <p className="text-muted-foreground">
              {fechaFormateada}
            </p>
          </div>
          <div className="flex gap-4">
            <Card>
              <CardContent className="flex flex-row gap-2 pt-4">
                <Link target="_blank" href={nextExams[0].urlConsigna} className="flex items-left gap-2 items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">{nextExams[0].titulo}</p>
                    <p className="text-sm text-muted-foreground">{fechaDeExamenFormateada(nextExams[0].fechaEntrega)}</p>
                  </div>
                  <Badge variant="destructive">Urgente</Badge>
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-row gap-2 pt-4">
                <Link target="_blank" href={nextExams[1].urlConsigna} className="flex items-left gap-2 items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">{nextExams[1].titulo}</p>
                    <p className="text-sm text-muted-foreground">{fechaDeExamenFormateada(nextExams[1].fechaEntrega)}</p>
                  </div>
                  <Badge variant="outline">Próximo</Badge>
                </Link>
              </CardContent>
            </Card>
          </div>
        </header>

        {/* Materias Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-6">Materias del Cuatrimestre</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {materias.map((materia) => {
              const progress = calculateProgress(materia.fechaInicio, materia.fechaFinalizacion)
              return (

                <Link key={materia.id} href={`/materias/${materia.id}`}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base">{materia.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{materia.professor}</p>
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

        {/* Calendar and Quick Links */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendario */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" /> Calendario Académico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CustomCalendar />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="flex gap-2 flex-row items-center">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <PiggyBank />
                </AvatarFallback>
              </Avatar>
              <CardTitle>Valor de la cuota para el mes de {actualMonth}:</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge variant="secondary" className="bg-green-600 text-white hover:bg-green-600">$77.900</Badge>
            </CardContent>
            <PriceChart />
          </Card>
        </div>
      </main >
    </div >
  );
}