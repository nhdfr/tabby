'use client';

import { Section } from '@/components/section';
import {
  FileJson,
  Repeat,
  Shuffle,
  Terminal,
  Zap,
  Command,
} from 'lucide-react';

const features = [
  {
    icon: Terminal,
    title: 'GET & POST Requests',
    description:
      'Simple, intuitive HTTP request handling with custom headers and JSON pretty printing.',
  },
  {
    icon: Shuffle,
    title: 'Random Data Generation',
    description:
      'Built-in template placeholders for names, emails, phones, UUIDs, and more.',
  },
  {
    icon: Repeat,
    title: 'Loop Mode',
    description:
      'Automated stress testing with configurable intervals and iteration counts.',
  },
  {
    icon: FileJson,
    title: 'Template Files',
    description:
      'Load complex request bodies from JSON template files with dynamic placeholders.',
  },
  {
    icon: Command,
    title: 'CLI First',
    description:
      'Designed for developers who love the terminal. Fast, scriptable, and easy to integrate.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Built with Go for blazing fast performance. No dependencies, single binary.',
  },
];

export default function WhyTabby() {
  return (
    <Section className='px-6 py-10 md:py-14'>
      <div className='flex flex-col gap-10'>
        <div className='flex flex-col gap-2'>
          <h2 className='max-w-xl text-left font-regular text-3xl tracking-tighter md:text-5xl'>
            Why Tabby?
          </h2>
          <p className='max-w-xl text-left text-lg text-muted-foreground leading-relaxed tracking-tight lg:max-w-lg'>
            Powerful features for HTTP testing and stress testing from your
            terminal.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-px border border-dashed border-border sm:grid-cols-2 lg:grid-cols-3'>
          {features.map((feature, index) => (
            <div
              key={index}
              className='group flex flex-col gap-4 border border-dashed border-border p-6 transition-colors hover:bg-card'
            >
              <feature.icon className='size-6 text-muted-foreground transition-colors group-hover:text-foreground' />
              <div className='flex flex-col gap-1'>
                <h3 className='font-medium text-base tracking-tight'>
                  {feature.title}
                </h3>
                <p className='text-muted-foreground text-sm leading-relaxed'>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
