import { Alert, AlertColor, Slide, SlideProps, Snackbar, SnackbarOrigin, SnackbarProps } from '@mui/material';
import { Snack, ActiveSnack, useSnackManager } from '@snackstack/core';
import React, { FC, useCallback, useMemo } from 'react';

export type MuiSnackbarProps = Pick<SnackbarProps, 'anchorOrigin' | 'autoHideDuration'> & {
  spacing?: number;
  heightOffset?: number;
  anchorOrigin: Exclude<SnackbarProps['anchorOrigin'], undefined>;
};

type Props = {
  snack: ActiveSnack;
  options: MuiSnackbarProps;
};

/** @internal */
export const MuiSnackbar: FC<Props> = ({ snack, options }) => {
  const { id: snackId, open, message, variant, action } = snack;

  // todo: better defaults
  options.heightOffset = options.spacing ?? 20;
  options.spacing = options.spacing ?? 20;

  const snackManager = useSnackManager();

  const onClose = useCallback(() => snackManager.close(snackId), [snackId, snackManager]);
  const onRemove = useCallback(() => snackManager.remove(snackId), [snackId, snackManager]);

  const messageIsValidElement = React.isValidElement(message);

  const content = messageIsValidElement ? (
    message
  ) : (
    <Alert onClose={onClose} action={action} severity={getSeverity(variant)}>
      {/* sx={{ width: '100%' }} */}
      {message}
    </Alert>
  );

  const offset = options.heightOffset + snack.index * options.spacing;

  const style: React.CSSProperties = {
    [options.anchorOrigin.vertical]: offset,
  };

  const TransitionComponent = useMemo(() => DefaultTransitionComponent(options.anchorOrigin), [options.anchorOrigin]);

  return (
    <Snackbar
      open={open}
      style={style}
      anchorOrigin={options.anchorOrigin}
      autoHideDuration={options.autoHideDuration}
      action={!messageIsValidElement ? action : undefined}
      TransitionComponent={TransitionComponent}
      // todo: might have to catch the clickaway
      onClose={onClose}
      TransitionProps={{ onExited: onRemove }}
    >
      <>{content}</>
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

const DefaultTransitionComponent = (anchorOrigin: SnackbarOrigin): SnackbarProps['TransitionComponent'] => props => (
  <Slide {...props} direction={getTransitionDirection(anchorOrigin)} />
);
