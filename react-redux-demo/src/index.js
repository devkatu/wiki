import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';


import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import history from './state/history';
import store from './state/store';
// import { history } from './state/store';
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

