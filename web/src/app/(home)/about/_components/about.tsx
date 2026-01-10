import { Section } from '@/components/section';

export default function About(): React.ReactElement {
  return (
    <Section className='grid divide-y divide-dashed divide-border lg:grid-cols-2 lg:divide-x lg:divide-y-0'>
      <div className='flex flex-col gap-2 px-6 py-10 md:py-14'>
        <h4 className='text-left font-regular text-3xl tracking-tighter md:text-5xl'>
          About Tabby
        </h4>
      </div>

      <div className='gap-4 px-6 py-10 md:py-14'>
        <div className='prose dark:prose-invert w-full space-y-4'>
          <p className='text-lg'>
            Tabby was born from the need for a simpler, more powerful HTTP
            testing tool. While curl is powerful, we wanted something with
            built-in data generation, loop mode for stress testing, and
            beautiful JSON output.
          </p>

          <p className='text-lg'>
            Built with Go for speed and simplicity, Tabby is open source and
            designed to make API testing a breeze. Whether you're testing a
            single endpoint or stress testing your entire API, Tabby has you
            covered.
          </p>
        </div>
      </div>
    </Section>
  );
}
