import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, RotateCcw, Maximize2, X, Sparkles } from "lucide-react";

interface Planet {
  id: string;
  name: string;
  radius: number;
  distance: number;
  color: string;
  speed: number;
  mode: string;
  baseNote: string;
  zodiac: string;
  element: string;
  description: string;
  keywords: string[];
}

const planets: Planet[] = [
  {
    id: "sun",
    name: "Sun",
    radius: 12,
    distance: 180,
    color: "#FFD700",
    speed: 0.3,
    mode: "Ionian (Major)",
    baseNote: "E",
    zodiac: "Leo",
    element: "Fire",
    description: "The Sun resonates with the Ionian mode in E, embodying vitality and creative expression.",
    keywords: ["Leadership", "Vitality", "Ego", "Self-expression"]
  },
  {
    id: "mercury",
    name: "Mercury",
    radius: 5,
    distance: 70,
    color: "#AAAAAA",
    speed: 1.2,
    mode: "Mixolydian",
    baseNote: "D",
    zodiac: "Gemini",
    element: "Air",
    description: "Mercury's rapid patterns in D create neural pathways for quick thinking.",
    keywords: ["Communication", "Intellect", "Adaptability"]
  },
  {
    id: "venus",
    name: "Venus",
    radius: 8,
    distance: 110,
    color: "#FFCC99",
    speed: 0.8,
    mode: "Lydian",
    baseNote: "G",
    zodiac: "Taurus",
    element: "Earth",
    description: "Venus embodies harmony through flowing Lydian progressions in G.",
    keywords: ["Love", "Beauty", "Harmony", "Values"]
  },
  {
    id: "earth",
    name: "Earth",
    radius: 16,
    distance: 0,
    color: "#2E8B57",
    speed: 0,
    mode: "Dorian",
    baseNote: "C",
    zodiac: "Virgo",
    element: "Earth",
    description: "Earth resonates with the balanced Dorian mode in C, the center of our observation.",
    keywords: ["Grounding", "Manifestation", "Stability"]
  },
  {
    id: "mars",
    name: "Mars",
    radius: 7,
    distance: 150,
    color: "#DC143C",
    speed: 0.5,
    mode: "Phrygian",
    baseNote: "C",
    zodiac: "Aries",
    element: "Fire",
    description: "Mars pulses with the intense Phrygian mode, driving action.",
    keywords: ["Action", "Courage", "Energy", "Transformation"]
  },
  {
    id: "jupiter",
    name: "Jupiter",
    radius: 14,
    distance: 220,
    color: "#FFA500",
    speed: 0.2,
    mode: "Lydian",
    baseNote: "A",
    zodiac: "Sagittarius",
    element: "Fire",
    description: "Jupiter's expansive harmonies in A resonate with wisdom.",
    keywords: ["Wisdom", "Expansion", "Abundance"]
  },
  {
    id: "saturn",
    name: "Saturn",
    radius: 12,
    distance: 260,
    color: "#DAA520",
    speed: 0.15,
    mode: "Dorian",
    baseNote: "B",
    zodiac: "Capricorn",
    element: "Earth",
    description: "Saturn's structured progressions in B teach patience.",
    keywords: ["Discipline", "Structure", "Mastery"]
  }
];

