import { motion, AnimatePresence } from "motion/react";
import { X, Mic2, FileText, Music, Smile, ShoppingBag, Globe, ExternalLink } from "lucide-react";
import { useEffect } from "react";
import { AudioPlayer } from "./AudioPlayer";

export interface PersonaData {
  name: string;
  role: string;
  desc: string;
  longDesc: string;
  trackTitle: string;
  audioSrc: string; // Placeholder for local file path
  image: string;
  images?: string[]; // Optional array for multiple images
  icon: any; // Lucide icon component
  traits: string[];
  spotifyUrl?: string; // Optional Spotify link
  appleMusicUrl?: string; // Optional Apple Music link
}

interface PersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PersonaData | null;
}

export function PersonaModal({ isOpen, onClose, data }: PersonaModalProps) {
  if (!data) return null;

  const Icon = data.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-4 md:inset-auto md:top-[10%] md:bottom-[10%] md:left-[10%] md:right-[10%] z-50 bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl md:max-w-5xl md:mx-auto"
          >
            <div className="flex-1 flex flex-col md:flex-row h-full">
              {/* Left Column: Image & Identity */}
              <div className="relative md:w-2/5 h-64 md:h-auto overflow-hidden bg-white/5">
                <img
                  src={data.image}
                  alt={data.name}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent md:bg-gradient-to-r" />
                
                <div className="absolute bottom-6 left-6 right-6 z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-black/50 backdrop-blur-sm mb-4">
                    <Icon className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white">Identity Module</span>
                  </div>
                  <h2 className="text-4xl font-light tracking-tighter text-white mb-1">
                    {data.name}
                  </h2>
                  <div className="text-sm font-mono text-emerald-500/80">
                    {data.role}
                  </div>
                </div>
              </div>

              {/* Right Column: Content & Audio */}
              <div className="flex-1 flex flex-col p-6 md:p-10 overflow-y-auto bg-[#0A0A0A]">
                <div className="flex justify-end mb-4">
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex-1 space-y-8">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">
                      Transmission
                    </h3>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light">
                      {data.longDesc}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">
                      Resonance Profile
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {data.traits.map((trait, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-md border border-white/10 bg-white/5 text-xs font-mono text-white/70"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">
                      Sonic Signature
                    </h3>
                    <AudioPlayer 
                      src={data.audioSrc} 
                      title="Sonic Signature"
                    />
                    <p className="text-xs text-white/20 mt-3 font-mono text-center">
                      ⬢ Web Audio API synthesis engine initialized ⬢
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}