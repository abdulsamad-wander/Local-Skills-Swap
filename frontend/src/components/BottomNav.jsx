import { Link, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "../constants/nav";
import { useUnseenCount } from "../hooks/useUnseenCount";

/** Mobile tab bar, hidden on desktop where the sidebar takes over. */
const BottomNav = () => {
  const { pathname } = useLocation();
  const { unseen, markSeen } = useUnseenCount();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-base-200/95 backdrop-blur border-t border-base-300 pb-[env(safe-area-inset-bottom)]">
      <ul className="grid grid-cols-3">
        {NAV_ITEMS.map(({ to, label, Icon, ActiveIcon }) => {
          const active = pathname === to;
          const I = active ? ActiveIcon : Icon;
          return (
            <li key={to}>
              <Link
                to={to}
                onClick={to === "/notifications" ? markSeen : undefined}
                className={`relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold ${
                  active ? "text-primary" : "text-base-content/60"
                }`}
              >
                <I className="size-6" />
                {label}
                {to === "/notifications" && unseen > 0 && (
                  <span className="absolute top-1.5 left-1/2 ml-1 size-2.5 rounded-full bg-secondary" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNav;
