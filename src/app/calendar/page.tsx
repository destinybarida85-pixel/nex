"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { eventsByDay, today } from "@/components/calendar/events";
import { IconPlus } from "@/components/icons";

const monthLabel = new Date(today.year, today.month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
const daysInMonth = new Date(today.year, today.month + 1, 0).getDate();
const firstWeekday = new Date(today.year, today.month, 1).getDay();
const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
  const [selectedDay, setSelectedDay] = useState(today.day);
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const selectedEvents = eventsByDay[selectedDay] ?? [];
  const selectedDate = new Date(today.year, today.month, selectedDay).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <Sidebar active="Calendar" />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="p-[24px_28px_28px] flex flex-col gap-5 min-w-0">
          <div className="flex items-end gap-3">
            <div>
              <h3 className="m-0 text-[22px]">Calendar</h3>
              <div className="text-muted text-[12.5px] mt-[3px]">{monthLabel}</div>
            </div>
            <div className="flex-1" />
            <button className="btn btn-primary text-[13px]">
              <IconPlus size={14} />
              New event
            </button>
          </div>

          <div className="grid gap-3.5" style={{ gridTemplateColumns: "1fr 320px" }}>
            <div className="card elev-sm p-5 gap-3">
              <div className="grid grid-cols-7 gap-1 text-center text-[10.5px] tracking-[.06em] uppercase text-[var(--color-neutral-500)] pb-1">
                {weekdayLabels.map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {cells.map((day, i) => {
                  if (!day) return <div key={`empty-${i}`} />;
                  const isToday = day === today.day;
                  const isSelected = day === selectedDay;
                  const hasEvents = !!eventsByDay[day];
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className="aspect-square rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
                      style={
                        isSelected
                          ? { background: "var(--color-accent)", color: "#161826" }
                          : isToday
                          ? { border: "1.5px solid var(--color-accent)", color: "var(--color-accent-300)" }
                          : { color: "var(--color-text)" }
                      }
                    >
                      <span className="text-[12.5px]">{day}</span>
                      {hasEvents && (
                        <span
                          className="w-1 h-1 rounded-full"
                          style={{ background: isSelected ? "#161826" : "var(--color-accent)" }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="card elev-sm p-4 gap-3">
              <div className="card-title text-[14px]">{selectedDate}</div>
              {selectedEvents.length === 0 ? (
                <div className="text-[12.5px] text-[var(--color-neutral-500)]">No events scheduled.</div>
              ) : (
                <div className="flex flex-col gap-3">
                  {selectedEvents.map((ev) => (
                    <div key={ev.time + ev.title} className="flex gap-2.5 text-[12.5px]">
                      <span className="font-mono text-[11px] flex-none pt-[1px]" style={{ color: "var(--color-accent-300)" }}>
                        {ev.time}
                      </span>
                      <span>{ev.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
