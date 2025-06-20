// Modified from: https://www.shadcn.io/components/animation/animated-grid-pattern

"use client";

import { motion } from "motion/react";
import {
  ComponentPropsWithoutRef,
  useEffect,
  useId,
  useRef,
  useState,
  useCallback,
} from "react";

import { cn } from "@/lib/utils";

export interface AnimatedGridPatternProps
  extends ComponentPropsWithoutRef<"svg"> {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeDasharray?: string | number;
  numSquares?: number;
  maxOpacity?: number;
  duration?: number;
}
function getPos(dimensions: { width: number; height: number }, width: number, height: number) {
  return [
    Math.floor((Math.random() * dimensions.width) / width),
    Math.floor((Math.random() * dimensions.height) / height),
  ];
}

function generateSquares(count: number, dims: { width: number; height: number }, width: number, height: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    pos: getPos(dims, width, height),
  }));
}

export function AnimatedGridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 50,
  className,
  maxOpacity = 0.5,
  duration = 4,
  ...props
}: AnimatedGridPatternProps) {
  const id = useId();
  const containerRef = useRef<SVGSVGElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [squares, setSquares] = useState(() =>
    generateSquares(numSquares, { width: width, height: height }, width, height),
  );

  const getPosMemo = useCallback(
    (dimensions: { width: number; height: number }) => getPos(dimensions, width, height),
    [width, height],
  );

  const generateSquaresMemo = useCallback(
    (count: number, dims: { width: number; height: number }) => generateSquares(count, dims, width, height),
    [width, height],
  );

  const updateSquarePosition = (id: number) => {
    setSquares((currentSquares) =>
      currentSquares.map((sq) =>
        sq.id === id
          ? {
              ...sq,
              pos: getPosMemo(dimensions),
            }
          : sq,
      ),
    );
  };

  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      setSquares(generateSquaresMemo(numSquares, dimensions));
    }
  }, [dimensions, numSquares, generateSquaresMemo, width, height]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    resizeObserver.observe(node);
    return () => {
      resizeObserver.unobserve(node);
    };
  }, []);

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 size-full fill-gray-400/30 stroke-gray-800/30",
        className,
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      <svg x={x} y={y} className="overflow-visible">
        {squares.map(({ pos: [x, y], id }, index) => (
          <motion.rect
            initial={{ opacity: 0 }}
            animate={{ opacity: maxOpacity }}
            transition={{
              duration,
              repeat: 1,
              delay: index * 0.1,
              repeatType: "reverse",
            }}
            onAnimationComplete={() => updateSquarePosition(id)}
            key={`${x}-${y}-${index}`}
            width={width - 1}
            height={height - 1}
            x={x * width + 1}
            y={y * height + 1}
            fill="bg-black dark:bg-gray-800"
            strokeWidth="0"
          />
        ))}
      </svg>
    </svg>
  );
}

export default AnimatedGridPattern;

