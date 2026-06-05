import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useWallet } from "../context/WalletContext";

export default function LandingPage() {
  const navigate = useNavigate();
  const { connect, loading, walletAddress } = useWallet();

  const [errorMessage, setErrorMessage] = useState("");

  async function handleOpenDashboard() {
    try {
      setErrorMessage("");

      if (!walletAddress) {
        await connect();
      }

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      if (
        error?.code === 4001 ||
        error?.message?.toLowerCase().includes("user rejected")
      ) {
        setErrorMessage("Request wallet dibatalkan oleh pengguna.");
        return;
      }

      setErrorMessage(error.message || "Gagal connect wallet.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-950/60 via-slate-950 to-cyan-950/40" />
          <div className="absolute top-24 left-8 w-96 h-96 bg-violet-600/20 blur-3xl rounded-full" />
          <div className="absolute bottom-8 right-8 w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full" />

          <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32 grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-3 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm text-slate-300 mb-7">
                <span className="w-2.5 h-2.5 bg-green-400 rounded-full shadow-lg shadow-green-400/50" />
                On-chain certificate verification platform
              </div>

              <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight">
                Trusted Digital
                <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                  Certificates
                </span>
              </h1>

              <p className="mt-6 text-slate-300 max-w-xl text-lg leading-relaxed">
                CampusPass membantu penerbit, mahasiswa, dan verifikator
                mengelola certificate digital berbasis smart contract secara
                transparan, aman, dan mudah diverifikasi.
              </p>

              <div className="mt-9 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleOpenDashboard}
                  disabled={loading}
                  className="bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 px-7 py-4 rounded-2xl font-bold transition disabled:opacity-60 shadow-xl shadow-violet-900/30"
                >
                  {loading ? "Connecting..." : "Open Dashboard"}
                </button>

                <button
                  onClick={async () => {
                    try {
                      setErrorMessage("");

                      if (!walletAddress) {
                        await connect();
                      }

                      navigate("/verify");
                    } catch (error) {
                      console.error(error);

                      if (
                        error?.code === 4001 ||
                        error?.message?.toLowerCase().includes("user rejected")
                      ) {
                        setErrorMessage(
                          "Request wallet dibatalkan oleh pengguna.",
                        );
                        return;
                      }

                      setErrorMessage(error.message || "Gagal connect wallet.");
                    }
                  }}
                  disabled={loading}
                  className="border border-white/15 bg-white/5 hover:bg-white/10 px-7 py-4 rounded-2xl font-bold transition disabled:opacity-60"
                >
                  Verify Certificate
                </button>
              </div>

              {errorMessage && (
                <div className="mt-5 bg-red-500/10 border border-red-400/20 text-red-200 p-4 rounded-2xl max-w-xl">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm font-semibold">{errorMessage}</p>

                    <button
                      onClick={() => setErrorMessage("")}
                      className="text-red-200 hover:text-white font-bold"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-10 grid sm:grid-cols-3 gap-4 max-w-2xl">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-sm text-slate-400">Identity</p>

                  <p className="font-bold mt-1">Wallet-based</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-sm text-slate-400">Data Source</p>

                  <p className="font-bold mt-1">Smart Contract</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-sm text-slate-400">Metadata</p>

                  <p className="font-bold mt-1">IPFS Ready</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 to-cyan-400/20 blur-3xl rounded-full" />

              <div className="relative bg-white/10 border border-white/10 rounded-[2rem] p-6 shadow-2xl backdrop-blur">
                <div className="bg-slate-950 border border-white/10 rounded-[1.5rem] p-6">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                        <img
                          src="/favicon.svg"
                          alt="CampusPass Logo"
                          className="w-8 h-8 object-contain"
                        />
                      </div>

                      <div>
                        <p className="font-bold">CampusPass Registry</p>

                        <p className="text-xs text-slate-500">
                          Certificate Infrastructure
                        </p>
                      </div>
                    </div>

                    <span className="bg-green-400/10 text-green-300 border border-green-400/20 px-3 py-1 rounded-full text-sm font-semibold">
                      Live
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                      <p className="text-sm text-slate-400 mb-1">Step 01</p>

                      <h3 className="font-bold text-lg">Issue Certificate</h3>

                      <p className="text-slate-400 text-sm mt-2">
                        Issuer menerbitkan certificate ke wallet penerima
                        melalui transaksi blockchain.
                      </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                      <p className="text-sm text-slate-400 mb-1">Step 02</p>

                      <h3 className="font-bold text-lg">Store Ownership</h3>

                      <p className="text-slate-400 text-sm mt-2">
                        Smart contract menyimpan kepemilikan certificate
                        berdasarkan wallet address.
                      </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                      <p className="text-sm text-slate-400 mb-1">Step 03</p>

                      <h3 className="font-bold text-lg">Verify On-chain</h3>

                      <p className="text-slate-400 text-sm mt-2">
                        Verifikator dapat mengecek validitas certificate
                        menggunakan Token ID.
                      </p>
                    </div>
                  </div>

                  <div className="mt-7 h-2 bg-gradient-to-r from-violet-600 to-cyan-400 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative border-t border-white/10 bg-slate-950">
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="max-w-3xl mb-12">
              <p className="text-sm font-semibold text-violet-400 mb-2">
                Why CampusPass
              </p>

              <h2 className="text-3xl md:text-4xl font-bold">
                Certificate verification without manual database dependency.
              </h2>

              <p className="text-slate-400 mt-4">
                CampusPass menggunakan wallet, smart contract, dan metadata
                terdesentralisasi untuk membuat certificate lebih mudah
                dibuktikan dan sulit dimanipulasi.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/20 text-violet-300 flex items-center justify-center font-black mb-5">
                  1
                </div>

                <h3 className="text-xl font-bold mb-3">For Issuers</h3>

                <p className="text-slate-400">
                  Terbitkan certificate digital ke wallet penerima dengan data
                  yang dapat diverifikasi melalui smart contract.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-black mb-5">
                  2
                </div>

                <h3 className="text-xl font-bold mb-3">For Holders</h3>

                <p className="text-slate-400">
                  Pemilik certificate dapat melihat daftar credential yang
                  tersimpan di wallet mereka secara langsung.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <div className="w-12 h-12 rounded-2xl bg-green-500/20 text-green-300 flex items-center justify-center font-black mb-5">
                  3
                </div>

                <h3 className="text-xl font-bold mb-3">For Verifiers</h3>

                <p className="text-slate-400">
                  Verifikasi certificate cukup menggunakan Token ID tanpa perlu
                  menghubungi penerbit secara manual.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
