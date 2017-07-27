import React from 'react'
import Word from './Word'
import { each } from 'lodash'
import { wordPosToIndex } from '../utils'

import config from '../config'

var { buckets } = config

export default function Sentence(props) {
	var { text, clickatSentences } = props

	if (text === undefined || text === null || text === '') {
		return null
	}

	const arrayOfWords = text.split(' ')

	function isWordInBucket({ word, pos, allWordsInBucket, sentence }) {
		var isWordInBucket = false
		var wordStartIndex = wordPosToIndex(sentence, pos)

		each(allWordsInBucket, function({ word: selectedWord, indices }) {
			// position of the word should match with the indices of the selected word
			if (word === selectedWord && wordStartIndex === indices[0]) {
				isWordInBucket = true
			}
		})

		return isWordInBucket
	}

	var bucketNames = Object.keys(buckets)
	return (
		<div className="row text-left">
			<h1 className="col-md-12 sentence">
				{arrayOfWords.map(function(word, ind) {
					var clicked = false,
						belongsToBucket = ''
					each(bucketNames, function(bucketName) {
						var bucketData = props[bucketName]
						if (
							bucketData.length > 0 &&
							isWordInBucket({
								word,
								pos: ind,
								allWordsInBucket: bucketData,
								sentence: text
							})
						) {
							clicked = true
							belongsToBucket = bucketName
						}
					})

					return (
						<Word
							clicked={clicked}
							mode={belongsToBucket}
							index={ind}
							key={ind}
							word={word}
							wordClick={clickatSentences}
							{...props}
						/>
					)
				})}
			</h1>
		</div>
	)
}
