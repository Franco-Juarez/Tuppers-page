'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Pencil, Plus, Trash2 } from "lucide-react";

export default function MateriasPanel() {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMateria, setEditingMateria] = useState(null);
  const [newMateria, setNewMateria] = useState({
    nombre: '',
    profesor: '',
    email: '',
    fechaInicio: null,
    fechaFinal: null,
    horarioCursada: '',
    descripcion: '',
    recursos: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [materiaToDelete, setMateriaToDelete] = useState(null);

  // Cargar materias al montar el componente
  useEffect(() => {
    fetchMaterias();
  }, []);

  const fetchMaterias = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/materias');
      if (response.ok) {
        const data = await response.json();
        setMaterias(data);
      } else {
        console.error('Error al obtener materias');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e, isEditing = false) => {
    const { name, value } = e.target;
    
    if (isEditing) {
      setEditingMateria({
        ...editingMateria,
        [name]: value
      });
    } else {
      setNewMateria({
        ...newMateria,
        [name]: value
      });
    }
  };

  const handleDateChange = (date, field, isEditing = false) => {
    if (isEditing) {
      setEditingMateria({
        ...editingMateria,
        [field]: date ? format(date, 'yyyy-MM-dd') : null
      });
    } else {
      setNewMateria({
        ...newMateria,
        [field]: date ? format(date, 'yyyy-MM-dd') : null
      });
    }
  };

  const handleCreateMateria = async () => {
    try {
      const response = await fetch('/api/materias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMateria),
      });

      if (response.ok) {
        // Limpiar formulario y recargar materias
        setNewMateria({
          nombre: '',
          profesor: '',
          email: '',
          fechaInicio: null,
          fechaFinal: null,
          horarioCursada: '',
          descripcion: '',
          recursos: ''
        });
        setIsDialogOpen(false);
        fetchMaterias();
      } else {
        console.error('Error al crear materia');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEditMateria = async () => {
    try {
      const response = await fetch(`/api/materias?id=${editingMateria.id_materia}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingMateria),
      });

      if (response.ok) {
        setEditingMateria(null);
        fetchMaterias();
      } else {
        console.error('Error al actualizar materia');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteMateria = async () => {
    try {
      const response = await fetch(`/api/materias?id=${materiaToDelete.id_materia}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setIsDeleteDialogOpen(false);
        setMateriaToDelete(null);
        fetchMaterias();
      } else {
        console.error('Error al eliminar materia');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const openEditDialog = (materia) => {
    setEditingMateria({
      ...materia,
      fechaInicio: materia.fechaInicio || null,
      fechaFinal: materia.fechaFinal || null
    });
  };

  const openDeleteDialog = (materia) => {
    setMateriaToDelete(materia);
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
        <h2 className="text-2xl font-bold">Gestión de Materias</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Materia
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Crear Nueva Materia</DialogTitle>
              <DialogDescription>
                Completa los datos para crear una nueva materia.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre de la Materia</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={newMateria.nombre}
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profesor">Profesor</Label>
                  <Input
                    id="profesor"
                    name="profesor"
                    value={newMateria.profesor}
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email de Contacto</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newMateria.email}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fecha de Inicio</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newMateria.fechaInicio ? (
                          format(new Date(newMateria.fechaInicio), 'PPP')
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newMateria.fechaInicio ? new Date(newMateria.fechaInicio) : undefined}
                        onSelect={(date) => handleDateChange(date, 'fechaInicio')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Fecha Final</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newMateria.fechaFinal ? (
                          format(new Date(newMateria.fechaFinal), 'PPP')
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newMateria.fechaFinal ? new Date(newMateria.fechaFinal) : undefined}
                        onSelect={(date) => handleDateChange(date, 'fechaFinal')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="horarioCursada">Horario de Cursada</Label>
                <Input
                  id="horarioCursada"
                  name="horarioCursada"
                  value={newMateria.horarioCursada}
                  onChange={(e) => handleInputChange(e)}
                  placeholder="Ej: Lunes y Miércoles de 18:00 a 21:00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  name="descripcion"
                  value={newMateria.descripcion}
                  onChange={(e) => handleInputChange(e)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recursos">Recursos (Enlaces)</Label>
                <Textarea
                  id="recursos"
                  name="recursos"
                  value={newMateria.recursos}
                  onChange={(e) => handleInputChange(e)}
                  rows={2}
                  placeholder="Enlaces a recursos separados por comas"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateMateria}>Crear Materia</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabla de materias */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Profesor</TableHead>
                <TableHead>Fecha Inicio</TableHead>
                <TableHead>Fecha Final</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materias.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No hay materias disponibles
                  </TableCell>
                </TableRow>
              ) : (
                materias.map((materia) => (
                  <TableRow key={materia.id_materia}>
                    <TableCell className="font-medium">{materia.nombre}</TableCell>
                    <TableCell>{materia.profesor}</TableCell>
                    <TableCell>
                      {materia.fechaInicio ? format(new Date(materia.fechaInicio), 'dd/MM/yyyy') : '-'}
                    </TableCell>
                    <TableCell>
                      {materia.fechaFinal ? format(new Date(materia.fechaFinal), 'dd/MM/yyyy') : '-'}
                    </TableCell>
                    <TableCell className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => openEditDialog(materia)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => openDeleteDialog(materia)}
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
      {editingMateria && (
        <Dialog open={!!editingMateria} onOpenChange={(open) => !open && setEditingMateria(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Editar Materia</DialogTitle>
              <DialogDescription>
                Modifica los datos de la materia.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-nombre">Nombre de la Materia</Label>
                  <Input
                    id="edit-nombre"
                    name="nombre"
                    value={editingMateria.nombre}
                    onChange={(e) => handleInputChange(e, true)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-profesor">Profesor</Label>
                  <Input
                    id="edit-profesor"
                    name="profesor"
                    value={editingMateria.profesor}
                    onChange={(e) => handleInputChange(e, true)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email de Contacto</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={editingMateria.email}
                  onChange={(e) => handleInputChange(e, true)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fecha de Inicio</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editingMateria.fechaInicio ? (
                          format(new Date(editingMateria.fechaInicio), 'PPP')
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={editingMateria.fechaInicio ? new Date(editingMateria.fechaInicio) : undefined}
                        onSelect={(date) => handleDateChange(date, 'fechaInicio', true)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Fecha Final</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editingMateria.fechaFinal ? (
                          format(new Date(editingMateria.fechaFinal), 'PPP')
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={editingMateria.fechaFinal ? new Date(editingMateria.fechaFinal) : undefined}
                        onSelect={(date) => handleDateChange(date, 'fechaFinal', true)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-horarioCursada">Horario de Cursada</Label>
                <Input
                  id="edit-horarioCursada"
                  name="horarioCursada"
                  value={editingMateria.horarioCursada}
                  onChange={(e) => handleInputChange(e, true)}
                  placeholder="Ej: Lunes y Miércoles de 18:00 a 21:00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-descripcion">Descripción</Label>
                <Textarea
                  id="edit-descripcion"
                  name="descripcion"
                  value={editingMateria.descripcion}
                  onChange={(e) => handleInputChange(e, true)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-recursos">Recursos (Enlaces)</Label>
                <Textarea
                  id="edit-recursos"
                  name="recursos"
                  value={editingMateria.recursos}
                  onChange={(e) => handleInputChange(e, true)}
                  rows={2}
                  placeholder="Enlaces a recursos separados por comas"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingMateria(null)}>
                Cancelar
              </Button>
              <Button onClick={handleEditMateria}>Guardar Cambios</Button>
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
              ¿Estás seguro de que deseas eliminar la materia "{materiaToDelete?.nombre}"? 
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteMateria}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 