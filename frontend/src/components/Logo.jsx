import { Link } from "react-router-dom";
import { MdLanguage } from "react-icons/md";

const Logo = ({ to = "/", size = "md" }) => {
  const text = size === "lg" ? "text-3xl" : "text-xl";
  const icon = size === "lg" ? "size-9" : "size-7";
  return (
    <Link to={to} className="inline-flex items-center gap-2 font-extrabold tracking-tight">
      <span className="grid place-items-center rounded-xl bg-primary text-primary-content p-1">
        <MdLanguage className={icon} />
      </span>
      <span className={text}>SpeakZen</span>
    </Link>
  );
};

export default Logo;
