import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Code2, FileCode2, Home, LogIn, LogOut, Shield } from "lucide-react";
import toast from "react-hot-toast";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/getquestions", label: "Problems", icon: FileCode2 },
  { to: "/compiler", label: "Compiler", icon: Code2 },
];

const linkBase =
  "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-cyan-300/40 hover:bg-cyan-400/10 hover:text-white";

function AppShell({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const role = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/", { replace: true });
  };

  const isAuthPage = location.pathname.startsWith("/auth");

  return (
    <div className="min-h-screen text-slate-100">
      {!isAuthPage && (
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(6,12,22,0.76)] backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <Link to="/" className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_18px_40px_-24px_rgba(34,211,238,0.8)]">
                  <Code2 size={22} className="text-cyan-300" />
                </div>
                <div>
                  <p className="text-2xl font-semibold leading-none tracking-tight text-white">
                    B.Engine
                  </p>
                  <p className="text-sm text-slate-400">
                    Practice and run code in one place
                  </p>
                </div>
              </Link>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <nav className="flex flex-wrap gap-2">
                {navItems.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `${linkBase} ${isActive ? "border-cyan-300/50 bg-cyan-400/12 text-white" : ""}`
                    }
                  >
                    <Icon size={16} />
                    {label}
                  </NavLink>
                ))}
                {role === "admin" && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `${linkBase} ${isActive ? "border-cyan-300/50 bg-cyan-400/12 text-white" : ""}`
                    }
                  >
                    <Shield size={16} />
                    Admin
                  </NavLink>
                )}
              </nav>

              <div className="flex items-center gap-2">
                {token ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className={linkBase}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                ) : (
                  <Link to="/auth" className={linkBase}>
                    <LogIn size={16} />
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>
      )}

      <main>{children}</main>
    </div>
  );
}

export default AppShell;
