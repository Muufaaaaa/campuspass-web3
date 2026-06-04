import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  const connectWallet = () => {
    // sementara hanya simulasi connect wallet
    navigate("/dashboard");
  };

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-800 text-white flex flex-col justify-center items-center px-6">

        <h1 className="text-5xl font-bold text-center">
          CampusPass
        </h1>

        <p className="mt-5 text-center max-w-xl">
          Platform sertifikat digital mahasiswa
          berbasis blockchain yang aman,
          transparan, dan mudah diverifikasi.
        </p>

        <button
          onClick={connectWallet}
          className="mt-8 bg-white text-purple-700 px-6 py-3 rounded-xl hover:bg-gray-100 transition"
        >
          Connect Wallet
        </button>

      </section>
    </>
  );
}