import React from 'react';
import Word from './Word';
import { each } from 'lodash';

import config from '../config'

var {buckets} = config;

export default function Sentence(props) {
  var {text, clickatSentences} = props;
  const _words = text.split(' ');

  // console.log(props);

  const clickatSentence = function(word, sentenceId, doUnselectWord) {
    clickatSentences(word, sentenceId, doUnselectWord);
  };

  function isWordInBucket (_word, bucket) {
    var isWordInBucket = false;
    each(bucket, function ({word}) {
      console.log(arguments)
      if  (word === _word) {
        isWordInBucket = true
      }
    })

    return isWordInBucket;
  }

  var bucketNames = Object.keys(buckets);
  return (
    <div className="row text-left sentence-wrap">
      <h1 className="col-md-12 sentence">
        {_words.map(function(_word, ind) {
          var clicked = false, belongsToBucket = '';
          each(bucketNames, function (bucketName) {
            var bucketData = props[bucketName]
            if (bucketData.length > 0 && isWordInBucket(_word, bucketData)) {
              clicked = true;
              belongsToBucket = bucketName
            }
          })


          return (
            <Word
              clicked={clicked}
              mode={belongsToBucket}
              key={ind}
              word={_word}
              wordClick={clickatSentence}
              {...props}
            />
          );
        })}
      </h1>
    </div>
  );
}
