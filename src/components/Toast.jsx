import React from "react";

/**

 * Props:
 *  - show: boolean (controls visibility)
 *  - message: string
 */
export default function Toast({ show, message, tone = "success" }) {
  const toneClasses = {
    success: "bg-emerald-600",
    danger: "bg-rose-600",
    info: "bg-slate-800",
  }[tone];

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className={[
        "pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center",
        "transition-opacity duration-300",
        show ? "opacity-100" : "opacity-0",
      ].join(" ")}
    >
      <div
        className={[
          "pointer-events-auto text-white px-4 py-2 rounded-lg shadow-lg",
          "flex items-center gap-2",
          toneClasses,
        ].join(" ")}
      >
        {/* little dot/pulse for fun */}
        <span className="inline-block w-2 h-2 rounded-full bg-white/80 animate-pulse" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}
