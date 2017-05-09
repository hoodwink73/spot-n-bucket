import React from 'react';



const Word = (wrd, onwordClick) => {
const _onClick = () =>this.onwordClick
return(
 <span onClick={_onClick}>{wrd.wrd+' '}</span>
 )
}
export default Word;