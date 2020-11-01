import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

export default function MenuList(props){
  return (
    <div> 
      <h2>Reactサンプル</h2>
      <Link to="/RouteExample"><p>ルーティング(パラメータ無し)</p></Link>
      <Link to="/RouteExample/get_param"><p>ルーティング(パラメータ有り)</p></Link>
    </div>
  );
}
