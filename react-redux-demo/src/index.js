import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';


import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import history from './state/history';
import store from './state/store';
import { fetchTodos } from './state/todosSlice';
// import { history } from './state/store';
const theme = createMuiTheme({
  
});

store.dispatch(fetchTodos());

// ConnectedRouterにより、storeでrouteの管理ができるようになる。
// これがないと<Link path="hoge"/>とか書く必要があるはずだが、
// storeで管理しているのでdispatch(push('/path'));
// のような感じで関数的に書くことができる。
// なぜかver4じゃないとダメ・・・
// この配下にはreact-routerの<Router></Router>は不要(代わりにあるみたいなもん)
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

