import { Trans } from '@lingui/macro';
import { GitHub, Twitter } from '@mui/icons-material';
import { Box, styled, SvgIcon, Typography } from '@mui/material';
import { Link } from 'src/components/primitives/Link';

interface StyledLinkProps {
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

const StyledLink = styled(Link)<StyledLinkProps>(({ theme }) => ({
  color: theme.palette.text.muted,
  '&:hover': {
    color: theme.palette.text.primary,
  },
  display: 'flex',
  alignItems: 'center',
}));

const FOOTER_ICONS = [
  // {
  //   href: 'https://lenster.xyz/u/aaveaave',
  //   icon: <LensLogoIcon />,
  //   title: 'Aave',
  // },
  {
    href: 'https://twitter.com/seamlessfi',
    icon: <Twitter />,
    title: 'Twitter',
  },
  // {
  //   href: 'https://discord.com/invite/aave',
  //   icon: <DiscordIcon />,
  //   title: 'Discord',
  // },
  // {
  //   href: 'https://github.com/aave',
  //   icon: < />,
  //   title: 'Telegram',
  // },
  {
    href: 'https://github.com/seamless-protocol/',
    icon: <GitHub />,
    title: 'Github',
  },
];

export function AppFooter() {
  // const [setAnalyticsConfigOpen] = useRootStore((store) => [store.setAnalyticsConfigOpen]);
  const FOOTER_LINKS = [
    // {
    //   href: 'https://aave.com/term-of-use/',
    //   label: <Trans>Terms</Trans>,
    //   key: 'Terms',
    // },
    // {
    //   href: 'https://aave.com/privacy-policy/',
    //   label: <Trans>Privacy</Trans>,
    //   key: 'Privacy',
    // },
    // {
    //   href: 'https://docs.aave.com/hub/',
    //   label: <Trans>Docs</Trans>,
    //   key: 'Docs',
    // },
    // {
    //   href: 'https://docs.aave.com/faq/',
    //   label: <Trans>FAQS</Trans>,
    //   key: 'FAQS',
    // },
    {
      href: 'https://onchainsummer.xyz/base',
      label: <Trans>BASE | Onchain Summer</Trans>,
      key: 'Base',
    },
    // {
    //   href: 'https://discord.com/invite/7kHKnkDEUf',
    //   label: <Trans>Send feedback</Trans>,
    //   key: 'Send feedback',
    // },
    // {
    //   href: '',
    //   label: <Trans>Manage analytics</Trans>,
    //   key: 'Manage analytics',
    //   onClick: (event: React.MouseEvent) => {
    //     event.preventDefault();
    //     setAnalyticsConfigOpen(true);
    //   },
    // },
  ];

  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        padding: ['22px 0px 40px 0px', '0 22px 0 40px', '20px 22px'],
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '22px',
        flexDirection: ['column', 'column', 'row'],
        boxShadow:
          theme.palette.mode === 'light'
            ? 'inset 0px 1px 0px rgba(0, 0, 0, 0.04)'
            : 'inset 0px 1px 0px rgba(255, 255, 255, 0.12)',
        bgcolor: theme.palette.action.hover,
      })}
    >
      <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {FOOTER_LINKS.map((link) => (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          <StyledLink onClick={link.onClick} key={link.key} href={link.href}>
            <Typography variant="caption">{link.label}</Typography>
          </StyledLink>
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {FOOTER_ICONS.map((icon) => (
          <StyledLink href={icon.href} key={icon.title}>
            <SvgIcon
              sx={{
                fontSize: [24, 24, 20],
              }}
            >
              {icon.icon}
            </SvgIcon>
          </StyledLink>
        ))}
      </Box>
    </Box>
  );
}
