import Navbar from "../components/Navbar";
import CertificateCard from "../components/CertificateCard";
import { certificates } from "../data/dummyData";

export default function Dashboard() {
  return (
    <>
      <Navbar />

      <div className="p-8">

        <div className="bg-slate-900 text-white rounded-xl p-5 mb-8">
          <h2>Wallet Address</h2>

          <p>
            0x7fD...A12B
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-5">
          My Certificates
        </h2>

        <div className="grid md:grid-cols-3 gap-5">

          {certificates.map(cert => (
            <CertificateCard
              key={cert.id}
              cert={cert}
            />
          ))}

        </div>
      </div>
    </>
  );
}