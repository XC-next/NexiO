import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, Image as ImageIcon, Send, Phone, Video, Smile, MoreVertical, Play, CheckCheck, Lock } from 'lucide-react';
import { ChatSession } from '../types';
import { Avatar, SectionHeader, NeoButton } from '../components/UI';
import { useApp } from '../context/AppContext';

export const ChatScreen: React.FC = () => {
  const { chats, messages, sendMessage, markChatRead } = useApp();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    if (activeChat) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeChat]);

  // Mark as read when entering
  useEffect(() => {
      if (activeChat) {
          markChatRead(activeChat);
      }
  }, [activeChat]);

  const handleSend = () => {
      if (!inputText.trim() || !activeChat) return;
      sendMessage(activeChat, inputText);
      setInputText('');
  };

  const handleVoiceSim = () => {
      if (!activeChat) return;
      sendMessage(activeChat, "0:05", "voice");
      setIsRecording(false);
  };

  if (activeChat) {
    // Chat Detail View
    const chat = chats.find(c => c.id === activeChat);
    const chatMessages = messages[activeChat] || [];

    return (
      <div className="h-full flex flex-col bg-nexio-surface">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-white/5 glass backdrop-blur-xl z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveChat(null)} className="text-gray-400 hover:text-white mr-1 transition-colors">←</button>
            <div className="relative">
                <Avatar src={chat?.user.avatar || ''} size="sm" />
                {chat?.isOnline && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black"></div>}
            </div>
            <div>
                <h4 className="font-bold text-sm leading-tight text-nexio-text">{chat?.user.username}</h4>
                <span className="text-[10px] text-nexio-secondary font-medium tracking-wide">ONLINE</span>
            </div>
          </div>
          <div className="flex gap-4 text-gray-300">
            <Phone size={20} className="hover:text-nexio-primary transition-colors cursor-pointer" />
            <Video size={20} className="hover:text-nexio-primary transition-colors cursor-pointer" />
            <MoreVertical size={20} className="cursor-pointer" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar relative">
           {/* E2EE Indicator */}
           {chat?.isEncrypted && (
               <div className="flex justify-center mb-6">
                   <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                       <Lock size={10} className="text-nexio-secondary"/>
                       <span className="text-[10px] text-gray-500">Messages are end-to-end encrypted</span>
                   </div>
               </div>
           )}

           <div className="flex justify-center"><span className="text-[10px] font-bold text-gray-500 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5">Today</span></div>
           
           {chatMessages.map(msg => (
               <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} group`}>
                   {msg.type === 'voice' ? (
                       <div className="flex items-end gap-2">
                           {!msg.isMe && <Avatar src={chat?.user.avatar || ''} size="sm" />}
                           <div className={`glass px-4 py-3 rounded-2xl flex items-center gap-3 w-48 border border-white/10 ${msg.isMe ? 'rounded-tr-none' : 'rounded-tl-none'}`}>
                                <button className="w-8 h-8 rounded-full bg-nexio-text text-nexio-surface flex items-center justify-center hover:bg-nexio-secondary transition-colors">
                                    <Play size={12} fill="currentColor" />
                                </button>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-0.5 h-6">
                                        {[4,8,3,6,9,5,2,7,4,6,3,8,5,2].map((h, i) => (
                                            <div key={i} className="w-1 bg-gray-500 rounded-full" style={{ height: `${h*3}px`, opacity: i < 5 ? 1 : 0.3 }}></div>
                                        ))}
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-mono">{msg.content}</span>
                                </div>
                           </div>
                       </div>
                   ) : (
                       <div className={`${msg.isMe ? 'bg-gradient-to-br from-nexio-primary to-purple-700 text-white rounded-tr-none shadow-[0_4px_15px_rgba(217,70,239,0.3)]' : 'glass-high rounded-tl-none text-nexio-text border border-white/10'} px-5 py-3 rounded-2xl max-w-[75%] relative`}>
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                            <span className="text-[8px] opacity-60 absolute bottom-1 right-2">{msg.timestamp}</span>
                       </div>
                   )}
               </div>
           ))}
           <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 glass-high border-t border-white/10 safe-pb">
           <div className="flex items-center gap-2 bg-white/5 rounded-[1.5rem] px-2 py-2 border border-white/10">
              <button className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"><div className="w-6 h-6 rounded-full bg-nexio-secondary/20 flex items-center justify-center border border-nexio-secondary/50 text-nexio-secondary text-xs font-bold">+</div></button>
              
              {isRecording ? (
                  <div className="flex-1 flex items-center gap-2 px-2 animate-pulse cursor-pointer" onClick={handleVoiceSim}>
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span className="text-sm text-red-400 font-bold">Recording... (Tap to send)</span>
                  </div>
              ) : (
                  <input 
                    type="text" 
                    placeholder="Message..." 
                    className="bg-transparent flex-1 outline-none text-nexio-text placeholder-gray-500 text-sm px-2" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  />
              )}

              {inputText ? (
                  <button onClick={handleSend} className="p-2 rounded-full bg-nexio-secondary text-black hover:scale-105 transition-transform"><Send size={18} /></button>
              ) : (
                  <button 
                    className={`p-2 rounded-full text-white shadow-[0_0_10px_rgba(217,70,239,0.4)] hover:scale-105 transition-transform ${isRecording ? 'bg-red-500 scale-110' : 'bg-nexio-primary'}`}
                    onMouseDown={() => setIsRecording(true)}
                    // On desktop, we click to toggle simulation for simplicity, or hold.
                    // For this demo, clicking toggles recording state to simulated send
                    onClick={() => !isRecording && setIsRecording(true)}
                  >
                    <Mic size={18} />
                  </button>
              )}
           </div>
        </div>
      </div>
    );
  }

  // Chat List View
  return (
    <div className="h-full overflow-y-auto pb-24 px-3 pt-4 no-scrollbar">
      <SectionHeader title="Messages" action={<div className="bg-white/10 p-2.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer"><Search size={18}/></div>} />
      
      {/* Online Now Rail */}
      <div className="flex gap-4 overflow-x-auto mb-6 py-2 no-scrollbar px-1">
        {[1,2,3,4,5].map((u, i) => (
          <div key={i} className="flex flex-col items-center gap-1 cursor-pointer group">
            <div className="relative">
                <Avatar src={`https://picsum.photos/100/100?random=${i}`} size="md" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black shadow-[0_0_5px_#22c55e]"></div>
            </div>
            <span className="text-[10px] text-gray-400 group-hover:text-white transition-colors">User</span>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {chats.map(chat => (
          <div key={chat.id} onClick={() => setActiveChat(chat.id)} className="flex items-center gap-4 p-4 glass rounded-3xl cursor-pointer hover:bg-white/10 transition-all border border-transparent hover:border-white/5">
            <div className="relative">
                <Avatar src={chat.user.avatar} size="lg" />
                {chat.isOnline && <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-[3px] border-black"></div>}
            </div>
            <div className="flex-1 min-w-0">
               <div className="flex justify-between items-center mb-1">
                 <h4 className="font-bold text-base text-nexio-text">{chat.user.username}</h4>
                 <span className={`text-[10px] ${chat.unread > 0 ? 'text-nexio-primary font-bold' : 'text-gray-500'}`}>{chat.timestamp}</span>
               </div>
               <p className={`text-sm truncate ${chat.unread > 0 ? 'text-nexio-text font-medium' : 'text-gray-500'}`}>
                   {chat.lastMessage}
               </p>
            </div>
            {chat.unread > 0 ? (
              <div className="w-5 h-5 bg-nexio-primary rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-[0_0_10px_rgba(217,70,239,0.5)]">
                {chat.unread}
              </div>
            ) : (
                <CheckCheck size={16} className="text-gray-600" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
