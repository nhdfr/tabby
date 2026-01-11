"use client";

import { Section } from "@/components/section";
import { Playground } from "./_components/playground";

export default function PlaygroundPage() {
  return (
    <Section className="px-6 py-10 md:py-14">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="max-w-xl text-left font-regular text-3xl tracking-tighter md:text-5xl">
            Playground
          </h2>
          <p className="max-w-xl text-left text-muted-foreground leading-relaxed tracking-tight lg:max-w-lg">
            Build HTTP requests with template placeholders and generate CLI commands.
          </p>
        </div>
        <Playground />
      </div>
    </Section>
  );
}
