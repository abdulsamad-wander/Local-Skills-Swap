import { create } from "zustand";

const read = (key, fallback) => {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // storage can be blocked; the theme still applies for this session
  }
};

/** One theme for the whole app. The chat follows it, see .str-chat--app-theme. */
export const useThemeStore = create((set) => ({
  theme: read("SpeakZen-theme", "night"),
  setTheme: (theme) => {
    write("SpeakZen-theme", theme);
    set({ theme });
  },
}));
