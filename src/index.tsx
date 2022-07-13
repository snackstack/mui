import { Slide, SlideProps, Snackbar, SnackbarOrigin, SnackbarProps } from '@mui/material';
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert';
import { Snack, SnackProps } from '@snackstack/core';
import React, { useCallback, useMemo } from 'react';

const defaultAutoHideDuration = 3000;
const defaultAnchorOrigin: SnackbarOrigin = { vertical: 'bottom', horizontal: 'left' };

export type MuiSnackProps = SnackProps & {
  autoHideDuration?: number;
  anchorOrigin?: SnackbarOrigin;
};

export const MuiSnack = React.forwardRef<unknown, MuiSnackProps>(
  ({ autoHideDuration = defaultAutoHideDuration, anchorOrigin = defaultAnchorOrigin, ...props }, ref) => {
    const onClose = useCallback<Exclude<SnackbarProps['onClose'], undefined>>(
      (_, reason) => {
        if (reason === 'clickaway') {
          return;
        }

        props.onClose();
      },
      [props.onClose]
    );

    const content = (
      <Alert action={props.action} severity={getSeverity(props.variant)}>
        {props.message}
      </Alert>
    );

    const style: React.CSSProperties = {
      [anchorOrigin.vertical]: props.offset,
    };

    const TransitionComponent = useMemo(() => SlideTransition(anchorOrigin), [anchorOrigin]);

    return (
      <Snackbar
        ref={ref}
        open={status === 'open'}
        style={style}
        anchorOrigin={anchorOrigin}
        autoHideDuration={autoHideDuration}
        action={props.action}
        TransitionComponent={TransitionComponent}
        onClose={onClose}
        TransitionProps={{ onExited: props.onExited }}
      >
        {content}
      </Snackbar>
    );
  }
);

const SlideTransition = (anchorOrigin: SnackbarOrigin): SnackbarProps['TransitionComponent'] => props => {
  return <Slide {...props} direction={getTransitionDirection(anchorOrigin)} />;
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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
