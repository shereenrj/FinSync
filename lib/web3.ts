import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Your deployed contract address
const ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [{ "internalType": "address payable", "name": "_to", "type": "address" }],
    "name": "transfer",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  }
];

export const getEthereumProvider = () => {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    console.log("✅ Ethereum provider detected:", provider);
    return provider;
  }
  console.error("❌ No Ethereum provider found. Ensure MetaMask is installed and unlocked.");
  return null;
};

export const getBlockchainContract = async () => {
  const provider = getEthereumProvider();
  if (!provider) throw new Error("No Ethereum provider found. Install MetaMask and connect.");

  try {
    const signer = await provider.getSigner();
    console.log("✅ Signer detected:", signer);
    return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  } catch (error) {
    console.error("❌ Error getting signer:", error);
    throw error;
  }
};

export const sendBlockchainTransfer = async (receiver: string, amount: number) => {
  try {
    console.log("🔹 Initiating transfer to:", receiver, "Amount:", amount, "ETH");

    // Validate Ethereum address before sending
    if (!ethers.isAddress(receiver)) {
      throw new Error("Invalid Ethereum address provided.");
    }

    const contract = await getBlockchainContract();
    const tx = await contract.transfer(receiver, { value: ethers.parseEther(amount.toString()) });

    console.log("⏳ Transaction sent:", tx);
    await tx.wait();
    console.log("✅ Transaction confirmed:", tx.hash);
    return tx;
  } catch (error) {
    console.error("❌ Transaction failed:", error);
    throw error;
  }
};
