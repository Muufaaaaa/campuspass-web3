import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";

export default function ConnectWalletButton() {
  const { walletAddress, loading, connect, switchAccount, disconnect } =
    useWallet();

  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  function getFriendlyError(error) {
    if (error?.code === 4001) {
      return "Request wallet dibatalkan oleh pengguna.";
    }

    if (error?.message?.toLowerCase().includes("user rejected")) {
      return "Request wallet dibatalkan oleh pengguna.";
    }

    if (error?.message?.toLowerCase().includes("metamask")) {
      return "MetaMask belum terinstall atau belum aktif.";
    }

    return error?.message || "Terjadi kesalahan saat menghubungkan wallet.";
  }

  async function handleConnectWallet() {
    try {
      setErrorMessage("");
      await connect();
    } catch (error) {
      console.error(error);
      setErrorMessage(getFriendlyError(error));
    }
  }

  async function handleSwitchWallet() {
    try {
      setErrorMessage("");
      await switchAccount();
      setOpen(false);
    } catch (error) {
      console.error(error);
      setErrorMessage(getFriendlyError(error));
    }
  }

  async function handleDisconnect() {
    try {
      setErrorMessage("");

      await disconnect();

      setOpen(false);
      navigate("/");
    } catch (error) {
      console.error(error);
      setErrorMessage("Gagal disconnect wallet.");
    }
  }

  function shortAddress(address) {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  if (!walletAddress) {
    return (
      <div className="relative">
        <button
          onClick={handleConnectWallet}
          disabled={loading}
          className="bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white px-4 py-2 rounded-2xl transition text-sm font-semibold disabled:opacity-60 shadow-lg shadow-violet-900/20"
        >
          {loading ? "Connecting..." : "Connect Wallet"}
        </button>

        {errorMessage && (
          <div className="absolute right-0 mt-3 w-72 bg-red-50 border border-red-200 text-red-700 rounded-2xl shadow-xl p-4 z-50">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold">Wallet Connection Failed</p>

                <p className="text-sm mt-1">{errorMessage}</p>
              </div>

              <button
                onClick={() => setErrorMessage("")}
                className="text-red-500 hover:text-red-700 font-bold"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen(!open);
          setErrorMessage("");
        }}
        className="group flex items-center gap-3 bg-white/10 border border-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-2xl transition"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
        </span>

        <span className="text-sm font-semibold">
          {shortAddress(walletAddress)}
        </span>

        <span className="hidden lg:inline text-xs text-slate-400 group-hover:text-slate-300">
          Connected
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-72 bg-white text-slate-900 border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50">
          <div className="p-4 border-b border-slate-200">
            <p className="text-xs text-slate-500 mb-1">Connected Wallet</p>

            <p className="text-sm font-semibold break-all">{walletAddress}</p>
          </div>

          {errorMessage && (
            <div className="m-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3">
              <p className="text-sm font-semibold">{errorMessage}</p>
            </div>
          )}

          <button
            onClick={handleSwitchWallet}
            disabled={loading}
            className="w-full text-left px-4 py-3 hover:bg-slate-100 text-sm font-semibold transition disabled:opacity-60"
          >
            {loading ? "Opening MetaMask..." : "Switch Wallet"}
          </button>

          <button
            onClick={handleDisconnect}
            className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 text-sm font-semibold transition"
          >
            Disconnect from App
          </button>
        </div>
      )}
    </div>
  );
}
