import React from 'react'
import { FaSpinner } from "react-icons/fa6";
import { useThemeStore } from '../store/useThemeStore';
const PageLoader = () => {
  const { theme }  = useThemeStore();
  return (
    <div className='min-h-screen flex items-center justify-center' data-theme ={theme}>
      <FaSpinner className='animate-spin text-primary size-12'/>
    </div>
  )
}

export default PageLoader
