import { motion } from "motion/react";
import { useState } from "react";

interface SkillOrbitProps {
  skills: string[];
}

export function SkillOrbit({ skills }: SkillOrbitProps) {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Distribute skills across different orbits dynamically based on count
  const orbitsCount = Math.ceil(skills.length / 6); // ~6 skills per orbit
  const orbits = Array.from({ length: orbitsCount }, (_, i) => i);

  return (
    <div className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
      {/* Starfield background */}
      <div className="absolute inset-0">
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute w-[1px] h-[1px] bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Quantum lattice grid */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.12]" style={{ filter: "blur(0.5px)" }}>
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(99, 102, 241, 0.3)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        {/* Diagonal cross-hatching for quantum effect */}
        <defs>
          <pattern id="diagonal" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="20" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diagonal)" />
      </svg>

      {/* Central silhouette - translucent portrait */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.15] pointer-events-none">
        <div 
          className="w-[350px] h-[450px] bg-gradient-to-b from-indigo-400/40 via-purple-400/30 to-transparent rounded-full blur-3xl"
          style={{
            maskImage: "radial-gradient(ellipse 40% 50% at 50% 40%, black 0%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse 40% 50% at 50% 40%, black 0%, transparent 70%)",
          }}
        />
        {/* Optional: Replace the gradient above with an actual image */}
        {/* <img 
          src="/path/to/your/portrait.jpg" 
          alt=""
          className="w-[350px] h-[450px] object-cover object-center"
          style={{
            maskImage: "radial-gradient(ellipse 50% 60% at 50% 40%, black 20%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 50% 60% at 50% 40%, black 20%, transparent 80%)",
          }}
        /> */}
      </div>

      {/* Animated background shimmer */}
      <motion.div
        className="absolute inset-0 opacity-[0.08]"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.2) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 80%, rgba(99, 102, 241, 0.2) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.2) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      {/* Center core - pulsing */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute w-4 h-4 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 z-10"
        animate={{
          boxShadow: [
            "0 0 20px rgba(99, 102, 241, 0.5)",
            "0 0 40px rgba(139, 92, 246, 0.7)",
            "0 0 20px rgba(99, 102, 241, 0.5)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Orbits - slowly rotating */}
      {orbits.map((orbit) => (
        <motion.div
          key={orbit}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: orbit * 0.15 }}
          className="absolute rounded-full border border-white/10"
          style={{
            width: `${(orbit + 1) * 160}px`,
            height: `${(orbit + 1) * 160}px`,
          }}
          animate={{
            rotate: orbit % 2 === 0 ? 360 : -360,
          }}
          transition={{
            duration: 60 + orbit * 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Skills distributed on orbits - each orbiting independently */}
      {skills.map((skill, index) => {
        // Distribute skills evenly across orbits
        const orbitIndex = Math.floor(index / Math.ceil(skills.length / orbitsCount));
        const skillsInOrbit = skills.filter(
          (_, i) => Math.floor(i / Math.ceil(skills.length / orbitsCount)) === orbitIndex
        );
        const indexInOrbit = index % Math.ceil(skills.length / orbitsCount);
        const angle = (indexInOrbit / skillsInOrbit.length) * 360;

        const radius = (orbitIndex + 1) * 80;

        // Alternate rotation direction per orbit for visual interest
        const rotationDirection = orbitIndex % 2 === 0 ? 1 : -1;
        const rotationSpeed = 40 + orbitIndex * 15;

        return (
          <motion.div
            key={skill}
            className="absolute"
            style={{
              width: `${radius * 2}px`,
              height: `${radius * 2}px`,
            }}
            animate={{
              rotate: rotationDirection * 360,
            }}
            transition={{
              duration: rotationSpeed,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.08 }}
              whileHover={{ scale: 1.3, zIndex: 50 }}
              onHoverStart={() => setHoveredSkill(skill)}
              onHoverEnd={() => setHoveredSkill(null)}
              className="absolute px-3 py-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-xs font-medium cursor-pointer transition-all"
              style={{
                left: `calc(50% + ${Math.cos((angle * Math.PI) / 180) * radius}px)`,
                top: `calc(50% + ${Math.sin((angle * Math.PI) / 180) * radius}px)`,
                transform: "translate(-50%, -50%)",
                backgroundColor:
                  hoveredSkill === skill ? "rgba(99, 102, 241, 0.2)" : "rgba(255, 255, 255, 0.05)",
                borderColor:
                  hoveredSkill === skill ? "rgba(99, 102, 241, 0.5)" : "rgba(255, 255, 255, 0.1)",
              }}
              animate={{
                rotate: rotationDirection * -360,
              }}
              transition={{
                rotate: {
                  duration: rotationSpeed,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
            >
              {skill}
            </motion.div>
          </motion.div>
        );
      })}

      {/* Playful status text */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-white/30 font-mono tracking-wider"
      >
        {hoveredSkill ? (
          <motion.span
            key={hoveredSkill}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-indigo-400/70"
          >
            ✦ {hoveredSkill.toUpperCase()} ✦
          </motion.span>
        ) : (
          <span>
            ORBITAL_VELOCITY: ACTIVE · STATUS: PERPETUAL_MOTION
          </span>
        )}
      </motion.div>

      {/* Cheeky corner annotation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 2 }}
        className="absolute top-6 right-6 text-[10px] text-white/20 font-mono tracking-widest text-right"
      >
        // Always learning,
        <br />
        // never stationary ◎
      </motion.div>
    </div>
  );
}