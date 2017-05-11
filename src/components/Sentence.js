import React from 'react';
import Word from './Word';

export default function Sentence({
  text,
  clickatSentences,
  sentenceId,
  getCurrentMode
}) {
  const _words = text.split(' ');

  const clickatSentence = function(word, sentenceId, doUnselectWord) {
    clickatSentences(word, sentenceId, doUnselectWord);
  };

  return (
    <div className="row text-left sentence-wrap">
      <h1 className="col-md-12 sentence">
        {_words.map(function(_word, ind) {
          return (
            <Word
              key={ind}
              word={_word}
              wordClick={clickatSentence}
              sentenceId={sentenceId}
              getCurrentMode={getCurrentMode}
            />
          );
        })}
      </h1>
    </div>
  );
}
