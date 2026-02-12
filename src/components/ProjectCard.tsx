import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

interface ProjectCardProps {
  title: string;
  category: string;
  description: string;
  href?: string;
  index: number;
}

export function ProjectCard({ title, category, description, href, index }: ProjectCardProps) {
  const CardContent = (
    <div className="flex items-start justify-between gap-8">
      <div className="flex-1">
        <motion.div
          className="text-muted-foreground mb-3 tracking-[0.2em] uppercase text-sm font-medium"
        >
          {category}
        </motion.div>
        <motion.h3
          className="text-3xl md:text-4xl mb-4 font-medium tracking-tight"
          whileHover={{ x: 10 }}
          transition={{ duration: 0.3 }}
        >
          {title}
        </motion.h3>
        <p className="text-muted-foreground max-w-2xl text-base md:text-lg leading-relaxed">
          {description}
        </p>
      </div>
      <motion.div
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        whileHover={{ scale: 1.1 }}
      >
        <ArrowUpRight className="w-7 h-7" />
      </motion.div>
    </div>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="group block border-t border-white/10 py-12 cursor-pointer no-underline text-inherit"
      >
        {CardContent}
      </motion.a>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group border-t border-white/10 py-12 cursor-pointer"
    >
      {CardContent}
    </motion.div>
  );
}