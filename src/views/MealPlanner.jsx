import React, { useMemo, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { addMealToDate, loadPlan, removeMealFromDate } from "../utils/mealPlan";
import { getLikedMeals } from "../utils/likes"; // reuse your liked list
import { Link } from "react-router-dom";

// --- helpers to build calendar grid ---
function startOfMonth(d){ return new Date(d.getFullYear(), d.getMonth(), 1); }
function endOfMonth(d){ return new Date(d.getFullYear(), d.getMonth()+1, 0); }
function fmtISO(d){ return d.toISOString().slice(0,10); }
const WEEKDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function MealPlanner(){
  const [cursor, setCursor] = useState(() => new Date()); // current month
  const [plan, setPlan] = useState(() => loadPlan());
  const [openDate, setOpenDate] = useState(null); // ISO string for quick-add panel
  const liked = getLikedMeals(); // [{idMeal, strMeal, strMealThumb}...]

  const monthTitle = cursor.toLocaleString(undefined, { month: "long", year: "numeric" });

  const days = useMemo(() => {
    const start = startOfMonth(cursor);
    const end = endOfMonth(cursor);
    // Build a 6x7 grid (42 cells), including prev/next month spillover
    const startOffset = start.getDay(); // 0..6 (Sun=0)
    const firstCell = new Date(start); firstCell.setDate(firstCell.getDate() - startOffset);
    return Array.from({length: 42}, (_,i)=>{
      const d = new Date(firstCell); d.setDate(d.getDate()+i);
      const inMonth = d.getMonth() === cursor.getMonth();
      return { date: d, inMonth, iso: fmtISO(d) };
    });
  }, [cursor]);

  function prevMonth(){ setCursor(new Date(cursor.getFullYear(), cursor.getMonth()-1, 1)); }
  function nextMonth(){ setCursor(new Date(cursor.getFullYear(), cursor.getMonth()+1, 1)); }
  function today(){ setCursor(new Date()); }

  function onAdd(dateISO, meal) {
    const updated = addMealToDate(dateISO, meal);
    setPlan(updated);
  }
  function onRemove(dateISO, idx){
    const updated = removeMealFromDate(dateISO, idx);
    setPlan(updated);
  }

  // quick-add panel content
  function QuickAdd({ dateISO }){
    
    return (
      <div className="mt-2 p-2 rounded-lg border border-white/10 bg-white/5">
        
        <div className="text-xs text-white/70 mb-1">Or pick from Liked</div>
        {liked.length === 0 ? (
          <div className="text-xs text-white/50">No liked recipes yet. <Link className="underline" to="/dashboard">Go like some →</Link></div>
        ) : (
          <div className="max-h-36 overflow-auto space-y-1 pr-1">
            {liked.map((m,i)=>(
              <button
                key={m.idMeal ?? `${m.strMeal}-${i}`}
                onClick={()=>{ onAdd(dateISO, { idMeal: m.idMeal, strMeal: m.strMeal, strMealThumb: m.strMealThumb }); setOpenDate(null); }}
                className="w-full text-left text-sm px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10"
                title="Add to this day"
              >
                {m.strMeal}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="p-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="h-9 w-9 rounded-md bg-white/5 hover:bg-white/10 border border-white/10">‹</button>
            <button onClick={today} className="h-9 px-3 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-white/90">Today</button>
            <button onClick={nextMonth} className="h-9 w-9 rounded-md bg-white/5 hover:bg-white/10 border border-white/10">›</button>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{monthTitle}</h1>
          <div className="opacity-0 w-[110px] md:w-[120px]">{/* spacer to balance layout */}</div>
        </div>

        {/* Weekday header */}
        <div className="grid grid-cols-7 text-center text-xs uppercase tracking-wide text-white/60 mb-2">
          {WEEKDAYS.map(d => <div key={d} className="py-2">{d}</div>)}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map(({date,inMonth,iso})=>{
            const dayMeals = plan[iso] || [];
            const isToday = fmtISO(new Date()) === iso;
            return (
              <div key={iso}
                className={[
                  "min-h-[120px] rounded-xl p-2 border",
                  inMonth ? "bg-white/5 border-white/10" : "bg-white/[0.03] border-white/5",
                  isToday ? "ring-2 ring-indigo-400" : "",
                ].join(" ")}
              >
                {/* date + add button */}
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-white/80">
                    {date.getDate()}
                  </div>
                  <button
                    onClick={()=> setOpenDate(prev => prev===iso ? null : iso)}
                    className="h-7 px-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
                    title="Add meal"
                  >
                    + Add
                  </button>
                </div>

                {/* quick-add panel */}
                {openDate === iso && <QuickAdd dateISO={iso} />}

                {/* meals list */}
                <div className="mt-1 space-y-1">
                  {dayMeals.map((m,idx)=>(
                    <div key={idx} className="group flex items-center gap-2 px-2 py-1 rounded-md bg-white/10 border border-white/10">
                      <span className="text-sm truncate">{m.strMeal}</span>
                      {/* link if it has id */}
                      {m.idMeal && (
                        <Link to={`/meal/${m.idMeal}`} className="ml-auto text-xs text-indigo-300 hover:text-indigo-200 underline">view</Link>
                      )}
                      <button
                        onClick={()=> onRemove(iso, idx)}
                        className="opacity-60 group-hover:opacity-100 text-xs ml-auto md:ml-0 px-1 rounded hover:bg-white/10"
                        title="Remove"
                      >✕</button>
                    </div>
                  ))}
                  {dayMeals.length === 0 && (
                    <div className="text-xs text-white/40">No meals</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
