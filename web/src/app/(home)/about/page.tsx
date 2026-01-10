import Separator from '@/components/separator';
import CTA from '../_components/cta';
import About from './_components/about';
import Hero from './_components/hero';

export default function AboutPage() {
  return (
    <>
      <Hero />
      <Separator />
      <About />
      <Separator />
      <CTA />
    </>
  );
}
