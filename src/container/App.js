import React, { Component } from 'react';
import '../App.css';
import config from '../config'
import uuid from 'uuid'
import Modes from '../components/Modes'
import Sentences from '../components/Sentences'
import { each } from 'lodash';

class App extends Component {
  constructor(props) {
     super(props);
     let keys = Object.keys(config.buckets);
     let modes={}
     keys = keys.map((val)=>{
      modes[val] = false
     })
     let defaultMode = config.defaultMode
     modes[defaultMode] =true;
     this.state = {
        data:{},
        modes: modes,
        currentMode:config.defaultMode
      };
   }

   componentDidMount() {
     console.log('start', this.state)
   }

  updateMode = (evt) => {
    let modeKey = evt.target.value
    let oldModes =this.state.modes
    let oldModeKeys =Object.keys(oldModes)
    let newModes =oldModes
    oldModeKeys.map((val)=>{
      newModes[val] =false
    })
    newModes[modeKey] =true
    this.setState({modes:newModes,currentMode:modeKey})
  }

  updateWords = (word, sentenceId) => {
    let data = this.state.data
    let currentMode = this.state.currentMode
    var sentence = data[sentenceId];
    data[sentenceId] = {
      ...sentence,
      [currentMode]: [...sentence[currentMode], word]
    }
    console.log(data)
    this.setState({data:data});
  }


  readFile = () =>{
          var file = this.refs.file.files[0];
          var reader = new FileReader();
          reader.readAsText(file);
          reader.onload = function(evt){
               var resultText = evt.target.result;
               var data = {}

               each(resultText.split('\n'), function (val) {
                   data[uuid.v4()] = {
                      originalSentence: val,
                      ...config.buckets
                  }
                });

               this.setState({
                data
              })
          }.bind(this);
     }
  render() {
    return (
      <div className="container">
        <br/>
        <br/>
        <br/>
        <br/>
        <div className="row header">
          <div className="col-md-2 col-md-offset-3">
          <input type="file" ref="file" onChange={this.readFile} />
          </div>
          <div className="col-md-3 col-md-offset-3">
            <Modes modes={this.state.modes} updateMode={this.updateMode}/>
          </div>
        </div>
        <Sentences sentences={this.state.data} updateWords={this.updateWords}/>

      </div>
    );
  }
}

export default App;
