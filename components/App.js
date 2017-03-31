// react
import React, { Component } from 'react'
// ob
import { observer } from 'mobx-react'
// the class
import AppState from './AppState'
// instance of class
// data is all the dogy method, etc..
const data = new AppState()
// app class
export default class App extends Component {
  render() {
    // react clone is merge children with app method class
    // return it
    const Routes = React.cloneElement(this.props.children, { data })
    return Routes
  }
}
