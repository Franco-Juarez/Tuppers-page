'use client'
import { useState, useEffect, use } from 'react'
import { notFound } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import Link from "next/link"
import { ChevronLeftIcon, FileTextIcon, Link2Icon, VideoIcon } from "lucide-react"
import calculateProgress from "@/hooks/calculateProgress"
import { Link as LucideLink } from 'lucide-react'

export default function PaginaMateria ({ params }) {
  const [exams, setExams] = useState([])
  const [materia, setMateria] = useState({})
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [correlatividades, setCorrelatividades] = useState([]);

  // Unwrap params correctly using React.use()
  const { idMateria } = use(params)

  const getCorrelatividad = async (materiaId) => {
    try {
      const response = await fetch(`/api/correlatividad?idMateria=${materiaId}`);
      if (!response.ok) throw new Error('Error al obtener correlatividades');
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error al obtener correlatividades:", error);
      return [];
    }
  }

  useEffect(() => {
    async function fetchMateria () {
      try {
        const response = await fetch(`/api/materias?idMateria=${idMateria}`);
        if (!response.ok) throw new Error('Materia no encontrada');
        const result = await response.json();

        // API returns an array, so we need the first item
        if (!result || result.length === 0) {
          notFound();
          return;
        }

        const materiaData = result[0]; // Get the first item from the array

        const correlatividadData = await getCorrelatividad(materiaData.id_materia);
        console.log(correlatividadData);

        // Agrega esta línea para guardar las correlatividades en el estado
        setCorrelatividades(correlatividadData);

        // Format dates if they exist
        if (materiaData.fechaInicio && materiaData.fechaFinal) {
          // Ensure dates are properly formatted
          materiaData.fechaInicio = new Date(materiaData.fechaInicio);
          materiaData.fechaFinal = new Date(materiaData.fechaFinal);

          // Calculate progress with correctly formatted dates
          const calculatedProgress = calculateProgress(
            materiaData.fechaInicio,
            materiaData.fechaFinal
          );
          setProgress(calculatedProgress);
        }

        setMateria(materiaData);
      } catch (error) {
        console.error("Error:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    }

    if (idMateria) fetchMateria();
  }, [idMateria]);

  useEffect(() => {
    async function fetchExams () {
      if (!materia?.id_materia) return;

      try {
        const response = await fetch(`/api/exams?idMateria=${materia.id_materia}`);
        if (!response.ok) throw new Error('Error al obtener exámenes');
        const result = await response.json();
        setExams(result || []);
      } catch (error) {
        console.error("Error al obtener los exámenes:", error);
        setExams([]);
      }
    }

    if (materia.id_materia) fetchExams();
  }, [materia.id_materia]);


  if (loading) {
    return <div className="min-h-screen bg-muted/40 flex items-center justify-center">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <main className="py-8 px-10">
        <header className="mb-8">
          <div className="flex flex-col-reverse items-start lg:items-center lg:flex-row justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight">{materia.nombre || 'Materia'}</h1>
            <Button className='p-0 md:p-2' asChild variant="ghost" size="sm">
              <Link href="/">
                <ChevronLeftIcon className="mr-2 h-4 w-4" />
                Volver al Dashboard
              </Link>
            </Button>
          </div>
          <p className="text-muted-foreground mt-2">{materia.descripcion}</p>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Progreso de la materia</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={progress} className="h-3" />
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Horario</p>
                    <p className="font-medium">{materia.horarioCursada || 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Profesor</p>
                    <p className="font-medium">{materia.profesor || 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{materia.email || 'No especificado'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Tareas y Entregas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {exams && exams.length > 0 ? (
                  exams.map((exam) => (
                    <div key={exam.id_examen} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{exam.titulo}</p>
                        <p className="text-sm text-muted-foreground">
                          Entrega: {new Date(exam.fechaEntrega).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={
                        exam.status === 'completed' ? 'default' :
                          exam.status === 'in-progress' ? 'secondary' : 'destructive'
                      }>
                        {exam.status === 'completed' ? 'Completado' :
                          exam.status === 'in-progress' ? 'En Progreso' : 'Pendiente'}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No hay tareas o entregas disponibles</p>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recursos de la materia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {materia.recursos ? (
                  <Link
                    target='_blank'
                    className='hover:text-muted-foreground flex gap-1'
                    href={materia.recursos}
                  >
                    <LucideLink />
                    Link a recursos
                  </Link>
                ) : (
                  <p className="text-muted-foreground">No hay recursos disponibles</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Correlatividad</CardTitle>
              </CardHeader>
              <CardContent>
                {correlatividades.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Materia</TableHead>
                        <TableHead>Tipo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {correlatividades.map((materia) => (
                        <TableRow key={materia.id_correlatividad}>
                          <TableCell>{materia.materia_correlativa}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                materia.tipo === "debil" ? "secondary" :
                                  materia.tipo === "fuerte" ? "destructive" :
                                    "default"
                              }
                            >
                              {materia.tipo === "fuerte" ? "Fuerte" : "Débil"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground">No hay información de correlatividad</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}