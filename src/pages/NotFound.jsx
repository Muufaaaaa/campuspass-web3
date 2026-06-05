import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-4xl mx-auto p-6 md:p-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-10 md:p-14 text-center shadow-sm">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white text-3xl font-black mb-6">
            404
          </div>

          <h1 className="text-4xl font-black text-slate-900 mb-3">
            Page Not Found
          </h1>

          <p className="text-slate-500 max-w-xl mx-auto mb-8">
            Halaman yang kamu cari tidak tersedia atau route tidak dikenali oleh CampusPass.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/dashboard"
              className="bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              Go to Dashboard
            </Link>

            <Link
              to="/verify"
              className="border border-slate-300 hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-xl font-semibold transition"
            >
              Verify Certificate
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}