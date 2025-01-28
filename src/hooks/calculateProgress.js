const calculateProgress = (fechaInicio, fechaFinalizacion) => {
  // Convertir fechas a milisegundos
  const inicioMs = Date.parse(fechaInicio);
  const finMs = Date.parse(fechaFinalizacion);
  const ahoraMs = Date.now();

  // Validar fechas
  if (isNaN(inicioMs) || isNaN(finMs)) {
    throw new Error("Formato de fecha inválido. Usa 'YYYY-MM-DD'.");
  }

  // Calcular tiempos total y transcurrido
  const totalMs = finMs - inicioMs;
  const transcurridoMs = ahoraMs - inicioMs;

  // Validar casos extremos
  if (transcurridoMs <= 0) return 0; // No ha comenzado
  if (transcurridoMs >= totalMs) return 100; // Ya finalizó

  // Calcular porcentaje (redondeado a 2 decimales)
  const progreso = (transcurridoMs / totalMs) * 100;
  return Number(progreso.toFixed(2));
};

export default calculateProgress;