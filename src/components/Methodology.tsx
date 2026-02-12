import { motion } from "motion/react";
import { Combine } from "lucide-react";

export function Methodology() {
  return (
    <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto border-b border-white/5">
      <div className="grid lg:grid-cols-2 gap-20 items-start">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-3 text-white/50 uppercase tracking-[0.25em] text-sm font-medium font-mono mb-8">
            <Combine className="w-5 h-5" />
            <span>Methodology</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight leading-[1.15] mb-8">
            Brand Alchemy & <br />
            <span className="text-white/60">Systems of Meaning</span>
          </h2>
          <div className="prose prose-invert prose-lg text-muted-foreground">
            <p className="mb-6 text-base md:text-lg leading-relaxed">
              Michael's foundation as a Creative Technologist places him at the crossroads of culture, clarity, and creativity. His approach is simple: brands are living systems—intentional, connective, and built to evolve.
            </p>
            <p className="text-base md:text-lg leading-relaxed">
              His methodology, <strong className="font-semibold">Creative Alchemy</strong>, acts as a structured framework for transformation. Inspired by classical alchemical processes—dissolution, purification, illumination, and manifestation—it guides concepts from ambiguity to resonance.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          <div className="py-12 px-8 lg:px-16 text-center">
            <blockquote className="text-2xl md:text-3xl font-serif italic text-white/90 leading-relaxed mb-8">
              "Everything we build — whether sound, brand, or being — is a frequency. My work is about tuning that frequency to truth."
            </blockquote>
            <cite className="not-italic text-sm font-mono tracking-widest text-emerald-500 uppercase">
              — Michael Anticoli
            </cite>
          </div>
        </motion.div>
      </div>
    </section>
  );
}