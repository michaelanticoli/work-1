import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { motion } from "motion/react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface AudioPlayerProps {
  src: string;
  title?: string;
}

export function AudioPlayer({ src, title }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [frequencyData, setFrequencyData] = useState<Uint8Array>(new Uint8Array(32));
  const [waveformData, setWaveformData] = useState<Uint8Array>(new Uint8Array(64));
  const [dominantFrequency, setDominantFrequency] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>("");
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number>();

  // Fetch audio URL from Supabase Storage
  useEffect(() => {
    const fetchAudioUrl = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-b5eacdbd/audio/${src}`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          setAudioUrl(data.url);
          setLoadError(false);
        } else {
          console.error("Failed to fetch audio URL:", response.status);
          setLoadError(true);
        }
      } catch (error) {
        console.error("Error fetching audio URL:", error);
        setLoadError(true);
      }
    };

    if (src) {
      fetchAudioUrl();
    }
  }, [src]);

  // Initialize Web Audio API for visualization
  useEffect(() => {
    if (audioRef.current && !sourceRef.current) {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 128;
        analyserRef.current.smoothingTimeConstant = 0.8;

        sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
      } catch (error) {
        console.error("Error initializing Web Audio API:", error);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioUrl]);

  // Analyze audio in real-time
  useEffect(() => {
    const analyze = () => {
      if (analyserRef.current && isPlaying) {
        const freqArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        const waveArray = new Uint8Array(analyserRef.current.fftSize);
        
        analyserRef.current.getByteFrequencyData(freqArray);
        analyserRef.current.getByteTimeDomainData(waveArray);
        
        // Reduce to 32 bars for cleaner visualization
        const reducedFreq = new Uint8Array(32);
        for (let i = 0; i < 32; i++) {
          reducedFreq[i] = freqArray[i * 2];
        }
        
        setFrequencyData(reducedFreq);
        setWaveformData(waveArray);
        
        // Calculate dominant frequency
        const maxIndex = freqArray.indexOf(Math.max(...Array.from(freqArray)));
        const freq = (maxIndex * audioContextRef.current!.sampleRate) / analyserRef.current.fftSize;
        setDominantFrequency(Math.round(freq));
      }
      animationFrameRef.current = requestAnimationFrame(analyze);
    };

    if (isPlaying) {
      analyze();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  const togglePlay = async () => {
    if (audioRef.current) {
      try {
        if (audioContextRef.current?.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          await audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error("Playback error:", error);
        setIsPlaying(false);
        setLoadError(true);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value;
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setProgress((current / total) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      audioRef.current.volume = volume;
      setLoadError(false);
    }
  };

  const handleError = () => {
    console.error("Audio load error for:", src);
    setLoadError(true);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (audioRef.current) {
      const time = (value / 100) * audioRef.current.duration;
      audioRef.current.currentTime = time;
      setProgress(value);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full bg-black/60 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md">
      {loadError ? (
        <div className="p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto">
            <VolumeX className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <p className="text-sm font-mono text-white/60 mb-2">AUDIO FILE UNAVAILABLE</p>
            <p className="text-xs font-mono text-white/30 mb-3">
              Configure audio URL in Personae.tsx
            </p>
          </div>
        </div>
      ) : (
        <>
          <audio
            ref={audioRef}
            src={audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            onError={handleError}
          />
          
          <div className="flex flex-col">
            {/* Waveform Visualizer */}
            <div className="relative h-32 bg-gradient-to-b from-indigo-950/20 to-transparent overflow-hidden">
              {/* Frequency Bars */}
              <div className="absolute inset-0 flex items-end justify-center gap-[2px] px-4 pb-4">
                {Array.from(frequencyData).map((value, i) => {
                  const height = isPlaying ? (value / 255) * 100 : 2;
                  const hue = 180 + (i / 32) * 60;
                  return (
                    <motion.div
                      key={i}
                      className="flex-1 rounded-t-sm"
                      style={{
                        height: `${height}%`,
                        backgroundColor: `hsl(${hue}, 70%, 60%)`,
                        opacity: 0.6 + (value / 255) * 0.4,
                        boxShadow: isPlaying && value > 100 ? `0 0 8px hsl(${hue}, 70%, 60%)` : 'none',
                      }}
                      animate={{
                        height: `${height}%`,
                      }}
                      transition={{
                        duration: 0.1,
                        ease: "easeOut",
                      }}
                    />
                  );
                })}
              </div>

              {/* Waveform Overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                {waveformData.some(v => v !== 128) && (
                  <polyline
                    points={Array.from(waveformData)
                      .map((value, i) => {
                        const x = (i / waveformData.length) * 100;
                        const y = ((value - 128) / 128) * 50 + 50;
                        return `${x}%,${y}%`;
                      })
                      .join(" ")}
                    fill="none"
                    stroke="rgba(147, 197, 253, 0.8)"
                    strokeWidth="1.5"
                  />
                )}
              </svg>

              {/* Grid Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-full" style={{
                  backgroundImage: 'linear-gradient(0deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                  backgroundSize: '100% 20%',
                }} />
              </div>

              {/* Technical Readout */}
              <div className="absolute top-2 right-2 text-[9px] font-mono text-cyan-300/50 tracking-wider space-y-0.5">
                <div>FREQ: {isPlaying ? dominantFrequency : "---"} Hz</div>
                <div>STATUS: {isPlaying ? "STREAMING" : "STANDBY"}</div>
              </div>
            </div>

            {/* Controls */}
            <div className="p-4 space-y-3 bg-black/40">
              {/* Track Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <motion.div 
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                    animate={{
                      scale: isPlaying ? [1, 1.3, 1] : 1,
                      opacity: isPlaying ? [0.7, 1, 0.7] : 0.3,
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <span className="text-xs font-mono text-white/60 uppercase tracking-widest">
                    {title || "Sonic Signature"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-white/30">
                    {formatTime(audioRef.current?.currentTime || 0)}
                  </span>
                  <span className="text-[10px] font-mono text-white/20">⬢</span>
                  <span className="text-[10px] font-mono text-white/30">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>

              {/* Progress Bar with Phase Markers */}
              <div className="relative group">
                <div className="absolute inset-0 bg-white/5 rounded-full h-1 my-auto" />
                
                {/* Phase markers at 25%, 50%, 75% */}
                {[25, 50, 75].map((percent) => (
                  <div
                    key={percent}
                    className="absolute top-1/2 -translate-y-1/2 w-0.5 h-2 bg-white/20 rounded-full"
                    style={{ left: `${percent}%` }}
                  />
                ))}
                
                <motion.div 
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 rounded-full h-1 my-auto"
                  style={{ 
                    width: `${progress}%`,
                    boxShadow: '0 0 8px rgba(99, 102, 241, 0.5)',
                  }}
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleSeek}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
              </div>

              {/* Playback Controls */}
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={togglePlay}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/15 border border-white/20 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-white text-white" />
                  ) : (
                    <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                  )}
                </motion.button>

                {/* Volume Control */}
                <div className="flex-1 flex items-center gap-2">
                  <Volume2 className="w-3.5 h-3.5 text-white/40" />
                  <div className="relative flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="absolute left-0 top-0 bottom-0 bg-white/40 rounded-full"
                      style={{ width: `${volume * 100}%` }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <span className="text-[9px] font-mono text-white/30 min-w-[2ch]">
                    {Math.round(volume * 100)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}