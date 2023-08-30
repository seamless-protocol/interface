import { Typography, TypographyProps } from '@mui/material';

export const TypographyGradient = ({ ...rest }: TypographyProps) => {
  return (
    <Typography
      sx={(theme) => ({
        color: 'transparent',
        backgroundClip: 'text !important',
        webkitTextFillColor: 'transparent',
        background: theme.palette.gradients.seamless,
      })}
      {...rest}
    >
      {rest.children}
    </Typography>
  );
};
