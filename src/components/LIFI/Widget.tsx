'use client';
import { LiFiWidget, WidgetConfig, WidgetDrawer } from '@lifi/widget';
import { useMemo, useRef } from 'react';

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
      toToken: '0x0000000000000000000000000000000000000000',
    }),
    []
  );

  const drawerRef = useRef<WidgetDrawer>(null);

  return (
    <>
      <WidgetEvents />
      <LiFiWidget integrator="seamless" config={widgetConfig} open ref={drawerRef} />
    </>
  );
};
