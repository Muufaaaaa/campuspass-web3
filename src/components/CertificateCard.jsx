import { Link } from "react-router-dom";

export default function CertificateCard({ cert }) {
  return (
    <Link
      to={`/certificate/${cert.id}`}
      className="group block"
    >
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition border border-slate-200 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-violet-600 to-cyan-400" />

        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <span
              className={
                cert.valid
                  ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold"
                  : "bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold"
              }
            >
              {cert.valid ? "Verified" : "Invalid"}
            </span>

            <span className="text-sm text-slate-400">
              #{cert.id}
            </span>
          </div>

          <h2 className="font-bold text-xl text-slate-900 mb-3 group-hover:text-violet-700 transition">
            {cert.eventName}
          </h2>

          <div className="space-y-2 text-sm text-slate-600">
            <p>
              <span className="font-semibold text-slate-800">
                Recipient:
              </span>{" "}
              {cert.recipientName}
            </p>

            <p>
              <span className="font-semibold text-slate-800">
                Issuer:
              </span>{" "}
              {cert.issuer}
            </p>

            <p>
              <span className="font-semibold text-slate-800">
                Date:
              </span>{" "}
              {cert.issuedDate}
            </p>
          </div>

          <div className="mt-5 pt-4 border-t text-sm text-violet-600 font-semibold">
            View Certificate →
          </div>
        </div>
      </div>
    </Link>
  );
}