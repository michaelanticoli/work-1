import { motion, useInView } from "motion/react";
import { useEffect, useState, useRef } from "react";

export function SparkleTrail() {
  const [particles, setParticles] = useState<Array<{ id: number; delay: number; x: number; y: number }>>([]);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    // Generate sparkle particles
    const sparkles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      delay: i * 0.015,
      x: -10 + i * 2, // Start off-screen left, move right
      y: Math.random() * 30 - 15, // Random vertical offset
    }));
    setParticles(sparkles);
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Main shooting star/comet */}
      <motion.div
        className="absolute w-4 h-4 rounded-full bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500"
        initial={{ x: "-10%", y: "40%", opacity: 0, scale: 0 }}
        animate={isInView ? {
          x: "110%",
          y: "60%",
          opacity: [0, 1, 1, 1, 0.8, 0],
          scale: [0, 2, 1.5, 1.5, 1, 0],
        } : {}}
        transition={{
          duration: 1.8,
          delay: 0.3,
          ease: [0.4, 0, 0.2, 1],
        }}
        style={{
          boxShadow: "0 0 40px rgba(251, 191, 36, 1), 0 0 80px rgba(236, 72, 153, 0.8), 0 0 120px rgba(168, 85, 247, 0.6)",
        }}
      />

      {/* Trail of electric sparkles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: `hsl(${Math.random() * 60 + 180}, 100%, ${60 + Math.random() * 20}%)`,
            boxShadow: "0 0 8px currentColor, 0 0 16px currentColor",
          }}
          initial={{
            x: "-5%",
            y: `calc(50% + ${particle.y}px)`,
            opacity: 0,
            scale: 0,
          }}
          animate={isInView ? {
            x: `${particle.x}%`,
            y: `calc(50% + ${particle.y + Math.sin(particle.id) * 20}px)`,
            opacity: [0, 1, 1, 0.8, 0],
            scale: [0, 2, 1.5, 1, 0],
            rotate: [0, 360],
          } : {}}
          transition={{
            duration: 1.2,
            delay: 0.4 + particle.delay,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Firework burst at the end */}
      <motion.div
        className="absolute"
        initial={{ x: "100%", y: "55%", opacity: 0 }}
        animate={isInView ? { opacity: [0, 1, 1, 0] } : {}}
        transition={{ duration: 1, delay: 1.6 }}
      >
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i / 24) * Math.PI * 2;
          const distance = 60 + Math.random() * 40;
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: `hsl(${45 + Math.random() * 60}, 100%, ${60 + Math.random() * 20}%)`,
                boxShadow: `0 0 12px currentColor, 0 0 24px currentColor`,
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={isInView ? {
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                opacity: [1, 1, 0],
                scale: [1, 0.5, 0],
              } : {}}
              transition={{
                duration: 0.8,
                delay: 1.8,
                ease: "easeOut",
              }}
            />
          );
        })}
      </motion.div>

      {/* Secondary sparkle shower - like sequins falling */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={`sequin-${i}`}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${20 + i * 2}%`,
            background: i % 3 === 0 
              ? "rgba(251, 191, 36, 1)" 
              : i % 3 === 1 
              ? "rgba(236, 72, 153, 1)" 
              : "rgba(167, 139, 250, 1)",
            boxShadow: "0 0 10px currentColor, 0 0 20px currentColor",
          }}
          initial={{ y: "45%", opacity: 0, scale: 0, rotate: 0 }}
          animate={isInView ? {
            y: ["45%", "70%"],
            opacity: [0, 1, 1, 0.5, 0],
            scale: [0, 2, 1.5, 1, 0],
            rotate: [0, 180 + Math.random() * 360],
          } : {}}
          transition={{
            duration: 1.5,
            delay: 1.2 + i * 0.03,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Fizzy electric crackles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={`crackle-${i}`}
          className="absolute"
          style={{
            left: `${30 + i * 4}%`,
            top: `${45 + Math.random() * 15}%`,
          }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: [0, 1, 0, 1, 0, 1, 0] } : {}}
          transition={{
            duration: 0.3,
            delay: 1 + i * 0.05,
            repeat: 1,
          }}
        >
          <div
            className="w-[3px] h-4 bg-yellow-200"
            style={{
              transform: `rotate(${Math.random() * 360}deg)`,
              boxShadow: "0 0 8px rgba(253, 224, 71, 1), 0 0 16px rgba(253, 224, 71, 0.8)",
            }}
          />
        </motion.div>
      ))}

      {/* Disney-style magical dust sweep */}
      <motion.div
        className="absolute w-full h-[200px]"
        style={{
          left: "-20%",
          top: "40%",
          background: "radial-gradient(ellipse 400px 100px at 50% 50%, rgba(251, 191, 36, 0.3), transparent)",
          filter: "blur(20px)",
        }}
        initial={{ x: 0, opacity: 0 }}
        animate={isInView ? {
          x: "140%",
          opacity: [0, 1, 1, 0.5, 0],
        } : {}}
        transition={{
          duration: 2,
          delay: 0.4,
          ease: [0.4, 0, 0.2, 1],
        }}
      />
    </div>
  );
}