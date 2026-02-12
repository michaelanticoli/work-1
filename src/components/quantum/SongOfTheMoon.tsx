import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Play, Pause, Waves, ExternalLink, Volume2 } from "lucide-react";

export function SongOfTheMoon() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodesRef = useRef<GainNode[]>([]);

  useEffect(() => {
    const knownNewMoon = new Date(2000, 0, 6, 18, 14);
    const synodicMonth = 29.53058867;
    const now = new Date();
    const diff = (now.getTime() - knownNewMoon.getTime()) / 1000 / 60 / 60 / 24;
    const currentPhase = (diff % synodicMonth) / synodicMonth;
    setPhase(currentPhase);
  }, []);

  // Audio synthesis based on lunar phase
  useEffect(() => {
    if (isPlaying) {
      // Initialize Web Audio API
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      
      // Resume context if suspended (browser autoplay policy)
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Base frequency derived from lunar phase (432 Hz base + phase modulation)
      const baseFreq = 432 + phase * 50;
      
      // Create multiple oscillators for rich harmonic content
      const frequencies = [
        baseFreq,           // Fundamental
        baseFreq * 1.5,     // Perfect fifth
        baseFreq * 2,       // Octave
        baseFreq * 0.5,     // Sub-octave
      ];

      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        // Different waveforms for each layer
        const waveforms: OscillatorType[] = ['sine', 'triangle', 'sine', 'sine'];
        osc.type = waveforms[i];
        osc.frequency.value = freq;
        
        // Volume levels for each harmonic layer
        const volumes = [0.15, 0.08, 0.05, 0.12];
        gain.gain.value = volumes[i];
        
        // Add subtle vibrato using LFO
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.type = 'sine';
        lfo.frequency.value = 0.5 + i * 0.3; // Slow modulation
        lfoGain.gain.value = 2 + phase * 3; // Phase affects vibrato depth
        
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();
        
        // Connect audio graph
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        
        oscillatorsRef.current.push(osc);
        gainNodesRef.current.push(gain);
      });

      // Add ambient noise layer
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;
      
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.value = 800 + phase * 400;
      
      const noiseGain = ctx.createGain();
      noiseGain.gain.value = 0.03;
      
      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noiseSource.start();
      
      oscillatorsRef.current.push(noiseSource as any);
      gainNodesRef.current.push(noiseGain);

    } else {
      // Stop all oscillators when paused
      oscillatorsRef.current.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
          // Oscillator may already be stopped
        }
      });
      oscillatorsRef.current = [];
      gainNodesRef.current = [];
    }

    // Cleanup on unmount or when stopping
    return () => {
      oscillatorsRef.current.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
          // Oscillator may already be stopped
        }
      });
      oscillatorsRef.current = [];
      gainNodesRef.current = [];
    };
  }, [isPlaying, phase]);

  return (
    <div className="relative h-[400px] rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden flex flex-col group">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent" />
      
      {/* Header */}
      <div className="absolute top-6 left-6 z-10">
        <h3 className="text-xl tracking-tight font-light flex items-center gap-2">
          <Waves className="w-4 h-4 text-blue-300/50" />
          Song of the Moon
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Lunar phase synthesizer
        </p>
      </div>

      <a 
        href="https://digitalchemy.netlify.app" 
        target="_blank" 
        rel="noopener noreferrer"
        className="absolute top-6 right-6 z-20 p-2 text-white/50 hover:text-white transition-colors"
        title="Visit Digital Alchemy"
      >
        <ExternalLink className="w-5 h-5" />
      </a>

      {/* Main Visualizer */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        
        {/* Orbital Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
          {[1, 2, 3].map((i) => (
             <motion.div
               key={i}
               className="absolute rounded-full border border-blue-200/20"
               style={{ width: `${i * 120}px`, height: `${i * 120}px` }}
               animate={{ rotate: isPlaying ? 360 : 0, scale: isPlaying ? [1, 1.02, 1] : 1 }}
               transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear" }}
             />
          ))}
        </div>

        {/* Central Moon Control */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsPlaying(!isPlaying)}
          className="relative w-32 h-32 rounded-full z-20 focus:outline-none"
        >
          {/* Moon Surface */}
          <div className="absolute inset-0 rounded-full bg-slate-800 overflow-hidden shadow-2xl shadow-blue-900/50">
             <div 
               className="absolute inset-0 bg-gray-200 transition-transform duration-1000"
               style={{
                 transform: `translateX(${(phase - 0.5) * 200}%)`,
                 boxShadow: 'inset -20px 0 40px rgba(0,0,0,0.5)'
               }}
             />
             {/* Crater texture overlay */}
             <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          </div>

          {/* Play/Pause Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/40 rounded-full">
            {isPlaying ? <Pause className="fill-white" /> : <Play className="fill-white pl-1" />}
          </div>
        </motion.button>

        {/* Ethereal Waves */}
        <AnimatePresence>
          {isPlaying && (
            <>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute border border-blue-400/30 rounded-full"
                  initial={{ width: "8rem", height: "8rem", opacity: 0.8 }}
                  animate={{ width: "24rem", height: "24rem", opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Data */}
      <div className="absolute bottom-6 w-full px-6 flex justify-between items-end z-10 text-[10px] text-blue-200/50 font-mono tracking-widest">
        <div>
          PHASE_LOCK: {(phase * 100).toFixed(2)}% <br/>
          FREQ: {isPlaying ? (432 + phase * 50).toFixed(2) : "---"} Hz
        </div>
        <div className="flex gap-1 h-8 items-end">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-blue-400/50"
              animate={{ height: isPlaying ? [5, 20 + Math.random() * 20, 5] : 4 }}
              transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.05 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}