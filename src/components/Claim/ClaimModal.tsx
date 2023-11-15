import React from 'react';
import { ModalType, useModalContext } from 'src/hooks/useModal';

import { BasicModal } from '../primitives/BasicModal';
import { ClaimModalContent } from './ClaimModalContent';

export const ClaimModal = () => {
  const { type, close, args } = useModalContext();
  return (
    <BasicModal open={type === ModalType.Claim} setOpen={close}>
      {args?.icon && args?.claimAssetName && (
        <ClaimModalContent icon={args.icon} claimAssetName={args.claimAssetName} />
      )}
    </BasicModal>
  );
};
