import './MenuList.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

export default function MenuList(props) {
  return (
    <div>
      <h2>Reactサンプル</h2>
      <ul className="MenuList">
        <li className="MenuItem"><Link to="/Base">React基本コンセプトまとめ…Reactの流儀</Link></li>
        <li className="MenuItem"><Link to="/Fragment">React高度コンセプト…Fragment</Link></li>
        <li className="MenuItem"><Link to="/Split">React高度コンセプト…Split</Link></li>



        <li className="MenuItem"><Link to="/RouteExample">React高度コンセプト…ルーティング(パラメータ無し)</Link></li>
        <li className="MenuItem"><Link to="/RouteExample/get_param">React高度コンセプト…ルーティング(パラメータ有り)</Link></li>
      </ul>
    </div>
  );
}
