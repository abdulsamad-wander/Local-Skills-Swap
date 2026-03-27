import useAuthUser from "../hooks/useAuthUser";
import ThemeSelector from "./ThemeSelector";
import { CiLogout } from "react-icons/ci";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full">

          {/* LEFT SIDE LOGO (CHAT PAGE ONLY) */}
        

          {/* RIGHT SIDE NAVBAR ITEMS */}
          <div className="flex items-center gap-2 ml-auto">

            {/* THEME SELECTOR */}
            <ThemeSelector />

            {/* USER AVATAR */}
            {authUser && (
              <div className="avatar">
                <div className="w-8 rounded-full">
                  <img
                    src={authUser?.profilePic || ""}
                    alt="User Avatar"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            )}

            {/* LOGOUT BUTTON */}
            {authUser && (
              <button
                onClick={logoutMutation}
                className="btn btn-ghost btn-circle"
                title="Logout"
              >
                <CiLogout className="h-6 w-6 text-base-content opacity-70" />
              </button>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;