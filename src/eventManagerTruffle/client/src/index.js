import React from 'react';
import ReactDOM from 'react-dom';
import { Drizzle, generateStore } from "drizzle";
//import jQuery from "./jquery-3.5.1.min.js";
import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';

import drizzleOptions from './drizzleOptions.js';


const drizzleStore = generateStore(drizzleOptions);
const drizzle = new Drizzle(drizzleOptions, drizzleStore);

ReactDOM.render(
  <React.StrictMode>
    <App drizzle={drizzle}/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

