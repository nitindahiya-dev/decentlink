"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useWalletContext } from "../../components/WalletContext";

export default function EmptyState({ hasLinks, totalClicks }: { hasLinks: boolean; totalClicks: number }) {
  const { disconnect } = useWalletContext();
  const router = useRouter();

  return (
    <div className="p-8 text-center text-gray-600">
      {!hasLinks ? (
        <p>No links created yet. Try shortening a link first.</p>
      ) : (
        <>
          <p>Your links have been created, but no clicks have been recorded yet.</p>
          <p>Share your links to start tracking analytics!</p>
        </>
      )}
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