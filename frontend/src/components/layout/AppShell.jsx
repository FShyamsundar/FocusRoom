import { motion } from "framer-motion";
import { BarChart3, LogOut, TimerReset, Users } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logoutUser } from "../../features/auth/authSlice";
import { useRealtimePresence } from "../../hooks/useRealtimePresence";
import { APP_NAVIGATION } from "../../utils/constants";
import Button from "../common/Button";
import Logo from "../common/Logo";

const iconMap = {
  "/room": TimerReset,
  "/dashboard": BarChart3,
  "/community": Users,
};

const AppShell = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  useRealtimePresence();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <div className="min-h-screen px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto flex max-w-7xl flex-col gap-6"
      >
        <header className="glass-panel flex flex-col gap-5 rounded-[30px] px-4 py-4 sm:px-6 sm:py-5 lg:flex-row lg:items-center lg:justify-between">
          <Link to="/room">
            <Logo />
          </Link>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <nav className="flex flex-nowrap gap-2 overflow-x-auto rounded-2xl border border-line bg-plateBlue p-1">
              {APP_NAVIGATION.map((item) => {
                const Icon = iconMap[item.href];
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={({ isActive }) =>
                      `flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition ${
                        isActive
                          ? "bg-plate text-ink"
                          : "text-muted hover:bg-plate hover:text-ink"
                      }`
                    }
                  >
                    <Icon size={16} />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="text-left sm:text-right">
                <p className="text-sm font-semibold text-ink">{user?.name}</p>
                <p className="text-xs text-muted">{user?.email}</p>
              </div>
              <Button
                variant="secondary"
                className="flex items-center gap-2"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          </div>
        </header>
        {children}

        <footer className="mt-6 text-center text-xs text-muted">
          <span>© {new Date().getFullYear()} </span>
          <a
            href="https://shyamsundar-full-stack-developer.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-ink"
          >
            shyam sundar
          </a>
          <span> — all rights reserved.</span>
        </footer>
      </motion.div>
    </div>
  );
};

export default AppShell;
