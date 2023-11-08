import { StateCreator } from 'zustand';

import { RootStore } from './root';

export type LifiSlice = {
  isLifiWidgetOpen: boolean;
  setLifiWidgetOpen: (open: boolean) => void;
};

export const createLifiSlice: StateCreator<
  RootStore,
  [['zustand/subscribeWithSelector', never], ['zustand/devtools', never]],
  [],
  LifiSlice
> = (set) => {
  return {
    isLifiWidgetOpen: false,
    setLifiWidgetOpen(open: boolean) {
      set({ isLifiWidgetOpen: open });
    },
  };
};
