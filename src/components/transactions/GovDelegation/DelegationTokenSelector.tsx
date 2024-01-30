import { Box, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { constants } from 'ethers';
import { useEffect } from 'react';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { Row } from 'src/components/primitives/Row';
import { useGovernanceTokens } from 'src/hooks/governance/useGovernanceTokens';

import { TokenIcon } from '../../primitives/TokenIcon';

export type DelegationToken = {
  address: string;
  name: string;
  amount: string;
  symbol: string;
  votingDelegatee?: string;
  type: DelegationTokenType;
};

export enum DelegationTokenType {
  BOTH = 0,
  SEAM,
  esSEAM,
}

export type DelegationTokenSelectorProps = {
  delegationTokens: DelegationToken[];
  setDelegationTokenType: (type: DelegationTokenType) => void;
  delegationTokenType: DelegationTokenType;
  filter: boolean;
};

type TokenRowProps = {
  symbol: string[] | string;
  amount: string | number;
};

export const TokenRow: React.FC<TokenRowProps> = ({ symbol, amount }) => {
  return (
    <Row
      sx={{ alignItems: 'center', width: '100%' }}
      caption={
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {Array.isArray(symbol) ? (
            symbol.map((token, index) => (
              <>
                <TokenIcon symbol={token} sx={{ width: 16, height: 16 }} />
                <Typography variant="subheader1">{token}</Typography>
                {index < symbol.length - 1 && <Typography variant="subheader1">+</Typography>}
              </>
            ))
          ) : (
            <>
              <TokenIcon symbol={symbol} sx={{ width: 16, height: 16 }} />
              <Typography variant="subheader1">{symbol}</Typography>
            </>
          )}
        </Box>
      }
    >
      <FormattedNumber variant="secondary14" color="text.secondary" value={amount} />
    </Row>
  );
};

const filterTokens = (tokens: DelegationToken[]): DelegationToken[] => {
  return tokens.filter((token) => token.votingDelegatee !== constants.AddressZero);
};

export const DelegationTokenSelector = ({
  delegationTokens,
  setDelegationTokenType,
  delegationTokenType,
  filter,
}: DelegationTokenSelectorProps) => {
  const {
    data: { seam, esSEAM },
  } = useGovernanceTokens();

  const filteredTokens = filter ? filterTokens(delegationTokens) : delegationTokens;
  const isOneLiner = filter && filteredTokens.length === 1;

  useEffect(() => {
    if (isOneLiner) setDelegationTokenType(filteredTokens[0].type);
  }, [isOneLiner, filteredTokens, setDelegationTokenType]);

  if (isOneLiner) {
    return <TokenRow symbol={filteredTokens[0].symbol} amount={filteredTokens[0].amount} />;
  }

  return (
    <FormControl variant="standard" fullWidth sx={{ mb: 6 }}>
      <RadioGroup
        value={delegationTokenType}
        onChange={(e) =>
          setDelegationTokenType(Number(e.target.value) as unknown as DelegationTokenType)
        }
      >
        <FormControlLabel
          value={DelegationTokenType.BOTH}
          control={<Radio size="small" />}
          componentsProps={{ typography: { width: '100%' } }}
          label={<TokenRow symbol={['SEAM', 'esSEAM']} amount={Number(seam) + Number(esSEAM)} />}
          data-cy={`delegate-token-both`}
        />
        <FormControlLabel
          value={DelegationTokenType.SEAM}
          control={<Radio size="small" />}
          componentsProps={{ typography: { width: '100%' } }}
          label={<TokenRow symbol="SEAM" amount={seam} />}
          data-cy={`delegate-token-SEAM`}
        />
        <FormControlLabel
          value={DelegationTokenType.esSEAM}
          control={<Radio size="small" />}
          componentsProps={{ typography: { width: '100%' } }}
          label={<TokenRow symbol="esSEAM" amount={esSEAM} />}
          data-cy={`delegate-token-esSEAM`}
        />
      </RadioGroup>
    </FormControl>
  );
};
