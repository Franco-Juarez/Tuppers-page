'use client'

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { exams } from "@/lib/exams";

const CustomCalendar = () => {
  return (
    <Calendar
      mode="single"
      className="rounded-md border"
      fixedWeeks
      numberOfMonths={3}
      weekStartsOn={1}
      modifiers={{
        exam: exams.map((exam) => new Date(exam.fechaEntrega)),
      }}
      modifiersClassNames={{
        exam: "exam-day",
      }}
      modifiersStyles={{
        exam: {
          border: "2px solid #ef4444",
          borderRadius: "4px",
          backgroundColor: "#fef2f2",
        },
      }}
      components={{
        Day: ({ date, ...props }) => {
          // Encuentra el examen correspondiente a la fecha del día
          const exam = exams.find(
            (exam) => new Date(exam.fechaEntrega).toDateString() === date.toDateString()
          );

          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className={`bg-transparent w-full h-full p-0 text-center rounded-sm shadow-none hover:bg-slate-200 hover:text-gray-800  ${exam ? 'rounded-sm bg-red-500 text-slate-50 hover:bg-red-500 hover:text-slate-50' : 'text-gray-700'} `}
                    style={{
                      padding: 0,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '36px',
                      width: '36px',
                    }}
                  >
                    {date.getDate()}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {exam ? (
                    <div>
                      <p>Materia: {exam.materia}</p>
                      <p>Parcial: {exam.titulo}</p>
                    </div>
                  ) : (
                    <p>No hay examen</p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        },
      }}
    />
  );
};

export default CustomCalendar;
