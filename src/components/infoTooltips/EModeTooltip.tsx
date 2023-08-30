import { Trans } from '@lingui/macro';

import { FormattedNumber } from '../primitives/FormattedNumber';
import { TextWithTooltip, TextWithTooltipProps } from '../TextWithTooltip';

export const EModeTooltip = ({
  eModeLtv,
  ...rest
}: TextWithTooltipProps & { eModeLtv: number }) => {
  return (
    <TextWithTooltip {...rest}>
      <Trans>
        E-Mode increases your LTV for a selected category of assets up to
        <FormattedNumber
          value={Number(eModeLtv) / 10000}
          percent
          variant="secondary12"
          color="text.secondary"
        />
        .
      </Trans>
    </TextWithTooltip>
  );
};
