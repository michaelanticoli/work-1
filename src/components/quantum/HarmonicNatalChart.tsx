import { motion } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, ExternalLink } from "lucide-react";

interface Planet {
  name: string;
  symbol: string;
  orbitalPeriod: number; // Earth years
  frequency: number; // Hz (octave transposed to audible range)
  color: string;
  wavelength: number; // nm
  distance: number; // AU from sun
}

// Planetary frequencies based on orbital periods
// Calculated using: f = 1 / (orbital_period * seconds_per_year)
// Then transposed up multiple octaves to audible range
const PLANETS: Planet[] = [
  {
    name: "Sun",
    symbol: "☉",
    orbitalPeriod: 0, // Center
    frequency: 126.22, // OM tone, 32nd octave of Earth year
    color: "#FFD700",
    wavelength: 580,
    distance: 0,
  },
  {
    name: "Mercury",
    symbol: "☿",
    orbitalPeriod: 0.241,
    frequency: 141.27,
    color: "#B0C4DE",
    wavelength: 470,
    distance: 0.39,
  },
  {
    name: "Venus",
    symbol: "♀",
    orbitalPeriod: 0.615,
    frequency: 221.23,
    color: "#FFB6C1",
    wavelength: 650,
    distance: 0.72,
  },
  {
    name: "Earth",
    symbol: "⊕",
    orbitalPeriod: 1.0,
    frequency: 136.10, // C# - Earth year frequency
    color: "#4169E1",
    wavelength: 475,
    distance: 1.0,
  },
  {
    name: "Mars",
    symbol: "♂",
    orbitalPeriod: 1.881,
    frequency: 144.72,
    color: "#CD5C5C",
    wavelength: 700,
    distance: 1.52,
  },
  {
    name: "Jupiter",
    symbol: "♃",
    orbitalPeriod: 11.862,
    frequency: 183.58,
    color: "#DAA520",
    wavelength: 590,
    distance: 5.2,
  },
  {
    name: "Saturn",
    symbol: "♄",
    orbitalPeriod: 29.457,
    frequency: 147.85,
    color: "#F0E68C",
    wavelength: 570,
    distance: 9.54,
  },
];

export function HarmonicNatalChart() {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };
    document.addEventListener("click", initAudio, { once: true });
    return () => document.removeEventListener("click", initAudio);
  }, []);

  const playPlanetFrequency = (planet: Planet) => {
    if (!audioContextRef.current || isMuted) return;

    stopFrequency();
    setIsPlaying(true);
    setSelectedPlanet(planet);

    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = planet.frequency;

    gainNode.gain.value = 0;
    gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 3);

    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;

    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };

  const stopFrequency = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch (e) {
        // Already stopped
      }
      oscillatorRef.current = null;
    }
    setIsPlaying(false);
  };

  return (
    <div className="relative h-[400px] rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden flex flex-col group">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-orange-900/5 to-transparent" />

      {/* Header */}
      <div className="absolute top-6 left-6 z-10">
        <h3 className="text-xl tracking-tight font-medium flex items-center gap-2">
          <span className="text-amber-300/50">◬</span>
          Planetary Frequency Synthesizer
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Orbital periods → audible frequencies
        </p>
      </div>

      <a
        href="https://sonic-dna.created.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-6 right-14 z-20 p-2 text-white/50 hover:text-white transition-colors"
        title="Launch Sonic DNA"
      >
        <ExternalLink className="w-5 h-5" />
      </a>

      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-6 right-6 z-20 p-2 text-white/50 hover:text-white transition-colors"
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      {/* Solar System Diagram */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="relative w-80 h-80">
          {/* Orbital rings */}
          {PLANETS.filter(p => p.distance > 0).map((planet, i) => (
            <motion.div
              key={`orbit-${planet.name}`}
              className="absolute inset-0 rounded-full border border-white/5"
              style={{
                width: `${planet.distance * 70}px`,
                height: `${planet.distance * 70}px`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            />
          ))}

          {/* Sun at center */}
          <motion.button
            onClick={() => playPlanetFrequency(PLANETS[0])}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-serif"
              style={{
                backgroundColor: PLANETS[0].color,
                boxShadow: `0 0 20px ${PLANETS[0].color}`,
              }}
              animate={{
                boxShadow: selectedPlanet?.name === "Sun" && isPlaying 
                  ? [`0 0 20px ${PLANETS[0].color}`, `0 0 40px ${PLANETS[0].color}`, `0 0 20px ${PLANETS[0].color}`]
                  : `0 0 20px ${PLANETS[0].color}`,
              }}
              transition={{ duration: 1, repeat: selectedPlanet?.name === "Sun" && isPlaying ? Infinity : 0 }}
            >
              {PLANETS[0].symbol}
            </motion.div>
          </motion.button>

          {/* Planets */}
          {PLANETS.filter(p => p.distance > 0).map((planet, i) => {
            const angle = (i * 360) / 6; // Distribute around circle
            const rad = (angle * Math.PI) / 180;
            const distance = planet.distance * 35; // Scale to pixels
            const x = Math.cos(rad) * distance;
            const y = Math.sin(rad) * distance;

            return (
              <motion.button
                key={planet.name}
                onClick={() => playPlanetFrequency(planet)}
                className="absolute top-1/2 left-1/2 z-20 group/planet"
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                }}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
              >
                <motion.div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-serif cursor-pointer"
                  style={{
                    backgroundColor: planet.color,
                    border: `1px solid ${planet.color}88`,
                  }}
                  animate={{
                    boxShadow: selectedPlanet?.name === planet.name && isPlaying 
                      ? [`0 0 10px ${planet.color}`, `0 0 25px ${planet.color}`, `0 0 10px ${planet.color}`]
                      : `0 0 10px ${planet.color}44`,
                  }}
                  transition={{ duration: 1, repeat: selectedPlanet?.name === planet.name && isPlaying ? Infinity : 0 }}
                >
                  {planet.symbol}
                </motion.div>
                
                {/* Planet label on hover */}
                <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 opacity-0 group-hover/planet:opacity-100 transition-opacity whitespace-nowrap">
                  <div className="text-[9px] font-mono text-white/60 bg-black/80 px-2 py-0.5 rounded">
                    {planet.name}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Data Display */}
      <div className="absolute bottom-6 w-full px-6 z-10">
        <div className="text-[10px] text-amber-200/50 font-mono tracking-widest">
          {selectedPlanet ? (
            <div className="space-y-1">
              <div>CELESTIAL_BODY: {selectedPlanet.symbol} {selectedPlanet.name.toUpperCase()}</div>
              <div className="flex justify-between">
                <span>ORBITAL_PERIOD: {selectedPlanet.orbitalPeriod.toFixed(3)} Earth years</span>
                <span>FREQUENCY: {selectedPlanet.frequency.toFixed(2)} Hz</span>
              </div>
              <div className="flex justify-between">
                <span>DISTANCE: {selectedPlanet.distance.toFixed(2)} AU</span>
                <span>WAVELENGTH: {selectedPlanet.wavelength} nm</span>
              </div>
            </div>
          ) : (
            <>
              HARMONIC_SYSTEM: HELIOCENTRIC <br />
              INTERACTION: CLICK_PLANET_TO_SYNTHESIZE
            </>
          )}
        </div>
      </div>
    </div>
  );
}