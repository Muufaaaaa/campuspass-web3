import Navbar from "../components/Navbar";

export default function IssueCertificate() {
  return (
    <>
      <Navbar />

      <div className="max-w-xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-5">
          Issue Certificate
        </h1>

        <form className="space-y-4">

          <input
            type="text"
            placeholder="Student Name"
            className="w-full border p-3 rounded"
          />

          <input
            type="text"
            placeholder="Course Name"
            className="w-full border p-3 rounded"
          />

          <button
            className="bg-violet-600 text-white px-5 py-3 rounded"
          >
            Generate
          </button>

        </form>
      </div>
    </>
  );
}