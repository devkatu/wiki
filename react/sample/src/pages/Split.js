import React, { Suspense } from 'react';
import Error from './Error';
import ReactDOM from 'react-dom';


// ★コード分割について
// React.lazyを用いると対象のコンポーネントがレンダリングされるときに初めて
// 該当コンポーネントをロードするようになる。
// ※通常はimport構文はjsの先頭にしか書けず、最初にすべてのimportを行う。
// 　import()は動的インポートといい、文の途中にも書く事ができ、import()を呼出した時点で対象をインポートする。
// 　コンポーネントを遅延ロードするにはこのlazy()とimport()を組み合わせる
// このlazyで呼出すコンポーネント(遅延コンポーネント)はSuspenseコンポーネント内でレンダーする。
// fallbackが呼出し待機中のコンテンツとなる。インジケータとかを表示する。
// さらにこのSuspenseコンポーネントをerror boundaryというもので囲うとエラー時のハンドリングができる。
// →ルーティングを使うときに各Routeを遅延コンポーネントとして、それらをSuspenseで囲うといいかも
// 但しコンポーネントの宣言に関するerrorしか拾わないので、イベントハンドラとかの中でのerrorを拾うなら
// try/catchするのが良い。

// fallback(呼出し待機中のコンテンツ)
function FallBack(props){
  return (
    <div>
      <p>component loading...</p>
      <p>component loading...</p>
      <p>component loading...</p>
      <p>component loading...</p>
      <p>component loading...</p>
    </div>
  );
}

const SplitComponent = React.lazy(() => import('./SplitComponent'));
export default function Split(props){
  return (
    <div>
      <h2>コード分割について</h2>
      <Error>
        <Suspense fallback={<FallBack/>}>
          <SplitComponent/>
          {/* 他にも遅延コンポーネントあれば纏めて入れられる */}
        </Suspense>
      </Error>
    </div>
  );
}
