import { Slide, SlideProps, Snackbar, SnackbarOrigin, SnackbarProps } from '@mui/material';
import { Snack, useSnackManager } from '@snackstack/core';
import React, { useCallback, useMemo } from 'react';
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert';
import { MuiSnackbarOptions } from './types/MuiSnackbarOptions';

type Props = Pick<MuiSnackbarOptions, 'autoHideDuration'> & {
  snack: Snack;
  heightOffset: number;
  anchorOrigin: Exclude<SnackbarProps['anchorOrigin'], undefined>;
};

/** @internal */
export const MuiSnackbar = React.forwardRef<any, Props>(
  ({ snack, heightOffset, anchorOrigin, autoHideDuration }, ref) => {
    const { id: snackId, status, variant } = snack;

    const snackManager = useSnackManager();

    const onClose = useCallback<Exclude<SnackbarProps['onClose'], undefined>>(
      (_, reason) => {
        if (reason === 'clickaway') {
          return;
        }

        snackManager.close(snackId);
      },
      [snackId, snackManager]
    );

    const onRemove = useCallback(() => {
      snackManager.remove(snackId);
    }, [snackId, snackManager]);

    let action = snack.action;

    if (typeof action === 'function') {
      action = action(snack);
    }

    let message = snack.message;

    if (typeof message === 'function') {
      message = message(snack);
    }

    const content = (
      <Alert action={action} severity={getSeverity(variant)}>
        {message}
      </Alert>
    );

    const style: React.CSSProperties = {
      [anchorOrigin.vertical]: heightOffset,
    };

    const TransitionComponent = useMemo(() => SlideTransition(anchorOrigin), [anchorOrigin]);

    return (
      <Snackbar
        ref={ref}
        open={status === 'open'}
        style={style}
        anchorOrigin={anchorOrigin}
        autoHideDuration={autoHideDuration}
        action={action}
        TransitionComponent={TransitionComponent}
        onClose={onClose}
        TransitionProps={{ onExited: onRemove }}
      >
        {content}
      </Snackbar>
    );
  }
);

function getSeverity(variant: Snack['variant']): AlertColor | undefined {
  if (variant === 'default') {
    return undefined;
  }

  return variant;
}

const TransitionDirectionMap: { [key: string]: SlideProps['direction'] } = {
  top: 'down',
  bottom: 'up',
  left: 'right',
  right: 'left',
};

function getTransitionDirection(anchorOrigin: SnackbarOrigin) {
  if (anchorOrigin.horizontal !== 'center') {
    return TransitionDirectionMap[anchorOrigin.horizontal];
  }

  return TransitionDirectionMap[anchorOrigin.vertical];
}

const SlideTransition = (anchorOrigin: SnackbarOrigin): SnackbarProps['TransitionComponent'] => props => {
  return <Slide {...props} direction={getTransitionDirection(anchorOrigin)} />;
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
