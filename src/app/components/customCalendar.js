import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CustomCalendar = ({ exams }) => {
  const [examDates, setExamDates] = useState([]);

  useEffect(() => {
    if (exams?.length > 0) {
      setExamDates(
        exams.map((exam) => {
          const examDate = new Date(exam.fechaEntrega)
          examDate.setHours(0, 0, 0, 0)
          return examDate;
        })
      );
    }
  }, [exams]);

  return (
    <Calendar
      mode="single"
      className="rounded-md border"
      fixedWeeks
      numberOfMonths={3}
      weekStartsOn={1}
      modifiers={{
        exam: examDates,
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
          const exam = exams?.find((exam) => {
            const examDate = new Date(exam.fechaEntrega);
            const examDateString = examDate.toISOString().split('T')[0]
            const dateString = date.toISOString().split('T')[0]
            return examDateString === dateString;
          });

          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className={`bg-transparent w-full h-full p-0 text-center rounded-sm shadow-none hover:bg-slate-200 hover:text-gray-800  
                      ${exam ? 'rounded-sm bg-red-500 text-white hover:bg-red-500' : 'text-gray-700'} `}
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
                      <p><strong>Materia:</strong> {exam.materia}</p>
                      <p><strong>Parcial:</strong> {exam.titulo}</p>
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
