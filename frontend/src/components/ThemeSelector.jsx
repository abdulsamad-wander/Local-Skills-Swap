import React from 'react'
import { useThemeStore } from '../store/useThemeStore';
import { FaPalette } from "react-icons/fa6";
import { THEMES } from '../constants';

const ThemeSelector = () => {
    const { theme, setTheme } = useThemeStore();
  return (
    <div className='dropdown dropdown-end'>
      {/* DropDown Trigger */}
      <button tabIndex={0} className='btn btn-ghost btn-circle'>
        <FaPalette className='size-4'/>
      </button>
      <div tabIndex={0} className='dropdown-content mt-2 p-1 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl w-56 border border-base-content/10 max-h-80 overflow-y-auto'>
         <div className='space-y-1'>
            {THEMES.map((themeOptions)=>(
                <button key={themeOptions.name}
                className={`w-full px-3 py-3 rounded-xl flex items-center gap-3 transition-colors ${theme === themeOptions.name ? "bg-primary/10 text-primary" : "hover:bg-base-content/5"}`}
                onClick={()=> setTheme(themeOptions.name)}
                >
                    <FaPalette className='size-3'/>
                    <span className='text-sm font-medium'>
                        {themeOptions.label}
                    </span>
                    <div className='ml-auto flex gap-1'>
                        {themeOptions.colors.map((color, i)=>(
                            <span
                            key={i}
                            className='size-1 rounded-full' style={{backgroundColor : color}}
                            >

                            </span>
                        ))}
                    </div>
                </button>
            ))}
         </div>
      </div>
    </div>
  )
}

export default ThemeSelector
