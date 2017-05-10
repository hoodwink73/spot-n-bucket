import React from 'react'
import Sentence from './Sentence'
import {map} from 'lodash'

export default function Sentences({sentences,updateWords}) {
  const clickatSentences = (word, sentenceId) =>{
    updateWords(word, sentenceId);
  }
  return (
    <div className='sentences'>
      {
        map(sentences, ((sentence, id) =>
          (
            <Sentence key={id} originalSentence={sentence.originalSentence} sentenceId={id} clickatSentences={clickatSentences} />
          )
        )
        )
      }
    </div>
    )
}