"use client";

import { Icons } from "@/components/icons/icons";
import { Section } from "@/components/section";
import { TabbyButton } from "@/components/tabby-items/tabby-button";
import { Button } from "@/components/ui/button";
import { Terminal } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const Hero = () => (
  <Section className="relative w-full overflow-hidden bg-dashed px-4 py-20 sm:px-16 sm:py-28 md:py-36">
    {/* Ambient gradient background - creates depth and warmth */}
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Primary warm glow - top right, brand-aligned */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute -top-[20%] -right-[10%] h-[600px] w-[600px] md:h-[800px] md:w-[800px]"
      >
        <div 
          className="absolute inset-0 rounded-full blur-[120px] opacity-[0.15] dark:opacity-[0.08] transition-opacity duration-700"
          style={{
            background: "radial-gradient(circle, rgba(191, 165, 115, 1) 0%, rgba(191, 165, 115, 0.4) 40%, transparent 70%)",
          }}
        />
      </motion.div>
      
      {/* Secondary accent glow - bottom left for balance */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.2, ease: "easeOut" }}
        className="absolute -bottom-[30%] -left-[15%] h-[500px] w-[500px] md:h-[700px] md:w-[700px]"
      >
        <div 
          className="absolute inset-0 rounded-full blur-[100px] opacity-[0.12] dark:opacity-[0.06] transition-opacity duration-700"
          style={{
            background: "radial-gradient(circle, rgba(161, 135, 95, 1) 0%, rgba(140, 120, 80, 0.3) 50%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* Subtle center ambient - ties the composition together */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, delay: 0.4, ease: "easeOut" }}
        className="absolute top-[20%] left-[30%] h-[400px] w-[400px] md:h-[500px] md:w-[500px]"
      >
        <div 
          className="absolute inset-0 rounded-full blur-[150px] opacity-[0.08] dark:opacity-[0.04] transition-opacity duration-700"
          style={{
            background: "radial-gradient(circle, rgba(180, 160, 120, 0.8) 0%, transparent 60%)",
          }}
        />
      </motion.div>
    </div>

    {/* Content */}
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
      className="mx-auto flex flex-col items-center justify-center gap-10"
    >
      {/* Badge */}
      <Button
        variant="outline"
        size="sm"
        className="group gap-2 border-border/60 bg-background/50 backdrop-blur-sm hover:border-[#BFA573]/40 hover:bg-[#BFA573]/5 transition-all duration-300"
        asChild
      >
        <Link href="/playground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#BFA573] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#BFA573]" />
          </span>
          Try the Playground
          <Icons.arrowUpRight className="size-3.5 text-muted-foreground group-hover:text-[#BFA573] transition-colors" />
        </Link>
      </Button>

      {/* Headline */}
      <div className="flex flex-col items-center gap-5">
        <h1 className="max-w-4xl text-center font-bold text-4xl tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
            API Stress Testing
          </span>
          <br />
          <span className="bg-gradient-to-r from-[#BFA573] via-[#D4BC8E] to-[#BFA573] bg-clip-text text-transparent">
            Made Simple
          </span>
        </h1>
        <p className="max-w-xl text-center text-muted-foreground/90 leading-relaxed text-base md:text-lg">
          A powerful terminal-based HTTP testing tool with automated data
          generation, loop mode for stress testing, and template support.
        </p>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <TabbyButton size="lg" className="min-w-[180px]" asChild>
          <Link href="/docs">
            Get Started
            <Icons.arrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </TabbyButton>
        <Button size="lg" className="group min-w-[180px] gap-2" variant="outline" asChild>
          <Link href="/playground">
            <Terminal className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            Playground
          </Link>
        </Button>
      </div>
    </motion.div>
  </Section>
);

export default Hero;
