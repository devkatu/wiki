import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

// material-ui
import { createMuiTheme, MuiThemeProvider  } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';


import './index.css';
import App from './App';



// storeの読込
import store from './store';

// マテリアルUIのテーマカスタマイズ
const theme = createMuiTheme({
  palette: {
    type: 'light', // light or dark
    primary: red, // primaryのカラー
    secondary: blue, // secondaryのカラー
  },
});

ReactDOM.render(
  // ★Providerで囲ってreactとreduxのstoreを接続する
  <Provider store={store}>
    {/* MuiThemeProviderはこの要素下にあるマテリアルUIに対しテーマを指示する */}
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

// reportWebVitals();
