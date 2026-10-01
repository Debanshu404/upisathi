import React, { useContext } from 'react';
import { Sun, Moon } from 'lucide-react';
import { themeContext } from '../context/ThemeContext';

function ThemeToggle({ className = '', showLabel = false }) {
  const { theme, toggleTheme, isDark } = useContext(themeContext);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center p-2.5 rounded-xl border transition-all duration-200 active:scale-95 cursor-pointer ${
        isDark
          ? 'bg-[#272625] border-white/10 text-amber-300 hover:bg-[#323130] hover:text-amber-200'
          : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50 hover:text-indigo-600'
      } shadow-sm ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Sun size={17} className="stroke-[2.2] animate-in spin-in-90 duration-200" />
        ) : (
          <Moon size={17} className="stroke-[2.2] animate-in spin-in-90 duration-200" />
        )}
      </div>

      {showLabel && (
        <span className="ml-2 text-xs font-bold tracking-tight">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
}

export default ThemeToggle;
