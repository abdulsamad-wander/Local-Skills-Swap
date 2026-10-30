const sizes = {
  sm: "size-9",
  md: "size-12",
  lg: "size-16",
  xl: "size-24",
};

const UserAvatar = ({ src, name = "", size = "md", online = false, unread = 0, className = "" }) => {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");

  return (
    <div className={`relative shrink-0 ${sizes[size]} ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          referrerPolicy="no-referrer"
          className="size-full rounded-full object-cover bg-base-300"
        />
      ) : (
        <div className="size-full rounded-full bg-base-300 text-base-content/80 grid place-items-center font-bold select-none">
          {initials || "?"}
        </div>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 size-3 rounded-full bg-success ring-2 ring-base-200" />
      )}
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1.5 rounded-full bg-secondary text-secondary-content text-[11px] font-bold grid place-items-center ring-2 ring-base-200">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </div>
  );
};

export default UserAvatar;
