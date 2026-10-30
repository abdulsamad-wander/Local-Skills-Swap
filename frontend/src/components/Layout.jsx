import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";

const Layout = ({ children, showSidebar = false, title, fullBleed = false }) => {
  return (
    <div className="min-h-screen flex">
      {showSidebar && <Sidebar />}
      <div className="flex-1 min-w-0 flex flex-col">
        <Navbar title={title} />
        <main className={`flex-1 ${fullBleed ? "" : "pb-24 lg:pb-8"}`}>{children}</main>
      </div>
      {showSidebar && <BottomNav />}
    </div>
  );
};

export default Layout;
