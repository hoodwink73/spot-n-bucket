import React from 'react';
import Word from './Word'
const Sentence = ({originalSentence}) => {
const _words = originalSentence.split(' ')

const _onclick =() =>{
  alert('clicked to sentence')
}
return(
<h1>
{
  _words.map(function(_word,ind){
    return(
      <Word key={ind} wrd={_word} onwordClick={_onclick} />
      )
    }
  )
}
</h1>
)
}


export default Sentence;