export function SolarSystemExplorer() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [time, setTime] = useState(0);
  const [showOrbits, setShowOrbits] = useState(true);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setTime(t => t + 0.01 * speed);
    }, 16);

    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const calculatePosition = (planet: Planet) => {
    if (planet.id === "sun") return { x: 0, y: 0 };
    
    const angle = time * planet.speed;
    const x = Math.cos(angle) * planet.distance;
    const y = Math.sin(angle) * planet.distance;
    
    return { x, y };
  };

  const handleReset = () => {
    setTime(0);
    setSpeed(1);
    setSelectedPlanet(null);
  };

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-b from-black via-[#0a0a1e] to-black rounded-2xl border border-white/10 overflow-hidden">
      {/* Starfield Background */}
      <div className="absolute inset-0">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-[1px] h-[1px] bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.4 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Solar System Canvas */}
      <div 
        ref={canvasRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        {/* Orbits */}
        {showOrbits && planets.filter(p => p.id !== "earth" && p.distance > 0).map((planet) => (
          <div
            key={`orbit-${planet.id}`}
            className="absolute border border-dashed border-white/10 rounded-full"
            style={{
              width: `${planet.distance * 2}px`,
              height: `${planet.distance * 2}px`,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}

        {/* Planets */}
        {planets.map((planet) => {
          const pos = calculatePosition(planet);
          
          return (
            <motion.div
              key={planet.id}
              className="absolute cursor-pointer group"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`
              }}
              onClick={() => setSelectedPlanet(planet)}
              whileHover={{ scale: 1.2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Planet */}
              <div
                className="rounded-full relative"
                style={{
                  width: `${planet.radius * 2}px`,
                  height: `${planet.radius * 2}px`,
                  backgroundColor: planet.color,
                  boxShadow: `0 0 ${planet.radius * 2}px ${planet.color}80`
                }}
              >
                {planet.id === "sun" && (
                  <div className="absolute inset-0 rounded-full animate-pulse bg-gradient-to-r from-yellow-400/20 to-transparent" />
                )}
              </div>

              {/* Label */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/70 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                {planet.name}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/80 backdrop-blur-xl border border-white/20 rounded-full px-6 py-3">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-24 h-1 bg-white/20 rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
              [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0"
          />
          <span className="text-xs text-white/70 w-10 font-medium">{speed.toFixed(1)}x</span>
        </div>

        <button
          onClick={() => setShowOrbits(!showOrbits)}
          className={`px-3 py-1 rounded-full text-xs transition-colors font-medium ${
            showOrbits ? 'bg-white/20 text-white' : 'text-white/50 hover:bg-white/10'
          }`}
        >
          Orbits
        </button>

        <button
          onClick={handleReset}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Info Badge */}
      <div className="absolute top-6 left-6 bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-medium tracking-wider">COSMIC HARMONICS</span>
        </div>
        <div className="text-xs text-white/60">
          {selectedPlanet ? (
            <div>
              <div className="text-white font-medium mb-1">{selectedPlanet.name}</div>
              <div>{selectedPlanet.mode} • {selectedPlanet.baseNote}</div>
            </div>
          ) : (
            <div>Click a planet to explore</div>
          )}
        </div>
      </div>

      {/* Planet Info Modal */}
      <AnimatePresence>
        {selectedPlanet && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10"
              onClick={() => setSelectedPlanet(null)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md
                bg-gradient-to-br from-[#0a0a1e] to-black border border-white/20 rounded-2xl p-6 z-20"
            >
              <button
                onClick={() => setSelectedPlanet(null)}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: selectedPlanet.color,
                    boxShadow: `0 0 30px ${selectedPlanet.color}80`
                  }}
                />
                <div>
                  <h3 className="text-2xl font-medium mb-1">{selectedPlanet.name}</h3>
                  <div className="text-sm text-white/60">
                    {selectedPlanet.zodiac} • {selectedPlanet.element}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-xs text-white/40 uppercase tracking-wider mb-1 font-medium">
                    Quantumelodic Signature
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-white/60">Mode:</span>{" "}
                      <span className="text-blue-400">{selectedPlanet.mode}</span>
                    </div>
                    <div>
                      <span className="text-white/60">Note:</span>{" "}
                      <span className="text-blue-400">{selectedPlanet.baseNote}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-white/40 uppercase tracking-wider mb-2 font-medium">
                    Description
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">
                    {selectedPlanet.description}
                  </p>
                </div>

                <div>
                  <div className="text-xs text-white/40 uppercase tracking-wider mb-2 font-medium">
                    Archetypal Keywords
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedPlanet.keywords.map((keyword, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-white/10 rounded-full text-xs border border-white/10"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}