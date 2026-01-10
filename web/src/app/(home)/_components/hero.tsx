import { Icons } from "@/components/icons/icons";
import { Section } from "@/components/section";
import { TabbyButton } from "@/components/tabby-items/tabby-button";
import { Button } from "@/components/ui/button";
import { Terminal } from "lucide-react";
import * as motion from "motion/react-client";
import Image from "next/image";
import Link from "next/link";
import tabbyTexture from "../../../../public/images/tabby-texture.png";

const Hero = () => (
  <Section className="relative w-full overflow-hidden bg-dashed px-4 py-16 sm:px-16 sm:py-24 md:py-32">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.6,
        scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
      }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="-z-10 absolute inset-0 h-full w-full overflow-hidden"
    >
      <Image
        src={tabbyTexture}
        alt="Tabby Texture Background"
        fill
        className="pointer-events-none absolute inset-0 select-none object-cover opacity-60 dark:opacity-40"
        priority
      />
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
    </motion.div>
    <div className="mx-auto flex flex-col items-center justify-center gap-8">
      <Button
        variant="outline"
        size="sm"
        className="group gap-4 bg-muted/70"
        asChild
      >
        <Link href="/playground">
          Try the Playground
          <Icons.arrowUpRight className="group-hover:-rotate-12 size-4 transition-transform" />
        </Link>
      </Button>
      <div className="flex flex-col items-center gap-6">
        <h1 className="max-w-3xl text-center font-bold text-4xl tracking-tight sm:text-5xl md:text-7xl">
           API Stress Testing
          <br />
          <span className="text-muted-foreground/70">Made Simple</span>
        </h1>
        <p className="max-w-lg text-center text-muted-foreground leading-relaxed md:text-lg">
          A powerful terminal-based HTTP testing tool with automated data
          generation, loop mode for stress testing, and template support.
        </p>
      </div>
      <div className="flex flex-row gap-3">
        <TabbyButton size="lg" asChild>
          <Link href="/docs">
            Documentation
            <Icons.arrowUpRight className="size-4 transition-transform group-hover:-rotate-12" />
          </Link>
        </TabbyButton>
        <Button size="lg" className="group gap-4" variant="outline" asChild>
          <Link href="/playground">
            <Terminal className="size-4 transition-transform group-hover:-rotate-12" />
            Try Playground
          </Link>
        </Button>
      </div>
    </div>
  </Section>
);

export default Hero;
