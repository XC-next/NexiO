import React, { useEffect, useState } from 'react';
import { ArrowRight, Mail, Lock, Sparkles, Smartphone, Globe, Layers, Wand2, Loader2 } from 'lucide-react';
import { NeoButton, GlassInput } from '../components/UI';
import { ScreenName } from '../types';
import { useApp } from '../context/AppContext';

interface EntryProps {
  onNavigate: (screen: ScreenName) => void;
}

// --- Splash Screen ---
export const SplashScreen: React.FC<EntryProps> = ({ onNavigate }) => {
  useEffect(() => {
    const timer = setTimeout(() => onNavigate(ScreenName.ONBOARDING), 4000);
    return () => clearTimeout(timer);
  }, [onNavigate]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-black relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-nexio-primary/10 rounded-full blur-[120px] animate-pulse-fast" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] bg-nexio-secondary/10 rounded-full blur-[120px] animate-float" />

      {/* Futuristic Neon Ring Logo */}
      <div className="relative mb-12">
        {/* Outer Ring */}
        <div className="w-40 h-40 rounded-full border-[1px] border-white/10 flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full border-[2px] border-transparent border-t-nexio-primary border-l-nexio-secondary animate-spin-slow blur-[1px]" />
          <div className="absolute inset-0 rounded-full border-[2px] border-transparent border-b-nexio-accent border-r-nexio-primary animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '6s' }} />
          
          {/* Inner Logo */}
          <div className="w-28 h-28 rounded-full bg-black border border-white/10 flex items-center justify-center shadow-[0_0_50px_rgba(217,70,239,0.2)] z-10 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-tr from-nexio-primary/20 via-transparent to-nexio-secondary/20 animate-pulse" />
             <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-nexio-secondary to-nexio-primary italic tracking-tighter">N</span>
          </div>
          
          {/* Orbiting Particles */}
          <div className="absolute w-full h-full animate-spin-slow" style={{ animationDuration: '10s' }}>
             <div className="absolute top-0 left-1/2 w-2 h-2 bg-nexio-secondary rounded-full shadow-[0_0_10px_#22d3ee] blur-[1px]" />
          </div>
        </div>
      </div>

      <div className="text-center z-10 relative">
        <h1 className="text-5xl font-bold tracking-tighter text-white mb-2 neon-text">
          NexiO
        </h1>
        <p className="text-nexio-secondary tracking-[0.3em] text-xs uppercase opacity-80">Create. Connect. Evolve.</p>
      </div>

      {/* Progress Shimmer */}
      <div className="absolute bottom-20 w-64 h-1 bg-gray-900 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-transparent via-nexio-secondary to-transparent w-full animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
      </div>
    </div>
  );
};

