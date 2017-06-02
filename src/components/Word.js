import React, { Component } from 'react';
import { partialRight, bind } from 'lodash';
import config from '../config'
export default class Word extends Component {
  bucketWord(e, proxy, word, sentenceId, getCurrentMode) {
    var wordState = !this.props.clicked;
    // this.setState({
    //   clicked: wordState,
    //   mode: wordState ? getCurrentMode() : ''
    // });
    this.props.wordClick(word, sentenceId, !wordState);
  }

  render() {
    var { word, sentenceId, wordClick, getCurrentMode } = this.props;
    var selectedStyle = this.props.clicked ? { fontSize: '25px' } : {};

    return (
      <span
        className="word-item"
        style={selectedStyle}
        data-mode={this.props.mode}
        onClick={partialRight(
          bind(this.bucketWord, this),
          word,
          sentenceId,
          getCurrentMode
        )}>{`${word}`}</span>
    );
  }
}
