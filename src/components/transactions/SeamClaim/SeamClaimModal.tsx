import { ModalType, useModalContext } from 'src/hooks/useModal';
import { SeamClaimContent } from './SeamClaimContent';
import { BasicModal } from 'src/components/primitives/BasicModal';

export const SeamClaimModal = () => {
  const { type, close } = useModalContext();
  console.log('type');
  console.log(type);
  return (
    <BasicModal open={true} setOpen={close}>
      <SeamClaimContent />
    </BasicModal>
  );
};
