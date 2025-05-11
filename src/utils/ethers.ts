import { ethers } from "ethers";
import RegistryABI from "../../artifacts/contracts/Registry.sol/Registry.json";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL!;
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_REGISTRY_ADDRESS!;

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
let signer: ethers.Signer | undefined;

if (typeof window !== "undefined" && (window as any).ethereum) {
  const web3Provider = new ethers.providers.Web3Provider((window as any).ethereum);
  signer = web3Provider.getSigner();
}

export const registryContract = new ethers.Contract(
  CONTRACT_ADDRESS,
  RegistryABI.abi,
  signer ?? provider
);
