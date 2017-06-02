import localForage from 'localforage';

const localForageConfig = {
  driver      : localForage.INDEXEDDB, 
  name        : 'spot-n-bucket',
  version     : 1.0,
  size        : 4980736, 
  storeName   : 'snb', 
  description : 'spot n bucket'
}

export default localForageConfig