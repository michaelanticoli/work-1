// Placeholder images - replace with actual uploaded images via admin panel
const redCasketImage1 =
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1080";
const redCasketImage2 =
  "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=1080";
const redCasketImage3 =
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1080";
const silasGoghImage1 =
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1080";
const silasGoghImage2 =
  "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1080";
const silasGoghImage3 =
  "https://images.unsplash.com/photo-1445985543470-41fba5c3144a?q=80&w=1080";
const brokebackImage1 =
  "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1080";
const brokebackImage2 =
  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1080";
const nadiaBiznessImage =
  "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?q=80&w=1080";
const angBoccaImage =
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1080";
import { motion } from "motion/react";
import {
  Mic2,
  Fingerprint,
  Activity,
  Radio,
  FileText,
  Music,
  Smile,
  ShoppingBag,
  Globe,
} from "lucide-react";
import { useState } from "react";
import { PersonaModal, PersonaData } from "./PersonaModal";

const personae: PersonaData[] = [
  {
    name: "Ang Bocca",
    role: "Synth Pop Architect",
    desc: "AI-hybridized synth-pop vocalist exploring human-machine synthesis through melodic structures and lyrical introspection.",
    longDesc:
      "Ang Bocca represents the intersection of organic vocal performance and artificial intelligence processing. This synth-pop entity investigates the blurred boundary between human expression and machine learning, utilizing AI-enhanced production to create emotional resonance within digital frameworks. The project explores identity, embodiment, and the future of collaborative creativity.",
    trackTitle: "",
    audioSrc: "ang-bocca.mp3", // Upload this file at /admin/audio
    image: angBoccaImage,
    icon: Mic2,
    traits: [
      "Synth Pop",
      "AI-Enhanced",
      "Melodic",
      "Introspective",
    ],
    spotifyUrl: "https://open.spotify.com/artist/ang-bocca", // Update with real link
  },
  {
    name: "Silas Gogh",
    role: "Southern Soul Theorist",
    desc: "Introspective southern soul crooner channeling melancholy intelligence through emotionally sophisticated vocal architecture.",
    longDesc:
      "Silas Gogh embodies the contemplative depth of southern soul tradition filtered through modern existential inquiry. With a voice that carries both warmth and world-weariness, this persona explores themes of longing, loss, and the quiet intelligence of heartbreak. The sonic palette blends classic soul instrumentation with contemporary production sensibilities—smart, sexy, and unapologetically introspective.",
    trackTitle: "",
    audioSrc: "silas-gogh.mp3", // Upload this file at /admin/audio
    image: silasGoghImage1,
    images: [silasGoghImage1, silasGoghImage2, silasGoghImage3],
    icon: FileText,
    traits: ["Soul", "Melancholic", "Intelligent", "Emotive"],
    // Launching this month - link coming soon
  },
  {
    name: "Red Casket Club",
    role: "Polynesian Requiem Collective",
    desc: "Four brothers lost in a Polynesian plane crash, now channeling beachy psychedelic hauntings through laid-back Hawaiian reverie.",
    longDesc:
      "Red Casket Club is a ghost story set to music. Born from tragedy—four brothers whose lives ended in a plane crash during a holiday in Polynesia—this spectral collective produces music that feels simultaneously sun-drenched and otherworldly. The sound is beachy yet haunting, psychedelic yet grounded, classic yet timeless. Drawing from Hawaiian slack-key guitar traditions, vintage surf rock, and cosmic Americana, Red Casket Club exists in the liminal space between memory and myth.",
    trackTitle: "",
    audioSrc: "red-casket-club.mp3", // Upload this file at /admin/audio
    image: redCasketImage1,
    images: [redCasketImage1, redCasketImage2, redCasketImage3],
    icon: Music,
    traits: ["Psychedelic", "Beachy", "Haunting", "Hawaiian"],
    spotifyUrl:
      "https://open.spotify.com/artist/red-casket-club", // Update with real link
  },
  {
    name: "Brokeback Kerouac",
    role: "Appalachian Avant-Garde",
    desc: "Cabin-in-the-woods singer-songwriter merging anthemic Americana with avant-garde chamber pop and experimental sampling.",
    longDesc:
      "Brokeback Kerouac is the sound of isolation transformed into intimacy. Recorded in rustic solitude, this project combines the raw authenticity of Appalachian folk traditions with the conceptual ambition of chamber pop and the textural innovation of modern sampling. Think lonesome highways meeting string quartets, campfire stories deconstructed through tape loops, and the American mythos reimagined through queer sensibility and intellectual rigor.",
    trackTitle: "",
    audioSrc: "brokeback-kerouac.mp3", // Upload this file at /admin/audio
    image: brokebackImage2,
    images: [brokebackImage2, brokebackImage1],
    icon: Smile,
    traits: [
      "Americana",
      "Chamber Pop",
      "Experimental",
      "Anthemic",
    ],
    // Launching after Silas Gogh
  },
  {
    name: "Nadia Bizness",
    role: "Circuit Production Engine",
    desc: "Upbeat dance music architect and innovative remix strategist—from ghostwritten political circuit anthems to club-ready dubs.",
    longDesc:
      "Nadia Bizness is pure kinetic energy compressed into BPM. This production persona specializes in high-octane dance music, inventive remixes, and genre-defying club constructions. Notable work includes ghostwriting for 'Amon Ajari'—a radical circuit music project setting Alexandria Ocasio-Cortez speeches to original production. Nadia operates at the intersection of political theater and dancefloor catharsis, proving that activism and hedonism need not be mutually exclusive.",
    trackTitle: "",
    audioSrc: "nadia-bizness.mp3", // Upload this file at /admin/audio
    image: nadiaBiznessImage,
    icon: ShoppingBag,
    traits: ["Circuit", "Dance", "Remix", "Political"],
    spotifyUrl: "https://open.spotify.com/artist/nadia-bizness", // Update with real link
  },
  {
    name: "Amon Ajari",
    role: "Political Sonic Rhetoric",
    desc: "Circuit music manifestation of progressive political discourse—Alexandria Ocasio-Cortez speeches transmuted into dancefloor activism.",
    longDesc:
      "Amon Ajari is an experiment in radical contextualization. By taking the impassioned speeches of Alexandria Ocasio-Cortez and setting them to original circuit music production (ghostwritten by Nadia Bizness), this project transforms political rhetoric into embodied experience. The result is music that makes you move while it makes you think—a sonic demonstration that policy and passion, intellect and ecstasy, can coexist on the same dance floor.",
    trackTitle: "",
    audioSrc: "amon-ajari.mp3", // Upload this file at /admin/audio
    image:
      "https://images.unsplash.com/photo-1672607608405-9a6353ca4b15?q=80&w=1080",
    icon: Globe,
    traits: ["Political", "Circuit", "Activist", "Innovative"],
    spotifyUrl: "https://open.spotify.com/artist/amon-ajari", // Update with real link
  },
];

