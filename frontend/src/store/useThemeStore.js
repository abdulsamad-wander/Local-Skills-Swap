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

export const useThemeStore = create((set) => ({
  theme: read("SpeakZen-theme", "night"),
  setTheme: (theme) => {
    write("SpeakZen-theme", theme);
    set({ theme });
  },
  // "match" follows the app theme; "light" and "dark" force Stream's own skin
  chatTheme: read("SpeakZen-chat-theme-v2", "match"),
  setChatTheme: (chatTheme) => {
    write("SpeakZen-chat-theme-v2", chatTheme);
    set({ chatTheme });
  },
}));
