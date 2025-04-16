import { Trans } from '@lingui/macro';

import { getFrozenProposalLink } from '../infoTooltips/FrozenTooltip';
import { Link } from '../primitives/Link';

export const BorrowDisabledWarning = () => {
  return (
    <Trans>
      Borrowing is disabled due to an Aave community decision.{' '}
      <Link
        href={getFrozenProposalLink()}
        sx={{ textDecoration: 'underline' }}
      >
        <Trans>More details</Trans>
      </Link>
    </Trans>
  );
};