export function Personae() {
  const [selectedPersona, setSelectedPersona] =
    useState<PersonaData | null>(null);

  return (
    <>
      <section className="py-32 px-6 lg:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
            <Fingerprint className="w-4 h-4 text-white/60" />
            <span className="text-xs uppercase tracking-[0.2em] text-white/60 font-medium">
              Identity Modules
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-medium tracking-tight mb-6">
            Embodied Frequencies
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Each creative identity represents a distinct channel
            of inquiry—a lens through which emotion, sound, and
            meaning are explored.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {personae.map((persona, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setSelectedPersona(persona)}
              className="group relative h-64 p-8 rounded-2xl border border-white/10 bg-black overflow-hidden hover:border-white/30 transition-colors cursor-pointer"
            >
              {/* Background noise/texture */}
              <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 text-xs font-mono text-white/30 uppercase tracking-widest">
                    <Radio className="w-3 h-3" />
                    CH_{String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/0 group-hover:bg-emerald-500 transition-colors shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                </div>

                <div>
                  <h3 className="text-2xl md:text-3xl font-medium text-white mb-1 group-hover:translate-x-1 transition-transform duration-300">
                    {persona.name}
                  </h3>
                  <div className="text-sm text-emerald-500/90 font-mono mb-4 font-medium">
                    {persona.role}
                  </div>
                  <p className="text-sm md:text-base text-muted-foreground line-clamp-3 group-hover:text-white/80 transition-colors leading-relaxed">
                    {persona.desc}
                  </p>
                </div>
              </div>

              {/* Hover Effect Line */}
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
            </motion.div>
          ))}
        </div>
      </section>

      <PersonaModal
        isOpen={!!selectedPersona}
        onClose={() => setSelectedPersona(null)}
        data={selectedPersona}
      />
    </>
  );
}