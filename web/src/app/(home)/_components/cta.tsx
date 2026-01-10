import { Icons } from '@/components/icons/icons';
import { Section } from '@/components/section';
import { Button } from '@/components/ui/button';
import { Terminal } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';

export default function CTA(): React.ReactElement {
  return (
    <Section className='relative grid gap-8 px-4 py-10 sm:grid-cols-2 md:py-14 lg:px-6 lg:py-16'>
      <h2 className='max-w-xl font-regular text-3xl md:text-5xl'>
        Ready to Supercharge Your API Testing?
      </h2>

      <div className='flex w-full items-center'>
        <div className='max-w-xl space-y-4'>
          <p className='text-muted-foreground text-sm md:text-base'>
            Install Tabby today and experience HTTP testing with automated data
            generation, loop mode, and template support. Open source and free forever.
          </p>
          <div className='flex flex-row gap-3'>
            <Button size='lg' className='group gap-4' asChild>
              <Link href='https://github.com/nhdfr/tabby'>
                Get Started
                <Icons.arrowUpRight className='size-4 transition-transform group-hover:-rotate-12' />
              </Link>
            </Button>
            <Button
              size='lg'
              className='group gap-4'
              variant='outline'
              asChild
            >
              <Link href='/playground'>
                <Terminal className='size-4 transition-transform group-hover:-rotate-12' />
                Try Playground
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
