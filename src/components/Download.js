import React from 'react';

export default function Download(props) {
  const { downloadFile } = props;
  return <button className='downloadBtn' onClick={downloadFile}> Download </button>;
}
