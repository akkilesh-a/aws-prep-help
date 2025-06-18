"use client";

import { motion } from "framer-motion";
import React, { useRef, useState } from "react";

interface AnimatedTextProps {
  text: string;
  down?: boolean;
  className?: string;
}

export default function AnimatedText({
  text,
  down = false,
  className,
}: AnimatedTextProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLHeadingElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLHeadingElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const letters = container.children;
    const containerRect = container.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;

    Array.from(letters).forEach((letter, index) => {
      const letterRect = letter.getBoundingClientRect();
      const letterCenterX =
        letterRect.left + letterRect.width / 2 - containerRect.left;
      const distance = Math.abs(mouseX - letterCenterX);

      if (distance <= 10) {
        setHoveredIndex(index);
      }
    });
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <motion.h1
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`flex items-center  font-normal text-[calc(1rem+10.15vw)] text-black dark:text-white uppercase leading-[calc(1rem+14.15vw)] cursor-pointer ${className}`}
    >
      {text.split("").map((letter, index) => (
        <motion.span
          key={index}
          animate={{
            scaleY:
              hoveredIndex === null
                ? 1
                : Math.max(1, 1.3638 - Math.abs(index - hoveredIndex) * 0.1),
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{
            display: "inline-block",
            transformOrigin: down ? "top" : "bottom",
          }}
        >
          {letter}
        </motion.span>
      ))}
    </motion.h1>
  );
}
