import React from 'react'
import Sentence from './Sentence'
import { List, AutoSizer, WindowScroller,CellMeasurer,CellMeasurerCache } from 'react-virtualized'
import 'react-virtualized/styles.css'
import { map } from 'lodash'

export default function Sentences({
	sentences,
	updateWords,
	getCurrentMode,
	onScroll,
	scrollTop
}) {
	var _sentences = []

	map(sentences, function(value, key) {
		_sentences.push(value)
	})
	const cache = new CellMeasurerCache({
	  defaultHeight: 50,
	  fixedWidth: true
	});

	function rowRenderer({
		key, // Unique key within array of rows
		index, // Index of row within collection
		isScrolling, // The List is currently being scrolled
		isVisible, // This row is visible within the List (eg it is not an overscanned row)
		style,
		parent
	}) {
		var { _id, ...rest } = _sentences[index]

		return (
			<CellMeasurer
	      cache={cache}
	      columnIndex={0}
	      key={key}
	      parent={parent}
	      rowIndex={index}
			    >
				<div className='sentence-wrap' key={key} style={style}>
					<Sentence
						{...rest}
						sentenceId={_id}
						clickatSentences={updateWords}
						getCurrentMode={getCurrentMode}
					/>
				</div>
			</CellMeasurer>
		)
	}
	const renderList = ({ height, width }) => {
		return (
			<List
				// autoHeight
				height={height}
				rowCount={Object.keys(sentences).length}
				deferredMeasurementCache={cache}
	      rowHeight={cache.rowHeight}
				rowRenderer={rowRenderer}
				width={width}
				scrollTop={scrollTop}
				onScroll={onScroll}
			/>
		)
	}
	return (
		<div className="sentences-container" style={{ height: '100vh' }}>
			<WindowScroller>
				{({ height, isScrolling, scrollTop }) =>
					<AutoSizer disableHeight>
						{renderList}
					</AutoSizer>}
			</WindowScroller>
		</div>
	)
}
