"use client";

import React, { useState, useRef, useEffect } from "react";

export function InteractiveGridBox({
  children,
  className = "",
  style = {},
  gridSize = 30,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  gridSize?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 400); // Ripple duration
  };

  // Ukuran spotlight
  const spotlightSize = isClicked ? 400 : isHovering ? 250 : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleClick}
      className={`relative overflow-hidden ${className} cursor-pointer`}
      style={{
        ...style,
        backgroundColor: style.backgroundColor || (style.background ? undefined : "rgba(255, 255, 255, 0.7)"),
        backdropFilter: style.backdropFilter || "blur(24px)",
      }}
    >
      {/* Dim Grid Foundation (barely visible) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.015) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.015) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
      />

      {/* Spotlight Highlighted Grid */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(90, 112, 243, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(90, 112, 243, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
          opacity: isHovering || isClicked ? 1 : 0,
          maskImage: `radial-gradient(${spotlightSize}px circle at ${mousePos.x}px ${mousePos.y}px, black, transparent)`,
          WebkitMaskImage: `radial-gradient(${spotlightSize}px circle at ${mousePos.x}px ${mousePos.y}px, black, transparent)`,
          transition: "mask-image 0.3s ease-out, -webkit-mask-image 0.3s ease-out",
        }}
      />

      {/* Subtle Glow following mouse */}
      <div
        className="absolute pointer-events-none rounded-full blur-2xl transition-all duration-300"
        style={{
          width: spotlightSize,
          height: spotlightSize,
          left: mousePos.x - spotlightSize / 2,
          top: mousePos.y - spotlightSize / 2,
          background: isClicked 
            ? "radial-gradient(circle, rgba(90,112,243,0.15) 0%, transparent 70%)" 
            : "radial-gradient(circle, rgba(90,112,243,0.05) 0%, transparent 70%)",
          opacity: isHovering ? 1 : 0,
        }}
      />

      {/* Content */}
      <div className="relative z-10 pointer-events-none">
        <div className="pointer-events-auto h-full w-full flex flex-col items-center">
          {children}
        </div>
      </div>
    </div>
  );
}
