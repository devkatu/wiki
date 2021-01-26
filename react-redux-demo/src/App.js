import './App.css';
import { Route, Router, Switch } from 'react-router';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import Header from './components/Header';
import Footer from './components/Footer';
import Todo from './pages/Todo';
import Setting from './pages/Setting';
import SignUp from './pages/SignUp';

function App() {
  // console.log(process.env.NODE_ENV);
  return (
    <div className="App">
      {/* <Router> ←ConnectedRouterがあるからいらない？*/}
        <Switch>
          <Route exact path="/" component={Todo} />
          <Route exact path="/a" component={Setting} />
          <Route exact path="/SignUp" component={SignUp}/>
          {/* <Route component={NotFound}/> */}
        </Switch>
      {/* </Router> */}
    </div>

  );
}

export default App;
