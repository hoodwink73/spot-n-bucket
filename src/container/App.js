import React, { Component } from 'react';
import '../App.css';
import config from '../config';
import uuid from 'uuid';
import Modes from '../components/Modes';
import Sentences from '../components/Sentences';
import Download from '../components/Download';
import { each, mapValues, remove } from 'lodash';
import { parse } from 'papaparse';
import fileDownload from 'react-file-download';

var dummySentences = [
  [1, 'Anuj works in Freshdesk'],
  [2, 'Freshdesk is in Chennai'],
  [3, 'Anuj works in Freshdesk'],
  [4, 'Freshdesk is in Chennai'],
  [5, 'Anuj works in Freshdesk'],
  [6, 'Freshdesk is in Chennai'],
  [7, 'Anuj works in Freshdesk'],
  [8, 'Freshdesk is in Chennai'],
  [9, 'Anuj works in Freshdesk'],
  [10, 'Freshdesk is in Chennai'],
  [11, 'Anuj works in Freshdesk'],
  [12, 'Freshdesk is in Chennai'],
  [13, 'Anuj works in Freshdesk'],
  [14, 'Freshdesk is in Chennai'],
  [15, 'Anuj works in Freshdesk'],
  [16, 'Freshdesk is in Chennai'],
  [17, 'Anuj works in Freshdesk'],
  [18, 'Freshdesk is in Chennai'],
  [19, 'Anuj works in Freshdesk'],
  [20, 'Freshdesk is in Chennai'],
  [21, 'Anuj works in Freshdesk'],
  [22, 'Freshdesk is in Chennai'],
  [23, 'Anuj works in Freshdesk'],
  [24, 'Freshdesk is in Chennai'],
  [25, 'Anuj works in Freshdesk'],
  [26, 'Freshdesk is in Chennai'],
  [27, 'Anuj works in Freshdesk'],
  [28, 'Freshdesk is in Chennai'],
  [29, 'Navneethan also works with Anuj']
];

class App extends Component {
  constructor(props) {
    super(props);
    let keys = Object.keys(config.buckets);
    let modes = {};

    keys.map(val => (modes[val] = false));

    let defaultMode = config.defaultMode;
    modes[defaultMode] = true;

    this.state = {
      data: this.makeSentencesStateReady(dummySentences),
      modes: modes
    };
  }

  makeSentencesStateReady(sentences) {
    var data = {};
    each(sentences, function(sentence) {
      var [id, text] = sentence;
      data[id] = {
        text,
        ...mapValues(config.buckets, () => [])
      };
    });

    return data;
  }

  getCurrentMode() {
    var selectedMode;
    each(this.state.modes, function(bool, mode) {
      if (bool) {
        selectedMode = mode;
        return false;
      }
    });
    return selectedMode || '';
  }

  updateMode(evt) {
    let modeKey = evt.target.value;
    let modes = {};

    each(this.state.modes, function(bool, mode) {
      modes[mode] = false;
    });

    this.setState({
      modes: {
        ...modes,
        [modeKey]: true
      }
    });
  }

  updateWords(word, sentenceId, doUnselectWord) {
    var data = this.state.data;
    var sentence = Object.assign({}, data[sentenceId]);
    var currentMode = this.getCurrentMode();

    function calculateIndicesOfWord(sentenceText, word) {
      return [
        sentenceText.indexOf(word),
        sentenceText.indexOf(word) + word.length
      ];
    }

    if (doUnselectWord) {
      let remainingWordsAfterUnselection = remove(
        sentence[currentMode],
        function(value) {
          return value === word;
        }
      );

      sentence = {
        ...sentence,
        [currentMode]: remainingWordsAfterUnselection
      };
    } else {
      sentence = {
        ...sentence,
        [currentMode]: [
          ...sentence[currentMode],
          {
            word,
            indices: calculateIndicesOfWord(sentence.text, word)
          }
        ]
      };
    }

    this.setState({
      data: {
        ...this.state.data,
        [sentenceId]: sentence
      }
    });
  }

  readFile() {
    var file = this.refs.file.files[0];
    var makeSentencesStateReady = this.makeSentencesStateReady;
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(evt) {
      var sentences = parse(evt.target.result).data;
      this.setState({
        data: makeSentencesStateReady(sentences)
      });
    }.bind(this);
  }

  downloadFile() {
    var data = JSON.stringify(this.state.data);
    fileDownload(data, `spot-n-bucket.${uuid.v4()}.json`);
  }

  render() {
    return (
      <div className="container">
        <div className="row header">
          <h1>Spot-n-Bucket</h1>
          <div className="input-wrap">
            <input type="file" ref="file" onChange={this.readFile.bind(this)} />
          </div>
        </div>
        {Object.keys(this.state.data).length > 0
          ? <Sentences
              sentences={this.state.data}
              updateWords={this.updateWords.bind(this)}
              getCurrentMode={this.getCurrentMode.bind(this)}
            />
          : null}
        <div className='footer'>
        <div className="modes">
          <Modes
            modes={this.state.modes}
            updateMode={this.updateMode.bind(this)}
          />
        </div>

        <Download downloadFile={this.downloadFile.bind(this)} />
        </div>
      </div>
    );
  }
}

export default App;
