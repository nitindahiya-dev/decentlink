// src/utils/ethers.ts
import { ethers } from "ethers";
import type { ExternalProvider } from "@ethersproject/providers";
import type { ContractInterface } from "ethers";
import RegistryABI from "../../artifacts/contracts/Registry.sol/Registry.json";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL!;
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_REGISTRY_ADDRESS!;

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
let signer: ethers.Signer | undefined;

// only run in browser
if (
  typeof window !== "undefined" &&
  (window as Window & { ethereum?: ExternalProvider }).ethereum
) {
  const external = (window as Window & { ethereum: ExternalProvider }).ethereum;
  const web3Provider = new ethers.providers.Web3Provider(external);
  signer = web3Provider.getSigner();
}

export const registryContract = new ethers.Contract(
  CONTRACT_ADDRESS,
  RegistryABI.abi as ContractInterface,
  signer ?? provider
);
export const getSigner = () => {
  if (!signer) {
    throw new Error("Signer is not available");
  }
  return signer;
};
export const getProvider = () => {
  if (!provider) {
    throw new Error("Provider is not available");
  }
  return provider;
}
export const getContract = () => {
  if (!signer) {
    throw new Error("Signer is not available");
  }
  return new ethers.Contract(
    CONTRACT_ADDRESS,
    RegistryABI.abi as ContractInterface,
    signer
  );
}
export const getAddress = async () => { 
  if (!signer) {
    throw new Error("Signer is not available");
  }
  return await signer.getAddress();
}