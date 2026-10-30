import { Link } from "react-router-dom";

const SIZES = {
  md: { img: "h-8", text: "text-xl" },
  lg: { img: "h-11", text: "text-3xl" },
};

const Logo = ({ to = "/", size = "md", showText = true }) => {
  const s = SIZES[size] || SIZES.md;
  return (
    <Link to={to} className="inline-flex items-center gap-2.5 font-extrabold tracking-tight">
      <img src="/logo.svg" alt="SpeakZen" className={`${s.img} w-auto`} />
      {showText && <span className={s.text}>SpeakZen</span>}
    </Link>
  );
};

export default Logo;
