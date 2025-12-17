import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Wand2, X, Check, Image as ImageIcon, Sliders, Layers, Music, Scissors, Settings as SettingsIcon, Video, Type, Sparkles, Smile, Share, UploadCloud } from 'lucide-react';
import { NeoButton, ToggleSwitch } from '../components/UI';
import { generateCreativeCaption } from '../services/geminiService';
import { useApp } from '../context/AppContext';

type StudioMode = 'video' | 'photo' | 'micro';
type StudioStep = 'capture' | 'edit' | 'upload';

export const StudioScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addPost } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState<StudioStep>('capture');
  const [mode, setMode] = useState<StudioMode>('video');
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [filter, setFilter] = useState(0);
  const [cameraError, setCameraError] = useState(false);
  
  const [aiCaptionEnabled, setAiCaptionEnabled] = useState(false);
  const [smartTags, setSmartTags] = useState<string[]>([]);

  const filters = [
    'none',
    'sepia(50%) hue-rotate(180deg) saturate(200%)', // Cyber
    'grayscale(100%) contrast(120%)', // Noir
    'saturate(300%) contrast(110%)', // Vivid
    'hue-rotate(90deg) brightness(110%)', // Alien
    'contrast(150%) saturate(0%) sepia(100%) shadow(0 0 20px #ff00ff)', // Retro
  ];
  const filterNames = ['Normal', 'Cyber', 'Noir', 'Vivid', 'Alien', 'Retro'];

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (step === 'capture' && mode !== 'micro') {
      const startCamera = async () => {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setCameraError(false);
        } catch (err) {
          console.error("Camera Error:", err);
          setCameraError(true);
        }
      };
      startCamera();
    }
    
    return () => {
       if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [step, mode]);

  const capture = () => {
    if (videoRef.current && !cameraError) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.filter = filters[filter];
        ctx.drawImage(videoRef.current, 0, 0);
        setImage(canvas.toDataURL('image/png'));
        setStep('edit');
      }
    } else {
        // Fallback simulation
        setImage(`https://picsum.photos/600/800?random=${Date.now()}`);
        setStep('edit');
    }
  };

  const generateAICaption = async () => {
    setIsGenerating(true);
    const newCaption = await generateCreativeCaption(filterNames[filter], "A cool creation in NexiO studio");
    setCaption(newCaption);
    
    setTimeout(() => {
        setSmartTags(['#NexiOCreator', '#FutureVibes', '#Trending', `#${filterNames[filter]}Style`]);
    }, 1000);
    
    setIsGenerating(false);
  };

  const handlePost = () => {
    addPost({
        type: mode === 'micro' ? 'micro' : (mode === 'video' ? 'video' : 'image'),
        content: image || caption, // For micro, content is text, for image, URL
        caption: mode === 'micro' ? '' : caption,
        tags: smartTags
    });
    onClose();
  };

  // --- Render Steps ---

  const renderCapture = () => (
    <div className="flex-1 relative bg-black overflow-hidden flex flex-col">
       {/* Viewfinder */}
       {mode === 'micro' ? (
           <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900 p-8">
               <textarea 
                 value={caption}
                 onChange={(e) => setCaption(e.target.value)}
                 placeholder="What's on your mind?" 
                 className="w-full bg-transparent text-3xl font-bold text-center text-white placeholder-white/50 focus:outline-none resize-none"
                 rows={4}
               />
           </div>
       ) : (
           <div className="flex-1 relative rounded-b-[2rem] overflow-hidden bg-gray-900 flex items-center justify-center">
             {!cameraError ? (
                 <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover"
                    style={{ filter: filters[filter] }}
                 />
             ) : (
                 <div className="text-center p-6">
                    <Camera size={48} className="mx-auto mb-4 text-gray-600"/>
                    <p className="text-gray-500">Camera access unavailable.</p>
                 </div>
             )}
             
             {/* AR Overlay UI */}
             <div className="absolute top-4 right-4 flex flex-col gap-4">
                <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur border border-white/20 flex items-center justify-center text-white" onClick={() => setFilter((filter + 1) % filters.length)}><Sparkles size={20}/></button>
             </div>
           </div>
       )}

       {/* Mode Selector */}
       <div className="bg-black pt-4 pb-8">
          <div className="flex justify-center gap-8 text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">
              {['video', 'photo', 'micro'].map(m => (
                  <button 
                    key={m} 
                    onClick={() => setMode(m as StudioMode)}
                    className={`${mode === m ? 'text-white scale-110 drop-shadow-[0_0_10px_white]' : 'hover:text-gray-300'} transition-all`}
                  >
                      {m}
                  </button>
              ))}
          </div>

          <div className="flex items-center justify-between px-8">
              <button className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white"><ImageIcon size={24}/></button>
              
              {mode === 'micro' ? (
                 <button onClick={() => setStep('upload')} className="px-8 py-3 rounded-full bg-white text-black font-bold">NEXT</button>
              ) : (
                 <button 
                    onClick={capture}
                    className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center relative group active:scale-95 transition-transform"
                 >
                    <div className={`w-16 h-16 bg-white rounded-full group-hover:bg-nexio-primary transition-colors duration-300 shadow-[0_0_30px_rgba(255,255,255,0.8)] ${mode === 'video' ? 'bg-red-500' : ''}`} />
                 </button>
              )}
              
              <button className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white"><RefreshCw size={24}/></button>
          </div>
       </div>
    </div>
  );

  const renderEdit = () => (
    <div className="flex-1 flex flex-col bg-black">
        {/* Preview Area */}
        <div className="h-[60%] bg-gray-900 relative">
            <img src={image || ''} className="w-full h-full object-contain" />
            <div className="absolute top-4 right-4 flex flex-col gap-3">
                 {[
                     {icon: Type, label: 'Text'},
                     {icon: Scissors, label: 'Trim'},
                     {icon: Sliders, label: 'Adjust'},
                     {icon: Wand2, label: 'Effects'},
                 ].map((tool, i) => (
                     <div key={i} className="flex flex-col items-center gap-1">
                         <button className="w-10 h-10 rounded-full bg-black/60 backdrop-blur text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                             <tool.icon size={18}/>
                         </button>
                         <span className="text-[9px] font-bold text-white shadow-black drop-shadow-md">{tool.label}</span>
                     </div>
                 ))}
            </div>
            
            {/* Timeline Overlay */}
            <div className="absolute bottom-4 left-4 right-4 h-16 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 flex items-center px-2 gap-1 overflow-hidden">
                <div className="h-12 w-1/3 bg-nexio-primary/40 rounded border border-nexio-primary flex items-center justify-center text-[10px] text-white font-bold">CLIP 1</div>
                <div className="h-12 w-1/4 bg-blue-500/40 rounded border border-blue-500"></div>
                <div className="h-full w-0.5 bg-white absolute left-1/2 z-10"></div>
            </div>
        </div>

        {/* Pro Features Panel */}
        <div className="flex-1 bg-nexio-surface p-6 rounded-t-[2rem] -mt-6 relative z-10 border-t border-white/10">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Pro Tools</h3>
            
            <div className="glass rounded-2xl p-4 flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-nexio-primary/20 flex items-center justify-center text-nexio-primary"><Type size={14}/></div>
                    <div>
                        <span className="text-sm font-bold text-white block">AI Auto Caption</span>
                        <span className="text-[10px] text-gray-400">Generate captions from audio</span>
                    </div>
                </div>
                <ToggleSwitch checked={aiCaptionEnabled} onChange={() => setAiCaptionEnabled(!aiCaptionEnabled)} />
            </div>

            <div className="flex justify-between items-center mt-auto">
                <button onClick={() => setStep('capture')} className="text-gray-400 font-bold hover:text-white">Discard</button>
                <NeoButton onClick={() => setStep('upload')}>Next <Check size={16}/></NeoButton>
            </div>
        </div>
    </div>
  );

  const renderUpload = () => (
    <div className="flex-1 flex flex-col bg-nexio-surface p-6 overflow-y-auto">
        <div className="flex gap-4 mb-6">
            <div className="w-24 h-32 bg-gray-800 rounded-lg overflow-hidden border border-white/10">
                 {mode === 'micro' ? (
                     <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900 text-[10px] text-center p-2">{caption}</div>
                 ) : (
                     image ? <img src={image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">No Preview</div>
                 )}
            </div>
            <div className="flex-1">
                <textarea 
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Write a caption..." 
                    className="w-full h-full bg-transparent text-white focus:outline-none resize-none text-sm"
                />
            </div>
        </div>

        {/* AI Assist */}
        <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase">AI Assistant</span>
                <button onClick={generateAICaption} className="text-nexio-secondary text-xs font-bold flex items-center gap-1">
                   <Wand2 size={12} className={isGenerating ? 'animate-spin' : ''}/> Generate
                </button>
            </div>
            
            {/* Smart Tags */}
            {smartTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2 animate-pulse-fast" style={{animationDuration: '2s'}}>
                    {smartTags.map(tag => (
                        <span key={tag} className="text-[10px] bg-nexio-primary/20 text-nexio-primary px-2 py-1 rounded-full border border-nexio-primary/30 cursor-pointer hover:bg-nexio-primary/40">
                            {tag}
                        </span>
                    ))}
                </div>
            )}
        </div>

        <div className="space-y-4 mb-8">
            <div className="glass p-4 rounded-xl flex items-center justify-between">
                <span className="text-sm text-white">Save to Device</span>
                <ToggleSwitch checked={true} onChange={() => {}} />
            </div>
            <div className="glass p-4 rounded-xl flex items-center justify-between">
                <span className="text-sm text-white">Share to other platforms</span>
                <Share size={16} className="text-gray-400"/>
            </div>
        </div>

        <NeoButton className="w-full py-4 text-lg" onClick={handlePost}>Post Creation</NeoButton>
    </div>
  );

  return (
    <div className="h-full w-full bg-black flex flex-col relative z-50">
        <div className="h-14 flex items-center justify-between px-4 z-20 bg-black/50 backdrop-blur-md absolute top-0 w-full">
            <button onClick={onClose}><X className="text-white" size={24}/></button>
            <span className="text-white font-bold uppercase tracking-widest text-sm">NexiO Studio</span>
            <button><SettingsIcon className="text-white" size={24}/></button>
        </div>
        <div className="pt-14 h-full flex flex-col">
            {step === 'capture' && renderCapture()}
            {step === 'edit' && renderEdit()}
            {step === 'upload' && renderUpload()}
        </div>
    </div>
  );
};
