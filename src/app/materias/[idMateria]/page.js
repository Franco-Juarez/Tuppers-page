'use client'
import * as React from 'react'
import { notFound } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import Link from "next/link";
import { materias } from "@/lib/materias";
import { CalendarIcon, ChevronLeftIcon, FileTextIcon, Link2Icon, VideoIcon } from "lucide-react";
import calculateProgress from "@/hooks/calculateProgress";

export default function PaginaMateria ({ params }) {
  const { idMateria } = React.use(params);
  const materia = materias.find(s => s.id === idMateria);

  if (!materia) return notFound();

  const progress = calculateProgress(materia.fechaInicio, materia.fechaFinalizacion)

  return (
    <div className="min-h-screen bg-muted/40">

      <main className="py-8 px-10">
        <header className="mb-8">
          <div className="flex justify-between items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight">{materia.name}</h1>
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <ChevronLeftIcon className="mr-2 h-4 w-4" />
                Volver al Dashboard
              </Link>
            </Button>
          </div>
          <p className="text-muted-foreground mt-2">{materia.description}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información Principal */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Progreso del Curso</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={progress} className="h-3" />
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Horario</p>
                    <p className="font-medium">{materia.schedule}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Profesor</p>
                    <p className="font-medium">{materia.professor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{materia.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tareas y Entregas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {materia.tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Entrega: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={
                      task.status === 'completed' ? 'default' :
                        task.status === 'in-progress' ? 'secondary' : 'destructive'
                    }>
                      {task.status === 'completed' ? 'Completado' :
                        task.status === 'in-progress' ? 'En Progreso' : 'Pendiente'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar de Recursos */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recursos del Curso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {materia.resources.map((resource) => (
                  <div key={resource.id} className="flex items-start gap-4 p-3 border rounded-lg">
                    <span className="mt-1">
                      {resource.type === 'document' && <FileTextIcon className="h-5 w-5" />}
                      {resource.type === 'link' && <Link2Icon className="h-5 w-5" />}
                      {resource.type === 'video' && <VideoIcon className="h-5 w-5" />}
                    </span>
                    <div>
                      <p className="font-medium">{resource.title}</p>
                      <Button variant="link" size="sm" className="h-auto p-0">
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          Ver recurso
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Correlatividad</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Materia</TableHead>
                      <TableHead>Tipo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materia.correlatividad.map((correlatividad) => (
                      <TableRow key={correlatividad.id}>
                        <TableCell>{correlatividad.title}</TableCell>
                        <TableCell>{correlatividad.type === "fuerte" ? "Fuerte" : "Débil"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}