// --- Onboarding Screen ---
export const OnboardingScreen: React.FC<EntryProps> = ({ onNavigate }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Discover Smart Feed",
      desc: "AI-curated content tailored to your unique vibe. Swipe into the future.",
      visual: (
        <div className="relative w-48 h-64">
           <div className="absolute top-0 left-4 w-full h-full bg-gray-800 rounded-2xl opacity-40 rotate-6 transform scale-90 border border-white/10"></div>
           <div className="absolute top-2 left-2 w-full h-full bg-gray-800 rounded-2xl opacity-70 rotate-3 transform scale-95 border border-white/10"></div>
           <div className="absolute top-4 left-0 w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/20 p-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center">
              <Sparkles className="w-12 h-12 text-nexio-secondary mb-4 animate-pulse" />
              <div className="w-24 h-2 bg-gray-700 rounded-full mb-2"></div>
              <div className="w-16 h-2 bg-gray-800 rounded-full"></div>
           </div>
        </div>
      ),
      bg: "from-blue-900/30"
    },
    {
      title: "NexiO Studio",
      desc: "Powerful creation tools at your fingertips. Filters, AI effects, and timeline editing.",
      visual: (
        <div className="relative w-64 h-48 bg-black/50 border border-white/20 rounded-2xl p-2 backdrop-blur-md">
           <div className="h-32 bg-gray-800/50 rounded-lg mb-2 flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-nexio-primary/20 to-transparent"></div>
              <Wand2 className="text-white opacity-50" />
           </div>
           <div className="flex gap-2">
             <div className="h-8 w-8 rounded-full bg-nexio-primary/20 border border-nexio-primary/50 flex items-center justify-center"><Sparkles size={12} className="text-nexio-primary"/></div>
             <div className="h-8 flex-1 bg-gray-800/50 rounded-full border border-white/10 relative overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-1/2 bg-nexio-secondary/20"></div>
             </div>
           </div>
        </div>
      ),
      bg: "from-fuchsia-900/30"
    },
    {
      title: "Connect & Explore",
      desc: "Join the wave. Chat with creators and explore trending neon-soaked worlds.",
      visual: (
        <div className="relative w-48 h-48">
           <div className="absolute inset-0 rounded-full border border-white/10 animate-spin-slow">
              <div className="absolute -top-1 left-1/2 w-2 h-2 bg-nexio-accent rounded-full shadow-[0_0_10px_rgba(139,92,246,0.8)]"></div>
           </div>
           <div className="absolute inset-4 rounded-full border border-white/10 animate-spin-slow" style={{ animationDirection: 'reverse' }}>
              <div className="absolute -bottom-1 left-1/2 w-2 h-2 bg-nexio-primary rounded-full shadow-[0_0_10px_rgba(217,70,239,0.8)]"></div>
           </div>
           <div className="absolute inset-0 flex items-center justify-center">
              <Globe className="w-16 h-16 text-white opacity-80" />
           </div>
        </div>
      ),
      bg: "from-violet-900/30"
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else onNavigate(ScreenName.AUTH);
  };

  return (
    <div className="h-full w-full flex flex-col bg-black relative transition-all duration-700">
       {/* Dynamic Background */}
      <div className={`absolute inset-0 bg-gradient-to-b ${steps[step].bg} via-black to-black transition-colors duration-700`} />
      
      <div className="flex-1 flex flex-col items-center justify-center px-8 z-10 text-center pt-10">
        <div className="mb-12 animate-float">
          {steps[step].visual}
        </div>
        <h2 className="text-4xl font-bold mb-4 text-white drop-shadow-lg">{steps[step].title}</h2>
        <p className="text-gray-400 text-lg leading-relaxed max-w-xs">{steps[step].desc}</p>
      </div>

      <div className="p-8 z-10 w-full glass-high rounded-t-[3rem] border-t border-white/10">
        <div className="flex justify-center mb-8 gap-3">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-nexio-secondary shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'w-2 bg-gray-700'}`} />
          ))}
        </div>
        <NeoButton onClick={handleNext} className="w-full text-lg py-4">
          {step === 2 ? 'Get Started' : 'Next'} <ArrowRight className="w-5 h-5" />
        </NeoButton>
      </div>
    </div>
  );
};

// --- Auth Screen ---
export const AuthScreen: React.FC<EntryProps> = ({ onNavigate }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login, isLoading, error } = useApp();

  const handleAuth = async () => {
    const success = await login(email, password, !isLogin);
    if (success) {
       onNavigate(ScreenName.HOME);
    }
  };
  
  // Real check
  useEffect(() => {
      // If we are already logged in (e.g. session persistence), skip
      // logic handled in AppContext init
  }, []);

  const getStrength = (pass: string) => {
    if (!pass) return 0;
    if (pass.length < 4) return 1;
    if (pass.length < 8) return 2;
    return 3;
  };
  const strength = getStrength(password);

  return (
    <div className="h-full w-full flex flex-col justify-center px-6 bg-black relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-nexio-primary/20 via-black to-black opacity-60 pointer-events-none" />
      
      <div className="z-10 w-full max-w-sm mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-2 neon-text italic tracking-tighter">NexiO</h1>
          <p className="text-nexio-secondary uppercase tracking-widest text-xs">Login to the future</p>
        </div>

        <div className="glass p-8 rounded-3xl backdrop-blur-xl space-y-5 shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10">
          {error && (
              <div className="bg-red-500/20 border border-red-500/50 p-2 rounded text-red-200 text-xs text-center">
                  {error}
              </div>
          )}

          <div className="relative group">
            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-nexio-secondary transition-colors" />
            <GlassInput 
                type="email" 
                placeholder="Email" 
                style={{ paddingLeft: '3rem' }} 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-nexio-secondary transition-colors" />
            <GlassInput 
                type="password" 
                placeholder="Password" 
                style={{ paddingLeft: '3rem' }} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          {!isLogin && (
            <div className="space-y-1">
                <div className="flex gap-1 h-1">
                    <div className={`flex-1 rounded-full transition-all duration-300 ${strength >= 1 ? 'bg-red-500 shadow-[0_0_5px_red]' : 'bg-gray-800'}`} />
                    <div className={`flex-1 rounded-full transition-all duration-300 ${strength >= 2 ? 'bg-yellow-500 shadow-[0_0_5px_yellow]' : 'bg-gray-800'}`} />
                    <div className={`flex-1 rounded-full transition-all duration-300 ${strength >= 3 ? 'bg-green-500 shadow-[0_0_5px_green]' : 'bg-gray-800'}`} />
                </div>
                <p className="text-[10px] text-right text-gray-500">{strength === 0 ? '' : strength === 1 ? 'Weak' : strength === 2 ? 'Medium' : 'Strong'}</p>
            </div>
          )}

          <NeoButton className="w-full mt-2" onClick={handleAuth} isLoading={isLoading}>
            {isLogin ? 'Log In' : 'Sign Up'}
          </NeoButton>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-black/50 px-2 text-gray-500">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <button className="flex items-center justify-center py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                 <span className="font-bold text-sm">Google</span>
             </button>
             <button className="flex items-center justify-center py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                 <span className="font-bold text-sm">Apple</span>
             </button>
          </div>
        </div>

        <div className="text-center mt-8">
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-gray-400 text-sm hover:text-white transition-colors"
          >
            {isLogin ? "New to NexiO? " : "Already have an account? "}
            <span className="text-nexio-secondary font-bold hover:underline decoration-nexio-secondary/50">
              {isLogin ? 'Sign Up' : 'Log In'}
            </span>
          </button>
          
          <div className="mt-4">
             <button onClick={() => { setEmail(''); setPassword(''); login(); onNavigate(ScreenName.HOME); }} className="text-xs text-gray-500 hover:text-white">
                 Skip login (Demo Mode)
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};