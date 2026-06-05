import { IPFS_GATEWAY } from "../config/contract";

export function ipfsToHttp(uri) {
  if (!uri) return "";

  if (uri.startsWith("ipfs://")) {
    return uri.replace("ipfs://", IPFS_GATEWAY);
  }

  return uri;
}