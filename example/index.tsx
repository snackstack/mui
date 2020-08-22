import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MaterialSnackRenderer } from '../.';
import { SnackProvider, useSnacks } from '@snackstack/core';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardActions,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const Expandable = React.forwardRef((props, ref) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Accordion ref={ref} {...props} expanded={open} onChange={() => setOpen(prev => !prev)} style={{ width: 320 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>I am expandable</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo
          lobortis eget.
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
});

let id = 0;

const App = () => {
  const { enqueueSnack, closeSnack } = useSnacks();

  const handleEnqueue = () => {
    if (id === 0) {
      enqueueSnack('I am a default notification');
    }
    if (id === 1) {
      enqueueSnack({ message: 'I am a success!', variant: 'success' });
    }
    if (id === 2) {
      enqueueSnack({ message: 'I am an error!', variant: 'error' });
    }
    if (id === 3) {
      enqueueSnack({
        message: 'I am interactive',
        variant: 'info',
        action: snack => (
          <Button style={{ color: 'white' }} onClick={() => alert('My id is ' + snack.id)}>
            Find out my Id
          </Button>
        ),
      });
    }
    if (id === 4) {
      enqueueSnack({
        message: 'I am persisted',
        variant: 'warning',
        persist: true,
        action: snack => (
          <Button style={{ color: 'white' }} onClick={() => closeSnack(snack.id)}>
            Got it
          </Button>
        ),
      });
    }
    if (id === 5) {
      enqueueSnack({
        message: (
          <Card style={{ width: 320, display: 'flex', alignItems: 'center' }}>
            <Typography style={{ flex: 1 }}>I'm a custom Snack! :)</Typography>
            <CardActions>
              <Button variant="contained" color="primary" onClick={() => alert('Test')}>
                Test
              </Button>
            </CardActions>
          </Card>
        ),
      });
    }

    if (id === 6) {
      enqueueSnack({ message: <Expandable />, dynamicHeight: true });
      id = 0;
    } else id++;
  };

  return <button onClick={handleEnqueue}>Enqueue</button>;
};

ReactDOM.render(
  <SnackProvider
    renderer={MaterialSnackRenderer}
    options={{}}
    rendererProps={{
      anchorOrigin: {
        horizontal: 'left',
        vertical: 'bottom',
      },
    }}
  >
    <App />
  </SnackProvider>,
  document.getElementById('root')
);
