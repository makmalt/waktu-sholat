"use client";
import { useTimeStore } from "@/store/time";
import { useEffect } from "react";

export default function ClientWrapper({ children }) {
  const { time, fetchTime, tick } = useTimeStore();
  useEffect(() => {
    fetchTime();
    const interval = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(interval);
  }, [fetchTime, tick]);

  let overlayColor = "bg-transparent";
  if (time) {
    const hour = new Date(time).getHours();
    if (hour >= 5 && hour < 12) overlayColor = "bg-blue-200"; // pagi
    else if (hour >= 12 && hour < 18) overlayColor = "bg-yellow-200"; // siang
    else overlayColor = "bg-gray-800 text-white"; // malam
  }

  return (
    <div className={`relative min-h-screen`}>
      {/* Overlay transparan */}
      <div
        className={`absolute inset-0 ${overlayColor} transition-colors duration-500`}
      />

      {/* Konten halaman */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
