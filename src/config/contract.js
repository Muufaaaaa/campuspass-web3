export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

export const NETWORK_NAME =
  import.meta.env.VITE_NETWORK_NAME || "Sepolia Testnet";

export const SEPOLIA_CHAIN_ID =
  import.meta.env.VITE_CHAIN_ID || "0xaa36a7";

export const EXPLORER_URL =
  import.meta.env.VITE_EXPLORER_URL || "https://sepolia.etherscan.io";

export const IPFS_GATEWAY =
  import.meta.env.VITE_IPFS_GATEWAY || "https://ipfs.io/ipfs/";

export function getTransactionUrl(txHash) {
  if (!txHash) return "";
  return `${EXPLORER_URL}/tx/${txHash}`;
}

export function getAddressUrl(address) {
  if (!address) return "";
  return `${EXPLORER_URL}/address/${address}`;
}

export function getTokenUrl(contractAddress, tokenId) {
  if (!contractAddress || !tokenId) return "";
  return `${EXPLORER_URL}/token/${contractAddress}?a=${tokenId}`;
}