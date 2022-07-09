import React, { FC } from 'react';
import { Snack, SnackItem, useActiveSnacks } from '@snackstack/core';
import { MuiSnackbar } from './MuiSnackbar';
import { SnackbarOrigin, SnackbarProps } from '@mui/material';
import { MuiSnackbarOptions } from './types/MuiSnackbarOptions';

// todo: better defaults
const defaultBorderDistance = 20;
const defaultSpacing = 8;
const defaultAutohideDuration = 3000;
const defaultAnchorOrigin: SnackbarOrigin = {
  vertical: 'bottom',
  horizontal: 'left',
};

export const MuiSnackbars: FC<MuiSnackbarOptions> = props => {
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
        let localAutoHideDuration: SnackbarProps['autoHideDuration'] = undefined;

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
