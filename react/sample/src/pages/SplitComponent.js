import React from 'react';


// ★コード分割について

let result = false;

const timeout = (msec) => new Promise(resolve => {
  setTimeout(resolve, msec)
});

// 遅延ロードされるコンポーネント
export default function SplitComponent() {
  if (result) {
    return (
      <div>
        コンポーネントが遅延呼出しされました！
      </div>
    );
  }

  // コンポーネントの描画を遅延するための処理
  // 関数コンポーネントで(クラスコンポーネントではできなかった…)
  // promiseをスローするとコンポーネントのレンダリングは
  // promiseが解決されるまでできないようになる
  throw new Promise(async (resolve) => {
    await timeout(2000);
    result = true;
    resolve();
  });

}
