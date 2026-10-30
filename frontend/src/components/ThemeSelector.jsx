import { IoColorPaletteOutline } from "react-icons/io5";
import { useThemeStore } from "../store/useThemeStore";
import { THEMES } from "../constants";

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();
  return (
    <div className="dropdown dropdown-end">
      <button tabIndex={0} className="btn btn-ghost btn-circle" title="Theme" aria-label="Change theme">
        <IoColorPaletteOutline className="size-6" />
      </button>
      <div
        tabIndex={0}
        className="dropdown-content mt-2 p-2 shadow-xl bg-base-200 rounded-2xl w-60 max-h-80 overflow-y-auto"
      >
        <p className="px-3 pt-1 pb-2 text-xs font-bold text-base-content/60">Theme</p>
        <div className="space-y-0.5">
          {THEMES.map((t) => (
            <button
              key={t.name}
              onClick={() => setTheme(t.name)}
              className={`w-full px-3 py-2 rounded-xl flex items-center gap-3 text-sm font-semibold ${
                theme === t.name ? "bg-primary text-primary-content" : "hover:bg-base-300/60"
              }`}
            >
              <span>{t.label}</span>
              <span className="ml-auto flex gap-1">
                {t.colors.map((c, i) => (
                  <span key={i} className="size-2.5 rounded-full" style={{ backgroundColor: c }} />
                ))}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
