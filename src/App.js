import React, { Component } from 'react';
import './App.css';
import Buckets from './buckets';
import uuid from 'uuid'
import Sentence from './Sentence'
class App extends Component {
  constructor(props) {
     super(props);
     this.state = {data:[]};
   }
  readFile = () =>{
          var file = this.refs.file.files[0];
          var reader = new FileReader();
          var temp =reader.readAsText(file);
          reader.onload = function(evt){
               var resultText = evt.target.result;
               var _data=resultText.split('\n');
               _data = _data.map(function(val) {
                return {
                 originalSentence: val,
                 id: uuid.v4(),
                 ...Buckets
                 }
               });
               console.log('data',_data);
               this.setState({data:_data})
          }.bind(this);
     }
  render() {
    return (
      <div className="App">
        <p className="App-intro">
          <input type="file" ref="file" onChange={this.readFile} />
        </p>
          {
            this.state.data.map((line) => (
              <Sentence key={line.id} originalSentence={line.originalSentence} />
              )
            )
          }
      </div>
    );
  }
}

export default App;
