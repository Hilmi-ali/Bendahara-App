import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Light / Dark
  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");

  // Accent Theme
  const [accent, setAccent] = useState(
    localStorage.getItem("accent") || "ocean",
  );

  // ============================
  // Light / Dark
  // ============================

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  // ============================
  // Accent Theme
  // ============================

  useEffect(() => {
    document.body.classList.remove(
      "theme-ocean",
      "theme-emerald",
      "theme-indigo",
      "theme-slate",
      "theme-teal",
    );

    document.body.classList.add(`theme-${accent}`);

    localStorage.setItem("accent", accent);
  }, [accent]);

  return (
    <ThemeContext.Provider
      value={{
        dark,
        setDark,

        accent,
        setAccent,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
