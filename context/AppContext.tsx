import React, { createContext, useContext, useState, useEffect } from 'react';
import { Post, User, ChatSession, Message, Notification } from '../types';
import { supabase } from '../lib/supabaseClient';

// --- Fallback Mock Data ---
// Used if Supabase tables don't exist yet or connection fails
const MOCK_USER: User = {
  id: 'me',
  username: 'zayn_creates',
  avatar: 'https://picsum.photos/200/200',
  badges: ['verified', 'pro'],
  bio: 'Digital Artist 🎨 | Future Gazing 🔮',
  stats: { followers: '12.5k', following: '482', likes: '1.2m' }
};

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    user: { id: 'u1', username: 'kaira_26', avatar: 'https://picsum.photos/100/100', badges: ['verified'] },
    type: 'image',
    content: 'https://picsum.photos/600/800',
    caption: 'Cyberpunk nights in Tokyo 🌃 #future #neon',
    likes: 1240,
    comments: 45,
    tags: ['Cyberpunk', 'Travel'],
    timestamp: '2h ago',
    likedByMe: false,
    savedByMe: true,
  },
  {
    id: '2',
    user: { id: 'u2', username: 'd_art', avatar: 'https://picsum.photos/101/101', badges: ['tier1'] },
    type: 'video',
    content: 'https://picsum.photos/600/601',
    caption: 'NexiO Studio speedart process. 🎨',
    likes: 856,
    comments: 22,
    tags: ['AI Art', 'Studio', 'Process'],
    timestamp: '4h ago',
    likedByMe: true,
    savedByMe: false,
  }
];

// --- Context ---

interface AppContextType {
  currentUser: User | null;
  posts: Post[];
  chats: ChatSession[];
  notifications: Notification[];
  messages: Record<string, Message[]>;
  isLoading: boolean;
  error: string | null;
  
  login: (email?: string, password?: string, isSignUp?: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  
  addPost: (postData: Partial<Post>) => Promise<void>;
  toggleLike: (postId: string) => void;
  toggleSave: (postId: string) => void;
  
  sendMessage: (chatId: string, content: string, type?: 'text' | 'voice' | 'image') => void;
  markChatRead: (chatId: string) => void;
  
  filterNotifications: (type: 'All' | 'Mentions' | 'Follows' | 'System') => Notification[];
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMock, setUsingMock] = useState(false);

  // --- Initialization ---
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      
      // 1. Check Auth Session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
      
      // 2. Fetch Data
      await fetchPosts();

