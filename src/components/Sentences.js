import React from 'react';
import Sentence from './Sentence';
import { List, AutoSizer, WindowScroller } from 'react-virtualized';
import 'react-virtualized/styles.css';
import { map } from 'lodash'


export default function Sentences({ sentences, updateWords, getCurrentMode, onScroll, scrollTop }) {
  const clickatSentences = (word, sentenceId, doUnselectWord) => {
    updateWords(word, sentenceId, doUnselectWord);
  };

  var _sentences = []

  map(sentences, function (value, key) {
    _sentences.push(value)
  })
  
  function rowRenderer ({
    key,         // Unique key within array of rows
    index,       // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible,   // This row is visible within the List (eg it is not an overscanned row)
    style
  }) {
    var {_id, ...rest} = _sentences[index];

    return (
      <div
        key={key}
        style={style}
      >

        <Sentence
              {...rest}
              sentenceId={_id}
              clickatSentences={clickatSentences}
              getCurrentMode={getCurrentMode}
            />
        
      </div>
    )
  }
  const renderList = ({height, width}) => {
      return (
          <List
            // autoHeight
            height={height}
            rowCount={Object.keys(sentences).length}
            rowHeight={550}
            rowRenderer={rowRenderer}
            width={width}
            scrollTop={scrollTop}
            onScroll={onScroll}
          />
      );
  };
  return (
    <div className="sentences-container" style={{ height: '100vh' }}>
      <WindowScroller>
        {({ height, isScrolling, scrollTop }) => (
          <AutoSizer disableHeight>
            {renderList}
          </AutoSizer>
        )}
      </WindowScroller>
    </div>
  );
}
