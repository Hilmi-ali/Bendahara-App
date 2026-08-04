import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  HiBars3,
  HiHome,
  HiUsers,
  HiBanknotes,
  HiCreditCard,
  HiChartBar,
  HiCog6Tooth,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi2";

const menus = [
  {
    title: "Dashboard",
    icon: HiHome,
    path: "/",
  },
  {
    title: "Data Siswa",
    icon: HiUsers,
    path: "/students",
  },
  {
    title: "Tagihan",
    icon: HiBanknotes,
    path: "/bills",
  },
  {
    title: "Pembayaran",
    icon: HiCreditCard,
    path: "/payments",
  },
  {
    title: "Laporan",
    icon: HiChartBar,
    path: "/reports",
  },
  {
    title: "Pengaturan",
    icon: HiCog6Tooth,
    path: "/settings",
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`
        h-screen
        sticky
        top-0
        transition-all
        duration-300
        border-r
        border-gray-200
        dark:border-zinc-800
        bg-white
        dark:bg-zinc-900
        flex
        flex-col
        ${collapsed ? "w-[90px]" : "w-[280px]"}
      `}
    >
      {/* Logo */}

      <div
        className="
          h-[72px]
          flex
          items-center
          justify-between
          px-5
          border-b
          border-gray-200
          dark:border-zinc-800
        "
      >
        {!collapsed && (
          <div>
            <h2 className="font-bold text-lg dark:text-white">
              <strong>DIPONEGORO</strong>
            </h2>

            <p className="text-xs text-gray-500">School Finance</p>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="
            w-10
            h-10
            rounded-xl
            hover:bg-gray-100
            dark:hover:bg-zinc-800
            flex
            items-center
            justify-center
            transition
          "
        >
          {collapsed ? (
            <HiChevronRight className="text-xl dark:text-white" />
          ) : (
            <HiChevronLeft className="text-xl dark:text-white" />
          )}
        </button>
      </div>

      {/* Menu */}

      <div className="flex-1 py-5 px-3 overflow-y-auto">
        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <NavLink
              key={menu.title}
              to={menu.path}
              end={menu.path === "/"}
              className={({ isActive }) =>
                `
                flex
                items-center
                gap-4
                px-4
                h-12
                rounded-2xl
                mb-2
                transition-all
                duration-200

                ${
                  isActive
                    ? "bg-primary text-white shadow-soft"
                    : "text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-zinc-800"
                }
              `
              }
            >
              <Icon className="text-2xl shrink-0" />

              {!collapsed && <span className="font-medium">{menu.title}</span>}
            </NavLink>
          );
        })}
      </div>

      {/* Footer */}

      <div
        className="
          border-t
          border-gray-200
          dark:border-zinc-800
          p-4
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
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

          {!collapsed && (
            <div>
              <h4 className="font-semibold dark:text-white">Rizki</h4>

              <p className="text-sm text-gray-500">Bendahara</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
