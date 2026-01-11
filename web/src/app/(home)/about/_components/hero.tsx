import { Section } from '@/components/section';
import Image from 'next/image';
import Balancer from 'react-wrap-balancer';

const Hero = () => (
  <Section className='relative w-full overflow-hidden px-4 py-16 sm:px-16 sm:py-24 md:py-32'>
    <div className='mx-auto flex flex-col items-center justify-center gap-6'>
      <div className='flex flex-col items-center gap-4 text-center'>
        <div className='relative'>
          {/* Glow effect behind logo */}
          <div 
            className='absolute inset-0 blur-[60px] opacity-30 dark:opacity-20 scale-150'
            style={{
              background: 'radial-gradient(circle, rgba(191, 165, 115, 0.8) 0%, transparent 70%)',
            }}
          />
          <Image
            src='/images/tabby.png'
            alt='Tabby Logo'
            height={140}
            width={140}
            priority
            className='relative transition-transform duration-300 hover:scale-105'
          />
        </div>
        <h1 className='max-w-2xl font-bold text-3xl tracking-tight sm:text-4xl md:text-5xl'>
          <span className='bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent'>
            <Balancer>About Tabby</Balancer>
          </span>
        </h1>
        <p className='mx-auto max-w-xl text-base text-muted-foreground/90 md:text-lg'>
          <Balancer>
            A fast, simple HTTP testing tool built with Go.
          </Balancer>
        </p>
      </div>
    </div>
  </Section>
);

export default Hero;
