"use client";

import React from "react";
import { motion } from "framer-motion";

export default function AnalyticsCard({
  title,
  icon,
  children,
  className = "",
}: {
  title: string;
  icon: React.ReactElement;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white/70 backdrop-blur-sm rounded-2xl p-6 border-2 border-black shadow-neon ${className}`}
    >
      <div className="flex items-center gap-3 mb-4">
        {React.cloneElement(icon, { className: "h-6 w-6 text-neon-purple" })}
        <h3 className="text-2xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text">
          {title}
        </h3>
      </div>
      {children}
    </motion.div>
  );
}