import React, { Component } from 'react'
import '../App.css'
import config from '../config'
import localForageConfig from '../localforage.config'
import uuid from 'uuid'
import Modes from '../components/Modes'
import Sentences from '../components/Sentences'
import Download from '../components/Download'
import { each, mapValues, remove } from 'lodash'
import { parse } from 'papaparse'
import fileDownload from 'react-file-download'
import localForage from 'localforage'
import { wordPosToIndex } from '../utils'
import getAdjacentWords from '../utils/getAdjacentWord'

const makeSentencesStateReady = function(sentences) {
	var data = {}
	each(sentences, function(sentence, key) {
		var [id, text] = sentence
		var _id = uuid.v4()
		data[_id] = {
			_id,
			text,
			...mapValues(config.buckets, () => [])
		}
	})
	return data
}

class App extends Component {
	constructor(props) {
		super(props)
		localForage.config(localForageConfig)
		let keys = Object.keys(config.buckets)
		let modes = {}

		keys.map(val => (modes[val] = false))

		let defaultMode = config.defaultMode
		modes[defaultMode] = true
		this.state = {
			data: {},
			scroll: 1
		}
		this.getLocalSentences(modes)
	}

	getLocalSentences(modes) {
		localForage.getItem('filenames').then(value => {
			if (value) {
				const filename = value[value.length - 1]
				this.setState({
					filename: filename
				})
				localForage.getItem(filename).then(value => {
					if (value) {
						this.setState({
							scroll: value
						})
					}
				})
			}
		})
		localForage
			.getItem('sentences')
			.then(value => {
				this.setState({
					data: makeSentencesStateReady(value),
					modes: modes
				})
			})
			.catch(function(err) {
				console.log(err)
			})
	}

	getCurrentMode() {
		var selectedMode
		each(this.state.modes, function(bool, mode) {
			if (bool) {
				selectedMode = mode
				return false
			}
		})
		return selectedMode || ''
	}

	updateMode(evt) {
		let modeKey = evt.target.value
		let modes = {}

		each(this.state.modes, function(bool, mode) {
			modes[mode] = false
		})

		this.setState({
			modes: {
				...modes,
				[modeKey]: true
			}
		})
	}

	updateWords({ word, pos, sentenceId, doUnselectWord, isMetaKeyPressed }) {
		var data = this.state.data
		var sentence = Object.assign({}, data[sentenceId])
		var currentMode = this.getCurrentMode()

		function calculateIndicesOfWord({
			sentence,
			word,
			pos: wordPositionInSentence
		}) {
			var wordStartIndex = wordPosToIndex(sentence, pos) - 1
			return [
				sentence.indexOf(word, wordStartIndex - 1),
				sentence.indexOf(word, wordStartIndex - 1) + word.length
			]
		}

		function collateWords (sentence, adjacentWord, currentWord, direction) {
			each(sentence[currentMode], function(obj,ind) {
				if(obj.indices.toString() === adjacentWord.toString() ) {
					sentence[currentMode].pop(adjacentWord)
					if(direction == 'previous') {
						currentWord.indices[0] = adjacentWord[0]
						let temp = sentence.text.substring(adjacentWord[0],adjacentWord[1])
						currentWord.word = temp+'¦'+currentWord.word
					}
					else if(direction == 'next') {
						currentWord.indices[1] = adjacentWord[1]
						let temp = sentence.text.substring(adjacentWord[0],adjacentWord[1])
						currentWord.word = currentWord.word+'¦'+temp
					}
					sentence[currentMode].push(currentWord)
				}
				})
			return sentence
		}

		if (doUnselectWord) {
			// `remove` removes elements in-place from the
			// array on which it is operating
			word=word.replace(' ','¦')
			remove(sentence[currentMode], function(value) {
				return value.word === word
			})
		} else {
			let wordDetails ={
						word,
						indices: calculateIndicesOfWord({
							sentence: sentence.text,
							word,
							pos
						})
					}
			if(isMetaKeyPressed){
				let adj = getAdjacentWords({sentence:sentence.text, word:wordDetails})
				const newSentence = null
				each(sentence[currentMode], function(obj,index){
					if(adj.previous.toString() === obj.indices.toString()) {
						newSentence=collateWords(sentence,adj.previous,wordDetails,'previous')
					}
					if(adj.next.toString() === obj.indices.toString()) {
						newSentence=collateWords(sentence,adj.next,wordDetails,'next')
					}
				})
				sentence = {
					...newSentence,
					[currentMode]: [
						...newSentence[currentMode],
						wordDetails
					]
				}

			}
			else{
				sentence = {
					...sentence,
					[currentMode]: [
						...sentence[currentMode],
						wordDetails
					]
				}
			}
		}

		this.setState({
			data: {
				...this.state.data,
				[sentenceId]: sentence
			}
		})
	}

	checkPreviouslySavedFiles(file) {
		localForage
			.getItem('filenames')
			.then(value => {
				console.log(value)
				this.setState({
					filename: file.name
				})
				let filenames,
					present = 0
				if (value) {
					filenames = value
					each(filenames, function(value, key) {
						if (file.name === value) {
							present++
						}
					})
					if (present) {
						localForage.getItem(file.name).then(value => {
							console.log(this.state, value)
							if (value) {
								this.setState({ scroll: value })
							}
						})
					}
				} else {
					filenames = []
					localForage.setItem(file.name, 0).then(value => {
						console.log('stored file.name 0')
					})
				}
				filenames.push(file.name)
				localForage
					.setItem('filenames', filenames)
					.then(function(value) {
						console.log('filenames stored')
					})
					.catch(function(err) {
						console.log('filenames store error', err)
					})
			})
			.catch(function(err) {
				console.log(err)
			})
	}

	readFile() {
		var file = this.refs.file.files[0]
		var reader = new FileReader()
		this.checkPreviouslySavedFiles(file)

		reader.readAsText(file)
		reader.onload = function(evt) {
			var sentences = parse(evt.target.result).data
			localForage
				.setItem('sentences', sentences)
				.then(function(value) {
					console.log('sentences save sucess')
				})
				.catch(function(err) {
					console.log('sentences save failed', err)
				})
			this.setState({
				data: makeSentencesStateReady(sentences)
			})
		}.bind(this)
	}

	downloadFile() {
		var data = JSON.stringify(this.state.data)
		data=data.replace(/¦/g,' ')
		fileDownload(data, `spot-n-bucket.${uuid.v4()}.json`)
	}

	onScroll({ scrollTop }) {
		localForage
			.setItem(this.state.filename, scrollTop)
			.then(value => {
				console.log('scrollPos updated')
			})
			.catch(function(err) {
				console.log('scrollPos update failed')
			})
	}

	render() {
		return (
			<div className="container">
				<div className="row header">
					<h1>Spot-n-Bucket</h1>

					<div className="input-wrap">
						<input
							className="inputfile"
							type="file"
							ref="file"
							onChange={this.readFile.bind(this)}
						/>
						<label for="file">
							<span>Choose a file</span>
						</label>
					</div>
					<div className="modes">
						<Modes
							modes={this.state.modes}
							updateMode={this.updateMode.bind(this)}
						/>
					</div>
				</div>
				{Object.keys(this.state.data).length > 0
					? <Sentences
							sentences={this.state.data}
							updateWords={this.updateWords.bind(this)}
							getCurrentMode={this.getCurrentMode.bind(this)}
							onScroll={this.onScroll.bind(this)}
							scrollTop={this.state.scroll}
						/>
					: null}
				<div className="footer">
					<Download downloadFile={this.downloadFile.bind(this)} />
				</div>
			</div>
		)
	}
}

export default App
