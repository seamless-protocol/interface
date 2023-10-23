import dynamic from 'next/dynamic';

import { LoadingIndicator } from './LoadingIndicator';

const Swapper = dynamic(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  () => import('./Widget').then((module) => module.Widget) as any,
  {
    ssr: false,
    loading: () => <LoadingIndicator />,
  }
);

export default Swapper;
