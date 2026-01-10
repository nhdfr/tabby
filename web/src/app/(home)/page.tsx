import Hero from '@/app/(home)/_components/hero';
import Separator from '@/components/separator';
import CTA from './_components/cta';
import { FAQ } from './_components/faq';
import WhyTabby from './_components/why-tabby';

export default function Home() {
  return (
    <>
      <Hero />
      <Separator />
      <WhyTabby />
      <Separator />
      <FAQ />
      <Separator />
      <CTA />
    </>
  );
}
