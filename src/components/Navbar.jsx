import { Link, useLocation } from "react-router-dom";
import ConnectWalletButton from "./ConnectWalletButton";

export default function Navbar() {
  const location = useLocation();

  const menus = [
    {
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      label: "Issue",
      path: "/issue",
    },
    {
      label: "Verify",
      path: "/verify",
    },
  ];

  function getActiveIndex() {
    if (
      location.pathname.startsWith("/dashboard") ||
      location.pathname.startsWith("/certificate")
    ) {
      return 0;
    }

    if (location.pathname.startsWith("/issue")) {
      return 1;
    }

    if (location.pathname.startsWith("/verify")) {
      return 2;
    }

    return -1;
  }

  const activeIndex = getActiveIndex();

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden shadow-lg shadow-violet-900/20">
            <img
              src="/favicon.svg"
              alt="CampusPass Logo"
              className="w-8 h-8 object-contain"
            />
          </div>

          <div>
            <h1 className="font-bold text-xl leading-none">
              CampusPass
            </h1>

            <p className="text-xs text-slate-400 mt-1 hidden sm:block">
              Web3 Certificate Registry
            </p>
          </div>
        </Link>

        <div className="hidden md:block">
          <div className="relative grid grid-cols-3 bg-white/5 border border-white/10 rounded-2xl p-1 overflow-hidden">
            {activeIndex !== -1 && (
              <span
                className="absolute top-1 bottom-1 left-1 rounded-xl bg-white shadow-md transition-transform duration-300 ease-out"
                style={{
                  width: "calc((100% - 8px) / 3)",
                  transform: `translateX(${activeIndex * 100}%)`,
                }}
              />
            )}

            {menus.map((menu) => (
              <Link
                key={menu.path}
                to={menu.path}
                className={
                  activeIndex === menus.indexOf(menu)
                    ? "relative z-10 px-5 py-2 rounded-xl text-slate-950 text-sm font-semibold transition-colors duration-300 text-center"
                    : "relative z-10 px-5 py-2 rounded-xl text-slate-300 hover:text-white text-sm font-semibold transition-colors duration-300 text-center"
                }
              >
                {menu.label}
              </Link>
            ))}
          </div>
        </div>

        <ConnectWalletButton />
      </div>

      <div className="md:hidden border-t border-white/10 px-6 py-3">
        <div className="relative grid grid-cols-3 bg-white/5 border border-white/10 rounded-2xl p-1 overflow-hidden">
          {activeIndex !== -1 && (
            <span
              className="absolute top-1 bottom-1 left-1 rounded-xl bg-white shadow-md transition-transform duration-300 ease-out"
              style={{
                width: "calc((100% - 8px) / 3)",
                transform: `translateX(${activeIndex * 100}%)`,
              }}
            />
          )}

          {menus.map((menu) => (
            <Link
              key={menu.path}
              to={menu.path}
              className={
                activeIndex === menus.indexOf(menu)
                  ? "relative z-10 px-4 py-2 rounded-xl text-slate-950 text-sm font-semibold text-center transition-colors duration-300"
                  : "relative z-10 px-4 py-2 rounded-xl text-slate-300 text-sm font-semibold text-center transition-colors duration-300"
              }
            >
              {menu.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}