import React, { FC } from 'react';
import { useActiveSnacks } from '@snackstack/core';
import { MuiSnackbar, MuiSnackbarProps } from './MuiSnackbar';

export const MuiSnackbars: FC<MuiSnackbarProps> = props => {
  const activeSnacks = useActiveSnacks();

  return (
    <>
      {activeSnacks.map(snack => (
        <MuiSnackbar key={snack.id} snack={snack} options={props} />
      ))}
    </>
  );
};
