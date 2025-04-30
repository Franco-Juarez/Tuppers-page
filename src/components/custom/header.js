"use client"
import Link from "next/link"
import { Calendar, Clock, ExternalLink, AlertCircle, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

export function DashboardHeader({ fechaFormateada, loading, exams = [] }) {

  return (
    <div className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Bienvenidos/as, Tuppers!</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{fechaFormateada}</span>
          </div>
        </div>

        <Badge variant="outline" className="w-fit px-3 py-1.5 text-sm font-medium">
          Ciclo Lectivo 2025
        </Badge>
      </div>

      <Separator />

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Próximos Exámenes</h2>
          {exams.length > 0 && (
            <Badge variant="secondary" className="font-normal">
              {exams.length} {exams.length === 1 ? "examen" : "exámenes"}
            </Badge>
          )}
        </div>

        {loading ? (
          <div className="focus::border-none flex h-24 items-center justify-center rounded-md border border-dashed bg-muted/50">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <p>Cargando exámenes...</p>
            </div>
          </div>
        ) : exams.filter(exam => new Date(exam.fechaEntrega) >= new Date()).length === 0 ? (
          <div className="focus::border-none flex h-24 items-center justify-center rounded-md border border-dashed bg-muted/50">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-5 w-5" />
              <p>No hay exámenes programados.</p>
            </div>
          </div>
        ) : (
          <ScrollArea className="md:max-h-[330px] pb-2">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              {exams
                .filter(exam => new Date(exam.fechaEntrega) >= new Date())
                .sort((a, b) => new Date(a.fechaEntrega) - new Date(b.fechaEntrega))
                .map((exam, index) => (
                  <Link
                    key={index}
                    href={`/materias/${exam.id_materia}`}
                    target="_blank"
                    className="focus:border-none visited:border-none block transition-opacity hover:opacity-90 "
                  >
                    <Card className={`h-full overflow-hidden ${index === 0 ? "border-destructive/50" : ""}`}>
                      {index === 0 && (
                        <div className="bg-destructive px-3 py-1 text-center text-xs font-medium text-destructive-foreground">
                          Urgente
                        </div>
                      )}
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1.5">
                            <h3 className="font-medium">{exam.titulo}</h3>
                            <div className="flex flex-col items-start gap-1.5 text-xs text-muted-foreground">
                              <span className="flex gap-1 " ><Clock className="h-3.5 w-3.5" /> {exam.fechaEntrega}</span>
                              <span>{exam.materia}</span>
                            </div>
                          </div>

                          {index === 0 ? (
                            <AlertCircle className="h-5 w-5 text-destructive" />
                          ) : (
                            <Badge variant="outline" className="flex items-center gap-1 text-xs">
                              Próximo
                              <ExternalLink className="h-3 w-3" />
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  )
}

export default function Header({ exams = [] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExamsOpen, setIsExamsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminToken, setAdminToken] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      setIsAdmin(true)
      setAdminToken(token)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setIsAdmin(false)
    setAdminToken(null)
    router.push('/')
  }

  return null
}

