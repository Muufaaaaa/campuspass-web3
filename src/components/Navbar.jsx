export default function Navbar() {
  return (
    <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between">
      <h1 className="font-bold text-xl">
        CampusPass
      </h1>

      <button className="bg-violet-600 px-4 py-2 rounded-lg">
        Connect Wallet
      </button>
    </nav>
  );
}