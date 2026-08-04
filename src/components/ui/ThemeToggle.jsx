import { useState } from "react";

import { HiChevronDown } from "react-icons/hi2";

import { useTheme } from "../../contexts/ThemeContext";

const themes = ["ocean", "emerald", "indigo", "slate", "teal"];

export default function ThemeToggle() {
  const {
    dark,

    setDark,

    accent,

    setAccent,
  } = useTheme();

  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl px-4 h-11 bg-gray-100 dark:bg-zinc-800"
      >
        {dark ? "🌙" : "☀"}

        <HiChevronDown />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border dark:border-zinc-700 overflow-hidden">
          <button
            onClick={() => setDark(false)}
            className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            ☀ Light
          </button>

          <button
            onClick={() => setDark(true)}
            className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            🌙 Dark
          </button>

          <hr />

          {themes.map((theme) => (
            <button
              key={theme}
              onClick={() => {
                setAccent(theme);

                setOpen(false);
              }}
              className={`

w-full

px-4

py-3

text-left

capitalize

hover:bg-gray-100

dark:hover:bg-zinc-800

${accent === theme ? "font-bold" : ""}

`}
            >
              {theme}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
