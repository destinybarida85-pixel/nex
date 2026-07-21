export type CalendarEvent = { time: string; title: string };

export const eventsByDay: Record<number, CalendarEvent[]> = {
  15: [{ time: "09:00", title: "Invoice #INV-2038 due reminder — Figment Design" }],
  18: [{ time: "12:00", title: "Payroll run closes — July" }],
  21: [
    { time: "10:30", title: "Payroll approval — July run closes at noon" },
    { time: "14:00", title: "Client review — Halcyon Q3 scope" },
    { time: "16:30", title: "Interview — Senior PM candidate" },
  ],
  24: [{ time: "11:00", title: "Board sync — monthly update" }],
  28: [{ time: "15:00", title: "Quarterly business review" }],
  30: [{ time: "17:00", title: "Investor call — Series A" }],
};

export const today = { year: 2026, month: 6, day: 21 }; // month is 0-indexed (6 = July)
