import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  verifyCertificate,
  getCertificateData,
} from "../utils/certificate";

export default function VerifyCertificate() {
  const [tokenId, setTokenId] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function validateTokenId() {
    const value = tokenId.trim();

    if (!value) {
      setError("Token ID wajib diisi.");
      return false;
    }

    if (!/^\d+$/.test(value)) {
      setError("Token ID harus berupa angka.");
      return false;
    }

    if (Number(value) <= 0) {
      setError("Token ID harus lebih dari 0.");
      return false;
    }

    setError("");
    return true;
  }

  async function handleVerify(e) {
    e.preventDefault();

    setCertificate(null);
    setStatus("");
    setError("");

    const isValidInput = validateTokenId();

    if (!isValidInput) return;

    try {
      setLoading(true);

      const isValid = await verifyCertificate(tokenId.trim());

      if (!isValid) {
        setStatus("invalid");
        return;
      }

      const data = await getCertificateData(tokenId.trim());

      setCertificate(data);
      setStatus("valid");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setError(
        "Certificate tidak ditemukan atau gagal membaca data dari blockchain."
      );
    } finally {
      setLoading(false);
    }
  }

  function resetVerify() {
    setTokenId("");
    setCertificate(null);
    setStatus("");
    setError("");
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-6xl mx-auto p-6 md:p-8">
        <section className="relative overflow-hidden bg-slate-950 text-white rounded-3xl p-6 md:p-8 mb-8 shadow-xl">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-violet-600/20 blur-3xl rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-500/20 blur-3xl rounded-full" />

          <div className="relative max-w-3xl">
            <p className="text-sm text-violet-300 font-semibold mb-2">
              Certificate Verification
            </p>

            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Verify Certificate Authenticity
            </h1>

            <p className="text-slate-400">
              Masukkan Token ID untuk memeriksa apakah certificate benar-benar
              terdaftar, valid, dan dapat diverifikasi melalui smart contract.
            </p>
          </div>
        </section>

        <section className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8 sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Verify Token
              </h2>

              <p className="text-sm text-slate-500 mb-6">
                Gunakan Token ID certificate yang diberikan oleh issuer atau
                pemilik certificate.
              </p>

              <form onSubmit={handleVerify} className="space-y-5" noValidate>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Token ID
                  </label>

                  <input
                    type="text"
                    placeholder="Masukkan Token ID"
                    value={tokenId}
                    onChange={(e) => {
                      setTokenId(e.target.value);
                      setError("");
                      setStatus("");
                      setCertificate(null);
                    }}
                    className="w-full border border-slate-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none p-3 rounded-xl text-slate-900 bg-white transition"
                  />

                  {error && (
                    <p className="text-sm text-red-600 mt-2">
                      {error}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white px-5 py-4 rounded-xl font-semibold disabled:opacity-60 transition"
                >
                  {loading ? "Verifying..." : "Verify Certificate"}
                </button>

                {(status || tokenId) && (
                  <button
                    type="button"
                    onClick={resetVerify}
                    className="w-full border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-3 rounded-xl font-semibold transition"
                  >
                    Reset
                  </button>
                )}
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            {!status && !loading && (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 text-2xl font-bold mb-5">
                  ?
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Ready to verify
                </h3>

                <p className="text-slate-500 max-w-xl">
                  Masukkan Token ID certificate di panel kiri. Hasil verifikasi
                  akan diambil langsung dari blockchain dan ditampilkan di sini.
                </p>
              </div>
            )}

            {loading && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 rounded-3xl p-8 shadow-sm">
                <h3 className="text-2xl font-bold mb-2">
                  Reading blockchain data...
                </h3>

                <p>
                  Sistem sedang membaca status certificate dari smart contract.
                  Tunggu sampai proses selesai.
                </p>
              </div>
            )}

            {status === "valid" && certificate && (
              <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-green-500 to-cyan-400" />

                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
                    <div>
                      <p className="text-sm text-green-600 font-semibold mb-2">
                        Verification Result
                      </p>

                      <h3 className="text-3xl font-bold text-slate-900">
                        Certificate Valid
                      </h3>

                      <p className="text-slate-500 mt-2">
                        Certificate ini terdaftar dan masih valid di smart
                        contract.
                      </p>
                    </div>

                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                      On-chain Verified
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                      <p className="text-sm text-slate-500 mb-1">
                        Certificate / Event
                      </p>

                      <p className="font-bold text-slate-900">
                        {certificate.eventName}
                      </p>
                    </div>

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

                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                      <p className="text-sm text-slate-500 mb-1">
                        Status
                      </p>

                      <p className="font-bold text-green-600">
                        {certificate.valid ? "Verified" : "Invalid"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 bg-slate-50 rounded-2xl p-5 border border-slate-200">
                    <p className="text-sm text-slate-500 mb-1">
                      Owner Wallet
                    </p>

                    <p className="font-semibold text-slate-900 break-all">
                      {certificate.owner}
                    </p>
                  </div>

                  <div className="mt-5 bg-slate-50 rounded-2xl p-5 border border-slate-200">
                    <p className="text-sm text-slate-500 mb-1">
                      Metadata URI
                    </p>

                    <p className="font-semibold text-slate-900 break-all">
                      {certificate.metadataURI}
                    </p>
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <Link
                      to={`/certificate/${certificate.id}`}
                      className="text-center bg-slate-950 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold transition"
                    >
                      View Certificate Detail
                    </Link>

                    <button
                      onClick={resetVerify}
                      className="border border-slate-300 hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-xl font-semibold transition"
                    >
                      Verify Another Token
                    </button>
                  </div>
                </div>
              </div>
            )}

            {status === "invalid" && (
              <div className="bg-red-50 border border-red-200 text-red-900 rounded-3xl p-8 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 text-2xl font-bold mb-5">
                  !
                </div>

                <h3 className="text-2xl font-bold mb-2">
                  Certificate Invalid
                </h3>

                <p className="max-w-xl">
                  Certificate ditemukan tetapi statusnya tidak valid, atau
                  certificate sudah dicabut oleh issuer.
                </p>
              </div>
            )}

            {status === "error" && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 rounded-3xl p-8 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-yellow-100 flex items-center justify-center text-yellow-700 text-2xl font-bold mb-5">
                  ?
                </div>

                <h3 className="text-2xl font-bold mb-2">
                  Certificate Not Found
                </h3>

                <p className="max-w-xl">
                  Token ID tidak ditemukan, network salah, atau contract tidak
                  bisa dibaca. Pastikan Token ID dan jaringan wallet sudah benar.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}