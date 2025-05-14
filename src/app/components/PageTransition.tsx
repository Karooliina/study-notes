"use client";

import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";

const disabledPaths = ["/sign-in", "/sign-up"];

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (disabledPaths.includes(pathname)) {
    return children;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
