import React, { createContext, useContext, useEffect, useState } from 'react';
import { Loader2, Check, Star, Shield, Zap } from 'lucide-react';
import { ThemeContextType, BadgeType } from '../types';

// --- Theme Context ---
const ThemeContext = createContext<ThemeContextType>({ theme: 'dark', toggleTheme: () => {} });

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

// --- UI Components ---

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass' | 'ghost';
  isLoading?: boolean;
}

export const NeoButton: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', className = '', isLoading, ...props 
}) => {
  const baseStyle = "relative overflow-hidden rounded-2xl px-6 py-3 font-semibold transition-all active:scale-95 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-nexio-primary to-nexio-accent text-white shadow-[0_0_20px_rgba(217,70,239,0.4)] hover:shadow-[0_0_30px_rgba(217,70,239,0.6)]",
    secondary: "bg-nexio-secondary text-black shadow-[0_0_15px_rgba(34,211,238,0.4)]",
    glass: "glass text-nexio-text hover:bg-white/10",
    ghost: "text-gray-400 hover:text-nexio-text"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props} disabled={isLoading || props.disabled}>
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

export const GlassInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input 
    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-nexio-text placeholder-gray-500 focus:outline-none focus:border-nexio-primary/50 focus:ring-1 focus:ring-nexio-primary/50 transition-all"
    {...props}
  />
);

export const SectionHeader: React.FC<{ title: string; action?: React.ReactNode }> = ({ title, action }) => (
  <div className="flex justify-between items-center mb-4 px-1">
    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-nexio-text to-gray-400">
      {title}
    </h2>
    {action}
  </div>
);

export const Avatar: React.FC<{ src: string; size?: 'sm' | 'md' | 'lg' | 'xl'; hasStory?: boolean }> = ({ 
  src, size = 'md', hasStory 
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`relative ${sizes[size]} rounded-full p-[2px] ${hasStory ? 'bg-gradient-to-tr from-nexio-secondary via-nexio-primary to-nexio-accent' : 'bg-transparent'}`}>
      <img src={src} alt="avatar" className="w-full h-full rounded-full object-cover border-2 border-nexio-surface" />
    </div>
  );
};

export const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
  <div 
    onClick={onChange}
    className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${checked ? 'bg-nexio-primary shadow-[0_0_10px_rgba(217,70,239,0.4)]' : 'bg-gray-700'}`}
  >
    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
  </div>
);

export const BadgeIcon: React.FC<{ type: BadgeType }> = ({ type }) => {
  switch (type) {
    case 'verified':
      return <div className="text-nexio-secondary"><Check size={12} strokeWidth={4} className="bg-nexio-secondary text-black rounded-full p-[1px]" /></div>;
    case 'pro':
      return <div className="bg-nexio-primary/20 text-nexio-primary text-[9px] px-1.5 py-0.5 rounded-full border border-nexio-primary/30 font-bold">PRO</div>;
    case 'tier1':
      return <div className="text-amber-400"><Star size={12} fill="currentColor" /></div>;
    case 'new':
      return <div className="bg-green-500/20 text-green-500 text-[8px] px-1.5 py-0.5 rounded-full border border-green-500/30 font-bold uppercase">NEW</div>;
    default:
      return null;
  }
};