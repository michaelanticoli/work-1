import { motion } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, ExternalLink } from "lucide-react";

interface ZodiacSign {
  name: string;
  symbol: string;
  element: string;
  note: string;
  frequency: number; // Hz
  colorName: string;
  colorHex: string;
  wavelength: number; // nm (nanometers)
  degree: number; // Starting degree on wheel
}

// Chromatic mapping: 12 zodiac signs = 12 notes of chromatic scale
// Starting from C (Aries) at vernal equinox
const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    name: "Aries",
    symbol: "♈",
    element: "Fire",
    note: "C",
    frequency: 261.63,
    colorName: "Red",
    colorHex: "#FF0000",
    wavelength: 700,
    degree: 0,
  },
  {
    name: "Taurus",
    symbol: "♉",
    element: "Earth",
    note: "C#",
    frequency: 277.18,
    colorName: "Red-Orange",
    colorHex: "#FF4500",
    wavelength: 650,
    degree: 30,
  },
  {
    name: "Gemini",
    symbol: "♊",
    element: "Air",
    note: "D",
    frequency: 293.66,
    colorName: "Orange",
    colorHex: "#FFA500",
    wavelength: 600,
    degree: 60,
  },
  {
    name: "Cancer",
    symbol: "♋",
    element: "Water",
    note: "D#",
    frequency: 311.13,
    colorName: "Yellow",
    colorHex: "#FFFF00",
    wavelength: 580,
    degree: 90,
  },
  {
    name: "Leo",
    symbol: "♌",
    element: "Fire",
    note: "E",
    frequency: 329.63,
    colorName: "Yellow-Green",
    colorHex: "#9ACD32",
    wavelength: 560,
    degree: 120,
  },
  {
    name: "Virgo",
    symbol: "♍",
    element: "Earth",
    note: "F",
    frequency: 349.23,
    colorName: "Green",
    colorHex: "#00FF00",
    wavelength: 520,
    degree: 150,
  },
  {
    name: "Libra",
    symbol: "♎",
    element: "Air",
    note: "F#",
    frequency: 369.99,
    colorName: "Cyan",
    colorHex: "#00FFFF",
    wavelength: 490,
    degree: 180,
  },
  {
    name: "Scorpio",
    symbol: "♏",
    element: "Water",
    note: "G",
    frequency: 392.0,
    colorName: "Blue",
    colorHex: "#0000FF",
    wavelength: 450,
    degree: 210,
  },
  {
    name: "Sagittarius",
    symbol: "♐",
    element: "Fire",
    note: "G#",
    frequency: 415.3,
    colorName: "Indigo",
    colorHex: "#4B0082",
    wavelength: 430,
    degree: 240,
  },
  {
    name: "Capricorn",
    symbol: "♑",
    element: "Earth",
    note: "A",
    frequency: 440.0,
    colorName: "Violet",
    colorHex: "#8B00FF",
    wavelength: 400,
    degree: 270,
  },
  {
    name: "Aquarius",
    symbol: "♒",
    element: "Air",
    note: "A#",
    frequency: 466.16,
    colorName: "UV-Magenta",
    colorHex: "#FF00FF",
    wavelength: 380,
    degree: 300,
  },
  {
    name: "Pisces",
    symbol: "♓",
    element: "Water",
    note: "B",
    frequency: 493.88,
    colorName: "Magenta-Red",
    colorHex: "#FF1493",
    wavelength: 720,
    degree: 330,
  },
];

