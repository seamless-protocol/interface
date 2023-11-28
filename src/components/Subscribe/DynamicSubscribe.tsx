import dynamic from 'next/dynamic';

const DynamicSubscribe = dynamic(
  () => import('./CBSubscribeButton').then((mod) => mod.CBSubscribeButton),
  { ssr: false }
);

export default DynamicSubscribe;
