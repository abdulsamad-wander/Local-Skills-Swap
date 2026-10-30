import { IoLogOutOutline } from "react-icons/io5";
import useAuthUser from "../hooks/useAuthUser";
import useLogout from "../hooks/useLogout";
import ThemeSelector from "./ThemeSelector";
import Logo from "./Logo";
import UserAvatar from "./UserAvatar";

const Navbar = ({ title }) => {
  const { authUser } = useAuthUser();
  const { logoutMutation, isPending } = useLogout();

  return (
    <header className="sticky top-0 z-30 h-16 bg-base-100/90 backdrop-blur border-b border-base-200">
      <div className="h-full px-4 sm:px-6 flex items-center gap-3">
        <div className="lg:hidden">
          <Logo />
        </div>
        {title && <h1 className="hidden lg:block text-lg font-extrabold tracking-tight">{title}</h1>}

        <div className="ml-auto flex items-center gap-1">
          <ThemeSelector />
          {authUser && (
            <>
              <button
                onClick={() => logoutMutation()}
                disabled={isPending}
                className="btn btn-ghost btn-circle"
                title="Log out"
                aria-label="Log out"
              >
                <IoLogOutOutline className="size-6" />
              </button>
              <UserAvatar src={authUser.profilePic} name={authUser.fullName} size="sm" className="ml-1" />
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
