// @flow

import ReactDOM from 'react-dom';
import React from 'react';
import Papa from 'papaparse';
import TAFFY from 'taffydb';
import App from './components/App';

const appNode = document.getElementById('app');
if (appNode) {
  ReactDOM.render(<App />, appNode);
}
