export enum ScreenName {
  SPLASH = 'SPLASH',
  ONBOARDING = 'ONBOARDING',
  AUTH = 'AUTH',
  HOME = 'HOME',
  EXPLORE = 'EXPLORE',
  STUDIO = 'STUDIO',
  CHAT = 'CHAT',
  NOTIFICATIONS = 'NOTIFICATIONS',
  PROFILE = 'PROFILE',
  SETTINGS = 'SETTINGS',
  CHAT_DETAIL = 'CHAT_DETAIL'
}

export type BadgeType = 'verified' | 'pro' | 'tier1' | 'tier2' | 'tier3' | 'new';

export interface User {
  id: string;
  username: string;
  avatar: string;
  badges: BadgeType[];
  bio?: string;
  stats?: {
    followers: string;
    following: string;
    likes: string;
  }
}

export interface Post {
  id: string;
  user: User;
  type: 'image' | 'video' | 'text' | 'micro';
  content: string; // URL or text
  caption: string;
  likes: number;
  comments: number;
  tags: string[];
  timestamp: string;
  isSponsored?: boolean;
  likedByMe?: boolean;
  savedByMe?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  type: 'text' | 'image' | 'voice';
  content: string; // Text or duration for voice
  timestamp: string; // Display time (e.g. 10:30 AM)
  fullTimestamp: number; // Sorting
  isMe: boolean;
  reactions?: string[];
  read?: boolean;
  encrypted?: boolean;
}

export interface ChatSession {
  id: string;
  user: User;
  lastMessage: string;
  unread: number;
  timestamp: string; // Display string
  lastActive: number; // Sorting
  isOnline?: boolean;
  isEncrypted?: boolean;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'system';
  user?: User;
  content: string;
  time: string;
  timestamp: number; // Sorting
  read: boolean;
  group: 'New' | 'Earlier';
}

export interface ThemeContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}
