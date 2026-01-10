import { title as homeTitle } from '@/app/layout.config';
import { InlineLink } from '@/components/inline-link';
import { Section } from '@/components/section';
import { createMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';

const LAST_UPDATED = 'March 2, 2025';

export default function PrivacyPolicy() {
  return (
    <>
      <Section className='p-4 text-center lg:p-6'>
        <h1 className='mb-2 font-bold text-3xl leading-tight tracking-tighter md:text-4xl'>
          Privacy Policy
        </h1>
        <div className='flex items-center justify-center gap-2'>
          <p className='text-muted-foreground text-sm'>
            Last updated: {LAST_UPDATED}
          </p>
          <span className='text-muted-foreground text-sm'>•</span>
          <InlineLink href='/terms' className='text-sm'>
            Terms of Service
          </InlineLink>
        </div>
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
    title: 'Our Commitment to Privacy',
    content: (
      <p>
        We take your privacy seriously. Tabby is an open-source CLI tool that
        runs entirely on your local machine. The web playground does not send
        your data anywhere.
      </p>
    ),
  },
  {
    title: 'Data Collection',
    content: (
      <ul className='ml-4 list-disc space-y-2'>
        <li>
          The Tabby CLI tool runs locally and does not collect any data.
        </li>
        <li>
          The web playground generates commands locally in your browser and
          does not transmit your input.
        </li>
        <li>
          We may collect anonymous analytics on website visits to improve the
          site.
        </li>
      </ul>
    ),
  },
  {
    title: 'Third-Party Services',
    content: (
      <p>
        Our website may use analytics services to understand traffic patterns.
        These services follow their own privacy policies.
      </p>
    ),
  },
  {
    title: 'Your Rights',
    content: (
      <ul className='ml-4 list-disc space-y-2'>
        <li>You can use Tabby without providing any personal information.</li>
        <li>The tool works entirely offline after installation.</li>
        <li>No account or registration required.</li>
      </ul>
    ),
  },
  {
    title: 'Contact Us',
    content: (
      <p>
        If you have any questions about privacy, please open an issue on our
        GitHub repository.
      </p>
    ),
  },
];

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const description = `Privacy Policy for ${homeTitle}. Last updated on ${LAST_UPDATED}.`;

  return createMetadata({
    title: 'Privacy Policy',
    description,
    openGraph: {
      url: '/privacy',
    },
    alternates: {
      canonical: '/privacy',
    },
  });
}
