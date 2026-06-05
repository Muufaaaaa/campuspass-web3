import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";

export default function ProtectedRoute({ children }) {
  const {
    walletAddress,
    checkingWallet,
    refreshWalletConnection,
  } = useWallet();

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    async function checkWallet() {
      await refreshWalletConnection();
      setChecked(true);
    }

    checkWallet();
  }, []);

  if (checkingWallet || !checked) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="bg-white/10 border border-white/10 rounded-3xl p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">
            Checking Wallet
          </h1>

          <p className="text-slate-400">
            Memeriksa koneksi wallet...
          </p>
        </div>
      </div>
    );
  }

  if (!walletAddress) {
    return <Navigate to="/" replace />;
  }

  return children;
}