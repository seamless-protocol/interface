import { PERMISSION } from '@aave/contract-helpers';
import { Trans } from '@lingui/macro';
import React from 'react';
import { ModalContextType, ModalType, useModalContext } from 'src/hooks/useModal';

import { BasicModal } from '../../primitives/BasicModal';
import { ModalWrapper } from '../FlowCommons/ModalWrapper';
import { LoopModalContent } from './LoopModalContent';

export const LoopModal = () => {
  const { type, close, args } = useModalContext() as ModalContextType<{
    underlyingAsset: string;
  }>;

  return (
    <BasicModal open={type === ModalType.Loop} setOpen={close}>
      <ModalWrapper
        action="loop"
        title={<Trans>Loop</Trans>}
        underlyingAsset={args.underlyingAsset}
        requiredPermission={PERMISSION.DEPOSITOR}
      >
        {(params) => <LoopModalContent {...params} />}
      </ModalWrapper>
    </BasicModal>
  );
};
