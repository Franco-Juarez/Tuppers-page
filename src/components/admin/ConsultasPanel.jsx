'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CheckCircle2, Filter, Pencil, Plus, Trash2 } from "lucide-react";

export default function ConsultasPanel() {
  const [consultas, setConsultas] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingConsulta, setEditingConsulta] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [consultaToDelete, setConsultaToDelete] = useState(null);
  const [filter, setFilter] = useState({
    idMateria: 'all',
    estado: 'all',
    noRevisadas: false,
    reportadas: false
  });

  // Cargar consultas y materias al montar el componente
  useEffect(() => {
    fetchConsultas();
    fetchMaterias();
  }, []);

  // Cargar consultas con filtros aplicados
  useEffect(() => {
    fetchConsultas();
  }, [filter]);

  const fetchConsultas = async () => {
    try {
      setLoading(true);
      let url = '/api/consultas?';
      
      if (filter.idMateria && filter.idMateria !== 'all') {
        url += `idMateria=${filter.idMateria}&`;
      }
      
      if (filter.estado && filter.estado !== 'all') {
        url += `estado=${filter.estado}&`;
      }
      
      if (filter.noRevisadas) {
        url += 'noRevisadas=1&';
      }
      
      if (filter.reportadas) {
        url += 'reportadas=1&';
      }
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setConsultas(data);
      } else {
        console.error('Error al obtener consultas');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaterias = async () => {
    try {
      const response = await fetch('/api/materias');
      if (response.ok) {
        const data = await response.json();
        setMaterias(data);
      } else {
        console.error('Error al obtener materias');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilter({
      ...filter,
      [key]: value
    });
  };

  const handleResetFilter = () => {
    setFilter({
      idMateria: 'all',
      estado: 'all',
      noRevisadas: false,
      reportadas: false
    });
  };

  const handleEditConsulta = async () => {
    try {
      const response = await fetch('/api/consultas', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_consulta: editingConsulta.id_consulta,
          reportada: editingConsulta.reportada
        }),
      });

      if (response.ok) {
        setEditingConsulta(null);
        fetchConsultas();
      } else {
        console.error('Error al actualizar consulta');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteConsulta = async () => {
    try {
      const response = await fetch(`/api/consultas?idConsulta=${consultaToDelete.id_consulta}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setIsDeleteDialogOpen(false);
        setConsultaToDelete(null);
        fetchConsultas();
      } else {
        console.error('Error al eliminar consulta');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingConsulta({
      ...editingConsulta,
      [name]: value
    });
  };

  const handleSelectChange = (name, value) => {
    setEditingConsulta({
      ...editingConsulta,
      [name]: value
    });
  };

  const handleCheckboxChange = (name, checked) => {
    setEditingConsulta({
      ...editingConsulta,
      [name]: checked
    });
  };

  const openEditDialog = (consulta) => {
    setEditingConsulta(consulta);
  };

  const openDeleteDialog = (consulta) => {
    setConsultaToDelete(consulta);
    setIsDeleteDialogOpen(true);
  };

  // Estado de la consulta y colores de badge
  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'aprobada':
        return <Badge className="bg-green-500">Aprobada</Badge>;
      case 'pendiente':
        return <Badge className="bg-yellow-500">Pendiente</Badge>;
      case 'rechazada':
        return <Badge className="bg-red-500">Rechazada</Badge>;
      default:
        return <Badge className="bg-gray-500">Desconocido</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de Consultas</h2>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="filter-materia">Filtrar por Materia</Label>
              <Select
                value={filter.idMateria}
                onValueChange={(value) => handleFilterChange('idMateria', value)}
              >
                <SelectTrigger id="filter-materia" className="w-[200px]">
                  <SelectValue placeholder="Todas las materias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las materias</SelectItem>
                  {materias.map((materia) => (
                    <SelectItem key={materia.id_materia} value={materia.id_materia.toString()}>
                      {materia.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="filter-estado">Estado</Label>
              <Select
                value={filter.estado}
                onValueChange={(value) => handleFilterChange('estado', value)}
              >
                <SelectTrigger id="filter-estado" className="w-[180px]">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="aprobada">Aprobada</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="rechazada">Rechazada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex space-x-2 items-end">
              <Button 
                variant="outline" 
                className={filter.noRevisadas ? "bg-blue-50" : ""}
                onClick={() => handleFilterChange('noRevisadas', !filter.noRevisadas)}
              >
                <CheckCircle2 className={`h-4 w-4 mr-2 ${filter.noRevisadas ? "text-blue-500" : ""}`} />
                No revisadas
              </Button>
              
              <Button 
                variant="outline" 
                className={filter.reportadas ? "bg-red-50" : ""}
                onClick={() => handleFilterChange('reportadas', !filter.reportadas)}
              >
                <CheckCircle2 className={`h-4 w-4 mr-2 ${filter.reportadas ? "text-red-500" : ""}`} />
                Reportadas
              </Button>
            </div>
            
            <Button variant="ghost" onClick={handleResetFilter}>
              Limpiar filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de consultas */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Materia</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Respuestas</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consultas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No hay consultas disponibles
                  </TableCell>
                </TableRow>
              ) : (
                consultas.map((consulta) => (
                  <TableRow key={consulta.id_consulta} className={
                    consulta.reportada ? "bg-red-50" : 
                    !consulta.revisada ? "bg-blue-50" : ""
                  }>
                    <TableCell className="font-medium">
                      {consulta.titulo}
                      {!consulta.revisada && <Badge className="ml-2 bg-blue-500">Nueva</Badge>}
                      {consulta.reportada && <Badge className="ml-2 bg-red-500">Reportada</Badge>}
                    </TableCell>
                    <TableCell>{consulta.materia}</TableCell>
                    <TableCell>
                      {format(new Date(consulta.fecha_creacion), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                      {getEstadoBadge(consulta.estado)}
                    </TableCell>
                    <TableCell>{consulta.num_respuestas}</TableCell>
                    <TableCell className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => openEditDialog(consulta)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => openDeleteDialog(consulta)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Diálogo de Edición */}
      {editingConsulta && (
        <Dialog open={!!editingConsulta} onOpenChange={(open) => !open && setEditingConsulta(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Detalles de la Consulta</DialogTitle>
              <DialogDescription>
                Información de la consulta y opciones de moderación.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Información en modo solo lectura */}
              <div className="space-y-2">
                <Label>Título</Label>
                <div className="p-2 border rounded-md bg-gray-50">{editingConsulta.titulo}</div>
              </div>
              
              <div className="space-y-2">
                <Label>Descripción</Label>
                <div className="p-2 border rounded-md bg-gray-50 min-h-[100px] whitespace-pre-wrap">
                  {editingConsulta.descripcion}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Materia</Label>
                  <div className="p-2 border rounded-md bg-gray-50">{editingConsulta.materia}</div>
                </div>
                
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <div className="p-2 border rounded-md bg-gray-50">
                    {editingConsulta.estado === 'aprobada' ? 'Aprobada' : 
                     editingConsulta.estado === 'pendiente' ? 'Pendiente' : 'Rechazada'}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fecha de creación</Label>
                  <div className="p-2 border rounded-md bg-gray-50">
                    {format(new Date(editingConsulta.fecha_creacion), 'dd/MM/yyyy')}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Respuestas</Label>
                  <div className="p-2 border rounded-md bg-gray-50">
                    {editingConsulta.num_respuestas}
                  </div>
                </div>
              </div>
              
              {/* Único campo editable */}
              <div className="mt-4 p-4 border rounded-md bg-gray-100">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-reportada"
                    checked={editingConsulta.reportada === 1}
                    onChange={(e) => handleCheckboxChange('reportada', e.target.checked ? 1 : 0)}
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <Label htmlFor="edit-reportada" className="text-base font-medium">
                    Marcar como reportada
                  </Label>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Las consultas reportadas pueden ser revisadas por los administradores para su moderación.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingConsulta(null)}>
                Cancelar
              </Button>
              <Button onClick={handleEditConsulta}>Guardar Cambios</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Diálogo de Confirmación de Eliminación */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar la consulta "{consultaToDelete?.titulo}"? 
              Esta acción eliminará también todas las respuestas asociadas y no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteConsulta}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
