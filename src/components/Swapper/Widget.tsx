// 'use client';
// import { LiFiWidget, WidgetConfig } from '@lifi/widget';
// import { useMemo } from 'react';

// import { WidgetEvents } from './WidgetEvents';

// const Widget = () => {
//   const widgetConfig: WidgetConfig = useMemo(
//     () => ({
//       containerStyle: {
//         //   border: `1px solid ${
//         //     window.matchMedia("(prefers-color-scheme: dark)").matches
//         //       ? "rgb(66, 66, 66)"
//         //       : "rgb(234, 234, 234)"
//         //   }`,
//         //   borderRadius: "16px",
//         // },
//         // theme: {
//         //   palette: {
//         //     primary: { main: "#9900d1" },
//         //     secondary: { main: "#F5B5FF" },
//         //   },
//         //   shape: {
//         //     borderRadius: 0,
//         //     borderRadiusSecondary: 0,
//         //   },
//       },
//       integrator: 'Seamless',
//       //variant: 'drawer',
//       //base chain id
//       toChain: 8453,
//       toToken: '0x4200000000000000000000000000000000000006',
//     }),
//     []
//   );

//   return (
//     <>
//       <WidgetEvents />
//       <LiFiWidget integrator="Seamless" config={widgetConfig} />
//     </>
//   );
// };

// import { LiFiWidget } from '@lifi/widget';

// import { WidgetEvents } from './WidgetEvents';

// export const Widget = () => {
//   return (
//     <>
//       <WidgetEvents />
//       <LiFiWidget
//         config={{
//           containerStyle: {
//             border: `1px solid rgb(234, 234, 234)`,
//             borderRadius: '16px',
//           },
//         }}
//         integrator="nextjs-example"
//       />
//     </>
//   );
// };
