import { title as homeTitle } from '@/app/layout.config';
import { Section } from '@/components/section';
import { createMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';
import Link from 'next/link';

const LAST_UPDATED = 'March 2, 2025';

export default function TermsOfService() {
  return (
    <>
      <Section className='p-4 text-center lg:p-6'>
        <h1 className='mb-2 font-bold text-3xl leading-tight tracking-tighter md:text-4xl'>
          Terms of Service
        </h1>
        <p className='text-muted-foreground text-sm'>
          Last updated: {LAST_UPDATED}
        </p>
      </Section>
      <Section>
        <div className='grid divide-y divide-dashed divide-border'>
          {sections.map((section) => (
            <div key={section.title} className='group p-6 transition-all'>
              <h2 className='mb-4 font-semibold text-xl tracking-tight'>
                {section.title}
              </h2>
              <div className='prose prose-sm prose-zinc dark:prose-invert max-w-none'>
                {section.content}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

const sections = [
  {
    title: 'Overview',
    content: (
      <p>
        Tabby is an open-source terminal-based HTTP testing tool with automated
        data generation capabilities. By using our website and tools, you agree
        to these terms.
      </p>
    ),
  },
  {
    title: 'Software License',
    content: (
      <div className='space-y-8'>
        <div>
          <h3 className='mb-3 font-medium text-card-foreground text-xl'>
            Open Source
          </h3>
          <ul className='ml-4 list-disc space-y-2'>
            <li>
              Tabby is released under an open-source license. Please refer to
              the LICENSE file in the repository for specific terms.
            </li>
            <li>
              You may use, modify, and distribute the software according to the
              license terms.
            </li>
            <li>
              Contributions to the project are welcome and subject to the same
              license.
            </li>
          </ul>
        </div>
        <div>
          <h3 className='mb-3 font-medium text-card-foreground text-xl'>
            Web Playground
          </h3>
          <ul className='ml-4 list-disc space-y-2'>
            <li>
              The web playground generates Tabby commands based on your input.
            </li>
            <li>
              No HTTP requests are sent from the browser - commands are for
              local execution.
            </li>
            <li>We do not store or log the commands you generate.</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    title: 'User Responsibilities',
    content: (
      <div className='mt-4 space-y-3 text-muted-foreground'>
        <p>By using Tabby, you agree to:</p>
        <ul className='ml-4 list-disc space-y-2'>
          <li>Use the tool responsibly and ethically.</li>
          <li>Only test APIs you have permission to access.</li>
          <li>Not use the tool for malicious purposes or attacks.</li>
          <li>Respect rate limits and terms of services of APIs you test.</li>
        </ul>
      </div>
    ),
  },
  {
    title: 'Disclaimer',
    content: (
      <div className='mt-4 space-y-3 text-muted-foreground'>
        <p>Important disclaimers:</p>
        <ul className='ml-4 list-disc space-y-2'>
          <li>Tabby is provided &quot;as is&quot; without warranty.</li>
          <li>
            We are not responsible for any damages from using the software.
          </li>
          <li>Use at your own risk.</li>
        </ul>
      </div>
    ),
  },
  {
    title: 'Contact Information',
    content: (
      <div className='mt-4 space-y-3 text-muted-foreground'>
        <p>
          For any questions or concerns regarding these terms, please open an
          issue on our GitHub repository:
        </p>
        <div className='flex flex-col space-y-2'>
          <Link
            href='https://github.com/nhdfr/tabby/issues'
            className='inline-flex items-center text-fd-primary underline duration-300 hover:text-fd-primary/70'
          >
            GitHub Issues
          </Link>
        </div>
      </div>
    ),
  },
];

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const description = `Terms of service for ${homeTitle}. Last updated on ${LAST_UPDATED}.`;

  return createMetadata({
    title: 'Terms of Service',
    description,
    openGraph: {
      url: '/terms',
    },
    alternates: {
      canonical: '/terms',
    },
  });
}
