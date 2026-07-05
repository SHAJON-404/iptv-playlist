"use client";

import { CopyableInput } from "./CopyableInput";

interface PlaylistFile {
  name: string;
  updated: string; // serialized date
  size: number;
}

export function PlaylistTabs({ files }: { files: PlaylistFile[] }) {
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full space-y-8">
      {/* Playlist Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {files.map((file) => {
          const url = `/playlist/${file.name}`;
          
          return (
            <div 
              key={file.name}
              className="group relative flex flex-col p-6 rounded-[2.5rem] bg-[#0c0c0e]/85 border border-white/5 backdrop-blur-2xl transition-all duration-500 hover:bg-[#121215]/90 hover:border-white/10 hover:-translate-y-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              {/* Radial glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-10 transition-all duration-500 group-hover:opacity-30 group-hover:scale-125 bg-blue-500" />

              <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="flex flex-shrink-0 items-center justify-center w-14 h-14 rounded-2xl border transition-colors duration-300 bg-blue-500/10 text-blue-400 border-blue-500/10 group-hover:border-blue-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-white tracking-tight truncate pr-4">{file.name}</h3>
                    <p className="text-xs text-zinc-500 font-medium mt-0.5">{formatSize(file.size)} • JSON</p>
                  </div>
                </div>
                
                <a 
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  title="Open raw feed"
                  className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-zinc-400 hover:bg-white/15 hover:text-white transition-all duration-300 border border-white/5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                </a>
              </div>

              {/* Time display */}
              <div className="relative z-10 flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 w-fit mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-zinc-500">Updated:</span>
                <span className="text-emerald-400 font-semibold">{new Date(file.updated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              {/* Link copying widget */}
              <CopyableInput endpoint={url} />
            </div>
          );
        })}

        {files.length === 0 && (
          <div className="col-span-full py-20 text-center text-zinc-500 border border-dashed border-white/10 rounded-[2.5rem] bg-white/5 backdrop-blur-md">
            No playlists found.
          </div>
        )}
      </div>
    </div>
  );
}
