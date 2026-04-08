"use client";

import { useEffect, useState } from "react";

export default function AnimatedBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 25,
        y: (e.clientY / window.innerHeight) * 25,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div
        className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-gradient-to-br from-cyan-500 to-blue-900 rounded-full opacity-20 blur-3xl"
        style={{
          transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
          transition: "transform 0.3s ease-out",
        }}
      />
      <div
        className="absolute top-1/3 right-[-100px] w-80 h-80 bg-gradient-to-bl from-purple-600 to-pink-900 rounded-full opacity-15 blur-3xl"
        style={{
          transform: `translate(${-mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`,
          transition: "transform 0.3s ease-out",
        }}
      />
      <div
        className="absolute bottom-[-50px] left-1/4 w-72 h-72 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-full opacity-10 blur-3xl"
        style={{
          transform: `translate(${mousePos.x * 0.7}px, ${-mousePos.y * 0.7}px)`,
          transition: "transform 0.3s ease-out",
        }}
      />

      <div
        className="absolute inset-0 bg-grid opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent)",
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  );
}
