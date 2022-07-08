import { Alert, AlertColor, Snackbar, SnackbarProps } from '@mui/material';
import { Snack, useSnackManager } from '@snackstack/core';
import React, { FC, useCallback } from 'react';

export type MuiSnackbarProps = Pick<SnackbarProps, 'anchorOrigin' | 'autoHideDuration'>;

type Props = {
  snack: Snack;
  options: MuiSnackbarProps;
};

/** @internal */
export const MuiSnackbar: FC<Props> = props => {
  const { id: snackId, open, message, variant, action } = props.snack;

  const snackManager = useSnackManager();

  const onClose = useCallback(() => snackManager.close(snackId), [snackId, snackManager]);

  const messageIsValidElement = React.isValidElement(message);

  const content = messageIsValidElement ? (
    message
  ) : (
    <Alert onClose={onClose} action={action} severity={getSeverity(variant)}>
      {/* sx={{ width: '100%' }} */}
      {message}
    </Alert>
  );

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      action={!messageIsValidElement ? action : undefined}
      onClose={onClose}
    >
      {content}
    </Snackbar>
  );
};

function getSeverity(variant: Snack['variant']): AlertColor | undefined {
  if (variant === 'default') {
    return undefined;
  }

  return variant;
}
