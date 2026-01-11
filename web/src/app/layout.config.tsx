import { Icons } from '@/components/icons/icons';
import type { LinkItemType } from 'fumadocs-ui/layouts/links';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export const title = 'Tabby';
export const description =
  'A powerful terminal-based HTTP testing tool with automated data generation.';
export const owner = 'Tabby';

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: <span style={{ color: '#BFA573' }}>{title}</span>,
  },
};

export const linkItems: LinkItemType[] = [
  {
    icon: <Icons.info />,
    text: 'About',
    url: '/about',
    active: 'url',
  },
];

export const postsPerPage = 5;
