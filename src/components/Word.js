import React, { Component } from 'react';
import { partialRight, bind } from 'lodash';
import config from '../config'
export default class Word extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false,
      mode: ''
    };
  }

  bucketWord(e, proxy, word, sentenceId, getCurrentMode) {
    var wordState = !this.state.clicked;
    this.setState({
      clicked: wordState,
      mode: wordState ? getCurrentMode() : ''
    });
    this.props.wordClick(word, sentenceId, !wordState);
  }

  render() {
    var { word, sentenceId, wordClick, getCurrentMode } = this.props;
    var selectedStyle = this.state.clicked ? { fontSize: '25px' } : {};

    return (
      <span
        className="word-item"
        style={selectedStyle}
        data-mode={this.state.mode}
        onClick={partialRight(
          bind(this.bucketWord, this),
          word,
          sentenceId,
          getCurrentMode
        )}>{`${word}`}</span>
    );
  }
}
