import React, { Component } from 'react';
import '../App.css';
import config from '../config';
import localForageConfig from '../localforage.config';
import uuid from 'uuid';
import Modes from '../components/Modes';
import Sentences from '../components/Sentences';
import Download from '../components/Download';
import { each, mapValues, remove } from 'lodash';
import { parse } from 'papaparse';
import fileDownload from 'react-file-download';
import localForage from "localforage";

const makeSentencesStateReady = function (sentences) {
  var data = {};
  each(sentences, function(sentence, key) {
    var [id, text] = sentence;
    var _id = uuid.v4();
    data[_id] = {
      _id,
      text,
      ...mapValues(config.buckets, () => [])
    };
  });
  return data;
}

class App extends Component {
  constructor(props) {
    super(props);
    localForage.config(localForageConfig);
    let keys = Object.keys(config.buckets);
    let modes = {};
    
    keys.map(val => (modes[val] = false));

    let defaultMode = config.defaultMode;
    modes[defaultMode] = true;
    this.state = {
      data: {},
      scroll: 1
    }
    this.getLocalSentences(modes);
  }

  getLocalSentences(modes) {
    localForage.getItem('filenames').then((value)=> {
      if(value) {
        const filename = value[value.length-1];
        this.setState({
          filename: filename
        })
        localForage.getItem(filename).then((value)=>{
          if(value){
            this.setState({
              scroll: value
            })
          }
        })
      }
    })
    localForage.getItem('sentences').then((value) => {
      this.setState({
        data: makeSentencesStateReady(value),
        modes: modes
      });
    }).catch(function(err) {
      console.log(err);
    });
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

  checkPreviouslySavedFiles(file) {
    localForage.getItem('filenames').then((value) => {
      console.log(value)
      this.setState({
        filename: file.name
      });
      let filenames, present = 0;
      if(value) {
        filenames = value 
        each(filenames, function(value, key) {
          if(file.name === value){
            present++;
          }
        })
        if(present) {
          localForage.getItem(file.name).then((value) => {
            console.log(this.state, value)
            if(value) {
              this.setState({scroll: value})
            }
          })
        }
      }else {
        filenames = [];
        localForage.setItem(file.name,0).then((value)=>{
          console.log('stored file.name 0')
        })
      }
      filenames.push(file.name)
      localForage.setItem('filenames', filenames).then(function (value) {
        console.log('filenames stored');
      }).catch(function(err) {
        console.log('filenames store error', err);
      });
    }).catch(function(err) {
      console.log(err);
    });
  }

  readFile() {
    var file = this.refs.file.files[0];
    var reader = new FileReader();
    this.checkPreviouslySavedFiles(file)
    
    reader.readAsText(file);
    reader.onload = function(evt) {
      var sentences = parse(evt.target.result).data;
      localForage.setItem('sentences', sentences).then(function (value) {
          console.log('sentences save sucess');
      }).catch(function(err) {
          console.log('sentences save failed', err);
      });
      this.setState({
        data: makeSentencesStateReady(sentences)
      });
    }.bind(this);
  }

  downloadFile() {
    var data = JSON.stringify(this.state.data);
    fileDownload(data, `spot-n-bucket.${uuid.v4()}.json`);
  }
  
  onScroll({ scrollTop }) {
    localForage.setItem(this.state.filename, scrollTop).then((value) => {
        console.log('scrollPos updated');
    }).catch(function(err) {
        console.log('scrollPos update failed');
    });
  }

  render() {
    return (
      <div className="container">
        <div className="row header">
          <h1>Spot-n-Bucket</h1>
          
          <div className="input-wrap">
            <input className="inputfile" type="file" ref="file" onChange={this.readFile.bind(this)} />
            <label for="file"><span>Choose a file</span></label>
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
        <div className='footer'>
        

        <Download downloadFile={this.downloadFile.bind(this)} />
        
        </div>
      </div>
    );
  }
}

export default App;
