import React from 'react';
import Word from './Word';


export default function Sentence ({originalSentence,clickatSentences,sentenceId}){
  const _words = originalSentence.split(' ')

  const clickatSentence =function(word, sentenceId){
    clickatSentences(word,sentenceId);
  }

  return(
    <div className='row text-left'>
      <h1 className='col-md-12'>
      {
        _words.map(function(_word,ind){
          return(
            <Word key={ind} word={_word} wordClick={clickatSentence} sentenceId={sentenceId}/>
            )
          }
        )
      }
      </h1>
    </div>
  )
}