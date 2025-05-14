"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useWalletContext } from "../../components/WalletContext";

export default function ErrorMessage({ error }: { error: string }) {
  const { disconnect } = useWalletContext();
  const router = useRouter();

  return (
    <div className="p-8 text-center text-red-600">
      <p>{error}</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={() => {
          disconnect();
          router.push("/");
        }}
        className="mt-4 px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-neon-red"
      >
        Disconnect & Home
      </motion.button>
    </div>
  );
}