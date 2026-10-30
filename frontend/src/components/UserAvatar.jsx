const sizes = {
  sm: "size-9",
  md: "size-12",
  lg: "size-16",
  xl: "size-24",
};

const UserAvatar = ({ src, name = "", size = "md", online = false, className = "" }) => {
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
        <div className="size-full rounded-full bg-primary/15 text-primary grid place-items-center font-bold">
          {initials || "?"}
        </div>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 size-3 rounded-full bg-success ring-2 ring-base-200" />
      )}
    </div>
  );
};

export default UserAvatar;
