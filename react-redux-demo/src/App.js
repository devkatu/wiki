import './App.css';
import { Route, Router, Switch } from 'react-router';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import Header from './components/Header';
import Footer from './components/Footer';
import Todo from './pages/Todo';
import Setting from './pages/Setting';

function App() {
  return (
    <div className="App">
      {/* <Router> */}
        <Switch>
          <Route exact path="/" component={Todo} />
          <Route exact path="/a" component={Setting} />
          {/* <Route component={NotFound}/> */}
        </Switch>
      {/* </Router> */}
    </div>

  );
}

export default App;
