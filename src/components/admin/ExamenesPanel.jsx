'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Pencil, Plus, Trash2 } from "lucide-react";

export default function ExamenesPanel() {
  const [examenes, setExamenes] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingExamen, setEditingExamen] = useState(null);
  const [examenToDelete, setExamenToDelete] = useState(null);
  const [newExamen, setNewExamen] = useState({
    titulo: '',
    consigna: '',
    id_materia: '',
    fechaEntrega: null
  });

  // Cargar exámenes y materias al montar el componente
  useEffect(() => {
    fetchExamenes();
    fetchMaterias();
  }, []);

  const fetchExamenes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/exams');
      if (response.ok) {
        const data = await response.json();
        setExamenes(data);
      } else {
        console.error('Error al obtener exámenes');
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

  const handleInputChange = (e, isEditing = false) => {
    const { name, value } = e.target;
    
    if (isEditing) {
      setEditingExamen({
        ...editingExamen,
        [name]: value
      });
    } else {
      setNewExamen({
        ...newExamen,
        [name]: value
      });
    }
  };

  const handleSelectChange = (name, value, isEditing = false) => {
    if (isEditing) {
      setEditingExamen({
        ...editingExamen,
        [name]: value
      });
    } else {
      setNewExamen({
        ...newExamen,
        [name]: value
      });
    }
  };

  const handleDateChange = (date, isEditing = false) => {
    if (isEditing) {
      setEditingExamen({
        ...editingExamen,
        fechaEntrega: date ? format(date, 'yyyy-MM-dd') : null
      });
    } else {
      setNewExamen({
        ...newExamen,
        fechaEntrega: date ? format(date, 'yyyy-MM-dd') : null
      });
    }
  };

  const handleCreateExamen = async () => {
    try {
      const response = await fetch('/api/exams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExamen),
      });

      if (response.ok) {
        // Limpiar formulario y recargar exámenes
        setNewExamen({
          titulo: '',
          consigna: '',
          id_materia: '',
          fechaEntrega: null
        });
        setIsDialogOpen(false);
        fetchExamenes();
      } else {
        console.error('Error al crear examen');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEditExamen = async () => {
    try {
      const response = await fetch(`/api/exams?idExamen=${editingExamen.id_examen}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingExamen),
      });

      if (response.ok) {
        setEditingExamen(null);
        fetchExamenes();
      } else {
        console.error('Error al actualizar examen');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteExamen = async () => {
    try {
      const response = await fetch(`/api/exams?idExamen=${examenToDelete.id_examen}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setIsDeleteDialogOpen(false);
        setExamenToDelete(null);
        fetchExamenes();
      } else {
        console.error('Error al eliminar examen');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const openEditDialog = (examen) => {
    setEditingExamen({
      ...examen,
      fechaEntrega: examen.fechaEntrega || null
    });
  };

  const openDeleteDialog = (examen) => {
    setExamenToDelete(examen);
    setIsDeleteDialogOpen(true);
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
        <h2 className="text-2xl font-bold">Gestión de Exámenes</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Examen
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Examen</DialogTitle>
              <DialogDescription>
                Completa los datos para crear un nuevo examen.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título del Examen</Label>
                <Input
                  id="titulo"
                  name="titulo"
                  value={newExamen.titulo}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="id_materia">Materia</Label>
                <Select
                  value={newExamen.id_materia}
                  onValueChange={(value) => handleSelectChange('id_materia', value)}
                >
                  <SelectTrigger id="id_materia">
                    <SelectValue placeholder="Seleccionar materia" />
                  </SelectTrigger>
                  <SelectContent>
                    {materias.map((materia) => (
                      <SelectItem key={materia.id_materia} value={materia.id_materia.toString()}>
                        {materia.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Fecha de Entrega</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newExamen.fechaEntrega ? (
                        format(new Date(newExamen.fechaEntrega), 'PPP')
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newExamen.fechaEntrega ? new Date(newExamen.fechaEntrega) : undefined}
                      onSelect={(date) => handleDateChange(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="consigna">Consigna del Examen</Label>
                <Textarea
                  id="consigna"
                  name="consigna"
                  value={newExamen.consigna}
                  onChange={(e) => handleInputChange(e)}
                  rows={5}
                  placeholder="Describe la consigna del examen..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateExamen}>Crear Examen</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabla de exámenes */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Materia</TableHead>
                <TableHead>Fecha de Entrega</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {examenes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No hay exámenes disponibles
                  </TableCell>
                </TableRow>
              ) : (
                examenes.map((examen) => (
                  <TableRow key={examen.id_examen}>
                    <TableCell className="font-medium">{examen.titulo}</TableCell>
                    <TableCell>{examen.materia}</TableCell>
                    <TableCell>
                      {examen.fechaEntrega ? format(new Date(examen.fechaEntrega), 'dd/MM/yyyy') : '-'}
                    </TableCell>
                    <TableCell className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => openEditDialog(examen)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => openDeleteDialog(examen)}
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
      {editingExamen && (
        <Dialog open={!!editingExamen} onOpenChange={(open) => !open && setEditingExamen(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Editar Examen</DialogTitle>
              <DialogDescription>
                Modifica los datos del examen.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-titulo">Título del Examen</Label>
                <Input
                  id="edit-titulo"
                  name="titulo"
                  value={editingExamen.titulo}
                  onChange={(e) => handleInputChange(e, true)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-id_materia">Materia</Label>
                <Select
                  value={editingExamen.id_materia.toString()}
                  onValueChange={(value) => handleSelectChange('id_materia', value, true)}
                >
                  <SelectTrigger id="edit-id_materia">
                    <SelectValue placeholder="Seleccionar materia" />
                  </SelectTrigger>
                  <SelectContent>
                    {materias.map((materia) => (
                      <SelectItem key={materia.id_materia} value={materia.id_materia.toString()}>
                        {materia.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Fecha de Entrega</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editingExamen.fechaEntrega ? (
                        format(new Date(editingExamen.fechaEntrega), 'PPP')
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={editingExamen.fechaEntrega ? new Date(editingExamen.fechaEntrega) : undefined}
                      onSelect={(date) => handleDateChange(date, true)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-consigna">Consigna del Examen</Label>
                <Textarea
                  id="edit-consigna"
                  name="consigna"
                  value={editingExamen.consigna}
                  onChange={(e) => handleInputChange(e, true)}
                  rows={5}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingExamen(null)}>
                Cancelar
              </Button>
              <Button onClick={handleEditExamen}>Guardar Cambios</Button>
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
              ¿Estás seguro de que deseas eliminar el examen "{examenToDelete?.titulo}"? 
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteExamen}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 