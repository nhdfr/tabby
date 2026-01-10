import { loader } from 'fumadocs-core/source';
import type { InferMetaType, InferPageType } from 'fumadocs-core/source';
import { createMDXSource } from 'fumadocs-mdx';
import { docs } from '.source';

export const source = loader({
  baseUrl: '/docs',
  source: createMDXSource(docs),
});

export type Page = InferPageType<typeof source>;
export type Meta = InferMetaType<typeof source>;
