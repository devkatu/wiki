import './MenuList.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

export default function MenuList(props) {
  return (
    <div>
      <h2>Reactサンプル</h2>
      <ul className="MenuList">
        <li className="MenuItem"><Link to="/Base">React基本…(Reactの流儀)</Link></li>
        <li className="MenuItem"><Link to="/Fragment">Fragment</Link></li>
        <li className="MenuItem"><Link to="/Split">Split</Link></li>



        <li className="MenuItem"><Link to="/RouteExample">ルーティング(パラメータ無し)</Link></li>
        <li className="MenuItem"><Link to="/RouteExample/get_param">ルーティング(パラメータ有り)</Link></li>
      </ul>
    </div>
  );
}
