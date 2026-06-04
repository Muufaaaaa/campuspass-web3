import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { certificates } from "../data/dummyData";
import Navbar from "../components/Navbar";

export default function CertificateDetail() {
  const { id } = useParams();

  const cert = certificates.find(
    item => item.id === Number(id)
  );

  if (!cert) {
    return (
      <div>
        Certificate Not Found
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Link
  to="/dashboard"
  className="text-blue-600 mb-4 inline-block"
>
  ← Back to Dashboard
</Link>

      <div className="max-w-3xl mx-auto p-8">

        <div className="bg-white rounded-xl shadow-xl p-8">

          <h1 className="text-3xl font-bold mb-6">
            {cert.title}
          </h1>

          <div className="space-y-4">

            <p>
              <strong>Recipient:</strong>
              {" "}
              {cert.recipient}
            </p>

            <p>
              <strong>Issuer:</strong>
              {" "}
              {cert.issuer}
            </p>

            <p>
              <strong>Date:</strong>
              {" "}
              {cert.date}
            </p>

            <p>
              <strong>Token ID:</strong>
              {" "}
              {cert.tokenId}
            </p>

            <p>
              <strong>Status:</strong>
              {" "}
              <span className="text-green-600">
                Verified
              </span>
            </p>

          </div>

        </div>

      </div>
    </>
  );
}