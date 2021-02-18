import './App.css';
import { Route, Router, Switch } from 'react-router';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import Header from './components/Header';
import Footer from './components/Footer';
import Todo from './pages/Todo';
import Setting from './pages/Setting';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Auth from './Auth';
import Detail from './pages/Detail';
// import NotFound from './pages/NotFound.js';

function App() {
  return (
    <div className="App">
      {/* <Router> ←ConnectedRouterがあるからいらない？*/}
        <Switch>
          <Route exact path="/SignUp" component={SignUp}/>
          <Route exact path="/SignIn" component={SignIn}/>          
          <Auth>
            <Route exact path="/" component={Todo}/>
            <Route exact path="/detail" component={Detail}/>
            <Route exact path="/a" component={Setting} />
          </Auth>
          {/* <Route component={NotFound}/> */}
        </Switch>
      {/* </Router> */}
    </div>

  );
}

export default App;
