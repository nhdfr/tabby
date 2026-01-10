import { Section } from '@/components/section';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Link from 'next/link';

const faq = [
  {
    question: 'What is Tabby?',
    answer:
      'Tabby is a terminal-based HTTP testing tool with automated data generation. Think of it as curl with superpowers - template placeholders, loop mode for stress testing, and beautiful JSON output.',
  },
  {
    question: 'How do I install Tabby?',
    answer:
      'Install via Go: `go install github.com/nhdfr/tabby@latest` or build from source by cloning the repository and running `go build -o tabby`.',
  },
  {
    question: 'What are template placeholders?',
    answer:
      'Placeholders like {{name}}, {{email}}, {{uuid}}, {{number:1:100}} are automatically replaced with random data. Perfect for testing APIs with realistic data without manual input.',
  },
  {
    question: 'What is loop mode?',
    answer:
      'Loop mode lets you send multiple requests with configurable intervals - great for stress testing or load testing your APIs. Each request gets fresh random data from your templates.',
  },
  {
    question: 'What is the Playground?',
    answer:
      'The Playground is a web UI where you can build Tabby commands visually. Enter your URL, headers, and body - it generates the equivalent `tabby` terminal command for you.',
  },
];

export const FAQ = () => (
  <Section className='grid divide-y divide-dashed divide-border lg:grid-cols-2 lg:divide-x lg:divide-y-0'>
    <div className='flex flex-col gap-2 px-6 py-10 md:py-14'>
      <h4 className='max-w-xl text-left font-regular text-3xl tracking-tighter md:text-5xl'>
        Frequently Asked Questions
      </h4>
      <p className='max-w-xl text-left text-lg text-muted-foreground leading-relaxed tracking-tight lg:max-w-lg'>
        Have more questions?{' '}
        <Link
          href='https://github.com/nhdfr/tabby/issues'
          className='text-foreground underline hover:no-underline'
        >
          Open an issue on GitHub
        </Link>
      </p>
    </div>

    <Accordion
      type='single'
      collapsible
      className='w-full divide-dashed divide-border'
    >
      {faq.map((item, index) => (
        <AccordionItem
          key={`${item.question}-${index}`}
          value={`index-${index}`}
        >
          <AccordionTrigger className='rounded-none px-4 hover:bg-card hover:no-underline data-[state=open]:bg-card'>
            {item.question}
          </AccordionTrigger>
          <AccordionContent className='p-4'>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </Section>
);
