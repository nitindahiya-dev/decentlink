"use client";

import React from "react";
import { motion } from "framer-motion";
import { SparklesIcon } from "@heroicons/react/24/outline";

export default function AnalyticsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center space-y-4"
    >
      <div className="inline-flex items-center gap-2 mb-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white px-6 py-2 rounded-full">
        <SparklesIcon className="h-5 w-5" />
        <span>Advanced Analytics</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text">
        Link Performance Insights
      </h1>
    </motion.div>
  );
}