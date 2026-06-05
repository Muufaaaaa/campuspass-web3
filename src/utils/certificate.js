import { getContractWithSigner, getContractReadOnly } from "./web3";

export async function issueCertificate({
  recipient,
  recipientName,
  eventName,
  issuer,
  issuedDate,
  metadataURI,
}) {
  const contract = await getContractWithSigner();

  const tx = await contract.issueCertificate(
    recipient,
    recipientName,
    eventName,
    issuer,
    issuedDate,
    metadataURI
  );

  const receipt = await tx.wait();

  return receipt;
}

export async function verifyCertificate(tokenId) {
  const contract = getContractReadOnly();

  const isValid = await contract.verifyCertificate(tokenId);

  return isValid;
}

export async function getCertificateData(tokenId) {
  const contract = getContractReadOnly();

  const data = await contract.getCertificateData(tokenId);
  const owner = await contract.ownerOf(tokenId);
  const metadataURI = await contract.tokenURI(tokenId);

  return {
    id: tokenId.toString(),
    owner,
    recipientName: data[0],
    eventName: data[1],
    issuer: data[2],
    issuedDate: data[3],
    valid: data[4],
    metadataURI,
  };
}

export async function getCertificatesByOwner(ownerAddress) {
  const contract = getContractReadOnly();

  const ids = await contract.getCertificatesByOwner(ownerAddress);

  return ids.map((id) => id.toString());
}