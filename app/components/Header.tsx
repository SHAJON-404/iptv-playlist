"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HelpCircle, Menu, X, Tv, Download, Trophy } from "lucide-react";
import { FaTelegram, FaDiscord } from "react-icons/fa6";

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const isDownloadPage = pathname === "/download";
  const isFaqPage = pathname === "/faq";
  const isFixturesPage = pathname === "/fixtures";

  return (
    <header className="sticky top-0 z-50 w-full border-b transition-all duration-500 bg-[#070414]/85 backdrop-blur-xl border-white/[0.08] shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-22">
          {/* Logo & Brand */}
          <Link href="/">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex items-center gap-2.5 sm:gap-4.5 cursor-pointer group"
            >
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden border border-white/10 sm:border-white/15 shadow-xl bg-white/5 flex-shrink-0 flex items-center justify-center transition-colors">
                <Image
                  src="/logo.svg"
                  alt="IPTV Docs Logo"
                  width={32}
                  height={32}
                  className="object-contain w-6 h-6 sm:w-8 sm:h-8 group-hover:scale-105 transition-transform"
                  priority
                />
              </div>
              <div className="flex flex-col justify-center">
                {/* Mobile UI Brand */}
                <span className="text-lg font-black tracking-tight text-white sm:hidden leading-none select-none">
                  IP<span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">TV Docs</span>
                </span>

                {/* Desktop UI Brand */}
                <div className="hidden sm:flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    IP
                  </span>
                  <span className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                    TV Docs
                  </span>
                </div>

                {/* Desktop Live Broadcast Badge */}
                <div className="hidden sm:flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[9px] font-bold tracking-widest text-blue-400 uppercase">
                      Sync Server & Docs
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Navigation Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="hidden md:flex items-center gap-2 sm:gap-3"
            >
              <Link
                href="/fixtures"
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 active:scale-95 cursor-pointer ${isFixturesPage
                  ? "border-blue-500/50 bg-blue-500/10 text-blue-400"
                  : "border-white/10 hover:border-blue-500/50 bg-white/5 hover:bg-blue-500/10 text-white"
                  } font-bold text-xs sm:text-sm`}
              >
                <Trophy size={15} className="text-amber-400" />
                <span>World Cup Fixtures</span>
              </Link>

              <Link
                href="/download"
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 active:scale-95 cursor-pointer ${isDownloadPage
                  ? "border-blue-500/50 bg-blue-500/10 text-blue-400"
                  : "border-white/10 hover:border-blue-500/50 bg-white/5 hover:bg-blue-500/10 text-white"
                  } font-bold text-xs sm:text-sm`}
              >
                <Download size={15} />
                <span>Download App</span>
              </Link>

              <Link
                href="/faq"
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 active:scale-95 cursor-pointer ${isFaqPage
                  ? "border-blue-500/50 bg-blue-500/10 text-blue-400"
                  : "border-white/10 hover:border-blue-500/50 bg-white/5 hover:bg-blue-500/10 text-white"
                  } font-bold text-xs sm:text-sm`}
              >
                <HelpCircle size={15} />
                <span>FAQ</span>
              </Link>
            </motion.div>

            {/* Mobile Hamburger Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={toggleMenu}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white transition-all cursor-pointer select-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={20} className="text-rose-400" /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-[#070414]/95 backdrop-blur-2xl border-t border-white/[0.08]"
          >
            <div className="px-4 py-6 space-y-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
              {/* Community & Playlist Guide */}
              <div className="space-y-4">
                <div className="group relative glass-card border border-blue-500/15 rounded-2xl bg-white/[0.01] overflow-hidden transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.04] to-transparent pointer-events-none" />
                  <div className="relative p-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/15 text-blue-400 flex items-center justify-center flex-shrink-0">
                      <Tv className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-blue-400/80 tracking-widest mb-1 uppercase">Community Support</p>
                      <p className="text-xs text-zinc-300 leading-relaxed mb-3 font-medium">
                        Join our community to get custom playlists, updates, and customer support.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <a
                          href="https://t.me/shajonOTT"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2AABEE]/10 border border-[#2AABEE]/20 text-[#2AABEE] text-[10px] font-bold"
                        >
                          <FaTelegram size={12} />
                          Telegram
                        </a>
                        <a
                          href="https://discord.gg/NQjksbt3NN"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5865F2]/10 border border-[#5865F2]/20 text-[#5865F2] text-[10px] font-bold"
                        >
                          <FaDiscord size={12} />
                          Discord
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Navigation Links */}
              <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
                <Link
                  href="/fixtures"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-bold transition-all ${isFixturesPage
                    ? "border-blue-500/50 bg-blue-500/10 text-blue-400"
                    : "border-white/5 bg-white/[0.02] text-white"
                    }`}
                >
                  <Trophy size={16} className="text-amber-400" />
                  World Cup Fixtures
                </Link>

                <Link
                  href="/download"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-bold transition-all ${isDownloadPage
                    ? "border-blue-500/50 bg-blue-500/10 text-blue-400"
                    : "border-white/5 bg-white/[0.02] text-white"
                    }`}
                >
                  <Download size={16} />
                  Download App
                </Link>

                <Link
                  href="/faq"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-bold transition-all ${isFaqPage
                    ? "border-blue-500/50 bg-blue-500/10 text-blue-400"
                    : "border-white/5 bg-white/[0.02] text-white"
                    }`}
                >
                  <HelpCircle size={16} />
                  FAQ
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
