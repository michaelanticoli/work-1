import { motion } from "motion/react";
import { SongOfTheMoon } from "./SongOfTheMoon";
import { HarmonicNatalChart } from "./HarmonicNatalChart";
import { StellarOrbiter } from "./StellarOrbiter";
import { AspectHarmonizer } from "./AspectHarmonizer";
import { SolarSystemExplorer } from "./SolarSystemExplorer";

export function QuantumelodicInteractive() {
  return (
    <section className="py-32 px-6 lg:px-12 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-20 text-center"
      >
        <h2 className="text-5xl md:text-7xl font-medium tracking-tight mb-6">
          Quantumelodic Lab
        </h2>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Experimental interfaces for metaphysical data processing.
          <br />
          Translating archetypal structures into interactive systems.
        </p>
      </motion.div>

      {/* Featured: Solar System Explorer - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="mb-8"
      >
        <SolarSystemExplorer />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <StellarOrbiter />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <AspectHarmonizer />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <SongOfTheMoon />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <HarmonicNatalChart />
        </motion.div>
      </div>
    </section>
  );
}