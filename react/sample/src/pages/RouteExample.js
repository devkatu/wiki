import React from 'react';
// import ReactDOM from 'react-dom';
// import { BrowserRouter as Router} from 'react-router-dom';

export default function RouteExample(props) {
  console.log(props);
  return (
    <div>
      <h2>Routeのサンプル</h2>
      {props.match.params.attr
        ? (<p>URLに与えたパラメータは　{props.match.params.attr}　です</p>)
        : (<p>パラメータはありません</p>)
      }
      {
        props.match.params.attr == "extra"
          ? (<p>モードは　extra　です</p>)
          : (<p>モードは　main　です</p>)
      }
    </div>
  );
}
