import { Trans } from '@lingui/macro';
import { GitHub, Telegram, Twitter } from '@mui/icons-material';
import { Box, styled, SvgIcon, Typography } from '@mui/material';
import Discord from 'public/icons/discord.svg';
import { Link } from 'src/components/primitives/Link';

interface StyledLinkProps {
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

const StyledLink = styled(Link)<StyledLinkProps>(({ theme }) => ({
  color: theme.palette.text.links,
  '&:hover': {
    color: theme.palette.text.links,
  },
  display: 'flex',
  alignItems: 'center',
}));

const FOOTER_ICONS = [
  {
    href: 'https://t.me/seamless_protocol',
    icon: <Telegram />,
    title: 'Telegram',
  },
  {
    href: 'https://discord.com/invite/Uye9jCVgUp',
    icon: <Discord fill="white" />,
    title: 'Discord',
  },
  {
    href: 'https://twitter.com/seamlessfi',
    icon: <Twitter />,
    title: 'Twitter',
  },
  {
    href: 'https://github.com/seamless-protocol/',
    icon: <GitHub />,
    title: 'Github',
  },
];

export function AppFooter() {
  // const [setAnalyticsConfigOpen] = useRootStore((store) => [store.setAnalyticsConfigOpen]);
  const FOOTER_LINKS = [
    {
      href: 'https://seamlessprotocol.medium.com/seamless-protocol-terms-of-use-f9d75a855fb3',
      label: <Trans>Terms</Trans>,
      key: 'Terms',
    },
    {
      href: 'https://seamlessprotocol.medium.com/seamless-privacy-policy-2ebfda169143',
      label: <Trans>Privacy</Trans>,
      key: 'Privacy',
    },
    {
      href: 'https://docs.seamlessprotocol.com',
      label: <Trans>Docs</Trans>,
      key: 'Docs',
    },
    {
      href: 'https://docs.seamlessprotocol.com/overview/faq',
      label: <Trans>FAQ</Trans>,
      key: 'FAQ',
    },
    {
      href: 'https://bridge.base.org/',
      label: 'Base Bridge',
      key: 'Bridge',
    },
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
        background: theme.palette.background.footer,
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
