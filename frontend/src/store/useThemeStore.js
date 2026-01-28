import { create } from 'zustand'

export const useThemeStore = create((set) => ({
    theme : localStorage.getItem("SpeakZen-theme") || "coffee",
    setTheme : (theme)=>{
        localStorage.setItem("SpeakZen-theme", theme);
        set({ theme})

    },
}))
