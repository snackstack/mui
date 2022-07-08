import { Slide, SlideProps, Snackbar, SnackbarOrigin, SnackbarProps } from '@mui/material';
import { Snack, ActiveSnack, useSnackManager } from '@snackstack/core';
import React, { FC, useCallback, useMemo } from 'react';
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert';

export type MuiSnackbarProps = Pick<SnackbarProps, 'anchorOrigin' | 'autoHideDuration'> & {
  spacing?: number;
  borderDistance?: number;
};

type Props = {
  snack: ActiveSnack;
  options: MuiSnackbarProps;
};

const defaultAnchorOrigin: SnackbarOrigin = {
  vertical: 'bottom',
  horizontal: 'left',
};

// todo: better defaults
const defaultBorderDistance = 20;
const defaultSpacing = 5;
const defaultAutohideDuration = 3000;

/** @internal */
export const MuiSnackbar: FC<Props> = ({ snack, options }) => {
  const { id: snackId, open, message, variant, persist, action } = snack;

  const borderDistance = options.borderDistance ?? defaultBorderDistance;
  const spacing = options.spacing ?? defaultSpacing;
  const autoHideDuration = persist ? undefined : options.autoHideDuration ?? defaultAutohideDuration;
  const anchorOrigin = options.anchorOrigin ?? defaultAnchorOrigin;

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

  const content = (
    <Alert action={action} severity={getSeverity(variant)}>
      {message}
    </Alert>
  );

  const offset = borderDistance + snack.index * spacing;

  const style: React.CSSProperties = {
    [anchorOrigin.vertical]: offset,
  };

  const TransitionComponent = useMemo(() => SlideTransition(anchorOrigin), [anchorOrigin]);

  return (
    <Snackbar
      open={open}
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
};

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
