import { StateCreator } from 'zustand';

import { RootStore } from './root';

export type LifiSlice = {
  isLifiWidgetOpen: boolean;
  setLifiWidget: (eventName: boolean) => void;
};

export const createLifiSlice: StateCreator<
  RootStore,
  [['zustand/subscribeWithSelector', never], ['zustand/devtools', never]],
  [],
  LifiSlice
> = (set) => {
  return {
    isLifiWidgetOpen: false,
    setLifiWidget(eventName: boolean) {
      set({ isLifiWidgetOpen: eventName });
    },
  };
};
