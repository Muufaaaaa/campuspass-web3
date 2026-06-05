import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CertificateCard from "../components/CertificateCard";
import { useWallet } from "../context/WalletContext";
import { getContractReadOnly } from "../utils/web3";
import {
  getCertificatesByOwner,
  getCertificateData,
} from "../utils/certificate";

export default function Dashboard() {
  const { walletAddress, connect } = useWallet();

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  function formatWallet(address) {
    if (!address) return "Wallet belum terhubung";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  function formatLastUpdated() {
    return new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  function getFriendlyBlockchainError(err) {
    let message =
      err?.reason ||
      err?.shortMessage ||
      err?.message ||
      "Gagal membaca data certificate dari blockchain.";

    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("contract address")) {
      return "Contract address belum diatur atau salah. Cek file .env atau src/config/contract.js.";
    }

    if (lowerMessage.includes("could not decode result data")) {
      return "Contract address atau ABI tidak cocok dengan smart contract yang sedang dipakai.";
    }

    if (lowerMessage.includes("missing revert data")) {
      return "Gagal membaca contract. Pastikan contract sudah deploy di Sepolia dan ABI sesuai.";
    }

    if (lowerMessage.includes("network")) {
      return "Network wallet tidak sesuai. Pastikan MetaMask menggunakan Sepolia Testnet.";
    }

    if (lowerMessage.includes("metamask")) {
      return "MetaMask belum terinstall atau belum aktif.";
    }

    return message;
  }

  async function fetchCertificates(address, showLoading = true) {
    if (!address) {
      setCertificates([]);
      setError("");
      return;
    }

    try {
      if (showLoading) setLoading(true);

      setError("");

      const ids = await getCertificatesByOwner(address);

      const certificateData = await Promise.all(
        ids.map((id) => getCertificateData(id))
      );

      setCertificates(certificateData);
      setLastUpdated(formatLastUpdated());
    } catch (err) {
      console.error("Dashboard blockchain read error:", err);

      setCertificates([]);
      setError(getFriendlyBlockchainError(err));
    } finally {
      if (showLoading) setLoading(false);
    }
  }

  async function handleConnectAndLoad() {
    try {
      setError("");

      let address = walletAddress;

      if (!address) {
        address = await connect();
      }

      await fetchCertificates(address);
    } catch (err) {
      console.error("Wallet connection error:", err);

      if (
        err?.code === 4001 ||
        err?.message?.toLowerCase().includes("user rejected")
      ) {
        setError("Request wallet dibatalkan oleh pengguna.");
        return;
      }

      setError(err?.message || "Gagal menghubungkan wallet.");
    }
  }

  useEffect(() => {
    if (walletAddress) {
      fetchCertificates(walletAddress);
    } else {
      setCertificates([]);
      setLastUpdated("");
      setError("");
    }
  }, [walletAddress]);

  useEffect(() => {
    if (!walletAddress) {
      setListening(false);
      return;
    }

    let contract;

    async function setupListener() {
      try {
        contract = getContractReadOnly();

        async function handleCertificateIssued(tokenId, recipient) {
          const recipientAddress = String(recipient).toLowerCase();
          const currentWallet = String(walletAddress).toLowerCase();

          if (recipientAddress === currentWallet) {
            await fetchCertificates(walletAddress, false);
          }
        }

        contract.on("CertificateIssued", handleCertificateIssued);
        setListening(true);

        return () => {
          contract.off("CertificateIssued", handleCertificateIssued);
          setListening(false);
        };
      } catch (err) {
        console.error("Gagal memasang listener event:", err);
        setListening(false);
        return null;
      }
    }

    const cleanupPromise = setupListener();

    return () => {
      cleanupPromise.then((cleanup) => {
        if (cleanup) cleanup();
      });
    };
  }, [walletAddress]);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto p-6 md:p-8">
        <section className="relative overflow-hidden bg-slate-950 text-white rounded-3xl p-6 md:p-8 mb-8 shadow-xl">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-violet-600/20 blur-3xl rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-500/20 blur-3xl rounded-full" />

          <div className="relative grid lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2">
              <p className="text-sm text-violet-300 font-semibold mb-2">
                CampusPass Dashboard
              </p>

              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                My Blockchain Certificates
              </h1>

              <p className="text-slate-400 max-w-2xl">
                Dashboard ini menampilkan certificate digital yang benar-benar
                terhubung dengan wallet kamu melalui smart contract.
              </p>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-2xl p-5 backdrop-blur">
              <p className="text-sm text-slate-400 mb-2">
                Connected Wallet
              </p>

              <p className="font-bold text-lg break-all">
                {formatWallet(walletAddress)}
              </p>

              {walletAddress && (
                <p className="text-xs text-slate-500 break-all mt-2">
                  {walletAddress}
                </p>
              )}

              <button
                onClick={handleConnectAndLoad}
                disabled={loading}
                className="mt-5 w-full bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 px-5 py-3 rounded-xl disabled:opacity-60 font-semibold transition"
              >
                {loading
                  ? "Loading..."
                  : walletAddress
                  ? "Refresh Certificates"
                  : "Connect Wallet"}
              </button>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <p className="text-sm text-slate-500 mb-2">
              Total Certificates
            </p>

            <h2 className="text-3xl font-bold text-slate-900">
              {certificates.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <p className="text-sm text-slate-500 mb-2">
              Verification Status
            </p>

            <h2 className="text-lg font-bold text-green-600">
              {certificates.length > 0
                ? "On-chain Verified"
                : "No Certificate Found"}
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <p className="text-sm text-slate-500 mb-2">
              Realtime Listener
            </p>

            <h2
              className={
                listening
                  ? "text-lg font-bold text-green-600"
                  : "text-lg font-bold text-slate-500"
              }
            >
              {listening ? "Active" : "Inactive"}
            </h2>
          </div>
        </section>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-5 rounded-2xl mb-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-bold mb-1">
                  Cannot Load Certificates
                </h3>

                <p className="text-sm">
                  {error}
                </p>
              </div>

              <button
                onClick={() => setError("")}
                className="text-red-600 hover:text-red-800 font-bold"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <section className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Certificates
            </h2>

            <p className="text-slate-500 mt-1">
              Data diambil langsung dari smart contract berdasarkan wallet yang
              sedang terhubung.
            </p>
          </div>

          {lastUpdated && (
            <p className="text-sm text-slate-500">
              Last updated: {lastUpdated}
            </p>
          )}
        </section>

        {loading && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 p-5 rounded-2xl mb-8">
            Mengambil data certificate dari blockchain...
          </div>
        )}

        {!loading && !walletAddress && (
          <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold mb-5">
              W
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Connect your wallet
            </h3>

            <p className="text-slate-500 max-w-xl mx-auto mb-6">
              Hubungkan wallet untuk melihat certificate digital yang sudah
              diterbitkan ke alamat wallet kamu.
            </p>

            <button
              onClick={handleConnectAndLoad}
              className="bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              Connect Wallet
            </button>
          </div>
        )}

        {!loading && walletAddress && certificates.length === 0 && !error && (
          <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 text-2xl font-bold mb-5">
              0
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              No certificates found
            </h3>

            <p className="text-slate-500 max-w-xl mx-auto">
              Wallet ini belum memiliki certificate dari CampusPass. Certificate
              akan muncul otomatis setelah issuer menerbitkannya ke wallet ini.
            </p>
          </div>
        )}

        {!loading && certificates.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <CertificateCard
                key={cert.id}
                cert={cert}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}