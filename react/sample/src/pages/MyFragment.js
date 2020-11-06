import './Base.css';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import BaseProductCategory from './BaseProductCategory';
import BaseProductRow from './BaseProductRow';
import BaseProductTable from './BaseProductTable';
import BaseProductTableContain from './BaseProductTableContain';
import BaseSearchBar from './BaseSearchBar';


// ★React.Fragmentについて
function FragmentItem(props) {
  return (
    // Fragmentで囲うと戻り要素が複数あってもOKになる
    <Fragment>
      <dt>{props.term}</dt>
      <dd>{props.description}</dd>
    </Fragment>
    // 下のでもOK
    // <>
    // <dt>{props.term}</dt>
    // <dd>{props.description}</dd>
    // </>
  )
}

export default function MyFragment(props){
  return (
    <div>
      <h2>Fragmentについて</h2>
      <dl>
        {/*
          ここでリストのアイテムを呼出す時、dt,dlの２要素を
          返してもらわないとhtml的にセマンティックでなくなってしまうが、
          コンポーネントの戻りは一つの要素になっていなければいけない為
          divで囲う等の事をしなければならない。
          これを解決するためにFragmentがある。
         */}
        <FragmentItem term="定義名１" description="説明１" />
        <FragmentItem term="定義名２" description="説明２" />
        <FragmentItem term="定義名３" description="説明３" />
        <FragmentItem term="定義名４" description="説明４" />
      </dl>
    </div>
  );
}
