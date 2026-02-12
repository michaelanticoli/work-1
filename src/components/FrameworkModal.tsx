import { motion, AnimatePresence } from "motion/react";
import { X, ExternalLink, ArrowRight } from "lucide-react";
import { useEffect } from "react";

export interface FrameworkData {
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  href: string;
  images: string[];
  features: string[];
}

interface FrameworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: FrameworkData | null;
}

export function FrameworkModal({ isOpen, onClose, data }: FrameworkModalProps) {
  if (!data) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-4 md:inset-10 z-50 bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden flex flex-col max-w-7xl mx-auto shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-white/10 bg-black/50">
              <div>
                <div className="text-emerald-500/80 text-xs font-mono uppercase tracking-widest mb-1">
                  System Architecture
                </div>
                <h2 className="text-2xl md:text-3xl font-light tracking-tight text-white">
                  {data.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Left Column: Text Content */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-mono text-white/80 mb-4">
                      {data.subtitle}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {data.longDescription}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-white/40">
                      Core Components
                    </h4>
                    <ul className="grid gap-3">
                      {data.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className="pt-8">
                    <a
                      href={data.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-6 py-3 bg-white text-black rounded-full hover:bg-emerald-400 transition-colors font-medium group"
                    >
                      <span>Explore System</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>

                {/* Right Column: Image Gallery */}
                <div className="space-y-6">
                  {/* Main Image */}
                  <div className="aspect-video w-full rounded-lg overflow-hidden border border-white/10 bg-white/5">
                    <img
                      src={data.images[0]}
                      alt={data.title}
                      className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-700"
                    />
                  </div>

                  {/* Grid of smaller images */}
                  <div className="grid grid-cols-2 gap-4">
                    {data.images.slice(1).map((img, idx) => (
                      <div
                        key={idx}
                        className="aspect-square rounded-lg overflow-hidden border border-white/10 bg-white/5 group"
                      >
                        <img
                          src={img}
                          alt={`${data.title} detail ${idx + 1}`}
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 hover:scale-105 transform"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
