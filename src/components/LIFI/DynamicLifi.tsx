import dynamic from 'next/dynamic';

import { Widget } from './Widget';

const DynamicLifi = dynamic(() => import('./Widget').then((module) => module.Widget), {
  ssr: false,
}) as typeof Widget;

export default DynamicLifi;
