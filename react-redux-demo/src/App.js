import './App.css';
import { Route, Router, Switch } from 'react-router';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';

function Top() {
  const dispatch = useDispatch();
  const goto = () => { dispatch(push('/a')); }
  return (
    <div>
      top page
      <button onClick={() => dispatch(push('/a'))}>goto</button>
    </div>
  )
}

function Page_a() {
  return (
    <div>
      page a
    </div>
  )
}

function App() {
  return (
    <div className="App">
      {/* <Router> */}
        <Switch>
          <Route exact path="/" component={Top} />
          <Route exact path="/a" component={Page_a} />
          {/* <Route component={NotFound}/> */}
        </Switch>
      {/* </Router> */}
    </div>

  );
}

export default App;
