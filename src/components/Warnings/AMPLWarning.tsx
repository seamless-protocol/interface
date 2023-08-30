import { Trans } from '@lingui/macro';

import { Link } from '../primitives/Link';

export const AMPLWarning = () => {
  return (
    <Trans>
      <b>Ampleforth</b> is a rebasing asset. Visit the{' '}
      <Link href="https://docs.seamlessprotocol.com/overview/faq" underline="always">
        <Trans>documentation</Trans>
      </Link>{' '}
      to learn more.
    </Trans>
  );
};
