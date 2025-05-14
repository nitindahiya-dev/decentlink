"use client";

import React from "react";
import { motion } from "framer-motion";

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neon-blue/5 to-neon-purple/5">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="h-16 w-16 border-4 border-neon-purple border-t-transparent rounded-full"
      />
    </div>
  );
}