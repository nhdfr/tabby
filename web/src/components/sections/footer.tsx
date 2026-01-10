import { owner } from '@/app/layout.config';
import { GithubLink } from '@/components/tabby-items/github-link';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function Footer() {
  return (
    <footer
      className={cn(
        'container mx-auto flex flex-col gap-4',
        'border-border border-b border-dashed',
        'gap-8 px-8 py-8',
      )}
    >
      <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
        <div className='flex items-center gap-4'>
          <GithubLink />
        </div>

        <p className='text-muted-foreground text-sm'>
          &copy; {new Date().getFullYear()} {owner}. All rights reserved.
        </p>

        <div className='flex gap-4 text-muted-foreground text-sm'>
          <Link href='/privacy' className='hover:text-foreground'>
            Privacy
          </Link>
          <Link href='/terms' className='hover:text-foreground'>
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