export function AspectHarmonizer() {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const [hoveredSign, setHoveredSign] = useState<ZodiacSign | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    // Initialize AudioContext
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };
    document.addEventListener("click", initAudio, { once: true });
    return () => document.removeEventListener("click", initAudio);
  }, []);

  useEffect(() => {
    drawZodiacWheel();
  }, [selectedSign, hoveredSign]);

  const drawZodiacWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const outerRadius = Math.min(centerX, centerY) - 30;
    const innerRadius = outerRadius * 0.65;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw zodiac sign segments
    ZODIAC_SIGNS.forEach((sign, index) => {
      const startAngle = ((sign.degree - 90) * Math.PI) / 180;
      const endAngle = ((sign.degree + 30 - 90) * Math.PI) / 180;

      const isSelected = selectedSign?.name === sign.name;
      const isHovered = hoveredSign?.name === sign.name;

      // Draw segment
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      ctx.closePath();

      // Create gradient for each segment
      const gradient = ctx.createRadialGradient(centerX, centerY, innerRadius, centerX, centerY, outerRadius);
      gradient.addColorStop(0, `${sign.colorHex}00`);
      gradient.addColorStop(1, `${sign.colorHex}${isSelected ? '80' : isHovered ? '50' : '30'}`);
      
      ctx.fillStyle = gradient;
      ctx.fill();

      // Segment border
      ctx.strokeStyle = isSelected ? sign.colorHex : isHovered ? `${sign.colorHex}AA` : "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.stroke();

      // Draw symbol
      const midAngle = ((sign.degree + 15 - 90) * Math.PI) / 180;
      const symbolRadius = (outerRadius + innerRadius) / 2;
      const symbolX = centerX + Math.cos(midAngle) * symbolRadius;
      const symbolY = centerY + Math.sin(midAngle) * symbolRadius;

      ctx.fillStyle = isSelected || isHovered ? sign.colorHex : "rgba(255, 255, 255, 0.6)";
      ctx.font = "20px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(sign.symbol, symbolX, symbolY);

      // Draw glow for selected sign
      if (isSelected) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = sign.colorHex;
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
        ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
        ctx.closePath();
        ctx.strokeStyle = sign.colorHex;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw center text
    if (selectedSign || hoveredSign) {
      const sign = selectedSign || hoveredSign;
      ctx.fillStyle = sign!.colorHex;
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(sign!.name, centerX, centerY - 25);

      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.font = "12px monospace";
      ctx.fillText(sign!.note, centerX, centerY - 5);
      ctx.fillText(`${sign!.frequency.toFixed(2)} Hz`, centerX, centerY + 10);
      ctx.fillText(`${sign!.wavelength} nm`, centerX, centerY + 25);
    } else {
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.font = "11px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Chromatic Zodiac", centerX, centerY - 5);
      ctx.fillText("Click to explore", centerX, centerY + 10);
    }

    // Draw degree markers
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.font = "9px monospace";
    for (let i = 0; i < 12; i++) {
      const angle = ((i * 30 - 90) * Math.PI) / 180;
      const labelRadius = outerRadius + 15;
      const labelX = centerX + Math.cos(angle) * labelRadius;
      const labelY = centerY + Math.sin(angle) * labelRadius;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${i * 30}°`, labelX, labelY);
    }
  };

  const playFrequency = (sign: ZodiacSign) => {
    if (!audioContextRef.current || isMuted) return;

    stopFrequency();
    setIsPlaying(true);
    setSelectedSign(sign);

    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = sign.frequency;

    gainNode.gain.value = 0;
    gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 2);

    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;

    setTimeout(() => {
      setIsPlaying(false);
    }, 2000);
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

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const outerRadius = Math.min(centerX, centerY) - 30;
    const innerRadius = outerRadius * 0.65;

    if (distance >= innerRadius && distance <= outerRadius) {
      let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      if (angle < 0) angle += 360;

      const clickedSign = ZODIAC_SIGNS.find(sign => {
        const start = sign.degree;
        const end = sign.degree + 30;
        return angle >= start && angle < end;
      });

      if (clickedSign) {
        playFrequency(clickedSign);
      }
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const outerRadius = Math.min(centerX, centerY) - 30;
    const innerRadius = outerRadius * 0.65;

    if (distance >= innerRadius && distance <= outerRadius) {
      let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      if (angle < 0) angle += 360;

      const hoveredSignData = ZODIAC_SIGNS.find(sign => {
        const start = sign.degree;
        const end = sign.degree + 30;
        return angle >= start && angle < end;
      });

      setHoveredSign(hoveredSignData || null);
    } else {
      setHoveredSign(null);
    }
  };

  return (
    <div className="relative h-[400px] rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden flex flex-col group">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/10 via-fuchsia-900/5 to-transparent" />

      {/* Header */}
      <div className="absolute top-6 left-6 z-10">
        <h3 className="text-xl tracking-tight font-medium flex items-center gap-2">
          <span className="text-violet-300/50">⬡</span>
          Chromatic Zodiac Wheel
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Sign → Note → Frequency → Wavelength mapping
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
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-6 right-6 z-20 p-2 text-white/50 hover:text-white transition-colors"
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      {/* Interactive Wheel */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <canvas
          ref={canvasRef}
          width={350}
          height={350}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={() => setHoveredSign(null)}
          className="cursor-pointer"
          style={{ filter: "drop-shadow(0 0 30px rgba(139, 92, 246, 0.2))" }}
        />
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-6 w-full px-6 flex justify-between items-center z-10 text-[10px] text-violet-200/50 font-mono tracking-widest">
        <div>
          {selectedSign ? (
            <>
              SIGN: {selectedSign.symbol} {selectedSign.name.toUpperCase()} <br />
              SPECTRUM: {selectedSign.element.toUpperCase()} · {selectedSign.colorName.toUpperCase()}
            </>
          ) : (
            <>
              CHROMATIC_SCALE: C → B <br />
              INTERACTION: CLICK_SEGMENT_TO_PLAY
            </>
          )}
        </div>
        <div className="flex gap-1 h-6 items-end">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="w-0.5 rounded-full"
              style={{
                backgroundColor: ZODIAC_SIGNS[i].colorHex,
                opacity: 0.6,
              }}
              animate={{
                height: isPlaying && selectedSign?.name === ZODIAC_SIGNS[i].name ? [4, 20, 4] : 4,
              }}
              transition={{
                duration: 0.5,
                repeat: isPlaying && selectedSign?.name === ZODIAC_SIGNS[i].name ? Infinity : 0,
                delay: i * 0.05,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}