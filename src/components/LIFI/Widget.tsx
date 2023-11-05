'use client';
import { LiFiWidget, WidgetConfig } from '@lifi/widget';
import { useMemo } from 'react';

import { WidgetEvents } from './WidgetEvents';

export const Widget = () => {
  const widgetConfig: WidgetConfig = useMemo(
    () => ({
      containerStyle: {
        border: `1px solid rgb(234, 234, 234)`,
        borderRadius: '16px',
      },
      integrator: 'seamless',
      variant: 'drawer',
      //BASE ChainID
      toChain: 8453,
      toToken: '0x4200000000000000000000000000000000000006',
    }),
    []
  );

  return (
    <>
      <WidgetEvents />
      <LiFiWidget integrator="seamless" config={widgetConfig} />
    </>
  );
};