      setIsLoading(false);
    };

    init();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (data) {
        setCurrentUser(data as User);
      } else if (error) {
        // Fallback if profile doesn't exist but auth exists
        console.warn("Profile fetch error, using dummy", error);
        if (userId) {
             setCurrentUser({ ...MOCK_USER, id: userId });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPosts = async () => {
    try {
      // Try to fetch from Supabase
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          user:profiles(*)
        `)
        .order('created_at', { ascending: false });

      if (error || !data) {
        throw error || new Error("No data");
      }

      // If table is empty, we might want to show mock data for demo purposes, 
      // but let's respect the empty state if it's a real connection.
      // Only use mock if there's an actual error (e.g. table missing).
      
      const mappedPosts: Post[] = data.map((p: any) => ({
        id: p.id,
        user: p.user || MOCK_USER, // Fallback if join fails
        type: p.type || 'image',
        content: p.content,
        caption: p.caption,
        likes: p.likes || 0,
        comments: p.comments || 0,
        tags: p.tags || [],
        timestamp: new Date(p.created_at).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' }),
        likedByMe: false, // In a real app with 'likes' table, we would check this
        savedByMe: false
      }));

      setPosts(mappedPosts);
      setUsingMock(false);
    } catch (e) {
      console.log("Using Mock Data due to Supabase fetch error or empty table:", e);
      setPosts(MOCK_POSTS);
      setUsingMock(true);
      if (!currentUser) setNotifications([]); // Clear notifs if offline
    }
  };

  // --- Auth Actions ---

  const login = async (email?: string, password?: string, isSignUp?: boolean): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!email || !password) {
        // Demo login fallback
        setCurrentUser(MOCK_USER);
        if (usingMock) setPosts(MOCK_POSTS);
        setIsLoading(false);
        return true;
      }

      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user) {
          // Create Profile
          const username = email.split('@')[0];
          await supabase.from('profiles').insert({
            id: data.user.id,
            username: username,
            avatar: `https://ui-avatars.com/api/?name=${username}&background=d946ef&color=fff`,
            badges: ['new']
          });
          await fetchUserProfile(data.user.id);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) {
           await fetchUserProfile(data.user.id);
        }
      }
      
      await fetchPosts();
      return true;

    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setPosts(usingMock ? MOCK_POSTS : []); // Keep generic posts
  };

  // --- Data Actions ---

  const addPost = async (postData: Partial<Post>) => {
    // Optimistic Update
    const tempId = Math.random().toString(36).substring(7);
    const newPost: Post = {
      id: tempId,
      user: currentUser || MOCK_USER,
      type: postData.type || 'image',
      content: postData.content || '',
      caption: postData.caption || '',
      likes: 0,
      comments: 0,
      tags: postData.tags || [],
      timestamp: 'Just now',
      likedByMe: false,
      savedByMe: false,
    };
    
    setPosts([newPost, ...posts]);

    if (!usingMock && currentUser) {
      try {
        await supabase.from('posts').insert({
          user_id: currentUser.id,
          type: newPost.type,
          content: newPost.content,
          caption: newPost.caption,
          tags: newPost.tags,
          likes: 0,
          comments: 0
        });
        // Reload to get real ID
        fetchPosts();
      } catch (e) {
        console.error("Failed to sync post to DB", e);
      }
    }
  };

  const toggleLike = async (postId: string) => {
    let newLikes = 0;
    
    setPosts(posts.map(p => {
      if (p.id === postId) {
        const isLiked = !p.likedByMe;
        newLikes = isLiked ? p.likes + 1 : Math.max(0, p.likes - 1);
        return {
          ...p,
          likes: newLikes,
          likedByMe: isLiked
        };
      }
      return p;
    }));

    if (!usingMock && currentUser) {
        try {
            await supabase.from('posts').update({ likes: newLikes }).eq('id', postId);
        } catch (e) {
            console.error("Failed to update likes", e);
        }
    }
  };

  const toggleSave = (postId: string) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return { ...p, savedByMe: !p.savedByMe };
      }
      return p;
    }));
  };

  const sendMessage = (chatId: string, content: string, type: 'text' | 'voice' | 'image' = 'text') => {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: 'me',
      type,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fullTimestamp: Date.now(),
      isMe: true,
      read: true
    };

    setMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMessage]
    }));

    setChats(prev => prev.map(c => {
      if (c.id === chatId) {
        return {
          ...c,
          lastMessage: type === 'voice' ? 'Sent a voice note' : type === 'image' ? 'Sent an image' : content,
          timestamp: 'Just now',
          lastActive: Date.now()
        };
      }
      return c;
    }).sort((a, b) => b.lastActive - a.lastActive));
    
    // TODO: Insert into 'messages' table
  };

  const markChatRead = (chatId: string) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, unread: 0 } : c));
  };

  const filterNotifications = (type: 'All' | 'Mentions' | 'Follows' | 'System') => {
    if (type === 'All') return notifications;
    if (type === 'Mentions') return notifications.filter(n => n.type === 'mention' || n.type === 'comment' || n.type === 'like');
    if (type === 'Follows') return notifications.filter(n => n.type === 'follow');
    if (type === 'System') return notifications.filter(n => n.type === 'system');
    return notifications;
  };

  return (
    <AppContext.Provider value={{
      currentUser, posts, chats, messages, notifications, isLoading, error,
      login, logout, addPost, toggleLike, toggleSave,
      sendMessage, markChatRead, filterNotifications
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};