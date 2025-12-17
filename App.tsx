import React, { useState, useEffect } from 'react';
import { Home, Compass, PlusSquare, MessageSquare, User as UserIcon, Mic, Zap } from 'lucide-react';
import { ScreenName } from './types';
import { SplashScreen, OnboardingScreen, AuthScreen } from './screens/EntryScreens';
import { HomeScreen, ExploreScreen, NotificationsScreen, ProfileScreen, SettingsScreen } from './screens/MainScreens';
import { StudioScreen } from './screens/StudioScreen';
import { ChatScreen } from './screens/ChatScreen';
import { ThemeProvider } from './components/UI';
import { AppProvider, useApp } from './context/AppContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
};

const AppContent: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>(ScreenName.SPLASH);
  const [activeTab, setActiveTab] = useState<ScreenName>(ScreenName.HOME);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("Listening...");

  const navigate = (screen: ScreenName) => {
    setCurrentScreen(screen);
  };

  const toggleVoice = () => {
      setIsVoiceActive(!isVoiceActive);
      setVoiceTranscript("Listening...");
  };

  // Simulate Voice Command Logic
  useEffect(() => {
      let timer: ReturnType<typeof setTimeout>;
      if (isVoiceActive) {
          timer = setTimeout(() => {
              const commands = ["Open Explore", "Go Home", "Show Profile", "Open Chat"];
              const randomCmd = commands[Math.floor(Math.random() * commands.length)];
              setVoiceTranscript(randomCmd);
              
              // Execute Command
              setTimeout(() => {
                  if (randomCmd === "Open Explore") setActiveTab(ScreenName.EXPLORE);
                  if (randomCmd === "Go Home") setActiveTab(ScreenName.HOME);
                  if (randomCmd === "Show Profile") setActiveTab(ScreenName.PROFILE);
                  if (randomCmd === "Open Chat") setActiveTab(ScreenName.CHAT);
                  setIsVoiceActive(false);
              }, 1000);
          }, 2000);
      }
      return () => clearTimeout(timer);
  }, [isVoiceActive]);

  const renderScreen = () => {
    switch (currentScreen) {
      case ScreenName.SPLASH:
        return <SplashScreen onNavigate={navigate} />;
      case ScreenName.ONBOARDING:
        return <OnboardingScreen onNavigate={navigate} />;
      case ScreenName.AUTH:
        return <AuthScreen onNavigate={navigate} />;
      case ScreenName.HOME:
      case ScreenName.STUDIO:
        if (currentScreen === ScreenName.STUDIO) return <StudioScreen onClose={() => setCurrentScreen(ScreenName.HOME)} />;
        return <MainLayout activeTab={activeTab} setActiveTab={setActiveTab} toggleVoice={toggleVoice} />;
      default:
        return <MainLayout activeTab={activeTab} setActiveTab={setActiveTab} toggleVoice={toggleVoice} />;
    }
  };

  return (
    <div className="w-full h-[100dvh] bg-nexio-surface text-nexio-text font-sans overflow-hidden max-w-md mx-auto relative shadow-2xl border-x border-white/5">
      {renderScreen()}
      
      {/* Voice Command Overlay */}
      {isVoiceActive && (
          <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-lg flex flex-col items-center justify-center cursor-pointer" onClick={() => setIsVoiceActive(false)}>
              <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-nexio-primary/20 animate-ping absolute inset-0"></div>
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-nexio-primary to-nexio-secondary flex items-center justify-center shadow-[0_0_50px_rgba(217,70,239,0.5)]">
                      <Mic size={48} className="text-white"/>
                  </div>
              </div>
              <h2 className="text-2xl font-bold mt-8 text-white neon-text">{voiceTranscript}</h2>
              <p className="text-gray-400 mt-2 text-sm">Tap anywhere to cancel</p>
          </div>
      )}
    </div>
  );
};

// Sub-component for the main authenticated shell
interface MainLayoutProps {
  activeTab: ScreenName;
  setActiveTab: (tab: ScreenName) => void;
  toggleVoice: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ activeTab, setActiveTab, toggleVoice }) => {
  const [showCreate, setShowCreate] = useState(false);
  const { notifications } = useApp();

  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  if (showCreate) {
    return <StudioScreen onClose={() => setShowCreate(false)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case ScreenName.HOME: return <HomeScreen />;
      case ScreenName.EXPLORE: return <ExploreScreen />;
      case ScreenName.CHAT: return <ChatScreen />;
      case ScreenName.PROFILE: return <ProfileScreen />;
      case ScreenName.NOTIFICATIONS: return <NotificationsScreen />;
      case ScreenName.SETTINGS: return <SettingsScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* Header (Dynamic based on tab) */}
      <div className="h-16 px-4 flex items-center justify-between glass backdrop-blur-md z-20 transition-all">
        <h1 className="text-xl font-bold tracking-tight neon-text">
            {activeTab === ScreenName.HOME ? 'NexiO' : 
             activeTab === ScreenName.EXPLORE ? 'Explore' :
             activeTab === ScreenName.CHAT ? 'Chat' :
             activeTab === ScreenName.PROFILE ? 'Profile' : 'App'}
        </h1>
        <div className="flex gap-4 items-center">
             <button onClick={toggleVoice} className="bg-white/10 p-2 rounded-full hover:bg-white/20 active:scale-95 transition-all">
                <Mic size={18} className="text-nexio-primary"/>
             </button>
             {activeTab === ScreenName.PROFILE && (
                 <button onClick={() => setActiveTab(ScreenName.SETTINGS)}><UserIcon size={20}/></button>
             )}
             {activeTab === ScreenName.HOME && (
                 <button onClick={() => setActiveTab(ScreenName.NOTIFICATIONS)} className="relative">
                     {unreadCount > 0 && <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-black z-10"></div>}
                     <div className="bg-white/5 p-2 rounded-full"><Zap size={18} /></div>
                 </button>
             )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative z-10">
        {renderContent()}
      </div>

      {/* Bottom Nav */}
      <div className="h-20 glass-high absolute bottom-0 w-full flex justify-around items-center px-2 pb-2 z-30 rounded-t-3xl border-t border-white/10 safe-pb">
        <NavButton active={activeTab === ScreenName.HOME} onClick={() => setActiveTab(ScreenName.HOME)} icon={<Home size={24} />} />
        <NavButton active={activeTab === ScreenName.EXPLORE} onClick={() => setActiveTab(ScreenName.EXPLORE)} icon={<Compass size={24} />} />
        
        {/* Create Button (Floats) */}
        <div className="relative -top-6">
           <button 
             onClick={() => setShowCreate(true)}
             className="w-16 h-16 rounded-full bg-gradient-to-tr from-nexio-primary to-nexio-secondary shadow-[0_0_20px_rgba(217,70,239,0.5)] flex items-center justify-center text-black transition-transform active:scale-95"
           >
             <PlusSquare size={28} />
           </button>
        </div>

        <NavButton active={activeTab === ScreenName.CHAT} onClick={() => setActiveTab(ScreenName.CHAT)} icon={<MessageSquare size={24} />} />
        <NavButton active={activeTab === ScreenName.PROFILE} onClick={() => setActiveTab(ScreenName.PROFILE)} icon={<UserIcon size={24} />} />
      </div>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode }> = ({ active, onClick, icon }) => (
  <button 
    onClick={onClick} 
    className={`p-3 rounded-xl transition-all ${active ? 'text-nexio-secondary bg-white/5' : 'text-gray-500 hover:text-nexio-text'}`}
  >
    {icon}
  </button>
);

export default App;