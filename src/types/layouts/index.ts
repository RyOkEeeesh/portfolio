import type { Thing, WithContext } from 'schema-dts';

export type MainLayoutProps = {
  title?: string;
  description?: string;
  ogp?: string;
  noindex?: true;
  jsonld?: WithContext<Thing> | WithContext<Thing>[];
}