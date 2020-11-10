import React from 'react';


// ★reduxについて
export default class MyRedux extends React.Component {

  constructor(props) {
    super(props);

  }


  render() {
    return (
      <div>
        <h2>reduxについて</h2>
        <p>fufa = {this.props.fuga}</p>
        <button onClick={ () => this.props.handleClick() }>click</button>
      </div>
    );
  }
}

