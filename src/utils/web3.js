import { ethers } from "ethers";
import CampusPassABI from "../abi/CampusPassCertificate.json";
import { CONTRACT_ADDRESS, SEPOLIA_CHAIN_ID } from "../config/contract";

function validateContractAddress() {
  if (!CONTRACT_ADDRESS) {
    throw new Error(
      "Contract address belum diatur. Isi VITE_CONTRACT_ADDRESS di file .env."
    );
  }
}

export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("MetaMask belum terinstall.");
  }

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  return accounts[0];
}

export async function checkNetwork() {
  if (!window.ethereum) {
    throw new Error("MetaMask belum terinstall.");
  }

  const chainId = await window.ethereum.request({
    method: "eth_chainId",
  });

  return chainId === SEPOLIA_CHAIN_ID;
}

export async function switchToSepolia() {
  if (!window.ethereum) {
    throw new Error("MetaMask belum terinstall.");
  }

  await window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: SEPOLIA_CHAIN_ID }],
  });
}

export function getProvider() {
  if (!window.ethereum) {
    throw new Error("MetaMask belum terinstall.");
  }

  return new ethers.BrowserProvider(window.ethereum);
}

export async function getSigner() {
  const provider = getProvider();
  return await provider.getSigner();
}

export async function getContractWithSigner() {
  validateContractAddress();

  const signer = await getSigner();

  return new ethers.Contract(
    CONTRACT_ADDRESS,
    CampusPassABI,
    signer
  );
}

export function getContractReadOnly() {
  validateContractAddress();

  const provider = getProvider();

  return new ethers.Contract(
    CONTRACT_ADDRESS,
    CampusPassABI,
    provider
  );
}