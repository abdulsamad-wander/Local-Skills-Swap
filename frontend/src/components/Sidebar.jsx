import { Link, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { NAV_ITEMS } from "../constants/nav";
import { useUnseenCount } from "../hooks/useUnseenCount";
import Logo from "./Logo";
import UserAvatar from "./UserAvatar";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const { pathname } = useLocation();
  const { unseen, markSeen } = useUnseenCount();

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col h-screen sticky top-0 bg-base-200 px-4 py-5">
      <div className="px-2 mb-8">
        <Logo />
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, Icon, ActiveIcon }) => {
          const active = pathname === to;
          const I = active ? ActiveIcon : Icon;
          return (
            <Link
              key={to}
              to={to}
              onClick={to === "/notifications" ? markSeen : undefined}
              className={`nav-pill ${active ? "is-active" : ""}`}
            >
              <I className="size-5" />
              <span>{label}</span>
              {to === "/notifications" && unseen > 0 && (
                <span className="ml-auto badge badge-secondary badge-sm font-bold">
                  {unseen > 9 ? "9+" : unseen}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {authUser && (
        <div className="mt-auto flex items-center gap-3 rounded-2xl bg-base-100 p-3">
          <UserAvatar src={authUser.profilePic} name={authUser.fullName} size="sm" online />
          <div className="min-w-0">
            <p className="font-bold text-sm truncate">{authUser.fullName}</p>
            <p className="text-xs text-base-content/60 truncate">{authUser.location || "Online"}</p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
