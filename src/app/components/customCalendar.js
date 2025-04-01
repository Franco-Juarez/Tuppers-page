"use client"

import { useEffect, useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMediaQuery } from "@/hooks/use-media-query"
import Link from "next/link"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const CustomCalendar = ({ exams = [] }) => {
  const [examDates, setExamDates] = useState([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const isLargeDesktop = useMediaQuery("(min-width: 1280px)")
  const isMobile = useMediaQuery("(max-width: 640px)")

  useEffect(() => {
    if (exams?.length > 0) {
      setExamDates(
        exams.map((exam) => {
          const examDate = new Date(exam.fechaEntrega)
          examDate.setHours(0, 0, 0, 0)
          return examDate
        }),
      )
    }
  }, [exams])

  // Format date to compare dates without time
  const formatDateForComparison = (date) => {
    return date.toISOString().split("T")[0]
  }

  // Get today's date for highlighting current day
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Determine number of months to show based on screen size
  const getNumberOfMonths = () => {
    if (isLargeDesktop) return 3
    if (isDesktop) return 2
    return 1
  }

  // Handle month change
  const handleMonthChange = (month) => {
    setCurrentMonth(month)
  }

  const formatDateForTooltip = (dateString) => {
    // Crear la fecha explícitamente para evitar problemas de zona horaria
    const [year, month, day] = dateString.split('-').map(Number);
    const examDate = new Date(year, month - 1, day); // mes es 0-indexado
    
    // Establecer la hora del medio día para evitar problemas de zona horaria
    examDate.setHours(12, 0, 0, 0);
    
    return examDate.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric", 
      month: "long",
      day: "numeric",
    });
  };

  const generateGoogleCalendarLink = (exam) => {
    // Parse the date explicitly to avoid timezone issues
    const [year, month, day] = exam.fechaEntrega.split('-').map(Number);
    
    // Create start date at noon to prevent timezone-related shifts
    const startDate = new Date(year, month - 1, day, 12, 0, 0);
    
    // Create end date (1 hour later) also at noon
    const endDate = new Date(year, month - 1, day, 13, 0, 0);
    
    // Convert to ISO string and remove timezone-related characters
    const formattedStartDate = startDate.toISOString().replace(/-|:|\.\d+/g, "");
    const formattedEndDate = endDate.toISOString().replace(/-|:|\.\d+/g, "");
    
    const title = encodeURIComponent(exam.titulo);
    const details = encodeURIComponent(`Materia: ${exam.materia}`);
    const location = encodeURIComponent("Online");
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formattedStartDate}/${formattedEndDate}&details=${details}&location=${location}`;
  };

  // Renderiza el contenido del examen (usado tanto en tooltip como en popover)
  const renderExamContent = (exam) => (
    <div className="space-y-1.5 bg-slate-900 rounded-md">
      <div className="p-2 text-xs font-medium text-slate-100">
        <p className="text-center text-sm font-semibold">
          {formatDateForTooltip(exam.fechaEntrega)}
        </p>
      </div>
      <div className="p-3 space-y-2 bg-slate-900 rounded-md">
          <div className="flex flex-col items-center"> 
            <span className="flex gap-1 ">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
              <p className="font-medium text-sm text-slate-100">{exam.titulo}</p>
            </span>
            <Badge variant="outline" className="mt-1 text-xs text-white">
              {exam.materia}
            </Badge>
            <Badge variant="outline" className="mt-1 text-xs text-white hover:bg-green-500 hover:border-green-500">
              <Link
                href={generateGoogleCalendarLink(exam)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs"
              >
                Agregar a Google Calendar
              </Link>
            </Badge>
          </div>
      </div>
    </div>
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/30 pb-3">
        <div className="flex gap-1 flex-col md:flex-row md:items-center justify-between">
          <CardTitle className="text-lg font-medium">Calendario de Exámenes</CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-sm bg-red-500"></div>
              <span className="text-xs text-muted-foreground">Examen</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-sm bg-primary/20 border border-primary"></div>
              <span className="text-xs text-muted-foreground">Hoy</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <TooltipProvider delayDuration={0}>
          <Calendar
            className="rounded-md border-0 sm:border"
            numberOfMonths={getNumberOfMonths()}
            mode="multiple"
            month={currentMonth}
            fixedWeeks={true}
            onMonthChange={handleMonthChange}
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "h-9 w-9 text-center text-sm relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
              day_selected:
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-primary/20 border border-primary text-foreground",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
            components={{
              Day: ({ date, ...props }) => {
                // Find exam for this date
                const dateString = formatDateForComparison(date)
                const exam = exams?.find((exam) => {
                  const examDate = new Date(exam.fechaEntrega)
                  return formatDateForComparison(examDate) === dateString
                })

                // Check if date is today
                const isToday = formatDateForComparison(date) === formatDateForComparison(today)

                // Determine if this is an urgent exam (within 3 days)
                const isUrgent =
                  exam && (new Date(exam.fechaEntrega).getTime() - today.getTime()) / (1000 * 60 * 60 * 24) <= 3

                // En móvil usamos Popover en lugar de Tooltip para mejor experiencia táctil
                if (isMobile) {
                  return (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className={`h-9 w-9 p-0 font-normal ${exam
                            ? "bg-red-500 text-white hover:bg-red-600 hover:text-white"
                            : isToday
                              ? "border border-primary text-foreground hover:bg-primary/30"
                              : "hover:bg-accent hover:text-accent-foreground"
                            }`}
                          {...props}
                        >
                          <time dateTime={dateString}>{date.getDate()}</time>
                          {isUrgent && (
                            <span className="absolute -right-1 -top-1 flex h-2 w-2">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75"></span>
                              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500"></span>
                            </span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-0" align="center">
                        {exam ? renderExamContent(exam) : (
                          <div className="p-3 flex items-center gap-2">
                            <p className="text-sm">No hay examen programado</p>
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                  )
                }

                // En escritorio usamos Tooltip para la experiencia original
                return (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`h-9 w-9 p-0 font-normal ${exam
                          ? "bg-red-500 text-white hover:bg-red-600 hover:text-white"
                          : isToday
                            ? "border border-primary text-foreground hover:bg-primary/30"
                            : "hover:bg-accent hover:text-accent-foreground"
                          }`}
                        {...props}
                      >
                        <time dateTime={dateString}>{date.getDate()}</time>
                        {isUrgent && (
                          <span className="absolute -right-1 -top-1 flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500"></span>
                          </span>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent sideOffset={5} align="center">
                      {exam ? renderExamContent(exam) : (
                        <div className="p-3 flex items-center gap-2">
                          <p className="text-sm">No hay examen programado</p>
                        </div>
                      )}
                    </TooltipContent>
                  </Tooltip>
                )
              },
            }}
          />
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}

export default CustomCalendar