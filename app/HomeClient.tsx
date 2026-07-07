"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, Variants } from "motion/react";
import { Globe, Trophy, Play, Clipboard, Check, Sparkles } from "lucide-react";

interface PlaylistInfo {
  filename: string;
  name: string;
  channelCount: number;
  sizeBytes: number;
}

interface HomeClientProps {
  playlists: PlaylistInfo[];
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = 1;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15
    }
  }
};

export default function HomeClient({ playlists }: HomeClientProps) {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setOrigin(window.location.origin);
    }, 0);
  }, []);

  const handleCopy = async (filename: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedFile(filename);
      setTimeout(() => setCopiedFile(null), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const getPlaylistIcon = (filename: string) => {
    switch (filename.toLowerCase()) {
      case 'sports.json':
        return <Trophy className="w-6 h-6 text-amber-400" />;
      case 'fifa.json':
        return <Play className="w-6 h-6 text-emerald-400 animate-pulse" />;
      case 'channels.json':
        return <Globe className="w-6 h-6 text-blue-400" />;
      default:
        return <Sparkles className="w-6 h-6 text-indigo-400" />;
    }
  };

  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-5xl flex flex-col min-h-[85vh] relative z-10"
    >
      {/* Hero Section */}
      <div className="relative text-center mb-16 sm:mb-24 flex flex-col items-center select-none w-full">
        {/* Soft background glow */}
        <div className="absolute -top-12 w-72 h-72 rounded-full bg-blue-500/10 blur-[90px] pointer-events-none -z-10 animate-pulse duration-[7000ms]" />

        {/* Sync Status Badge */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 hover:border-blue-500/35 hover:bg-blue-500/5 backdrop-blur-md mb-4 transition-all duration-300 cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="text-[10px] sm:text-xs font-semibold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent uppercase tracking-wider">Sync Server &amp; Playlists Online</span>
        </motion.div>

        {/* Title */}
        <motion.h1 
          variants={itemVariants} 
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-b from-white via-white to-zinc-500 bg-clip-text text-transparent leading-tight pb-3"
        >
          IPTV Playlists &amp; Docs
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          variants={itemVariants} 
          className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed px-4"
        >
          Access curated, automated live streaming database feeds. Sync lists in real-time, inspect dynamic formats, and download our native player application.
        </motion.p>

        {/* Hero Actions */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4 mt-8 w-full">
          <Link
            href="/download"
            className="w-48 sm:w-52 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 transition-all font-semibold flex items-center justify-center gap-2 text-white shadow-lg shadow-blue-600/10 text-xs sm:text-sm"
          >
            Download App
          </Link>
          <Link
            href="/fixtures"
            className="w-48 sm:w-52 py-3 px-4 rounded-xl bg-white/5 border border-white/15 hover:bg-white/10 hover:border-white/20 transition-all font-semibold flex items-center justify-center gap-2 text-zinc-300 hover:text-white text-xs sm:text-sm"
          >
            <Trophy size={16} className="text-amber-400" />
            World Cup Fixtures
          </Link>
        </motion.div>
      </div>

      {/* Playlists Grid */}
      <motion.div variants={itemVariants} className="mb-20 sm:mb-28 w-full">
        <div className="flex flex-col mb-8 select-none">
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <span className="w-1.5 h-6 rounded-full bg-blue-500" />
            Synchronized Playlist Endpoints
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Double click or tap copy to save raw API endpoints into your player.
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {playlists.map((playlist) => {
            const playlistUrl = origin ? `${origin}/playlist/${playlist.filename}` : `/playlist/${playlist.filename}`;
            const isCopied = copiedFile === playlist.filename;

            return (
              <div 
                key={playlist.filename}
                className="flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-slate-900/40 border border-white/15 backdrop-blur-xl hover:border-blue-500/20 transition-all duration-300 relative group"
              >
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/5 border border-white/15">
                      {getPlaylistIcon(playlist.filename)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm sm:text-base">{playlist.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-mono font-bold">
                          {playlist.channelCount.toLocaleString()} Channels
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {formatBytes(playlist.sizeBytes)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Input URL Section */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">M3U API Endpoint</label>
                    <div className="flex items-center gap-2 bg-slate-950/65 rounded-xl border border-white/15 p-1.5 pl-3 group-hover:border-white/10 transition-colors">
                      <input 
                        type="text" 
                        readOnly 
                        value={playlistUrl}
                        className="bg-transparent border-none text-zinc-300 font-mono text-[10px] sm:text-xs focus:ring-0 focus:outline-none flex-1 truncate select-all"
                      />
                      <button
                        onClick={() => handleCopy(playlist.filename, playlistUrl)}
                        className={`p-2 rounded-lg transition-all shrink-0 ${
                          isCopied 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/40" 
                            : "bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/15"
                        }`}
                        title="Copy to Clipboard"
                      >
                        {isCopied ? <Check size={14} /> : <Clipboard size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="flex justify-between items-center border-t border-white/15 mt-5 pt-3">
                  <a 
                    href={`/playlist/${playlist.filename}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
                  >
                    View Raw JSON
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                  </a>
                  <span className="text-[10px] text-zinc-400 font-mono">{playlist.filename}</span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>


    </motion.main>
  );
}
