"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useWalletContext } from "../../components/WalletContext";

export default function DisconnectButton() {
  const { disconnect } = useWalletContext();
  const router = useRouter();

  return (
    <motion.div whileHover={{ scale: 1.05 }} className="flex justify-center mt-8">
      <button
        onClick={() => {
          disconnect();
          router.push("/");
        }}
        className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-neon-red"
      >
        Disconnect & Return Home
      </button>
    </motion.div>
  );
}