import React from 'react';
import Sentence from './Sentence';
import { map } from 'lodash';

export default function Sentences({ sentences, updateWords, getCurrentMode }) {
  const clickatSentences = (word, sentenceId, doUnselectWord) => {
    updateWords(word, sentenceId, doUnselectWord);
  };
  return (
    <div className="sentences-container">
      {map(sentences, (sentence, id) => {
        if (sentence.text && sentence.text.length > 0) {
          return (
            <Sentence
              key={id}
              text={sentence.text}
              sentenceId={id}
              clickatSentences={clickatSentences}
              getCurrentMode={getCurrentMode}
            />
          );
        } else {
          return null;
        }
      })}
    </div>
  );
}
