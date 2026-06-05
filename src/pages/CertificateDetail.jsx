import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getCertificateData } from "../utils/certificate";
import { ipfsToHttp } from "../utils/ipfs";
import {
  CONTRACT_ADDRESS,
  getAddressUrl,
  getTokenUrl,
} from "../config/contract";

export default function CertificateDetail() {
  const { id } = useParams();

  const [certificate, setCertificate] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [metadataStatus, setMetadataStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState("");
  const [copyError, setCopyError] = useState("");
  const [error, setError] = useState("");

  async function copyText(text, label) {
    try {
      setCopyError("");

      await navigator.clipboard.writeText(text);
      setCopied(label);

      setTimeout(() => {
        setCopied("");
      }, 1800);
    } catch (err) {
      console.error(err);
      setCopyError("Gagal menyalin teks ke clipboard.");
    }
  }

  useEffect(() => {
    async function loadCertificateDetail() {
      try {
        setLoading(true);
        setError("");
        setCopyError("");
        setMetadata(null);
        setMetadataStatus("");

        const data = await getCertificateData(id);
        setCertificate(data);

        if (data.metadataURI) {
          try {
            setMetadataStatus("loading");

            const metadataUrl = ipfsToHttp(data.metadataURI);
            const response = await fetch(metadataUrl);

            if (!response.ok) {
              throw new Error("Metadata gateway response failed.");
            }

            const metadataJson = await response.json();

            setMetadata(metadataJson);
            setMetadataStatus("success");
          } catch (metadataError) {
            console.error("Gagal mengambil metadata IPFS:", metadataError);
            setMetadataStatus("failed");
          }
        }
      } catch (err) {
        console.error(err);
        setError(
          "Certificate tidak ditemukan atau gagal dibaca dari blockchain."
        );
      } finally {
        setLoading(false);
      }
    }

    loadCertificateDetail();
  }, [id]);

  const imageUrl = metadata?.image ? ipfsToHttp(metadata.image) : "";

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100">
        <Navbar />

        <main className="max-w-6xl mx-auto p-6 md:p-8">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 p-6 rounded-3xl">
            <h2 className="text-xl font-bold mb-2">
              Loading Certificate
            </h2>

            <p>
              Mengambil data certificate dari smart contract dan metadata dari IPFS...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen bg-slate-100">
        <Navbar />

        <main className="max-w-6xl mx-auto p-6 md:p-8">
          <Link
            to="/dashboard"
            className="inline-block text-violet-600 font-semibold mb-5"
          >
            ← Back to Dashboard
          </Link>

          <div className="bg-red-50 border border-red-200 text-red-900 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold mb-2">
              Certificate Not Found
            </h2>

            <p>
              {error || "Certificate tidak ditemukan."}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto p-6 md:p-8">
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-block text-violet-600 font-semibold"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <section className="relative overflow-hidden bg-slate-950 text-white rounded-3xl p-6 md:p-8 mb-8 shadow-xl">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-violet-600/20 blur-3xl rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-500/20 blur-3xl rounded-full" />

          <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <p className="text-sm text-violet-300 font-semibold mb-2">
                Certificate Detail
              </p>

              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                {certificate.eventName}
              </h1>

              <p className="text-slate-400 max-w-2xl">
                Certificate ini dibaca langsung dari smart contract berdasarkan
                Token ID #{certificate.id}.
              </p>
            </div>

            <span
              className={
                certificate.valid
                  ? "bg-green-400/10 text-green-300 border border-green-400/20 px-4 py-2 rounded-full text-sm font-semibold"
                  : "bg-red-400/10 text-red-300 border border-red-400/20 px-4 py-2 rounded-full text-sm font-semibold"
              }
            >
              {certificate.valid ? "On-chain Verified" : "Invalid"}
            </span>
          </div>
        </section>

        {copyError && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl mb-6">
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm font-semibold">
                {copyError}
              </p>

              <button
                onClick={() => setCopyError("")}
                className="text-red-600 hover:text-red-800 font-bold"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <section className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              {imageUrl ? (
                <div className="bg-slate-950 p-4">
                  <img
                    src={imageUrl}
                    alt={metadata?.name || "Certificate"}
                    className="w-full rounded-2xl border border-white/10"
                  />
                </div>
              ) : (
                <div className="bg-slate-950 p-10 text-center">
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold mb-5">
                    C
                  </div>

                  <h2 className="text-2xl font-bold text-white">
                    Certificate Image Not Available
                  </h2>

                  <p className="text-slate-400 mt-2">
                    Metadata tidak memiliki image, atau image belum dapat dimuat dari IPFS.
                  </p>
                </div>
              )}

              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  On-chain Certificate Data
                </h2>

                <div className="grid md:grid-cols-2 gap-5">
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                    <p className="text-sm text-slate-500 mb-1">
                      Recipient
                    </p>

                    <p className="font-bold text-slate-900">
                      {certificate.recipientName}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                    <p className="text-sm text-slate-500 mb-1">
                      Issuer
                    </p>

                    <p className="font-bold text-slate-900">
                      {certificate.issuer}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                    <p className="text-sm text-slate-500 mb-1">
                      Issued Date
                    </p>

                    <p className="font-bold text-slate-900">
                      {certificate.issuedDate}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                    <p className="text-sm text-slate-500 mb-1">
                      Token ID
                    </p>

                    <p className="font-bold text-slate-900">
                      #{certificate.id}
                    </p>
                  </div>
                </div>

                <div className="mt-5 bg-slate-50 rounded-2xl p-5 border border-slate-200">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <p className="text-sm text-slate-500">
                      Owner Wallet
                    </p>

                    <button
                      onClick={() => copyText(certificate.owner, "owner")}
                      className="text-sm text-violet-600 font-semibold hover:text-violet-800"
                    >
                      {copied === "owner" ? "Copied" : "Copy"}
                    </button>
                  </div>

                  <p className="font-semibold text-slate-900 break-all">
                    {certificate.owner}
                  </p>

                  <a
                    href={getAddressUrl(certificate.owner)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-3 text-sm text-violet-600 font-semibold hover:text-violet-800"
                  >
                    View owner on explorer
                  </a>
                </div>

                <div className="mt-5 bg-slate-50 rounded-2xl p-5 border border-slate-200">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <p className="text-sm text-slate-500">
                      Metadata URI
                    </p>

                    <button
                      onClick={() => copyText(certificate.metadataURI, "metadata")}
                      className="text-sm text-violet-600 font-semibold hover:text-violet-800"
                    >
                      {copied === "metadata" ? "Copied" : "Copy"}
                    </button>
                  </div>

                  <p className="font-semibold text-slate-900 break-all">
                    {certificate.metadataURI}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    IPFS Metadata
                  </h2>

                  <p className="text-slate-500 mt-1">
                    Metadata tambahan yang dibaca dari tokenURI certificate.
                  </p>
                </div>

                <span
                  className={
                    metadataStatus === "success"
                      ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold"
                      : metadataStatus === "failed"
                      ? "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold"
                      : "bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-semibold"
                  }
                >
                  {metadataStatus === "success"
                    ? "Loaded"
                    : metadataStatus === "failed"
                    ? "Unavailable"
                    : "No Metadata"}
                </span>
              </div>

              {metadataStatus === "failed" && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 p-5 rounded-2xl">
                  Metadata URI tersedia, tetapi file metadata belum bisa dimuat
                  dari gateway IPFS. Pastikan file sudah ter-pin dan CID benar.
                </div>
              )}

              {metadata && (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">
                      Metadata Name
                    </p>

                    <p className="font-bold text-slate-900">
                      {metadata.name || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500 mb-1">
                      Description
                    </p>

                    <p className="text-slate-700">
                      {metadata.description || "-"}
                    </p>
                  </div>

                  {metadata.attributes && metadata.attributes.length > 0 && (
                    <div>
                      <p className="text-sm text-slate-500 mb-3">
                        Attributes
                      </p>

                      <div className="grid md:grid-cols-2 gap-4">
                        {metadata.attributes.map((attr, index) => (
                          <div
                            key={index}
                            className="bg-slate-50 p-4 rounded-2xl border border-slate-200"
                          >
                            <p className="text-sm text-slate-500">
                              {attr.trait_type}
                            </p>

                            <p className="font-bold text-slate-900">
                              {attr.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!metadata && metadataStatus !== "failed" && (
                <div className="bg-slate-50 border border-slate-200 text-slate-600 p-5 rounded-2xl">
                  Metadata belum tersedia untuk certificate ini.
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-5">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-bold text-slate-900 mb-4">
                Verification Summary
              </h2>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-slate-500">
                    Token ID
                  </p>

                  <p className="font-bold text-slate-900">
                    #{certificate.id}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">
                    Certificate Status
                  </p>

                  <p
                    className={
                      certificate.valid
                        ? "font-bold text-green-600"
                        : "font-bold text-red-600"
                    }
                  >
                    {certificate.valid ? "Verified" : "Invalid"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">
                    Data Source
                  </p>

                  <p className="font-bold text-slate-900">
                    Smart Contract
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">
                    Metadata Source
                  </p>

                  <p className="font-bold text-slate-900">
                    IPFS
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-bold text-slate-900 mb-4">
                Actions
              </h2>

              <div className="space-y-3">
                <a
                  href={getTokenUrl(CONTRACT_ADDRESS, certificate.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center bg-slate-950 hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-semibold transition"
                >
                  View Token on Explorer
                </a>

                <Link
                  to="/verify"
                  className="block text-center border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-3 rounded-xl font-semibold transition"
                >
                  Verify Another
                </Link>

                <Link
                  to="/dashboard"
                  className="block text-center border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-3 rounded-xl font-semibold transition"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}