import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Settings, ExternalLink, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";

interface Planet {
  id: string;
  name: string;
  radius: number;
  distance: number;
  color: string;
  speed: number;
  symbol: string;
  mode: string;
  baseNote: string;
  tempo: number;
  element: string;
  description: string;
}

interface Aspect {
  planet1: string;
  planet2: string;
  angle: number;
  type: string;
  color: string;
}

const PLANETS: Planet[] = [
  {
    id: "sun",
    name: "Sun",
    radius: 16,
    distance: 0,
    color: "#fbbf24",
    speed: 0,
    symbol: "☉",
    mode: "Ionian",
    baseNote: "E",
    tempo: 120,
    element: "Fire",
    description: "The radiant center resonates with pure Ionian harmonies in E major. Embodies vitality and the spark of consciousness.",
  },
  {
    id: "mercury",
    name: "Mercury",
    radius: 4,
    distance: 60,
    color: "#9ca3af",
    speed: 4.1,
    symbol: "☿",
    mode: "Mixolydian",
    baseNote: "D",
    tempo: 130,
    element: "Air",
    description: "Swift messenger dancing in rapid Mixolydian patterns. Enhances communication and lightning-fast mental connections.",
  },
  {
    id: "venus",
    name: "Venus",
    radius: 8,
    distance: 85,
    color: "#fde047",
    speed: 1.6,
    symbol: "♀",
    mode: "Lydian",
    baseNote: "G",
    tempo: 70,
    element: "Earth",
    description: "The cosmic muse weaves ethereal Lydian melodies that open the heart center through harmonic attraction.",
  },
  {
    id: "earth",
    name: "Earth",
    radius: 8,
    distance: 120,
    color: "#3b82f6",
    speed: 1,
    symbol: "⊕",
    mode: "Dorian",
    baseNote: "C",
    tempo: 80,
    element: "Earth",
    description: "Home world pulses with fundamental Dorian mode in C—the cosmic root note grounding celestial energies.",
  },
  {
    id: "mars",
    name: "Mars",
    radius: 5,
    distance: 170,
    color: "#ef4444",
    speed: 0.53,
    symbol: "♂",
    mode: "Phrygian",
    baseNote: "C",
    tempo: 160,
    element: "Fire",
    description: "The red warrior burns with intense Phrygian fire, driving action and catalyzing transformation through force.",
  },
  {
    id: "jupiter",
    name: "Jupiter",
    radius: 14,
    distance: 240,
    color: "#f97316",
    speed: 0.084,
    symbol: "♃",
    mode: "Lydian",
    baseNote: "A",
    tempo: 100,
    element: "Fire",
    description: "The Great Benefic expands consciousness through majestic Lydian harmonies, attracting abundance and wisdom.",
  },
  {
    id: "saturn",
    name: "Saturn",
    radius: 12,
    distance: 300,
    color: "#eab308",
    speed: 0.034,
    symbol: "♄",
    mode: "Dorian",
    baseNote: "B",
    tempo: 60,
    element: "Earth",
    description: "Wise teacher resonating with structured Dorian progressions, crystallizing intentions through discipline.",
  },
];

// Astrological aspect definitions with glyphs
const ASPECT_TYPES = [
  { angle: 0, tolerance: 10, name: "Conjunction", glyph: "☌", color: "rgba(255, 255, 255, 0.8)" },
  { angle: 60, tolerance: 6, name: "Sextile", glyph: "⚹", color: "rgba(74, 222, 128, 0.7)" },
  { angle: 90, tolerance: 8, name: "Square", glyph: "□", color: "rgba(239, 68, 68, 0.8)" },
  { angle: 120, tolerance: 8, name: "Trine", glyph: "△", color: "rgba(129, 140, 248, 0.8)" },
  { angle: 180, tolerance: 10, name: "Opposition", glyph: "☍", color: "rgba(249, 115, 22, 0.8)" },
  { angle: 150, tolerance: 3, name: "Quincunx", glyph: "⚻", color: "rgba(192, 132, 252, 0.7)" },
];

