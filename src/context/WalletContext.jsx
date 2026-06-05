import { createContext, useContext, useEffect, useState } from "react";
import { checkNetwork, switchToSepolia } from "../utils/web3";

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingWallet, setCheckingWallet] = useState(true);

  async function connect() {
    try {
      setLoading(true);

      if (!window.ethereum) {
        throw new Error("MetaMask belum terinstall.");
      }

      const isCorrectNetwork = await checkNetwork();

      if (!isCorrectNetwork) {
        await switchToSepolia();
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const address = accounts[0];

      setWalletAddress(address);

      return address;
    } finally {
      setLoading(false);
    }
  }

  async function switchAccount() {
    try {
      setLoading(true);

      if (!window.ethereum) {
        throw new Error("MetaMask belum terinstall.");
      }

      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [
          {
            eth_accounts: {},
          },
        ],
      });

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const address = accounts[0];

      setWalletAddress(address);

      return address;
    } finally {
      setLoading(false);
    }
  }

  async function refreshWalletConnection() {
    try {
      setCheckingWallet(true);

      if (!window.ethereum) {
        setWalletAddress("");
        return "";
      }

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        return accounts[0];
      }

      setWalletAddress("");
      return "";
    } finally {
      setCheckingWallet(false);
    }
  }

  async function disconnect() {
    try {
      setLoading(true);

      if (window.ethereum) {
        try {
          await window.ethereum.request({
            method: "wallet_revokePermissions",
            params: [
              {
                eth_accounts: {},
              },
            ],
          });
        } catch (error) {
          console.warn("Gagal revoke permission MetaMask:", error);
        }
      }

      setWalletAddress("");

      return true;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshWalletConnection();

    if (!window.ethereum) return;

    function handleAccountsChanged(accounts) {
      if (accounts.length === 0) {
        setWalletAddress("");
      } else {
        setWalletAddress(accounts[0]);
      }
    }

    function handleChainChanged() {
      window.location.reload();
    }

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        loading,
        checkingWallet,
        connect,
        switchAccount,
        disconnect,
        refreshWalletConnection,
        isConnected: Boolean(walletAddress),
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error("useWallet harus dipakai di dalam WalletProvider");
  }

  return context;
}
