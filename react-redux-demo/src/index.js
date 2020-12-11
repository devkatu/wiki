import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';


import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import store from './store';
import { history } from './store';

const theme = createMuiTheme({
  
});

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);

