import { SnackbarProps } from '@mui/material';

export type MuiSnackbarOptions = Pick<SnackbarProps, 'anchorOrigin' | 'autoHideDuration'> & {
  spacing?: number;
  borderDistance?: number;
};
