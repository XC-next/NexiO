import React, { useState, useMemo } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Search, MoreHorizontal, Zap, Grid, List, Play, Music, Sparkles, UserPlus, Layers, SlidersHorizontal, Mic } from 'lucide-react';
import { Post, Notification } from '../types';
import { Avatar, NeoButton, SectionHeader, BadgeIcon, ToggleSwitch, useTheme } from '../components/UI';
import { useApp } from '../context/AppContext';

// --- Home Feed ---
export const HomeScreen: React.FC = () => {
  const { posts, toggleLike, toggleSave } = useApp();
  const [feedMix, setFeedMix] = useState(50); // 0 = Niche, 100 = Variety
  
  // Filter Logic:
  // < 30: Show only specific tags (simulated by odd ID check for demo)
  // > 70: Show all sorted randomly
  // 50: Standard newest first
  const filteredPosts = useMemo(() => {
    let result = [...posts];
    if (feedMix < 30) {
       // Simulate "Niche" - only show posts with 'AI' or 'Cyberpunk'
       result = result.filter(p => p.tags.some(t => ['AI', 'Cyberpunk', 'Process'].includes(t)));
    } else if (feedMix > 70) {
       // Simulate "Variety" - shuffle
       result = result.sort(() => Math.random() - 0.5);
    }
    return result;
  }, [posts, feedMix]);

  return (
    <div className="h-full overflow-y-auto pb-24 no-scrollbar safe-pt">
      
      {/* Smart Feed Controls */}
      <div className="px-4 py-2 flex items-center gap-4 bg-nexio-surface sticky top-0 z-20 border-b border-white/5 backdrop-blur-md bg-opacity-80">
         <span className="text-[10px] font-bold text-gray-500 uppercase">Niche</span>
         <input 
            type="range" 
            min="0" 
            max="100" 
            value={feedMix} 
            onChange={(e) => setFeedMix(Number(e.target.value))}
            className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-nexio-primary"
         />
         <span className="text-[10px] font-bold text-gray-500 uppercase">Variety</span>
      </div>

      {/* Stories Rail */}
      <div className="flex gap-4 p-4 overflow-x-auto no-scrollbar mb-2">
        <div className="flex flex-col items-center gap-1 min-w-[64px] cursor-pointer group">
           <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center bg-white/5 group-hover:border-nexio-secondary transition-colors">
              <span className="text-2xl font-light text-nexio-secondary">+</span>
           </div>
           <span className="text-xs text-gray-400">My Story</span>
        </div>
        {[1,2,3,4,5].map(i => (
          <div key={i} className="flex flex-col items-center gap-1 min-w-[64px] cursor-pointer">
             <Avatar src={`https://picsum.photos/100/100?random=${i}`} size="lg" hasStory />
             <span className="text-xs text-gray-400">user_{i}</span>
          </div>
        ))}
      </div>

      {/* Feed */}
      <div className="space-y-6 px-3">
        {filteredPosts.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">No posts found for this vibe. Try adjusting the slider.</div>
        ) : filteredPosts.map(post => (
          <div key={post.id} className="glass rounded-[2rem] overflow-hidden mb-6 shadow-lg relative group">
            {/* Header */}
            <div className="p-4 flex justify-between items-center bg-gradient-to-b from-black/40 to-transparent absolute top-0 w-full z-10 pointer-events-none">
              <div className="flex items-center gap-3 pointer-events-auto">
                <Avatar src={post.user.avatar} size="md" />
                <div className="flex flex-col text-shadow-sm">
                    <h3 className="font-bold text-sm flex items-center gap-1 text-white">
                        {post.user.username} 
                        {post.user.badges.map(b => <BadgeIcon key={b} type={b} />)}
                    </h3>
                  <p className="text-[10px] text-gray-300">{post.timestamp}</p>
                </div>
              </div>
              <MoreHorizontal className="text-white w-5 h-5 cursor-pointer pointer-events-auto shadow-sm" />
            </div>

            {/* Content */}
            <div className="relative">
               {post.type === 'text' || post.type === 'micro' ? (
                   <div className="p-8 min-h-[250px] flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
                       <p className="text-xl md:text-2xl font-medium leading-relaxed text-center font-serif italic text-white drop-shadow-md">
                           "{post.content}"
                       </p>
                   </div>
               ) : (
                   <div className="relative aspect-[4/5] bg-gray-900">
                       <img src={post.content} alt="Post" className="w-full h-full object-cover" />
                       {post.type === 'video' && (
                           <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                               <div className="w-16 h-16 rounded-full glass flex items-center justify-center backdrop-blur-sm border border-white/20">
                                   <Play className="fill-white text-white ml-1" size={24} />
                               </div>
                           </div>
                       )}
                       {/* AI Tags Overlay */}
                       <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
                           {post.tags.map(tag => (
                               <div key={tag} className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                   <Sparkles size={10} className="text-nexio-secondary"/>
                                   <span className="text-[10px] font-bold tracking-wide uppercase text-white">{tag}</span>
                               </div>
                           ))}
                       </div>
                   </div>
               )}
            </div>

            {/* Footer / Actions */}
            <div className="p-4 bg-nexio-surface">
              <div className="flex justify-between items-center mb-3">
                  <div className="flex gap-4">
                      <div className="flex flex-col items-center gap-0.5 group/btn cursor-pointer" onClick={() => toggleLike(post.id)}>
                         <Heart className={`w-6 h-6 transition-colors ${post.likedByMe ? 'text-red-500 fill-red-500' : 'text-nexio-text group-hover/btn:text-red-500'}`} />
                         <span className="text-[10px] font-bold text-gray-500">{post.likes}</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5 group/btn cursor-pointer">
                         <MessageCircle className="w-6 h-6 text-nexio-text group-hover/btn:text-nexio-secondary transition-colors" />
                         <span className="text-[10px] font-bold text-gray-500">{post.comments}</span>
                      </div>
                      <Share2 className="w-6 h-6 text-nexio-text cursor-pointer hover:text-nexio-primary transition-colors" />
                  </div>
                  <div onClick={() => toggleSave(post.id)}>
                      <Bookmark className={`w-6 h-6 transition-colors cursor-pointer ${post.savedByMe ? 'text-nexio-accent fill-nexio-accent' : 'text-nexio-text hover:text-nexio-accent'}`} />
                  </div>
              </div>
              {post.caption && (
                  <p className="text-sm text-nexio-text leading-relaxed">
                    <span className="font-bold mr-2">{post.user.username}</span>
                    {post.caption}
                  </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Explore Screen ---
export const ExploreScreen: React.FC = () => {
  const facets = ['For You', 'Trending', 'Sounds', 'Templates', 'Hashtags', 'Events'];
  
  return (
    <div className="h-full overflow-y-auto pb-24 px-3 pt-4 no-scrollbar">
      <div className="relative mb-6">
        <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search creators, tags, sounds..." 
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-nexio-text focus:ring-1 focus:ring-nexio-primary outline-none transition-all focus:bg-white/10"
        />
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
        {facets.map((facet, i) => (
          <button key={facet} className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${i === 0 ? 'bg-nexio-text text-nexio-surface shadow-lg' : 'glass text-gray-400 hover:text-nexio-text hover:bg-white/10'}`}>
            {facet}
          </button>
        ))}
      </div>

      {/* Mosaic Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 auto-rows-[180px]">
        {/* Highlight Item */}
        <div className="row-span-2 relative group rounded-3xl overflow-hidden cursor-pointer">
             <img src="https://picsum.photos/400/600" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-100 flex flex-col justify-end p-4">
                 <span className="text-xs font-bold text-nexio-secondary mb-1">#Trending</span>
                 <p className="font-bold text-lg leading-tight text-white">Neon Dreams Vol. 4</p>
             </div>
        </div>

        {/* Sound Item */}
        <div className="relative group rounded-3xl overflow-hidden cursor-pointer bg-gray-800">
             <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <div className="w-12 h-12 rounded-full bg-nexio-primary/20 flex items-center justify-center text-nexio-primary mb-2">
                    <Music size={24} />
                </div>
                <p className="text-white font-bold text-sm text-center">Cyber Beat 2077</p>
                <span className="text-xs text-gray-400">12.5k uses</span>
             </div>
        </div>

        {/* Template Item */}
        <div className="relative group rounded-3xl overflow-hidden cursor-pointer">
             <img src="https://picsum.photos/401/401" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
             <div className="absolute top-2 left-2 bg-black/60 backdrop-blur px-2 py-1 rounded-lg border border-white/10">
                 <span className="text-[10px] text-white font-bold flex items-center gap-1"><Layers size={10}/> TEMPLATE</span>
             </div>
        </div>

        {/* Wide Banner */}
        <div className="col-span-2 relative group rounded-3xl overflow-hidden cursor-pointer">
             <img src="https://picsum.photos/800/400" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
             <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex items-center p-6">
                 <div>
                    <span className="bg-nexio-accent text-white text-[10px] font-bold px-2 py-1 rounded mb-2 inline-block">LIVE EVENT</span>
                    <h3 className="text-xl font-bold text-white">Digital Fashion Week</h3>
                    <p className="text-xs text-gray-300">Join 34k others</p>
                 </div>
             </div>
        </div>

        {/* Fillers */}
        {[1,2,3,4].map(i => (
             <div key={i} className="relative group rounded-3xl overflow-hidden cursor-pointer">
                <img src={`https://picsum.photos/400/400?random=${i}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
             </div>
        ))}
      </div>
    </div>
  );
};

// --- Notifications Screen ---
export const NotificationsScreen: React.FC = () => {
  const { filterNotifications } = useApp();
  const [filterType, setFilterType] = useState<'All' | 'Mentions' | 'Follows' | 'System'>('All');

  const filtered = filterNotifications(filterType);
  const newNotifs = filtered.filter(n => n.group === 'New');
  const earlierNotifs = filtered.filter(n => n.group === 'Earlier');

  const renderNotifItem = (n: Notification) => (
    <div key={n.id} className={`p-4 flex items-start gap-4 rounded-2xl mb-2 transition-colors ${!n.read ? 'bg-white/5 border border-white/5' : 'hover:bg-white/5'}`}>
        <div className="relative mt-1">
        {n.type === 'system' ? (
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nexio-primary to-nexio-secondary flex items-center justify-center shadow-[0_0_10px_rgba(217,70,239,0.3)]">
                <Zap size={18} className="text-white" />
             </div>
        ) : (
            <Avatar src={n.user?.avatar || ''} size="md" />
        )}
        {/* Type Icon Badge */}
        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-nexio-surface flex items-center justify-center ${
            n.type === 'like' ? 'bg-red-500' : 
            n.type === 'mention' ? 'bg-nexio-secondary' : 
            n.type === 'follow' ? 'bg-nexio-primary' : 'bg-gray-700'
        }`}>
            {n.type === 'like' && <Heart size={10} className="fill-white text-white"/>}
            {n.type === 'mention' && <MessageCircle size={10} className="text-black"/>}
            {n.type === 'follow' && <UserPlus size={10} className="text-white"/>}
        </div>
        </div>
        <div className="flex-1">
        <p className="text-sm leading-snug text-nexio-text">
            {n.user && <span className="font-bold mr-1 hover:text-nexio-secondary cursor-pointer transition-colors">{n.user.username}</span>}
            <span className="opacity-80">{n.content}</span>
        </p>
        <span className="text-xs text-gray-500 font-medium">{n.time} ago</span>
        </div>
        {n.type === 'like' && <div className="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden border border-white/10"><img src="https://picsum.photos/100/100" className="w-full h-full object-cover"/></div>}
        {n.type === 'follow' && <button className="px-3 py-1.5 rounded-full bg-nexio-primary/20 text-nexio-primary text-xs font-bold border border-nexio-primary/50">Follow</button>}
    </div>
  );

  return (
    <div className="h-full overflow-y-auto pb-24 pt-4 px-3 no-scrollbar">
      <SectionHeader title="Activity" />
      <div className="flex gap-1 bg-white/5 p-1 rounded-xl mb-6">
         {['All', 'Mentions', 'Follows', 'System'].map((tab) => (
             <button 
                key={tab} 
                onClick={() => setFilterType(tab as any)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${filterType === tab ? 'bg-gray-700 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
             >
                 {tab}
             </button>
         ))}
      </div>

      <div className="space-y-2">
        {newNotifs.length > 0 && <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">New</h3>}
        {newNotifs.map(renderNotifItem)}
        
        {/* Glow Separator */}
        {(newNotifs.length > 0 && earlierNotifs.length > 0) && (
            <div className="relative py-6 flex items-center justify-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-nexio-primary/50 to-transparent"></div>
                <div className="absolute w-2 h-2 rounded-full bg-nexio-primary shadow-[0_0_10px_#d946ef]"></div>
            </div>
        )}

        {earlierNotifs.length > 0 && <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">Earlier</h3>}
        {earlierNotifs.map(renderNotifItem)}

        {filtered.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm">No notifications.</div>
        )}
      </div>
    </div>
  );
};

// --- Profile Screen ---
export const ProfileScreen: React.FC = () => {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'posts'|'saved'|'templates'>('posts');

  if (!currentUser) return <div className="h-full flex items-center justify-center">Log in required</div>;

  return (
    <div className="h-full overflow-y-auto pb-24 no-scrollbar">
      {/* Cover */}
      <div className="h-56 w-full bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-nexio-primary/40 to-nexio-surface"></div>
        <img src="https://picsum.photos/800/300" className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-nexio-surface to-transparent"></div>
      </div>
      
      {/* Profile Header */}
      <div className="px-4 relative -mt-20 mb-4">
        <div className="flex justify-between items-end mb-4">
          <div className="w-28 h-28 rounded-full p-[3px] bg-gradient-to-tr from-nexio-secondary via-nexio-primary to-nexio-accent shadow-[0_0_30px_rgba(0,0,0,0.5)]">
             <div className="w-full h-full rounded-full border-4 border-nexio-surface overflow-hidden bg-black">
                 <img src={currentUser.avatar} className="w-full h-full object-cover" />
             </div>
          </div>
          <div className="flex gap-2 mb-4">
             <NeoButton variant="secondary" className="!py-2 !px-6 text-sm !rounded-full">Edit Profile</NeoButton>
             <NeoButton variant="glass" className="!p-2.5 !rounded-full"><SlidersHorizontal size={18}/></NeoButton>
          </div>
        </div>
        
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-nexio-text">
            {currentUser.username} 
            {currentUser.badges.map(b => <BadgeIcon key={b} type={b} />)}
          </h1>
          <p className="text-nexio-secondary text-sm font-medium mb-2">@{currentUser.id}</p>
          <p className="text-nexio-text opacity-80 text-sm leading-relaxed max-w-sm">
            {currentUser.bio}
          </p>
          
          <div className="flex gap-6 mt-6 p-4 glass rounded-2xl justify-between">
            <div className="text-center"><span className="font-bold text-lg block text-nexio-text">{currentUser.stats?.followers}</span><span className="text-xs text-gray-500 uppercase tracking-wide">Followers</span></div>
            <div className="w-px bg-white/10"></div>
            <div className="text-center"><span className="font-bold text-lg block text-nexio-text">{currentUser.stats?.following}</span><span className="text-xs text-gray-500 uppercase tracking-wide">Following</span></div>
            <div className="w-px bg-white/10"></div>
            <div className="text-center"><span className="font-bold text-lg block text-nexio-text">{currentUser.stats?.likes}</span><span className="text-xs text-gray-500 uppercase tracking-wide">Likes</span></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-around border-b border-white/10 mb-1 sticky top-0 bg-nexio-surface/90 backdrop-blur z-10">
         {[
             {id: 'posts', icon: Grid, label: 'Posts'},
             {id: 'saved', icon: Bookmark, label: 'Saved'},
             {id: 'templates', icon: Layers, label: 'Templates'}
         ].map(tab => (
             <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-4 flex flex-col items-center gap-1 relative ${activeTab === tab.id ? 'text-nexio-text' : 'text-gray-500'}`}
             >
                 <tab.icon size={20} />
                 <span className="text-[10px] font-medium uppercase tracking-wider">{tab.label}</span>
                 {activeTab === tab.id && (
                     <div className="absolute bottom-0 w-12 h-1 bg-nexio-secondary rounded-t-full shadow-[0_0_10px_#22d3ee]"></div>
                 )}
             </button>
         ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-0.5">
         {/* Functional Switch for Content based on Tab */}
         {activeTab === 'posts' && [1,2,3,4,5,6].map(i => (
           <div key={`p-${i}`} className="aspect-square bg-gray-900 relative group overflow-hidden cursor-pointer">
             <img src={`https://picsum.photos/300/300?random=${i+10}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
           </div>
         ))}
         
         {activeTab === 'saved' && [1,2,3].map(i => (
           <div key={`s-${i}`} className="aspect-square bg-gray-900 relative group overflow-hidden cursor-pointer border border-nexio-accent/30">
             <div className="absolute top-2 right-2 bg-black/60 p-1 rounded-full"><Bookmark size={12} className="text-nexio-accent fill-nexio-accent"/></div>
             <img src={`https://picsum.photos/300/300?random=${i+50}`} className="w-full h-full object-cover grayscale opacity-80" />
           </div>
         ))}

         {activeTab === 'templates' && [1,2].map(i => (
           <div key={`t-${i}`} className="aspect-square bg-gray-800 relative group flex items-center justify-center border border-white/10">
               <Layers className="text-gray-600 mb-2"/>
               <span className="absolute bottom-2 text-[8px] uppercase font-bold text-gray-400">Template {i}</span>
           </div>
         ))}
      </div>
    </div>
  );
};

// --- Settings Screen ---
export const SettingsScreen: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useApp();

  return (
    <div className="h-full overflow-y-auto pb-24 p-4 pt-4">
      <SectionHeader title="Settings" />
      
      <div className="space-y-6">
        {/* Appearance */}
        <div>
           <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 ml-2">Preferences</h3>
           <div className="glass rounded-2xl overflow-hidden">
                <div className="p-4 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-4">
                       <span className="font-medium text-sm text-nexio-text">Dark Mode</span>
                    </div>
                    <ToggleSwitch checked={theme === 'dark'} onChange={toggleTheme} />
                </div>
                <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <span className="font-medium text-sm text-nexio-text">Voice Commands</span>
                    </div>
                    <ToggleSwitch checked={true} onChange={() => {}} />
                </div>
           </div>
        </div>

        {/* Account */}
        <div>
           <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 ml-2">Account</h3>
           <div className="glass rounded-2xl overflow-hidden">
               <div className="p-4 flex items-center justify-between border-b border-white/5 cursor-pointer hover:bg-white/5">
                    <div className="flex items-center gap-4">
                        <span className="font-medium text-sm text-nexio-text">NexiO Pro</span>
                    </div>
                    <BadgeIcon type="pro" />
               </div>
               <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5">
                    <div className="flex items-center gap-4">
                        <span className="font-medium text-sm text-nexio-text">Privacy & Security</span>
                    </div>
                    <span className="text-gray-500">›</span>
               </div>
           </div>
        </div>

        <div onClick={logout} className="glass rounded-2xl p-4 mt-8 flex items-center justify-center text-red-500 font-bold cursor-pointer hover:bg-red-500/10 transition-colors">
            Log Out
        </div>
      </div>
    </div>
  );
};
