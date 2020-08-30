import React, { FC, useMemo } from 'react';
import { useSnacks, SnackRendererProps } from '@snackstack/core';
import {
  createStyles,
  Slide,
  SlideProps,
  Snackbar,
  SnackbarContent,
  SnackbarOrigin,
  SnackbarProps,
  SvgIcon,
} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { amber, blue, green, red } from '@material-ui/core/colors';
import SuccessIcon from '@material-ui/icons/Check';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';

const VariantIcons: { [key: string]: typeof SvgIcon | null } = {
  default: null,
  success: SuccessIcon,
  info: InfoIcon,
  warning: WarningIcon,
  error: ErrorIcon,
};

const useStyles = makeStyles(theme =>
  createStyles({
    message: {
      fontSize: 16,
      display: 'flex',
      alignItems: 'center',
      color: '#fff',
    },
    icon: {
      color: '#fff',
      fontSize: 24,
      opacity: 0.9,
      marginRight: theme.spacing(1),
    },
    iconAction: {
      fontSize: 20,
    },
    error: {
      backgroundColor: red[600],
    },
    warning: {
      backgroundColor: amber[800],
    },
    info: {
      backgroundColor: blue[500],
    },
    success: {
      backgroundColor: green[500],
    },
  })
);

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

export interface MaterialSnackRendererProps extends SnackRendererProps {
  anchorOrigin: Exclude<SnackbarProps['anchorOrigin'], undefined>;
  hideIcon: boolean;
}

export const MaterialSnackRenderer: FC<MaterialSnackRendererProps> = ({ snack, ...props }) => {
  const { closeSnack } = useSnacks();

  const styles = useStyles();

  const offset = 20 + props.heightOffset + props.index * props.spacing;

  const style: React.CSSProperties = {
    [props.anchorOrigin.vertical]: offset,
  };

  if (props.heightOffset <= props.previousHeightOffset) {
    const transitionDelay = props.transitionDelay;

    style.MozTransition = `all ${transitionDelay}ms`;
    style.msTransition = `all ${transitionDelay}ms`;
    style.transition = `all ${transitionDelay}ms`;
  }

  const handleClose: SnackbarProps['onClose'] = (_, reason) => {
    if (reason === 'clickaway') return;

    closeSnack(snack.id);
  };

  const Icon = VariantIcons[snack.variant];

  const content = React.isValidElement(snack.message) ? snack.message : null;

  const TransitionComponent = useMemo(() => DefaultTransitionComponent(props.anchorOrigin), [props.anchorOrigin]);

  return (
    /* @ts-ignore */
    <Snackbar
      ref={props.snackRef}
      key={snack.id}
      open={snack.open}
      anchorOrigin={props.anchorOrigin}
      style={style}
      autoHideDuration={props.autoHideDuration}
      onClose={handleClose}
      onExited={props.onRemove}
      TransitionComponent={TransitionComponent}
    >
      {/* @ts-ignore */}
      {content || (
        <SnackbarContent
          className={styles[snack.variant as keyof typeof useStyles]}
          message={
            <div className={styles.message}>
              {!props.hideIcon && Icon && <Icon className={styles.icon} />}
              {snack.message}
            </div>
          }
          action={props.action}
        />
      )}
    </Snackbar>
  );
};