export function StellarOrbiter() {
  const [isPlaying, setIsPlaying] = useState(true); // Start playing automatically
  const [speed, setSpeed] = useState(1);
  const [scale, setScale] = useState(1);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showAspects, setShowAspects] = useState(true);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [showControls, setShowControls] = useState(false);
  const [time, setTime] = useState(0);
  const [aspects, setAspects] = useState<Aspect[]>([]);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 400 });
  const requestRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Track container size for accurate aspect line rendering
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const animate = () => {
      if (isPlaying) {
        setTime((prev) => prev + 0.01 * speed);
      }
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, speed]);

  // Calculate geocentric angles for aspect detection
  const calculateGeocentricAngle = (planet: Planet) => {
    if (planet.id === "earth") return 0;
    
    // Calculate heliocentric position first
    const helioAngle = time * planet.speed * (Math.PI / 180);
    
    // Convert to geocentric (from Earth's perspective)
    const earthAngle = time * PLANETS.find(p => p.id === "earth")!.speed * (Math.PI / 180);
    const geocentricAngle = helioAngle - earthAngle;
    
    // Convert to degrees and normalize
    return ((geocentricAngle * 180 / Math.PI) % 360 + 360) % 360;
  };

  // Detect aspects based on geocentric positions
  useEffect(() => {
    const detectedAspects: Aspect[] = [];
    
    PLANETS.forEach((p1, i) => {
      PLANETS.forEach((p2, j) => {
        if (i >= j) return; // Avoid duplicates
        
        const angle1 = calculateGeocentricAngle(p1);
        const angle2 = calculateGeocentricAngle(p2);
        
        let angleDiff = Math.abs(angle1 - angle2);
        if (angleDiff > 180) angleDiff = 360 - angleDiff;
        
        ASPECT_TYPES.forEach(aspectType => {
          const diff = Math.abs(angleDiff - aspectType.angle);
          if (diff <= aspectType.tolerance) {
            detectedAspects.push({
              planet1: p1.id,
              planet2: p2.id,
              angle: angleDiff,
              type: aspectType.name,
              color: aspectType.color
            });
          }
        });
      });
    });
    
    setAspects(detectedAspects);
  }, [time]);

  const calculatePosition = (planet: Planet) => {
    if (planet.distance === 0) return { x: 0, y: 0 };
    const angle = time * planet.speed * (Math.PI / 180);
    return {
      x: Math.cos(angle) * planet.distance * scale,
      y: Math.sin(angle) * planet.distance * scale,
    };
  };

  const handleReset = () => {
    setTime(0);
    setSpeed(1);
    setScale(1);
    setIsPlaying(false);
  };

  return (
    <>
      <div className="relative h-[400px] rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden flex flex-col group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-transparent" />

        {/* Header */}
        <div className="absolute top-6 left-6 z-10">
          <h3 className="text-xl tracking-tight font-medium flex items-center gap-2">
            <span className="text-indigo-300/50">◎</span>
            Stellar Orbiter
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Geocentric aspect detection system
          </p>
        </div>

        <a
          href="https://quantumelodies.com"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-6 right-14 z-20 p-2 text-white/50 hover:text-white transition-colors"
          title="Visit Quantumelodies"
        >
          <ExternalLink className="w-5 h-5" />
        </a>

        <button
          onClick={() => setShowControls(!showControls)}
          className="absolute top-6 right-6 z-20 p-2 text-white/50 hover:text-white transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* Solar System Canvas */}
        <div ref={containerRef} className="relative z-10 flex-1 flex items-center justify-center overflow-hidden">
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 15 }}>
            {/* Aspect Lines */}
            {showAspects && aspects.map((aspect, i) => {
              const p1 = PLANETS.find(p => p.id === aspect.planet1);
              const p2 = PLANETS.find(p => p.id === aspect.planet2);
              if (!p1 || !p2) return null;
              
              const pos1 = calculatePosition(p1);
              const pos2 = calculatePosition(p2);
              
              const svgWidth = containerSize.width;
              const svgHeight = containerSize.height;
              const centerX = svgWidth / 2;
              const centerY = svgHeight / 2;
              
              return (
                <line
                  key={`${aspect.planet1}-${aspect.planet2}-${i}`}
                  x1={centerX + pos1.x}
                  y1={centerY + pos1.y}
                  x2={centerX + pos2.x}
                  y2={centerY + pos2.y}
                  stroke={aspect.color}
                  strokeWidth="1.5"
                  strokeDasharray={aspect.type === "Quincunx" ? "4 4" : undefined}
                  opacity="0.6"
                  style={{
                    filter: `drop-shadow(0 0 3px ${aspect.color})`
                  }}
                />
              );
            })}
          </svg>

          <div className="relative w-full h-full flex items-center justify-center">
            {/* Orbits */}
            {showOrbits &&
              PLANETS.filter((p) => p.distance > 0).map((planet) => (
                <div
                  key={`orbit-${planet.id}`}
                  className="absolute rounded-full border border-white/10"
                  style={{
                    width: `${planet.distance * 2 * scale}px`,
                    height: `${planet.distance * 2 * scale}px`,
                  }}
                />
              ))}

            {/* Planets */}
            {PLANETS.map((planet) => {
              const pos = calculatePosition(planet);
              return (
                <motion.button
                  key={planet.id}
                  className="absolute rounded-full cursor-pointer hover:scale-110 transition-transform flex items-center justify-center text-xs z-20"
                  style={{
                    width: `${planet.radius * 2}px`,
                    height: `${planet.radius * 2}px`,
                    background: `radial-gradient(circle at 30% 30%, ${planet.color}, ${adjustBrightness(planet.color, -0.3)})`,
                    boxShadow: `0 0 ${planet.radius}px ${planet.color}`,
                    left: `calc(50% + ${pos.x}px)`,
                    top: `calc(50% + ${pos.y}px)`,
                    transform: "translate(-50%, -50%)",
                  }}
                  onClick={() => setSelectedPlanet(planet)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {planet.distance === 0 && (
                    <span className="text-white/70 select-none">{planet.symbol}</span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Control Panel */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-white/10 p-4 z-30 space-y-3"
            >
              <div className="flex items-center gap-4">
                <span className="text-xs text-white/50 min-w-16 font-medium">Speed</span>
                <Slider
                  value={[speed]}
                  onValueChange={([val]) => setSpeed(val)}
                  min={0}
                  max={5}
                  step={0.1}
                  className="flex-1"
                />
                <span className="text-xs text-white/70 min-w-10 font-medium">{speed.toFixed(1)}×</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-white/50 min-w-16 font-medium">Scale</span>
                <Slider
                  value={[scale]}
                  onValueChange={([val]) => setScale(val)}
                  min={0.3}
                  max={1.5}
                  step={0.1}
                  className="flex-1"
                />
                <span className="text-xs text-white/70 min-w-10 font-medium">{scale.toFixed(1)}×</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowOrbits(!showOrbits)}
                  className="text-xs"
                >
                  {showOrbits ? "Hide" : "Show"} Orbits
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAspects(!showAspects)}
                  className="text-xs"
                >
                  {showAspects ? "Hide" : "Show"} Aspects
                </Button>
                <Button variant="outline" size="sm" onClick={handleReset} className="text-xs">
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Reset
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Controls */}
        <div className="absolute bottom-6 w-full px-6 flex justify-between items-center z-10">
          <div className="text-[10px] text-indigo-200/50 font-mono tracking-widest">
            TEMPORAL_FLOW: {isPlaying ? "ACTIVE" : "PAUSED"} <br />
            ASPECTS_DETECTED: {aspects.length}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 fill-white pl-0.5" />
            )}
          </motion.button>
        </div>

        {/* Active Aspects Badge */}
        {aspects.length > 0 && (
          <div className="absolute top-20 right-6 bg-black/80 backdrop-blur-xl border border-white/20 rounded-lg px-3 py-2 z-10 max-w-[200px]">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span className="text-[10px] font-medium tracking-wider">ACTIVE ASPECTS</span>
            </div>
            <div className="space-y-1">
              {aspects.slice(0, 3).map((aspect, i) => {
                const aspectType = ASPECT_TYPES.find(a => a.name === aspect.type);
                return (
                  <div key={i} className="text-[9px] text-white/60 flex items-center gap-1">
                    <span style={{ color: aspect.color }}>{aspectType?.glyph}</span>
                    <span className="capitalize">{PLANETS.find(p => p.id === aspect.planet1)?.name}</span>
                    <span className="text-white/40">-</span>
                    <span className="capitalize">{PLANETS.find(p => p.id === aspect.planet2)?.name}</span>
                  </div>
                );
              })}
              {aspects.length > 3 && (
                <div className="text-[9px] text-white/40">+{aspects.length - 3} more</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Planet Detail Modal */}
      <Dialog open={!!selectedPlanet} onOpenChange={() => setSelectedPlanet(null)}>
        <DialogContent className="bg-black/95 border-white/10 text-white max-w-2xl">
          {selectedPlanet && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl tracking-tight flex items-center gap-3 font-medium">
                  <span className="text-3xl">{selectedPlanet.symbol}</span>
                  {selectedPlanet.name}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Detailed harmonic and astrological data for {selectedPlanet.name}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 mt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/50">Mode:</span>{" "}
                    <span className="text-purple-300 font-medium">{selectedPlanet.mode}</span>
                  </div>
                  <div>
                    <span className="text-white/50">Base Note:</span>{" "}
                    <span className="text-cyan-300 font-medium">{selectedPlanet.baseNote}</span>
                  </div>
                  <div>
                    <span className="text-white/50">Tempo:</span>{" "}
                    <span className="text-pink-300 font-medium">{selectedPlanet.tempo} BPM</span>
                  </div>
                  <div>
                    <span className="text-white/50">Element:</span>{" "}
                    <span className="text-yellow-300 font-medium">{selectedPlanet.element}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm text-white/50 mb-2 font-medium">Harmonic Signature</h4>
                  <p className="text-sm leading-relaxed text-white/80">
                    {selectedPlanet.description}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function adjustBrightness(color: string, amount: number): string {
  const num = parseInt(color.replace("#", ""), 16);
  let r = (num >> 16) + amount * 255;
  let g = ((num >> 8) & 0x00ff) + amount * 255;
  let b = (num & 0x0000ff) + amount * 255;

  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
}