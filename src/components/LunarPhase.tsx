import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function LunarPhase() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Calculate current moon phase (0-1, where 0/1 is new moon, 0.5 is full moon)
    const calculateMoonPhase = () => {
      const knownNewMoon = new Date(2000, 0, 6, 18, 14); // Jan 6, 2000
      const synodicMonth = 29.53058867; // days
      const now = new Date();
      const diff = (now.getTime() - knownNewMoon.getTime()) / 1000 / 60 / 60 / 24;
      const phase = (diff % synodicMonth) / synodicMonth;
      return phase;
    };

    setPhase(calculateMoonPhase());
  }, []);

  // Calculate illumination percentage
  const illumination = phase < 0.5 ? phase * 2 : (1 - phase) * 2;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="relative w-8 h-8"
    >
      {/* Moon circle */}
      <div className="absolute inset-0 rounded-full bg-white/5 border border-white/10" />
      
      {/* Illuminated portion */}
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-white/40 to-white/20 transition-opacity duration-1000"
        style={{
          clipPath: phase < 0.5
            ? `inset(0 ${(1 - illumination) * 50}% 0 0)`
            : `inset(0 0 0 ${(1 - illumination) * 50}%)`,
        }}
      />
      
      {/* Subtle glow */}
      <div className="absolute inset-0 rounded-full blur-md bg-white/5" />
    </motion.div>
  );
}
