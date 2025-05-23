import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="pt-16 md:pt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
