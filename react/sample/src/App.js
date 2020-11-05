import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import MenuList from './pages/MenuList'
import Base from './pages/Base'
import RouteExample from './pages/RouteExample';
import NotFound from './pages/NotFound';



// ルーティング
// Router>Switch>Routeの構造
// Linkでto属性に設定したURLに対応するRouteのcomponentを呼出せる

function App() {
  return (
    <Router>
      <div className="App">
        {/* Switch を設定すると一番最初にマッチしたRouteのみを選択する */}
        {/* Switch がない状態だとマッチする全てのRouteを表示する */}
        <Switch>
          {/* exactを付けるとpathに完全一致の場合のみマッチとみなす */}
          {/* exactがないものは部分一致となる */}
          <Route exact path="/" component={MenuList} />
          <Route exact path="/Base" component={Base} />
          <Route exact path="/RouteExample" component={RouteExample} />
          <Route path="/RouteExample/:attr" component={RouteExample} />
          <Route path="/RouteExample/:mode(main|extra)" component={RouteExample} />
          {/* 最終的にどのpathともマッチしなければ下のrouteがよばれる */}
          <Route component={NotFound}/>
        </Switch>
        <Link to="/">home</Link>
      </div>
    </Router>
  );
}

export default App;
