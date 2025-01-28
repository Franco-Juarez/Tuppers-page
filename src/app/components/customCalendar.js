'use client'
import { Calendar } from "@/components/ui/calendar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { exams } from "@/lib/exams";

const CustomCalendar = () => {
  return (
    <Calendar
      mode="single"
      className="rounded-md border grid grid-cols-3 gap-1"
      fixedWeeks
      numberOfMonths={3}
      weekStartsOn={1}
      modifiers={{
        exam: exams.map((exam) => new Date(exam.fechaEntrega)),
      }}
      modifiersStyles={{
        exam: {
          border: "2px solid #ef4444",
          borderRadius: "4px",
        },
      }}
    />
  );
};

export default CustomCalendar;
