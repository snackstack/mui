import { Slide, SlideProps, Snackbar, SnackbarOrigin, SnackbarProps } from '@mui/material';
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert';
import { useActiveSnacks, Snack, SnackItem, useSnackManager } from '@snackstack/core';
import React, { FC, useCallback, useMemo } from 'react';

const defaultBorderDistance = 20;
const defaultSpacing = 8;
const defaultAutohideDuration = 3000;
const defaultAnchorOrigin: SnackbarOrigin = {
  vertical: 'bottom',
  horizontal: 'left',
};

type MuiSnackbarsProps = Pick<SnackbarProps, 'anchorOrigin' | 'autoHideDuration'> & {
  spacing?: number;
  borderDistance?: number;
};

export const MuiSnackbars: FC<MuiSnackbarsProps> = props => {
  const activeSnacks = useActiveSnacks();

  const borderDistance = props.borderDistance ?? defaultBorderDistance;
  const spacing = props.spacing ?? defaultSpacing;
  const autoHideDuration = props.autoHideDuration ?? defaultAutohideDuration;
  const anchorOrigin = props.anchorOrigin ?? defaultAnchorOrigin;

  let heightOffset = borderDistance;
  let previousSnack: Snack | null = null;
  let hasSnackWithAutohide = false;

  return (
    <>
      {activeSnacks.map((snack, index) => {
        let localAutoHideDuration: MuiSnackbarsProps['autoHideDuration'] = undefined;

        if (index > 0) {
          heightOffset += (previousSnack?.height ?? 0) + spacing;
        }

        if (!hasSnackWithAutohide && !snack.persist) {
          localAutoHideDuration = autoHideDuration;
          hasSnackWithAutohide = true;
        }

        previousSnack = snack;

        return (
          <SnackItem key={snack.id} snackId={snack.id}>
            <MuiSnackbar
              snack={snack}
              heightOffset={heightOffset}
              autoHideDuration={localAutoHideDuration}
              anchorOrigin={anchorOrigin}
            />
          </SnackItem>
        );
      })}
    </>
  );
};

/** @internal */
type MuiSnackbarProps = Pick<MuiSnackbarsProps, 'autoHideDuration'> & {
  snack: Snack;
  heightOffset: number;
  anchorOrigin: Exclude<MuiSnackbarsProps['anchorOrigin'], undefined>;
};

/** @internal */
export const MuiSnackbar = React.forwardRef<any, MuiSnackbarProps>(
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
