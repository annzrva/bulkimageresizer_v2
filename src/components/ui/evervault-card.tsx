"use client";

import { useMotionValue, motion, useMotionTemplate } from "framer-motion";
import { useCallback, useRef } from "react";

export const EvervaultCard = ({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback(
    ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
      const { left, top } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    },
    [mouseX, mouseY]
  );

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={containerClassName}
    >
      <motion.div
        className={className}
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(14, 165, 233, 0.07),
              transparent 80%
            )
          `,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}; 