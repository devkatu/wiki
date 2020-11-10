import React from 'react'
import { connect } from 'react-redux'

import MyRedux from '../pages/MyRedux';
import { actions }  from '../actions/action'

function mapStateToProps(state) {
  return state
}

function mapDispatchToProps(dispatch) {
  return {
    handleClick: () => { dispatch(actions.increment()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyRedux);