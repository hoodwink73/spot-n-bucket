import React from 'react';
import { map } from 'lodash';

export default function Modes ({ modes, updateMode }) {
  return (
    <div className="row">
      {
        map(modes,function(state,name) {
          return (
             <div className='col-md-3' key={`mode_${name}`}>
              <input id={`mode_${name}`} onChange={updateMode} type='radio' name='mode' value={name} checked={state} />
              <label htmlFor={`mode_${name}`}>{name}</label>
            </div>
          )
        })
      }
    </div>
  )
}