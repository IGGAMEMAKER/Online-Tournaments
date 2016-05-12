import React, { Component } from 'react';

export default class TodoList extends Component {
  state = {
    text: 'Todo1'
  };
  
  componentDidMount() {

  }
  
  render() {
    var text = this.props.item.text;

    return (
      <span>{text}</span>
    );
  }

}