import { useState } from "react";
import { isAddress } from "ethers";
import Navbar from "../components/Navbar";
import { useWallet } from "../context/WalletContext";
import { issueCertificate } from "../utils/certificate";
import { getTransactionUrl } from "../config/contract";

function getCurrentDateText() {
  return new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function IssueCertificate() {
  const { walletAddress, connect } = useWallet();

  const [form, setForm] = useState({
    recipient: "",
    recipientName: "",
    eventName: "",
    issuer: "",
    issuedDate: getCurrentDateText(),
    metadataURI: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
      global: "",
    });

    setSuccessMessage("");
    setTxHash("");
  }

  function validateForm() {
    const newErrors = {};

    if (!form.recipient.trim()) {
      newErrors.recipient = "Wallet penerima wajib diisi.";
    } else if (!isAddress(form.recipient)) {
      newErrors.recipient = "Format wallet address tidak valid.";
    }

    if (!form.recipientName.trim()) {
      newErrors.recipientName = "Nama penerima wajib diisi.";
    }

    if (!form.eventName.trim()) {
      newErrors.eventName = "Nama certificate/event wajib diisi.";
    }

    if (!form.issuer.trim()) {
      newErrors.issuer = "Nama issuer wajib diisi.";
    }

    if (!form.issuedDate.trim()) {
      newErrors.issuedDate = "Tanggal penerbitan wajib diisi.";
    }

    if (!form.metadataURI.trim()) {
      newErrors.metadataURI = "Metadata URI wajib diisi.";
    } else if (
      !form.metadataURI.startsWith("ipfs://") &&
      !form.metadataURI.startsWith("https://")
    ) {
      newErrors.metadataURI = "Metadata URI harus diawali ipfs:// atau https://";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setErrors({});
    setSuccessMessage("");
    setTxHash("");

    const isValid = validateForm();

    if (!isValid) return;

    try {
      setLoading(true);

      if (!walletAddress) {
        await connect();
      }

      const receipt = await issueCertificate({
        recipient: form.recipient,
        recipientName: form.recipientName,
        eventName: form.eventName,
        issuer: form.issuer,
        issuedDate: form.issuedDate,
        metadataURI: form.metadataURI,
      });

      setTxHash(receipt.hash || "");
      setSuccessMessage("Certificate berhasil diterbitkan ke wallet penerima.");

      setForm({
        recipient: "",
        recipientName: "",
        eventName: "",
        issuer: "",
        issuedDate: getCurrentDateText(),
        metadataURI: "",
      });
    } catch (error) {
      console.error(error);

      let message =
        error.reason ||
        error.shortMessage ||
        error.message ||
        "Gagal menerbitkan certificate.";

      if (
        message.toLowerCase().includes("ownable") ||
        message.toLowerCase().includes("owner")
      ) {
        message =
          "Wallet ini bukan owner/admin contract. Gunakan wallet yang dipakai saat deploy contract.";
      }

      setErrors({
        global: message,
      });
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full border border-slate-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none p-3 rounded-xl text-slate-900 bg-white transition";

  const errorClass = "text-sm text-red-600 mt-2";

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-5xl mx-auto p-6 md:p-8">
        <section className="relative overflow-hidden bg-slate-950 text-white rounded-3xl p-6 md:p-8 mb-8 shadow-xl">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-violet-600/20 blur-3xl rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-500/20 blur-3xl rounded-full" />

          <div className="relative">
            <p className="text-sm text-violet-300 font-semibold mb-2">
              Certificate Issuer Panel
            </p>

            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Issue New Certificate
            </h1>

            <p className="text-slate-400 max-w-2xl">
              Terbitkan certificate digital ke wallet penerima. Data certificate
              akan dicatat melalui smart contract dan dapat diverifikasi
              berdasarkan Token ID.
            </p>
          </div>
        </section>

        <section className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
            {errors.global && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-5 rounded-2xl mb-6">
                <h3 className="font-bold mb-1">
                  Transaction Failed
                </h3>
                <p>{errors.global}</p>
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-800 p-5 rounded-2xl mb-6">
                <h3 className="font-bold mb-1">
                  Certificate Issued
                </h3>

                <p>{successMessage}</p>

                {txHash && (
                  <div className="mt-3">
                    <p className="break-all text-sm text-green-700">
                      Transaction Hash: {txHash}
                    </p>

                    <a
                      href={getTransactionUrl(txHash)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mt-2 text-sm font-semibold text-green-800 underline"
                    >
                      View transaction on explorer
                    </a>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Recipient Wallet Address
                </label>

                <input
                  type="text"
                  name="recipient"
                  placeholder="0x..."
                  value={form.recipient}
                  onChange={handleChange}
                  className={inputClass}
                />

                {errors.recipient && (
                  <p className={errorClass}>{errors.recipient}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Recipient Name
                </label>

                <input
                  type="text"
                  name="recipientName"
                  placeholder="Nama penerima certificate"
                  value={form.recipientName}
                  onChange={handleChange}
                  className={inputClass}
                />

                {errors.recipientName && (
                  <p className={errorClass}>{errors.recipientName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Certificate / Event Name
                </label>

                <input
                  type="text"
                  name="eventName"
                  placeholder="Nama event, course, organisasi, atau program"
                  value={form.eventName}
                  onChange={handleChange}
                  className={inputClass}
                />

                {errors.eventName && (
                  <p className={errorClass}>{errors.eventName}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Issuer
                  </label>

                  <input
                    type="text"
                    name="issuer"
                    placeholder="Nama penerbit certificate"
                    value={form.issuer}
                    onChange={handleChange}
                    className={inputClass}
                  />

                  {errors.issuer && (
                    <p className={errorClass}>{errors.issuer}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Issued Date
                  </label>

                  <input
                    type="text"
                    name="issuedDate"
                    placeholder="Tanggal penerbitan"
                    value={form.issuedDate}
                    onChange={handleChange}
                    className={inputClass}
                  />

                  {errors.issuedDate && (
                    <p className={errorClass}>{errors.issuedDate}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Metadata URI
                </label>

                <input
                  type="text"
                  name="metadataURI"
                  placeholder="ipfs://CID_METADATA_JSON"
                  value={form.metadataURI}
                  onChange={handleChange}
                  className={inputClass}
                />

                {errors.metadataURI && (
                  <p className={errorClass}>{errors.metadataURI}</p>
                )}

                <p className="text-sm text-slate-500 mt-2">
                  Metadata URI harus berisi file JSON certificate yang sudah
                  diunggah ke IPFS.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white px-5 py-4 rounded-xl font-semibold disabled:opacity-60 transition"
              >
                {loading ? "Waiting for Blockchain Confirmation..." : "Issue Certificate"}
              </button>
            </form>
          </div>

          <aside className="space-y-5">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-2">
                Connected Issuer Wallet
              </p>

              <p className="font-bold text-slate-900 break-all">
                {walletAddress || "Wallet belum terhubung"}
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
              <h2 className="font-bold text-slate-900 mb-3">
                Important Notes
              </h2>

              <ul className="space-y-3 text-sm text-slate-600">
                <li>
                  Wallet issuer harus merupakan owner/admin smart contract.
                </li>

                <li>
                  Recipient wallet akan menjadi pemilik certificate NFT.
                </li>

                <li>
                  Metadata URI berasal dari IPFS dan akan disimpan sebagai
                  tokenURI certificate.
                </li>

                <li>
                  Setelah berhasil, certificate dapat diverifikasi melalui
                  halaman Verify.
                </li>
              </ul>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}