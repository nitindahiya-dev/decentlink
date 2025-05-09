"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import idl from "@/idl/registry.json";

export default function Resolver() {
  const { shortCode } = useParams();
  const { connection } = useConnection();

  useEffect(() => {
    (async () => {
      if (!shortCode) return;

      const programId = new PublicKey(idl.metadata.address);
      const [pda] = await PublicKey.findProgramAddress(
        [Buffer.from(shortCode)], programId
      );

      const provider = new AnchorProvider(connection, null, {});
      const program = new Program(idl, programId, provider);
      const entry = await program.account.entry.fetch(pda);
      const cid = Buffer.from(entry.cid).toString();

      const res = await fetch(`https://ipfs.infura.io:5001/api/v0/cat?arg=${cid}`);
      const json = await res.text();
      const { url } = JSON.parse(json);

      window.location.href = url;
    })();
  }, [shortCode, connection]);

  return <p>Redirecting…</p>;
}
