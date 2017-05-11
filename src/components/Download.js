import React from 'react';

export default function Download(props) {
  const { downloadFile } = props;
  return <button onClick={downloadFile}> Download </button>;
}
