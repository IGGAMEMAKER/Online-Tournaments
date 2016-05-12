import React, { Component } from 'react';

export default class Pack extends Component {
  state = {
    items: [{}, {}, {}, {}],
    frees: 0
  };
    
  componentDidMount() {
    
  }


  
  render() {
    return (
      <div>
        <div>{this.state.seconds}</div>
        <div>{this.state.fiveSeconds}</div>
      </div>
    );
  }
}