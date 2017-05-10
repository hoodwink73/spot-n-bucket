import React, { Component } from 'react';
import {partialRight, bind} from 'lodash';

export default class Word extends Component  {
  constructor (props) {
    super(props);
    this.state = {
      clicked: false
    }
  }

  bucketWord (e, proxy, word,sentenceId) {
    console.log(this.state.clicked);
    this.setState({
      clicked: !this.state.clicked
    });

    this.props.wordClick(word,sentenceId);
  }

  render () {
    var { word, sentenceId, wordClick } = this.props;
    var currentModeColor:
    var selectedStyle = this.state.clicked
      ? { border: '1px dotted'+ }
      : {}

    return(
     <span style={selectedStyle} onClick={partialRight(bind(this.bucketWord, this),  word,sentenceId)}>{` ${word}`}</span>
    )
  }
}