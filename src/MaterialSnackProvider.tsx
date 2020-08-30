import React, { FC } from 'react';
import { SnackProvider, SnackProviderOptions, SnackRendererProps } from '@snackstack/core';
import { MaterialSnackRenderer, MaterialSnackRendererProps } from './MaterialSnackRenderer';

interface MaterialSnackProviderProps {
  options?: Partial<SnackProviderOptions>;
  materialOptions?: Partial<Omit<MaterialSnackRendererProps, keyof SnackRendererProps>>;
}

export const MaterialSnackProvider: FC<MaterialSnackProviderProps> = props => {
  return (
    <SnackProvider renderer={MaterialSnackRenderer} options={props.options} rendererProps={props.materialOptions}>
      {props.children}
    </SnackProvider>
  );
};
