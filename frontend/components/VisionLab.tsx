import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Loader2, Image as ImageIcon, Video, Wand2, Download, Maximize2, Share2 } from 'lucide-react';

const VisionLab: React.FC = () => {
  const [mode, setMode] = useState<'generate' | 'edit' | 'video'>('generate');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [imageSize, setImageSize] = useState('1K');
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [status, setStatus] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSourceImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const ensureApiKey = async () => {
    // @ts-ignore
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
    }
    return true;
  };

  const generateImage = async () => {
    if (!prompt) return;
    setLoading(true);
    setStatus('Drafting neural patterns...');
    try {
      await ensureApiKey();
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: aspectRatio as any, imageSize: imageSize as any } }
      });

      const part = response.candidates[0].content.parts.find(p => p.inlineData);
      if (part?.inlineData) {
        setResultUrl(`data:image/png;base64,${part.inlineData.data}`);
        setVideoUrl(null);
      }
    } catch (e: any) {
      console.error(e);
      alert("Generation failed: " + e.message);
    } finally {
      setLoading(false);
      setStatus('');
    }
  };

  const editImage = async () => {
    if (!prompt || !sourceImage) return;
    setLoading(true);
    setStatus('Refining pixels...');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = sourceImage.split(',')[1];
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: 'image/png' } },
            { text: prompt }
          ]
        }
      });
      const part = response.candidates[0].content.parts.find(p => p.inlineData);
      if (part?.inlineData) {
        setResultUrl(`data:image/png;base64,${part.inlineData.data}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setStatus('');
    }
  };

  const generateVideo = async () => {
    if (!prompt && !sourceImage) return;
    setLoading(true);
    setStatus('Veo is imagining your scene... (This can take 2-3 minutes)');
    try {
      await ensureApiKey();
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const config: any = {
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: aspectRatio === '16:9' ? '16:9' : '9:16'
        }
      };

      if (sourceImage) {
        config.image = {
          imageBytes: sourceImage.split(',')[1],
          mimeType: 'image/png'
        };
      }

      let operation = await ai.models.generateVideos(config);
      
      while (!operation.done) {
        await new Promise(r => setTimeout(r, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
        setStatus(`Veo processing... ${operation.metadata?.progressPercent || '0'}%`);
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const fetchRes = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await fetchRes.blob();
        setVideoUrl(URL.createObjectURL(blob));
        setResultUrl(null);
      }
    } catch (e: any) {
      console.error(e);
      alert("Veo Error: " + e.message);
    } finally {
      setLoading(false);
      setStatus('');
    }
  };

  return (
    <div className="h-full w-full bg-[#f8fafc] flex flex-col overflow-hidden">
      <div className="p-8 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic">Vision Lab.</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">AI-Powered Visual Assets</p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button onClick={() => setMode('generate')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'generate' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>Generate</button>
          <button onClick={() => setMode('edit')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'edit' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>Edit</button>
          <button onClick={() => setMode('video')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'video' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>Video</button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        <div className="w-full md:w-96 border-r border-slate-200 bg-white p-8 overflow-y-auto custom-scrollbar flex flex-col shrink-0">
          <div className="space-y-8 flex-1">
            {mode === 'edit' && (
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">Base Image</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center cursor-pointer hover:border-indigo-500 transition-all overflow-hidden"
                >
                  {sourceImage ? <img src={sourceImage} className="w-full h-full object-cover" /> : <Wand2 className="w-8 h-8 text-slate-300" />}
                </div>
                <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} accept="image/*" />
              </div>
            )}

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">Creative Prompt</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={mode === 'video' ? "Describe the movement..." : "Describe your vision..."}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-sm font-medium focus:border-indigo-500 outline-none resize-none h-32 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Aspect Ratio</label>
                <select 
                  value={aspectRatio} 
                  onChange={e => setAspectRatio(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-xs font-black outline-none focus:border-indigo-500"
                >
                  <option>1:1</option>
                  <option>16:9</option>
                  <option>9:16</option>
                  <option>4:3</option>
                  <option>3:4</option>
                </select>
              </div>
              {mode !== 'video' && (
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Size</label>
                  <select 
                    value={imageSize} 
                    onChange={e => setImageSize(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-xs font-black outline-none focus:border-indigo-500"
                  >
                    <option>1K</option>
                    <option>2K</option>
                    <option>4K</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={mode === 'video' ? generateVideo : mode === 'edit' ? editImage : generateImage}
            disabled={loading || (!prompt && !sourceImage)}
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-30 transition-all mt-8"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : `Create ${mode === 'video' ? 'Video' : 'Image'}`}
          </button>
        </div>

        <div className="flex-1 bg-slate-50 p-8 flex items-center justify-center overflow-hidden">
          {loading ? (
            <div className="text-center animate-in fade-in duration-500">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl mb-6 mx-auto">
                 <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
              </div>
              <h3 className="text-slate-900 font-black text-sm uppercase tracking-widest mb-2">Neural Processing</h3>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">{status}</p>
            </div>
          ) : resultUrl || videoUrl ? (
            <div className="relative max-w-4xl w-full h-full flex items-center justify-center animate-in zoom-in-95 duration-500">
               {videoUrl ? (
                 <video src={videoUrl} controls autoPlay loop className="max-w-full max-h-full rounded-3xl shadow-2xl bg-black" />
               ) : (
                 <img src={resultUrl!} className="max-w-full max-h-full rounded-3xl shadow-2xl object-contain" />
               )}
               
               <div className="absolute top-4 right-4 flex space-x-2">
                 <button onClick={() => window.open(resultUrl || videoUrl || '#')} className="p-3 bg-white/90 backdrop-blur-md rounded-xl text-slate-800 shadow-lg hover:bg-white transition-all"><Download className="w-5 h-5" /></button>
               </div>
            </div>
          ) : (
            <div className="text-center">
               <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-slate-200 mb-8 mx-auto shadow-sm">
                  {mode === 'video' ? <Video className="w-10 h-10" /> : <ImageIcon className="w-10 h-10" />}
               </div>
               <h3 className="text-slate-900 font-black text-xl tracking-tight mb-2">Canvas Empty.</h3>
               <p className="text-slate-400 text-xs font-medium">Draft a prompt to begin the synthesis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisionLab;