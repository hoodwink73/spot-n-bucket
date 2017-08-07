import React from 'react'
import Word from './Word'
import { each } from 'lodash'
import { wordPosToIndex } from '../utils'

import config from '../config'

var { buckets } = config

export default function Sentence(props) {
	var { text, clickatSentences } = props
	function spreadWords () {
		each(buckets, (mode) => {
			var modename =mode.title.toLowerCase()
			each(props[modename], (word) =>{
				var wordWithSpace=text.substring(word.indices[0],word.indices[1])
				var wordWithoutSpace =wordWithSpace.replace(' ', '¦')
				text=text.replace(wordWithSpace,wordWithoutSpace)
			})
		})
		return text.split(' ')
	}


	if (text === undefined || text === null || text === '') {
		return null
	}
	var _counter = 0
	each(buckets, (mode) => {
		var modename =mode.title.toLowerCase()
		props[modename].length !== 0 ? _counter++ : null
	})
	let arrayOfWords =''
	if(_counter >0) {
		arrayOfWords = spreadWords(props)
	}
	else {
		arrayOfWords = text.split(' ')
	}
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
		<div className="row text-left sentence-wrap">
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
