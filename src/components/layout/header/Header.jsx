import { useMemo, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { HiMagnifyingGlass, HiBell, HiMoon, HiSun } from "react-icons/hi2";
import { useTheme } from "../../../contexts/ThemeContext";

const pageTitles = {
  "/": "Dashboard",
  "/students": "Data Siswa",
  "/bills": "Tagihan",
  "/payments": "Pembayaran",
  "/reports": "Laporan",
  "/settings": "Pengaturan",
};

export default function Header() {
  const location = useLocation();

  const { dark, setDark } = useTheme();
  const [time, setTime] = useState(
    new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const today = useMemo(() => {
    return new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, []);

  const pageTitle = pageTitles[location.pathname] || "Dashboard";

  return (
    <header
      className="
      sticky
      top-0
      z-40
      h-[72px]
      px-8
      flex
      items-center
      justify-between
      bg-white/80
      dark:bg-zinc-900/80
      backdrop-blur-xl
      border-b
      border-gray-200
      dark:border-zinc-800
    "
    >
      {/* LEFT */}

      <div>
        <h1 className="text-2xl font-bold dark:text-white">{pageTitle}</h1>

        <p className="text-sm text-gray-500">{today}</p>
      </div>

      {/* CENTER CLOCK */}

      <div className="hidden lg:flex flex-1 justify-center">
        <div
          className="
      flex
      items-center
      gap-3
      rounded-2xl
      dark:border-zinc-700
      bg-white/70
      dark:bg-zinc-800/60
      backdrop-blur-xl
      px-5
      py-2.5
      shadow-sm
    "
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-2xl font-black tracking-[0.08em] tabular-nums text-zinc-900 dark:text-white">
            {time}
          </span>
        </div>
      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-3">
        {/* Theme */}

        <button
          onClick={() => setDark(!dark)}
          className="
          w-11
          h-11
          rounded-2xl
          bg-gray-100
          dark:bg-zinc-800
          flex
          items-center
          justify-center
          transition
          hover:scale-105
        "
        >
          {dark ? (
            <HiSun className="text-xl text-yellow-400" />
          ) : (
            <HiMoon className="text-xl text-gray-700" />
          )}
        </button>

        {/* Notification */}

        <button
          className="
          relative
          w-11
          h-11
          rounded-2xl
          bg-gray-100
          dark:bg-zinc-800
          flex
          items-center
          justify-center
          transition
          hover:scale-105
        "
        >
          <HiBell className="text-xl dark:text-white" />

          <span
            className="
              absolute
              top-2
              right-2
              w-2
              h-2
              rounded-full
              bg-red-500
            "
          />
        </button>

        {/* User */}

        <div
          className="
          flex
          items-center
          gap-3
          pl-2
        "
        >
          <div
            className="
              w-11
              h-11
              rounded-full
              bg-primary
              text-white
              flex
              items-center
              justify-center
              font-bold
            "
          >
            R
          </div>

          <div className="hidden md:block">
            <h3 className="font-semibold dark:text-white">Rizki</h3>

            <p className="text-sm text-gray-500">Bendahara</p>
          </div>
        </div>
      </div>
    </header>
  );
}
