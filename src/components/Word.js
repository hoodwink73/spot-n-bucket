import React, { Component } from 'react'
import { partialRight, bind } from 'lodash'
import config from '../config'
export default class Word extends Component {
	bucketWord(e, proxy, args) {
		var doUnselectWord = this.props.clicked
		var isMetaKeyPressed = e.shiftKey
		// this.setState({
		//   clicked: wordState,
		//   mode: wordState ? getCurrentMode() : ''
		// });
		this.props.wordClick({ ...args, doUnselectWord, isMetaKeyPressed })
	}

	render() {
		var { word, sentenceId, wordClick, getCurrentMode, index } = this.props
		var selectedStyle = this.props.clicked ? { fontSize: '25px' } : {}

		return (
			<span
				className="word-item"
				style={selectedStyle}
				data-mode={this.props.mode}
				onClick={partialRight(bind(this.bucketWord, this), {
					word,
					pos: index,
					sentenceId,
					getCurrentMode
				})}
			>{`${word}`}</span>
		)
	}
}
