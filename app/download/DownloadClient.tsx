"use client";

import { useState } from "react";
import { FaWindows, FaLinux } from "react-icons/fa6";
import { motion, AnimatePresence, Variants } from "motion/react";

interface GitHubAsset {
  name: string;
  browser_download_url: string;
  size: number;
  download_count: number;
}

interface ReleaseData {
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
  assets: GitHubAsset[];
}

interface DownloadClientProps {
  release: ReleaseData;
  publishDate: string;
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

export default function DownloadClient({ release, publishDate }: DownloadClientProps) {
  const [selectedOS, setSelectedOS] = useState<'windows' | 'linux'>('windows');

  // Categorize assets
  const windowsInstaller = release.assets.find(a => a.name.endsWith('.exe') && a.name.toLowerCase().includes('setup'));
  const windowsAppExe = release.assets.find(a => a.name.endsWith('.exe') && !a.name.toLowerCase().includes('setup'));
  const windowsPortableZip = release.assets.find(a => a.name.toLowerCase().includes('win') && a.name.endsWith('.zip'));

  const linuxDeb = release.assets.find(a => a.name.endsWith('.deb'));
  const linuxRpm = release.assets.find(a => a.name.endsWith('.rpm'));
  const linuxAppImage = release.assets.find(a => a.name.endsWith('.AppImage'));

  const generalZip = release.assets.find(a => !a.name.toLowerCase().includes('win') && a.name.endsWith('.zip'));

  // Extract filenames for instructions, using fallback formats if assets are missing
  const versionString = release.tag_name.replace('v', '');
  const windowsInstallerName = windowsInstaller?.name || `IPTV.Player.Setup.${versionString}.exe`;
  const windowsAppExeName = windowsAppExe?.name || `IPTV.Player.${versionString}.exe`;
  const windowsPortableZipName = windowsPortableZip?.name || `IPTV.Player-${versionString}-win.zip`;
  
  const linuxDebName = linuxDeb?.name || `iptv_${versionString}_amd64.deb`;
  const linuxRpmName = linuxRpm?.name || `iptv-${versionString}.x86_64.rpm`;
  const linuxAppImageName = linuxAppImage?.name || `IPTV.Player-${versionString}.AppImage`;
  const generalZipName = generalZip?.name || `iptv-${versionString}.zip`;

  return (
    <motion.main 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-5xl flex flex-col min-h-[85vh] relative z-10"
    >
      
      {/* Hero Section */}
      <div className="relative text-center mb-10 sm:mb-16 flex flex-col items-center select-none w-full">
        {/* Soft background glow */}
        <div className="absolute -top-12 w-64 h-64 rounded-full bg-blue-500/10 blur-[80px] pointer-events-none -z-10 animate-pulse duration-[6000ms]" />

        {/* Dynamic staggered children */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 hover:border-blue-500/35 hover:bg-blue-500/5 backdrop-blur-md mb-4 transition-all duration-300 cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="text-[10px] sm:text-xs font-semibold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent uppercase tracking-wider">Latest Version: {release.tag_name}</span>
        </motion.div>

        <motion.h1 
          variants={itemVariants} 
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-b from-white via-white to-zinc-500 bg-clip-text text-transparent leading-tight pb-2 sm:pb-3"
        >
          Get IPTV Player
        </motion.h1>

        <motion.p 
          variants={itemVariants} 
          className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed px-4"
        >
          Download the high-performance desktop application for a buffer-free live streaming experience.
        </motion.p>

        <motion.p 
          variants={itemVariants} 
          className="text-xs text-zinc-400 mt-4 flex items-center justify-center gap-1.5 font-medium"
        >
          <span>Released on {publishDate}</span>
          <span className="text-zinc-500">&bull;</span>
          <a 
            href={release.html_url} 
            target="_blank" 
            rel="noreferrer" 
            className="text-blue-400 hover:text-blue-300 transition-colors hover:underline flex items-center gap-0.5"
          >
            View on GitHub
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="inline shrink-0"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
          </a>
        </motion.p>
      </div>

      {/* Main Download Cards */}
      <motion.div variants={itemVariants} className="grid gap-6 grid-cols-1 md:grid-cols-2 mb-10 sm:mb-16 max-w-4xl mx-auto w-full">
        
        {/* Windows Card */}
        <motion.div 
          whileHover={{ y: -4 }}
          onClick={() => setSelectedOS('windows')}
          className={`flex flex-col justify-between p-6 sm:p-8 rounded-3xl backdrop-blur-xl relative cursor-pointer border transition-all duration-300 group hover:scale-[1.01] ${selectedOS === 'windows' ? 'bg-slate-900/60 border-blue-500/80 shadow-lg shadow-blue-500/5' : 'bg-slate-900/40 border-white/15 hover:border-blue-500/30'}`}
        >
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl transition-colors ${selectedOS === 'windows' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-500/10 text-blue-400'}`}>
                <FaWindows size={22} className="w-5.5 h-5.5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  Windows
                  {selectedOS === 'windows' && (
                    <span className="text-[10px] bg-blue-500/20 text-blue-400 font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider scale-90">Active</span>
                  )}
                </h3>
                <span className="text-[11px] sm:text-xs text-zinc-400">Windows 10 / 11 (x64)</span>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Experience optimized performance on Windows with hardware acceleration and automatic stream format routing. Click to view guide.
            </p>
          </div>

          <div className="space-y-4 mt-6 sm:mt-8">
            {windowsInstaller ? (
              <a
                href={windowsInstaller.browser_download_url}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 transition-all font-semibold flex items-center justify-center gap-2 text-white shadow-lg shadow-blue-600/10 text-xs sm:text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Installer (.exe)
              </a>
            ) : (
              <div className="w-full text-center py-3 text-xs text-zinc-400 bg-slate-950/40 rounded-xl border border-white/15">
                Installer temporarily unavailable
              </div>
            )}
          </div>
        </motion.div>

        {/* Linux Card */}
        <motion.div 
          whileHover={{ y: -4 }}
          onClick={() => setSelectedOS('linux')}
          className={`flex flex-col justify-between p-6 sm:p-8 rounded-3xl backdrop-blur-xl relative cursor-pointer border transition-all duration-300 group hover:scale-[1.01] ${selectedOS === 'linux' ? 'bg-slate-900/60 border-amber-500/80 shadow-lg shadow-amber-500/5' : 'bg-slate-900/40 border-white/15 hover:border-amber-500/30'}`}
        >
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl transition-colors ${selectedOS === 'linux' ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-500/10 text-amber-400'}`}>
                <FaLinux size={22} className="w-5.5 h-5.5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  Linux
                  {selectedOS === 'linux' && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider scale-90">Active</span>
                  )}
                </h3>
                <span className="text-[11px] sm:text-xs text-zinc-400">Debian / RedHat / AppImage</span>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Run natively on Linux. Highly compatible bundles built for Debian-based systems, Fedora/RPM, or sandbox-friendly AppImage. Click to view guide.
            </p>
          </div>

          <div className="space-y-4 mt-6 sm:mt-8">
            {linuxDeb ? (
              <a
                href={linuxDeb.browser_download_url}
                className="w-full py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 transition-all font-semibold flex items-center justify-center gap-2 text-white text-xs sm:text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Debian (.deb)
              </a>
            ) : (
              <div className="w-full text-center py-3 text-xs text-zinc-400 bg-slate-950/40 rounded-xl border border-white/15">
                Debian binary unavailable
              </div>
            )}
          </div>
        </motion.div>

      </motion.div>

      {/* Installation Instructions Section */}
      <motion.div variants={itemVariants} className="p-6 sm:p-8 rounded-3xl bg-slate-900/25 border border-white/15 backdrop-blur-xl mb-10 sm:mb-16 w-full">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2 border-b border-white/15 pb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          Installation Guide: {selectedOS === 'windows' ? 'Windows OS' : 'Linux OS'}
        </h2>

        {/* Portable Recommendation Note */}
        <div className="mb-6 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/40 text-blue-300 flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs sm:text-sm">
          <span className="flex-shrink-0 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold uppercase text-[10px] tracking-wide border border-blue-500/30">
            Recommended
          </span>
          <span>
            {selectedOS === 'windows' ? (
              <>Using the <strong className="text-white">Portable version (.zip)</strong> is highly recommended. It runs instantly without installation or administrative rights.</>
            ) : (
              <>Using the <strong className="text-white">Portable version (AppImage / .zip)</strong> is highly recommended. It runs natively and instantly without system package installation.</>
            )}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedOS}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="text-xs sm:text-sm leading-relaxed"
          >
            {selectedOS === 'windows' ? (
              <div className="space-y-5">
                <h4 className="font-bold text-white flex items-center gap-2 text-sm sm:text-base">
                  <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-mono text-[11px] shrink-0">1</span>
                  Standard Installer Method (.exe)
                </h4>
                <div className="pl-7 space-y-2 text-zinc-400">
                  <p>
                    1. Double click on the downloaded installer file: <code className="text-zinc-200 font-mono bg-white/5 px-1.5 py-0.5 rounded border border-white/5">{windowsInstallerName}</code>.
                  </p>
                  <p>
                    2. If prompted by Windows SmartScreen, click <span className="text-white font-medium">More Info</span> and then <span className="text-white font-medium">Run Anyway</span>.
                  </p>
                  <p>
                    3. Follow the standard configuration screens to finish installing and open the IPTV Player.
                  </p>
                </div>

                <h4 className="font-bold text-white flex items-center gap-2 text-sm sm:text-base pt-3">
                  <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-mono text-[11px] shrink-0">2</span>
                  Standalone Executable Method (.exe)
                </h4>
                <div className="pl-7 space-y-2 text-zinc-400">
                  <p>
                    Run the standalone application file <code className="text-zinc-200 font-mono bg-white/5 px-1.5 py-0.5 rounded border border-white/5">{windowsAppExeName}</code> directly to launch the application.
                  </p>
                </div>

                <h4 className="font-bold text-white flex items-center gap-2 text-sm sm:text-base pt-3">
                  <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-mono text-[11px] shrink-0">3</span>
                  Portable Archive Method (.zip)
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">Recommended</span>
                </h4>
                <div className="pl-7 space-y-2 text-zinc-400">
                  <p>
                    Extract the folder from the archive: <code className="text-zinc-200 font-mono bg-white/5 px-1.5 py-0.5 rounded border border-white/5">{windowsPortableZipName}</code> to any directory. Inside the folder, open and execute <code className="text-zinc-200 font-mono bg-white/5 px-1.5 py-0.5 rounded border border-white/5">IPTV Player.exe</code>.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Linux Debian */}
                <div>
                  <h4 className="font-bold text-white flex items-center gap-2 text-sm sm:text-base mb-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center font-mono text-[11px] shrink-0">1</span>
                    Debian / Ubuntu / Linux Mint (.deb)
                  </h4>
                  <div className="pl-7 space-y-2 text-zinc-400">
                    <p>Open your favorite terminal and execute the package installer command:</p>
                    <pre className="mt-2 bg-slate-900/60 border border-white/5 rounded-lg p-3 text-zinc-300 font-mono text-[11px] sm:text-xs overflow-x-auto select-all">
                      sudo dpkg -i {linuxDebName}
                    </pre>
                  </div>
                </div>

                {/* Linux RPM */}
                <div className="pt-2">
                  <h4 className="font-bold text-white flex items-center gap-2 text-sm sm:text-base mb-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center font-mono text-[11px] shrink-0">2</span>
                    RedHat / Fedora / SUSE (.rpm)
                  </h4>
                  <div className="pl-7 space-y-2 text-zinc-400">
                    <p>Install the local RPM package using your distribution&apos;s package manager:</p>
                    <pre className="mt-2 bg-slate-900/60 border border-white/5 rounded-lg p-3 text-zinc-300 font-mono text-[11px] sm:text-xs overflow-x-auto select-all">
                      sudo dnf install ./{linuxRpmName}
                    </pre>
                  </div>
                </div>

                {/* Linux AppImage */}
                <div className="pt-2">
                  <h4 className="font-bold text-white flex items-center gap-2 text-sm sm:text-base mb-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center font-mono text-[11px] shrink-0">3</span>
                    Universal Portable AppImage (.AppImage)
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">Recommended</span>
                  </h4>
                  <div className="pl-7 space-y-2 text-zinc-400">
                    <p>Grant execute permissions to the AppImage binary and launch it directly:</p>
                    <pre className="mt-2 bg-slate-900/60 border border-white/5 rounded-lg p-3 text-zinc-300 font-mono text-[11px] sm:text-xs overflow-x-auto select-all">
                      chmod +x {linuxAppImageName} &amp;&amp; ./{linuxAppImageName}
                    </pre>
                  </div>
                </div>

                {/* Linux Portable Zip */}
                <div className="pt-2">
                  <h4 className="font-bold text-white flex items-center gap-2 text-sm sm:text-base mb-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center font-mono text-[11px] shrink-0">4</span>
                    Portable Archive (.zip)
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">Recommended</span>
                  </h4>
                  <div className="pl-7 space-y-2 text-zinc-400">
                    <p>Extract the compressed zip, enter the workspace, and run the binary wrapper script:</p>
                    <pre className="mt-2 bg-slate-900/60 border border-white/5 rounded-lg p-3 text-zinc-300 font-mono text-[11px] sm:text-xs overflow-x-auto select-all">
                      unzip {generalZipName} &amp;&amp; cd {generalZipName.replace('.zip', '')} &amp;&amp; ./iptv
                    </pre>
                  </div>
                </div>

              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* All Release Assets Table */}
      <motion.div variants={itemVariants} className="p-6 sm:p-8 rounded-3xl bg-slate-900/30 border border-white/5 backdrop-blur-xl relative">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 shrink-0"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
          All Release Assets ({release.assets.length} Files)
        </h2>

        <div className="overflow-x-auto -mx-6 sm:mx-0">
          <div className="inline-block min-w-full align-middle px-6 sm:px-0">
            <table className="min-w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/5 text-zinc-400 font-semibold">
                  <th className="py-3 px-2">Filename</th>
                  <th className="py-3 px-2">Size</th>
                  <th className="py-3 px-2 text-center">Downloads</th>
                  <th className="py-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {release.assets.map((asset) => (
                  <tr key={asset.name} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-2 font-mono text-[11px] sm:text-xs max-w-[140px] sm:max-w-xs md:max-w-md truncate text-white">
                      {asset.name}
                    </td>
                    <td className="py-2.5 px-2 font-mono text-[11px] sm:text-xs text-zinc-400">
                      {formatBytes(asset.size)}
                    </td>
                    <td className="py-2.5 px-2 text-center font-mono text-[11px] sm:text-xs text-zinc-400">
                      {asset.download_count.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      <a
                        href={asset.browser_download_url}
                        className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 hover:underline font-semibold"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
      
    </motion.main>
  );
}
