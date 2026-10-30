import { Link, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "../constants/nav";
import { useUnseenCount } from "../hooks/useUnseenCount";
import { useChat } from "../context/ChatContext";

/** Mobile tab bar, hidden on desktop where the sidebar takes over. */
const BottomNav = () => {
  const { pathname } = useLocation();
  const { unseen, markSeen } = useUnseenCount();
  const { totalUnread } = useChat();

  const countFor = (badge) => (badge === "requests" ? unseen : badge === "chat" ? totalUnread : 0);

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-base-200/95 backdrop-blur border-t border-base-300 pb-[env(safe-area-inset-bottom)]">
      <ul className="grid grid-cols-4">
        {NAV_ITEMS.map(({ to, label, Icon, ActiveIcon, badge }) => {
          const active = pathname === to;
          const I = active ? ActiveIcon : Icon;
          const count = countFor(badge);
          return (
            <li key={to}>
              <Link
                to={to}
                onClick={to === "/notifications" ? () => markSeen() : undefined}
                className={`relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold ${
                  active ? "text-primary" : "text-base-content/60"
                }`}
              >
                <span className="relative">
                  <I className="size-6" />
                  {count > 0 && (
                    <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 rounded-full bg-secondary text-secondary-content text-[10px] font-bold grid place-items-center">
                      {count > 9 ? "9+" : count}
                    </span>
                  )}
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNav;
