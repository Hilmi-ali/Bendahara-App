import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/sidebar/Sidebar";
import Header from "../components/layout/header/Header";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-background dark:bg-darkbg">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
