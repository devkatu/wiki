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
        <li className="MenuItem"><Link to="/Context">React高度コンセプト…Context</Link></li>
        <li className="MenuItem"><Link to="/RefDom">React高度コンセプト…RefとDOM</Link></li>
        <li className="MenuItem"><Link to="/HOC">React高度コンセプト…高階コンポーネント</Link></li>
        <li className="MenuItem"><Link to="/RouteExample">React高度コンセプト…ルーティング(パラメータ無し)</Link></li>
        <li className="MenuItem"><Link to="/RouteExample/get_param">React高度コンセプト…ルーティング(パラメータ有り)</Link></li>
        <li className="MenuItem"><Link to="/Immutability">イミュータブルとは</Link></li>
        <li className="MenuItem"><Link to="/Redux">redux</Link></li>
        <li className="MenuItem"><Link to="/MaterialUi">material ui</Link></li>

      </ul>
    </div>
  );
}
