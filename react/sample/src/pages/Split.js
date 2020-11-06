import React, { Suspense } from 'react';
import Error from './Error';
import ReactDOM from 'react-dom';


// ★コード分割について

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
        </Suspense>
      </Error>
    </div>
  );
}
