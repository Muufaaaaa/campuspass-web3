import Navbar from "../components/Navbar";

export default function VerifyCertificate() {
  return (
    <>
      <Navbar />

      <div className="max-w-xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-5">
          Verify Certificate
        </h1>

        <input
          type="text"
          placeholder="Input Token ID"
          className="w-full border p-3 rounded mb-5"
        />

        <div className="bg-green-100 p-4 rounded">

          <h3 className="font-bold">
            Certificate Valid
          </h3>

          <p>Blockchain Fundamentals</p>

          <p>Owner: Ariq Gusmila</p>

          <p>Token ID: CP001</p>

        </div>

      </div>
    </>
  );
}