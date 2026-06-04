import { Link } from "react-router-dom";

export default function CertificateCard({ cert }) {
  return (
    <Link to={`/certificate/${cert.id}`}>
      <div className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition cursor-pointer">

        <h2 className="font-bold text-lg">
          {cert.title}
        </h2>

        <p>{cert.recipient}</p>

        <p className="text-gray-500">
          Token ID: {cert.tokenId}
        </p>

        <span className="text-green-600 font-semibold">
          Verified
        </span>

      </div>
    </Link>
  );
}