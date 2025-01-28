const getNextExams = (exams) => {

  exams.forEach(exam => {
    exam.fechaEntrega = new Date(exam.fechaEntrega)
  })
  // filtrar exámenes aún vigentes
  const examsVigentes = exams.filter(exam => exam.fechaEntrega > new Date())
  // ordenar exámenes por fecha de entrega (menor a mayor)
  examsVigentes.sort((a, b) => a.fechaEntrega - b.fechaEntrega)
  // obtener próximos exámenes (los primeros 2)
  const nextExams = examsVigentes.slice(0, 2);

  return nextExams
}

export default getNextExams
