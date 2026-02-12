import { AudioUploadAdmin } from "../components/AudioUploadAdmin";
import { ImageUploadAdmin } from "../components/ImageUploadAdmin";
import { Link } from "react-router";
import { ArrowLeft, Music, Image as ImageIcon } from "lucide-react";
import { motion } from "motion/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export default function AudioAdmin() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-6 left-6 z-50"
      >
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 bg-black/60 border border-white/20 rounded-full text-white/80 hover:text-white hover:bg-black/80 backdrop-blur-md transition-all group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-mono tracking-wider">BACK TO PORTFOLIO</span>
        </Link>
      </motion.div>

      <div className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Tabs defaultValue="audio" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-black/40 border border-white/10 backdrop-blur-md p-1 rounded-xl mb-8">
                        <TabsTrigger 
                            value="audio"
                            className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-white text-white/40 font-mono tracking-wider"
                        >
                            <div className="flex items-center gap-2">
                                <Music className="w-4 h-4" />
                                <span>AUDIO ASSETS</span>
                            </div>
                        </TabsTrigger>
                        <TabsTrigger 
                            value="images"
                            className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-white text-white/40 font-mono tracking-wider"
                        >
                            <div className="flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" />
                                <span>IMAGE ASSETS</span>
                            </div>
                        </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="audio" className="mt-0">
                        <div className="bg-transparent">
                             <AudioUploadAdmin />
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="images" className="mt-0">
                        <div className="bg-transparent">
                            <ImageUploadAdmin />
                        </div>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </div>
      </div>
    </div>
  );
}