import { IoPeople } from "react-icons/io5";

const SIZES = { sm: "size-9", md: "size-12", lg: "size-16", xl: "size-24" };
const ICONS = { sm: "size-5", md: "size-6", lg: "size-8", xl: "size-11" };

/** Group icon: the uploaded picture, or a people glyph when there is none. */
const GroupAvatar = ({ src, name = "Group", size = "md", className = "" }) => (
  <span className={`relative shrink-0 block ${SIZES[size]} ${className}`}>
    {src ? (
      <img
        src={src}
        alt={name}
        referrerPolicy="no-referrer"
        className="size-full rounded-full object-cover bg-base-300"
      />
    ) : (
      <span className="size-full rounded-full bg-primary/15 text-primary grid place-items-center">
        <IoPeople className={ICONS[size]} />
      </span>
    )}
  </span>
);

export default GroupAvatar;
